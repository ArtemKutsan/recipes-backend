import { ValidationError } from 'sequelize';
import sequelize from '#config/db.js';
import { Cuisine, Recipe, Tag, User } from '#models/index.js';
import { findOrCreateTags } from '../tags/service.js';
import { parseListField } from '#utils/parseListField.js';
import { toRecipeDetailResponse, toRecipeListResponse } from './responses.js';

const recipeAuthorInclude = {
  model: User,
  as: 'user',
  attributes: ['id', 'fullname', 'email'],
};

const recipeCuisineInclude = {
  model: Cuisine,
  as: 'cuisine',
  attributes: ['id', 'title'],
};

const recipeTagsInclude = {
  model: Tag,
  as: 'tags',
  attributes: ['id', 'title', 'slug'],
};

export async function getAll(_req, res) {
  try {
    const recipes = await Recipe.findAll({
      include: [recipeAuthorInclude, recipeCuisineInclude, recipeTagsInclude],
    });

    return res.json(recipes.map(toRecipeListResponse));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [recipeAuthorInclude, recipeCuisineInclude, recipeTagsInclude],
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Рецепт не найден' });
    }

    return res.json(toRecipeDetailResponse(recipe));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    // Одна транзакция охватывает пользователя, кухню, tags, рецепт и recipe_tags.
    // При любой ошибке Sequelize откатит все изменения целиком.
    const result = await sequelize.transaction(async (transaction) => {
      // Ищем автора в той же транзакции, чтобы весь create-flow был атомарным.
      const user = await User.findByPk(req.user.id, { transaction });

      if (!user) {
        return { statusCode: 401, data: { error: 'Пользователь не найден' } };
      }

      // Отсутствующая кухня явно преобразуется в null для nullable FK.
      const cuisineId = req.body.cuisineId ?? null;

      if (cuisineId !== null) {
        const cuisine = await Cuisine.findByPk(cuisineId, { transaction });

        if (!cuisine) {
          return { statusCode: 400, data: { error: 'Кухня не найдена' } };
        }
      }

      // Строковые tags нормализуются, находятся или создаются сервисом.
      const tags = await findOrCreateTags(req.body.tags ?? [], { transaction });

      // Сначала создаём сам рецепт, чтобы получить его первичный ключ.
      const recipe = await Recipe.create({
        title: req.body.title,
        ingredients: parseListField(req.body.ingredients).join('. '),
        instructions: parseListField(req.body.instructions).join('. '),
        cuisineId,
        userId: user.id,
      }, { transaction });

      if (tags.length) {
        // После появления recipe.id записываем N:M связи в recipe_tags.
        await recipe.setTags(tags, { transaction });
      }

      // Повторно читаем рецепт с автором, кухней и tags для единого response-контракта.
      const createdRecipe = await Recipe.findByPk(recipe.id, {
        include: [recipeAuthorInclude, recipeCuisineInclude, recipeTagsInclude],
        transaction,
      });

      // Наружу передаём только HTTP-код и уже подготовленные JSON-данные.
      return { statusCode: 201, data: toRecipeDetailResponse(createdRecipe) };
    });

    return res.status(result.statusCode).json(result.data);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
}

import { ValidationError } from 'sequelize';
import sequelize from '#config/db.js';
import { Cuisine, MealType, Recipe, Tag, User } from '#models/index.js';
import { findOrCreateTags } from '../tags/service.js';
import { hasField } from '#utils/validators.js';
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

const recipeMealTypesInclude = {
  model: MealType,
  as: 'mealTypes',
  attributes: ['id', 'title'],
};

export async function getAll(_req, res) {
  try {
    const recipes = await Recipe.findAll({
      include: [recipeAuthorInclude, recipeCuisineInclude, recipeTagsInclude, recipeMealTypesInclude],
    });

    return res.json(recipes.map(toRecipeListResponse));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [recipeAuthorInclude, recipeCuisineInclude, recipeTagsInclude, recipeMealTypesInclude],
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

      const mealTypeIds = req.body.mealTypeIds ?? [];
      const mealTypes = await MealType.findAll({
        where: { id: mealTypeIds },
        transaction,
      });

      if (mealTypes.length !== mealTypeIds.length) {
        return { statusCode: 400, data: { error: 'Один или несколько meal types не найдены' } };
      }

      // Сначала создаём сам рецепт, чтобы получить его первичный ключ.
      const recipe = await Recipe.create(
        {
          title: req.body.title,
          ingredients: parseListField(req.body.ingredients).join('. '),
          instructions: parseListField(req.body.instructions).join('. '),
          cuisineId,
          userId: user.id,
        },
        { transaction },
      );

      if (tags.length) {
        // После появления recipe.id записываем N:M связи в recipe_tags.
        await recipe.setTags(tags, { transaction });
      }

      if (mealTypes.length) {
        // Через setMealTypes сохраняем только выбранные значения справочника.
        await recipe.setMealTypes(mealTypes, { transaction });
      }

      // Повторно читаем рецепт с автором, кухней, tags и mealTypes для единого response-контракта.
      const createdRecipe = await Recipe.findByPk(recipe.id, {
        include: [
          recipeAuthorInclude,
          recipeCuisineInclude,
          recipeTagsInclude,
          recipeMealTypesInclude,
        ],
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

export async function update(req, res) {
  try {
    // Обновление рецепта и его N:M-связей выполняется атомарно.
    const result = await sequelize.transaction(async (transaction) => {
      // Загружаем рецепт внутри транзакции до проверки владельца.
      const recipe = await Recipe.findByPk(req.params.id, { transaction });

      if (!recipe) {
        return { statusCode: 404, data: { error: 'Рецепт не найден' } };
      }

      if (recipe.userId !== req.user.id) {
        // Изменять рецепт может только пользователь, который его создал.
        return { statusCode: 403, data: { error: 'Нет прав на изменение этого рецепта' } };
      }

      // Обновляем только поля, явно переданные в PATCH-запросе.
      if (hasField(req.body, 'title')) recipe.title = req.body.title;
      if (hasField(req.body, 'ingredients')) {
        recipe.ingredients = parseListField(req.body.ingredients).join('. ');
      }
      if (hasField(req.body, 'instructions')) {
        recipe.instructions = parseListField(req.body.instructions).join('. ');
      }

      if (hasField(req.body, 'cuisineId')) {
        // null снимает кухню, а числовой id проверяется по справочнику cuisines.
        const cuisineId = req.body.cuisineId === null ? null : Number(req.body.cuisineId);
        const cuisine =
          cuisineId === null ? null : await Cuisine.findByPk(cuisineId, { transaction });

        if (cuisineId !== null && !cuisine) {
          return { statusCode: 400, data: { error: 'Кухня не найдена' } };
        }

        recipe.cuisineId = cuisineId;
      }

      if (hasField(req.body, 'tags')) {
        // setTags полностью заменяет набор связей; [] удаляет все tags рецепта.
        const tags = await findOrCreateTags(req.body.tags, { transaction });
        await recipe.setTags(tags, { transaction });
      }

      if (hasField(req.body, 'mealTypeIds')) {
        const mealTypes = await MealType.findAll({
          where: { id: req.body.mealTypeIds },
          transaction,
        });

        if (mealTypes.length !== req.body.mealTypeIds.length) {
          return { statusCode: 400, data: { error: 'Один или несколько meal types не найдены' } };
        }

        // setMealTypes полностью заменяет связи; [] очищает meal types рецепта.
        await recipe.setMealTypes(mealTypes, { transaction });
      }

      // Сохраняем обычные поля рецепта после всех проверок.
      await recipe.save({ transaction });
      // Перечитываем связанные данные для единого detail-response.
      await recipe.reload({
        include: [
          recipeAuthorInclude,
          recipeCuisineInclude,
          recipeTagsInclude,
          recipeMealTypesInclude,
        ],
        transaction,
      });

      return { statusCode: 200, data: toRecipeDetailResponse(recipe) };
    });

    return res.status(result.statusCode).json(result.data);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
}

import { ValidationError } from 'sequelize';
import { Cuisine, Recipe, User } from '#models/index.js';
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

export async function getAll(_req, res) {
  try {
    const recipes = await Recipe.findAll({
      include: [recipeAuthorInclude, recipeCuisineInclude],
    });

    return res.json(recipes.map(toRecipeListResponse));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [recipeAuthorInclude, recipeCuisineInclude],
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
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    const cuisineId = req.body.cuisineId ?? null;

    if (cuisineId !== null) {
      const cuisine = await Cuisine.findByPk(cuisineId);

      if (!cuisine) {
        return res.status(400).json({ error: 'Кухня не найдена' });
      }
    }

    const recipe = await Recipe.create({
      title: req.body.title,
      ingredients: parseListField(req.body.ingredients).join('. '),
      instructions: parseListField(req.body.instructions).join('. '),
      cuisineId,
      userId: user.id,
    });

    const createdRecipe = await Recipe.findByPk(recipe.id, {
      include: [recipeAuthorInclude, recipeCuisineInclude],
    });

    return res.status(201).json(toRecipeDetailResponse(createdRecipe));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
}

import { Router } from 'express';
import { auth } from '#api/v1/middleware/auth.js';
import { create, getAll, getById } from '#api/v1/modules/recipes/controllers.js';
import { validateCreateRecipe } from '#api/v1/modules/recipes/validators.js';

const router = Router();

// GET /api/v1/recipes - список рецептов.
router.get('/', getAll);
// GET /api/v1/recipes/:id - один рецепт с автором.
router.get('/:id', getById);
// POST /api/v1/recipes - создание рецепта под авторизованным пользователем.
router.post('/', auth, validateCreateRecipe, create);

export default router;

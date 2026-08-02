import { Router } from 'express';
import { auth } from '#api/v1/middleware/auth.js';
import { create, getAll, getById, update } from '#api/v1/modules/recipes/controllers.js';
import { validateCreateRecipe, validateUpdateRecipe } from '#api/v1/modules/recipes/validators.js';
import { validateId } from '#utils/validators.js';

const router = Router();

// GET /api/v1/recipes - список рецептов.
router.get('/', getAll);
// GET /api/v1/recipes/:id - один рецепт с автором.
router.get('/:id', validateId, getById);
// POST /api/v1/recipes - создание рецепта под авторизованным пользователем.
router.post('/', auth, validateCreateRecipe, create);
// PATCH /api/v1/recipes/:id - частичное обновление рецепта и его tags.
router.patch('/:id', auth, validateId, validateUpdateRecipe, update);

export default router;

import { Router } from 'express';
import { getAll } from '#api/v1/modules/tags/controllers.js';

const router = Router();

// GET /api/v1/tags - список tags для выбора при создании рецепта.
router.get('/', getAll);

export default router;

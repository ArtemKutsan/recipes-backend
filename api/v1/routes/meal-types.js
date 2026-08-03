import { Router } from 'express';
import { getAll } from '#api/v1/modules/meal-types/controllers.js';

const router = Router();

// GET /api/v1/meal-types - список значений контролируемого справочника.
router.get('/', getAll);

export default router;

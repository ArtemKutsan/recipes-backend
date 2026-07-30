import { Router } from 'express';
import { auth } from '#api/v1/middleware/auth.js';
import { create, getAll, getById, like, remove, update } from '#api/v1/modules/posts/controllers.js';
import { validateCreatePost } from '#api/v1/modules/posts/validators.js';

const router = Router();

// GET /api/v1/posts - список постов с авторами.
router.get('/', getAll);
// GET /api/v1/posts/:id - один пост с автором и комментариями.
router.get('/:id', getById);
// POST /api/v1/posts - создание поста под авторизованным пользователем.
router.post('/', auth, validateCreatePost, create);
// PUT /api/v1/posts/:id - обновление поста.
router.put('/:id', auth, update);
// DELETE /api/v1/posts/:id - удаление поста.
router.delete('/:id', auth, remove);
// POST /api/v1/posts/:id/like - увеличение счётчика лайков.
router.post('/:id/like', auth, like);

export default router;

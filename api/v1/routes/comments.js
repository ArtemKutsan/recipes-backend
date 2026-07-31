import { Router } from 'express';
import { auth } from '#api/v1/middleware/auth.js';
import { create, getByPostId, remove, update } from '#api/v1/modules/comments/controllers.js';
import { validateCreateComment, validateUpdateComment } from '#api/v1/modules/comments/validators.js';

const router = Router();

// GET /api/v1/comments/:postId - комментарии к посту.
router.get('/:postId', getByPostId);
// POST /api/v1/comments - создание комментария под авторизованным пользователем.
router.post('/', auth, validateCreateComment, create);
// PUT /api/v1/comments/:id - обновление комментария владельцем.
router.put('/:id', auth, validateUpdateComment, update);
// DELETE /api/v1/comments/:id - удаление комментария.
router.delete('/:id', auth, remove);

export default router;

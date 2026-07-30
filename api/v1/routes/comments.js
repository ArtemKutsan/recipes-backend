import { Router } from 'express';
import { auth } from '#api/v1/middleware/auth.js';
import { create, getByPostId, remove } from '#api/v1/modules/comments/controllers.js';
import { validateCreateComment } from '#api/v1/modules/comments/validators.js';

const router = Router();

// GET /api/v1/comments/:postId - комментарии к посту.
router.get('/:postId', getByPostId);
// POST /api/v1/comments - создание комментария под авторизованным пользователем.
router.post('/', auth, validateCreateComment, create);
// DELETE /api/v1/comments/:id - удаление комментария.
router.delete('/:id', auth, remove);

export default router;

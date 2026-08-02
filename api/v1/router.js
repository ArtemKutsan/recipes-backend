import { Router } from 'express';
import usersRouter from '#api/v1/routes/users.js';
import postsRouter from '#api/v1/routes/posts.js';
import commentsRouter from '#api/v1/routes/comments.js';
import recipesRouter from '#api/v1/routes/recipes.js';
import tagsRouter from '#api/v1/routes/tags.js';

const router = Router();

router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);
router.use('/recipes', recipesRouter);
router.use('/tags', tagsRouter);

export default router;

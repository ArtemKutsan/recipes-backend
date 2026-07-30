import { Router } from 'express';

const router = Router();

router.get('/', async (_req, res) => {
  return res.status(501).json({
    error: 'v2 posts is not implemented yet',
  });
});

export default router;

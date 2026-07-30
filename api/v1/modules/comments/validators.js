import { hasRequiredStringFields } from '#utils/validation.js';

export function validateCreateComment(req, res, next) {
  const isValid = hasRequiredStringFields(req.body, ['postId', 'text']);

  if (!isValid) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  return next();
}

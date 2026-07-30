import { hasRequiredStringFields } from '#utils/validation.js';

export function validateCreatePost(req, res, next) {
  const isValid = hasRequiredStringFields(req.body, ['title', 'text']);

  if (!isValid) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  return next();
}

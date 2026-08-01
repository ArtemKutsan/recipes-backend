import { hasRequiredStringFields } from '#utils/validators.js';

export function validateCreateComment(req, res, next) {
  const isValid = hasRequiredStringFields(req.body, ['postId', 'text']);

  if (!isValid) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  return next();
}

export function validateUpdateComment(req, res, next) {
  const isValid = hasRequiredStringFields(req.body, ['text']);

  if (!isValid) {
    return res.status(400).json({ error: 'Поле text обязательно' });
  }

  return next();
}

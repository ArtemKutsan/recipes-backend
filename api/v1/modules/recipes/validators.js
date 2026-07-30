import { hasRequiredStringFields } from '#utils/validation.js';

export function validateCreateRecipe(req, res, next) {
  const isValid = hasRequiredStringFields(req.body, ['title', 'ingredients', 'instructions']);

  if (!isValid) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  return next();
}

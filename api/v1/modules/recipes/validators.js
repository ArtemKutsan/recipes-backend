import {
  hasField,
  hasRequiredStringFields,
  isUniqueNonEmptyStringArray,
} from '#utils/validators.js';

export function validateCreateRecipe(req, res, next) {
  // Проверяем обязательные текстовые поля самого рецепта.
  const isValid = hasRequiredStringFields(req.body, ['title', 'ingredients', 'instructions']);

  if (!isValid) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  if (hasField(req.body, 'tags') && !isUniqueNonEmptyStringArray(req.body.tags)) {
    // tags должны быть массивом непустых строк без дублей после нормализации регистра.
    return res.status(400).json({ error: 'tags должен быть массивом уникальных непустых строк' });
  }

  return next();
}

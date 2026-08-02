import {
  hasAtLeastOneOfFields,
  hasField,
  hasInvalidStringFields,
  hasOnlyAllowedFields,
  hasRequiredStringFields,
  isPositiveInteger,
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

export function validateUpdateRecipe(req, res, next) {
  // PATCH разрешает только перечисленные поля и требует хотя бы одно из них.
  const updateFields = ['title', 'ingredients', 'instructions', 'cuisineId', 'tags'];
  // Проверяем наличие изменения, отсутствие неизвестных полей и корректность значений.
  const hasUpdate = hasAtLeastOneOfFields(req.body, updateFields);
  const hasOnlyUpdateFields = hasOnlyAllowedFields(req.body, updateFields);
  const hasInvalidStringField = hasInvalidStringFields(req.body, [
    'title',
    'ingredients',
    'instructions',
  ]);
  const hasInvalidCuisineId =
    hasField(req.body, 'cuisineId') &&
    req.body.cuisineId !== null &&
    !isPositiveInteger(req.body.cuisineId);
  const hasInvalidTags = hasField(req.body, 'tags') && !isUniqueNonEmptyStringArray(req.body.tags);

  if (
    !hasUpdate ||
    !hasOnlyUpdateFields ||
    hasInvalidStringField ||
    hasInvalidCuisineId ||
    hasInvalidTags
  ) {
    // Пустой объект, неизвестные поля, неверная кухня или некорректные tags отклоняются.
    return res.status(400).json({
      error: 'Передайте хотя бы одно корректное поле рецепта',
    });
  }

  return next();
}

import {
  hasAtLeastOneOfFields,
  hasInvalidStringFields,
  hasOnlyAllowedFields,
  hasRequiredStringFields,
} from '#utils/validation.js';

export function validateCreatePost(req, res, next) {
  const isValid = hasRequiredStringFields(req.body, ['title', 'text']);

  if (!isValid) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  return next();
}

export function validateUpdatePost(req, res, next) {
  const updateFields = ['title', 'text'];
  const hasUpdate = hasAtLeastOneOfFields(req.body, updateFields);
  const hasOnlyUpdateFields = hasOnlyAllowedFields(req.body, updateFields);
  const hasInvalidField = hasInvalidStringFields(req.body, updateFields);

  if (!hasUpdate || !hasOnlyUpdateFields || hasInvalidField) {
    return res
      .status(400)
      .json({ error: 'Передайте хотя бы одно корректное поле: title или text' });
  }

  return next();
}

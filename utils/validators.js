function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function hasField(obj, key) {
  return isPlainObject(obj) && Object.hasOwn(obj, key);
}

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function hasNonEmptyStringField(obj, key) {
  return hasField(obj, key) && isNonEmptyString(obj[key]);
}

export function hasRequiredStringFields(obj, fields) {
  return fields.every((key) => hasNonEmptyStringField(obj, key));
}

export function hasAtLeastOneOfFields(obj, fields) {
  return fields.some((key) => hasField(obj, key));
}

export function hasOnlyAllowedFields(obj, fields) {
  return isPlainObject(obj) && Object.keys(obj).every((key) => fields.includes(key));
}

export function hasInvalidStringFields(obj, fields) {
  return fields.some(
    (key) => hasField(obj, key) && !hasRequiredStringFields(obj, [key]),
  );
}

export function isPositiveInteger(value) {
  if (typeof value === 'number') {
    return Number.isInteger(value) && value > 0;
  }

  return typeof value === 'string' && /^[1-9]\d*$/.test(value);
}

export function validateId(req, res, next) {
  if (!isPositiveInteger(req.params.id)) {
    return res.status(400).json({ error: 'Некорректный id' });
  }

  return next();
}

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

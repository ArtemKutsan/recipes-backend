export function parseListField(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean); // filter((item) => Boolean(item))
  }

  const text = String(value ?? '').trim();

  if (!text) {
    return [];
  }

  if (text.includes('\n')) {
    return text
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return text
    .split('.')
    .map((item) => item.trim())
    .filter(Boolean);
}

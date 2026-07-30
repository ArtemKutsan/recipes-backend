export function errorHandler(error, _req, res, _next) {
  // Показываем понятный текст ошибки, если он пришёл из MySQL.
  console.error(error.parent?.sqlMessage || error.message);

  res.status(500).json({
    message: error.parent?.sqlMessage || error.message,
  });
}

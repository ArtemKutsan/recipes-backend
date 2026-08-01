import { hasRequiredStringFields } from '#utils/validators.js';

export function validateRegister(req, res, next) {
  const isValid = hasRequiredStringFields(req.body, ['fullname', 'email', 'password']);

  if (!isValid) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  return next();
}

export function validateLogin(req, res, next) {
  const isValid = hasRequiredStringFields(req.body, ['email', 'password']);

  if (!isValid) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  return next();
}

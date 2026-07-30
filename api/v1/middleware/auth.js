import jwt from 'jsonwebtoken';
import config from '#config/index.js';

export function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Нет токена' });
  }

  try {
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Неверный формат токена' });
    }

    if (!config.auth.jwtSecret) {
      return res.status(500).json({ error: 'JWT_SECRET не задан' });
    }

    const payload = jwt.verify(token, config.auth.jwtSecret);
    req.user = payload;

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Токен истёк' });
    }

    return res.status(401).json({ error: 'Неверный формат токена' });
  }
}

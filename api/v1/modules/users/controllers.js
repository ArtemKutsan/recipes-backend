import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '#config/index.js';
import { User } from '#models/index.js';
import { toUserResponse } from './responses.js';

export async function register(req, res) {
  try {
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email уже занят' });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      fullname: req.body.fullname,
      email: req.body.email,
      passwordHash,
    });

    return res.status(201).json(toUserResponse(user));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { jwtSecret, jwtExpiresIn } = config.auth;

    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT_SECRET не задан' });
    }

    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const passwordMatches = await bcrypt.compare(req.body.password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });

    return res.json({
      user: toUserResponse(user),
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function listUsers(_req, res) {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
    });

    return res.json(users.map(toUserResponse));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

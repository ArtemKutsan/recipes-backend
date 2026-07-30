import { Router } from 'express';
import { login, listUsers, register } from '#api/v1/modules/users/controllers.js';
import { validateLogin, validateRegister } from '#api/v1/modules/users/validators.js';

const router = Router();

// POST /api/v1/users/register - регистрация пользователя.
router.post('/register', validateRegister, register);
// POST /api/v1/users/login - вход и выдача JWT.
router.post('/login', validateLogin, login);
// GET /api/v1/users - список пользователей.
router.get('/', listUsers);

export default router;

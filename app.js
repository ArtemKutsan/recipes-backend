import express from 'express';
import routerV1 from '#api/v1/router.js';
import routerV2 from '#api/v2/router.js';
import { errorHandler } from '#middleware/errorHandler.js';

const app = express();

// Базовый middleware для JSON-тел запросов.
app.use(express.json());
// Подключаем версии API.
app.use('/api/v1', routerV1);
app.use('/api/v2', routerV2);

// Простая проверка, что приложение отвечает.
app.get('/', (_req, res) => {
  res.send('Hello, Sequelize with Express!');
});

// Единая обработка ошибок для всего приложения.
app.use(errorHandler);

export default app;

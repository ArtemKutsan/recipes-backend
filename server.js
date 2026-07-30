import app from './app.js';
import sequelize from './config/db.js';
import config from '#config/index.js';

const port = config.app.port;
const host = config.app.host;

// server.js только запускает приложение и проверяет подключение к БД.
app.listen(port, host, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database established successfully.');
    console.log(`Server is running at http://${host}:${port}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

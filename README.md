# Node lesson: Express, Sequelize и MySQL

Небольшой учебный проект на Node.js. В нём Express запускает HTTP‑сервер, Sequelize подключается к MySQL, а модели описывают пользователей, посты и комментарии.  
Добавлены регистрация, логин, хеширование паролей, CRUD для постов и комментариев, лайки, обработка ошибок и сидеры.
API подключён с версией в URL, а импорты внутри проекта идут через алиасы `#...`.

## Стек

- Node.js и ES‑модули (`"type": "module"`)
- Express
- Sequelize 6
- MySQL через `mysql2`
- Sequelize CLI для миграций и сидеров
- `dotenv` для переменных окружения
- `bcrypt` для хеширования паролей (rounds = 10)
- `jsonwebtoken` для JWT авторизации

## Инициализация Sequelize CLI

Чтобы создать стандартную структуру Sequelize CLI, используется команда:

```bash
npx sequelize-cli init
```

После этого появляются:

- `config/` - настройки подключения к БД
- `models/` - модели Sequelize
- `migrations/` - миграции схемы
- `seeders/` - сидеры для тестовых данных

Это стандартная структура, которую создаёт `sequelize-cli`. В этом проекте она изменена через `.sequelizerc`:

- `config/` остаётся в корне и хранит runtime-настройки всего приложения
- `db/config.cjs` хранит настройки подключения для `sequelize-cli`
- `db/models/` содержит модели Sequelize
- `db/migrations/` содержит миграции схемы
- `db/seeders/` содержит сидеры для тестовых данных
- `eslint.config.js` используется для базовой проверки кода

Файлы в `db/migrations/` здесь оформлены через `import` и `export`, потому что проект работает как ES‑модуль (`"type": "module"`).
Шаблон, который генерирует `sequelize-cli`, обычно использует `module.exports`, но в этом проекте миграции переписаны под текущий синтаксис приложения.

В шаблоне миграция выглядит так:

```js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {},
  async down(queryInterface, Sequelize) {},
};
```

После перевода на ES‑модули она выглядит так:

```js
import { DataTypes } from 'sequelize';

export async function up(queryInterface) {}

export async function down(queryInterface) {}
```

## Алиасы импортов

В `package.json` настроены алиасы для внутренних импортов:

- `#api/*`
- `#config/*`
- `#middleware/*`
- `#models/*`
- `#routes/*`
- `#utils/*`

Примеры:

```js
import sequelize from '#config/db.js';
import { User } from '#models/index.js';
import router from '#api/v1/router.js';
```

Модели в рабочем коде берутся из `#models/index.js`, потому что там же поднимаются ассоциации Sequelize.

## Логи SQL

В `development` Sequelize логирует SQL-запросы в более читаемом виде.

Для этого в `config/db.js` используется:

- `sql-formatter`
- `logging: process.env.NODE_ENV === 'development' ? ... : false`

## Декомпозиция server.js

Точка входа разбита на два файла:

- `app.js` - создаёт и настраивает Express-приложение
- `server.js` - запускает `listen()` и проверяет подключение к базе

Отдельно вынесен middleware для ошибок:

- `middleware/errorHandler.js` - единая обработка ошибок приложения

Такой вариант оставляет `server.js` коротким и не смешивает запуск сервера с настройкой роутов и middleware.

## Структура проекта

```text
.
├── config/                      # runtime-конфиг приложения
│   ├── index.js
│   └── db.js
├── db/                          # все сущности, связанные с базой данных
│   ├── config.cjs
│   ├── migrations/              # миграции схемы
│   │   ├── ...-create-users.js
│   │   ├── ...-create-posts.js
│   │   ├── ...-create-comments.js
│   │   ├── ...-create-cuisines.js
│   │   ├── ...-create-recipes.js
│   │   └── ...-rename-user-fields.js
│   ├── models/                  # модели Sequelize
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Recipe.js
│   │   ├── Cuisine.js
│   │   └── index.js
│   └── seeders/                 # сиды для тестовых данных
│       ├── ...-seed-users.js
│       ├── ...-seed-posts.js
│       ├── ...-seed-comments.js
│       ├── ...-seed-cuisines.js
│       └── ...-seed-recipes.js
├── api/                         # HTTP-слой приложения
│   ├── v1/                      # основная версия API
│   │   ├── middleware/          # middleware для v1
│   │   │   └── auth.js
│   │   ├── modules/             # доменные блоки по сущностям
│   │   │   ├── comments/
│   │   │   │   ├── controllers.js
│   │   │   │   ├── responses.js
│   │   │   │   └── validators.js
│   │   │   ├── posts/
│   │   │   │   ├── controllers.js
│   │   │   │   ├── responses.js
│   │   │   │   └── validators.js
│   │   │   ├── recipes/
│   │   │   │   ├── controllers.js
│   │   │   │   ├── responses.js
│   │   │   │   └── validators.js
│   │   │   └── users/
│   │   │       ├── controllers.js
│   │   │       ├── responses.js
│   │   │       └── validators.js
│   │   ├── routes/              # маршруты v1
│   │   │   ├── comments.js
│   │   │   ├── posts.js
│   │   │   ├── recipes.js
│   │   │   └── users.js
│   │   └── router.js
│   ├── v2/                      # вторая версия API
│   │   ├── posts.js
│   │   └── router.js
│   └── utils/                   # общие утилиты для API
│       └── validation.js
├── middleware/                  # общие middleware для всего Express
│   └── errorHandler.js
├── scripts/                     # служебные скрипты
│   └── db.js
├── utils/                       # общие утилиты приложения
│   ├── parseListField.js
│   └── validation.js
├── .sequelizerc
├── app.js
├── server.js
├── .env.example
├── eslint.config.js
└── package.json
```

`config/index.js` хранит runtime-настройки приложения, а `db/config.cjs` используется только для `sequelize-cli`. Оба файла получают пароль подключения к MySQL из `DB_PASSWORD` в `.env`.

## Что понадобится

- Node.js 18 или новее
- работающий сервер MySQL
- заранее созданная база данных

Пример:

```sql
CREATE DATABASE recipes_development;
```

## Установка

```bash
npm install
cp .env.example .env
```

Заполняем `.env`:

```env
PORT=3333
HOST=127.0.0.1
DB_NAME=recipes_development
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

Пароль подключения к MySQL указываем только один раз — в `DB_PASSWORD` файла `.env`. Runtime-конфиг получает его через `config/index.js`, а Sequelize CLI — через `db/config.cjs`.

## Скрипты БД

Для работы с базой в `package.json` добавлены отдельные скрипты:

- `npm run db:create` - создаёт базу данных
- `npm run db:drop` - удаляет базу данных
- `npm run db:reset` - удаляет и создаёт базу заново
- `npm run db:migrate` - запускает миграции
- `npm run db:migrate:undo` - откатывает последнюю миграцию
- `npm run db:migrate:undo:all` - откатывает все миграции
- `npm run db:seed` - запускает все сиды
- `npm run db:seed:undo` - откатывает последний сид
- `npm run db:seed:undo:all` - откатывает все сиды

Создание и удаление самой базы вынесено в `scripts/db.js`.  
Миграции и сиды по-прежнему выполняются через `sequelize-cli`, но уже через короткие npm-скрипты.

## Миграции

`migration:generate` → создаёт новый файл миграции.

В проекте шесть миграций:

1. `users`
2. `posts`
3. `comments`
4. `cuisines`
5. `recipes`
6. переименование пользовательских полей `name -> fullname` и `password -> password_hash`

Все таблицы содержат `created_at` и `updated_at`.

### Таблица users

| Поле          | Тип             | Ограничения       |
| ------------- | --------------- | ----------------- |
| id            | BIGINT UNSIGNED | PK, autoIncrement |
| fullname      | STRING          | not null          |
| email         | STRING          | not null, unique  |
| password_hash | STRING          | not null          |

В Sequelize-модели колонке `password_hash` соответствует camelCase-поле `passwordHash`.
Регистрация принимает обычный `password`, хеширует его через bcrypt и сохраняет только `passwordHash`.

### Таблица posts

| Поле    | Тип     | Ограничения       |
| ------- | ------- | ----------------- |
| id      | INTEGER | PK, autoIncrement |
| title   | STRING  | not null          |
| text    | TEXT    | not null          |
| user_id | INTEGER | not null, FK      |
| likes   | INTEGER | default 0         |

### Таблица comments

| Поле    | Тип     | Ограничения                |
| ------- | ------- | -------------------------- |
| id      | INTEGER | PK, autoIncrement          |
| post_id | INTEGER | not null, FK на `posts.id` |
| user_id | INTEGER | not null, FK на `users.id` |
| text    | TEXT    | not null                   |

### Таблица recipes

| Поле                 | Тип              | Ограничения       |
| -------------------- | ---------------- | ----------------- |
| id                   | INTEGER          | PK, autoIncrement |
| title                | STRING           | not null          |
| description          | TEXT             | nullable          |
| instructions         | TEXT             | not null          |
| cuisine_id           | INTEGER UNSIGNED | nullable, FK      |
| difficulty           | STRING           | default `easy`    |
| prep_time_minutes    | INTEGER          | default 0         |
| cook_time_minutes    | INTEGER          | default 0         |
| servings             | INTEGER          | default 1         |
| calories_per_serving | INTEGER          | nullable          |
| image_url            | STRING           | nullable          |
| rating               | DECIMAL          | default 0         |
| user_id              | INTEGER          | not null, FK      |

Запуск миграций:

```bash
npm run db:migrate
```

## Сидеры

В проекте есть пять сидеров:

1. `seed-users.js`
2. `seed-posts.js`
3. `seed-comments.js`
4. `seed-cuisines.js`
5. `seed-recipes.js`

Они заполняют базу тестовыми данными в правильном порядке:

1. users
2. posts
3. comments
4. cuisines
5. recipes

Запуск:

```bash
npm run db:seed
```

Откат:

```bash
npm run db:seed:undo:all
```

## Recipes

В проект добавлена сущность `recipes`:

- модель `Recipe`
- миграция `recipes`
- сидер с тестовыми рецептами
- роуты в `api/v1/routes/recipes.js`
- связь `User -> Recipe` через `user_id`

Для рецепта используется поле `title`.

В текущем флоу `POST /api/v1/recipes` принимает `title`, `ingredients` и `instructions`.
`instructions` нормализуется в строку с разделителем `. ` и хранится как `TEXT`.
В ответах API response helper парсит эту строку обратно в массив.
После создания рецепт повторно загружается с автором и кухней и возвращается через тот же response helper, что и GET-запросы.

`ingredients` проходит через API, но отдельной колонки для него в миграции `recipes` пока нет.

Текущий API-слой уже работает с `ingredients`, но отдельная колонка для него в миграции `recipes` ещё не добавлена.

## Версии API

API подключён с версией в URL:

- `app.use('/api/v1', routerV1)`
- `app.use('/api/v2', routerV2)`

Это значит, что текущие роуты доступны через `v1`:

- `POST /api/v1/users/register`
- `POST /api/v1/users/login`
- `GET /api/v1/users`
- `GET /api/v1/posts`
- `GET /api/v1/posts/:id`
- `POST /api/v1/posts`
- `PUT /api/v1/posts/:id`
- `DELETE /api/v1/posts/:id`
- `POST /api/v1/posts/:id/like`
- `GET /api/v1/comments/:postId`
- `POST /api/v1/comments`
- `DELETE /api/v1/comments/:id`

Для `v2` пока есть отдельный каркас:

- `GET /api/v2/posts`

`v2` нужен для новых несовместимых изменений, не ломая `v1`.

## Структура версий роутов

Версия `v1` уже собрана из отдельных роутеров:

- `api/v1/routes/users.js`
- `api/v1/routes/posts.js`
- `api/v1/routes/comments.js`
- `api/v1/routes/recipes.js`
- `api/v1/router.js`

Доменные модули для `v1` лежат рядом:

- `api/v1/modules/users/controllers.js`
- `api/v1/modules/users/responses.js`
- `api/v1/modules/users/validators.js`
- `utils/validation.js`

Версия `v2` тоже подключена отдельно:

- `api/v2/router.js`
- `api/v2/posts.js`

`app.js` подключает обе версии отдельно:

```js
app.use('/api/v1', routerV1);
app.use('/api/v2', routerV2);
```

## Модели

Каждая таблица имеет свою модель: `User`, `Post`, `Comment`, `Recipe`.

У `posts` и `comments` есть связь `Post.hasMany(Comment)` / `Comment.belongsTo(Post)`.  
Также включены связи `User -> Post`, `User -> Comment` и `User -> Recipe` через `user_id`: `User.hasMany(Post)` / `Post.belongsTo(User)`, `User.hasMany(Comment)` / `Comment.belongsTo(User)` и `User.hasMany(Recipe)` / `Recipe.belongsTo(User)`.
Проверка существования поста есть в роутере перед созданием комментария.

## Используемые методы Sequelize

В приложении используются только базовые методы ORM. Ниже коротко, что делает каждый из них и где он применяется.

### `findByPk`

Ищет запись по первичному ключу.

```js
const post = await Post.findByPk(req.params.id);
```

Используем в:

- `GET /posts/:id`
- `PUT /posts/:id`
- `POST /posts/:id/like`
- `POST /comments` для проверки существования поста

### `findAll`

Возвращает все записи, либо записи по фильтру.

```js
const posts = await Post.findAll();
const comments = await Comment.findAll({
  where: { postId: req.params.postId },
});
```

Используем в:

- `GET /users`
- `GET /posts`
- `GET /comments/:postId`

### `findOne`

Возвращает первую подходящую запись.

```js
const user = await User.findOne({
  where: { email: req.body.email },
});
```

Используем в:

- `POST /users/register` для проверки дубля email
- `POST /users/login` для поиска пользователя по email

### `create`

Создаёт новую запись в таблице.

```js
const user = await User.create({
  fullname: req.body.fullname,
  email: req.body.email,
  passwordHash,
});
```

Используем в:

- `POST /users/register`
- `POST /posts`
- `POST /comments`

### `update`

Обновляет поля существующей записи.

```js
await post.update({
  title: req.body.title,
  text: req.body.text,
});
```

Используем в:

- `PUT /posts/:id`

### `destroy`

Удаляет запись или записи по условию.

```js
const deletedCount = await Post.destroy({ where: { id: req.params.id } });
```

Используем в:

- `DELETE /posts/:id`
- `DELETE /comments/:id`

### `increment`

Атомарно увеличивает числовое поле.

```js
await post.increment('likes');
```

Используем в:

- `POST /posts/:id/like`

### `reload`

Перечитывает текущий экземпляр из базы.

```js
await post.reload();
```

Используем в:

- `POST /posts/:id/like`, чтобы вернуть уже обновлённый `likes`

### `toJSON`

Преобразует экземпляр модели в обычный объект.

```js
const { passwordHash: _, ...safeUser } = user.toJSON();
```

Используем в:

- `POST /users/register`, чтобы убрать пароль из ответа

### `authenticate`

Проверяет подключение к базе данных.

```js
await sequelize.authenticate();
```

Используем в:

- `server.js`, при старте приложения

## Связи Sequelize

В проекте используются обычные связи один-ко-многим.

### `hasMany`

Описывает связь “одна запись родителя связана со многими дочерними”.

В этом проекте:

```js
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
```

Это значит:

- у пользователя может быть много постов
- один пост может иметь много комментариев

### `belongsTo`

Описывает обратную сторону связи: “эта запись принадлежит другой записи”.

В этом проекте:

```js
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
```

Это значит:

- пост принадлежит одному пользователю
- комментарий принадлежит одному пользователю
- каждый комментарий принадлежит одному посту

### `foreignKey`

Показывает, какое поле хранит связь между таблицами.

В этом проекте:

- `posts.user_id` ссылается на `users.id`
- `comments.user_id` ссылается на `users.id`
- `comments.post_id` ссылается на `posts.id`

Пример:

```js
const user = await User.findByPk(1, {
  include: [{ model: Post, as: 'posts' }],
});

const commentsByUser = await Comment.findAll({
  where: { userId: 1 },
});

const post = await Post.findByPk(1, {
  include: [{ model: Comment, as: 'comments' }],
});
```

Так можно загрузить пользователя вместе с его постами.

Так можно получить все комментарии конкретного пользователя.

Так можно загрузить пост вместе с его комментариями.

```js
const posts = await Post.findAll({
  where: { userId: 1 },
});

const comments = await Comment.findAll({
  where: { postId: 1 },
});
```

Так можно получить все посты конкретного пользователя.

Так можно получить все комментарии к конкретному посту.

## Роутеры

Маршруты разделены по сущностям.

---

## api/v1/routes/users.js

### POST /api/v1/users/register

Тело: `{ fullname, email, password }`

- хеширование пароля через bcrypt (rounds = 10) в поле `passwordHash`
- при успехе → 201, возвращаем объект без `passwordHash`
- если email уже существует → 409 `{ error: 'Email уже занят' }`
- если тело пустое → 400

### POST /api/v1/users/login

Тело: `{ email, password }`

- если email не найден или пароль неверный → 401 `{ error: 'Неверный email или пароль' }`
- успех → 200 `{ user: { id, fullname, email }, token }`

Токен подписывается через `JWT_SECRET` и используется в заголовке `Authorization: Bearer <token>`.

### GET /api/v1/users

Возвращает список пользователей без паролей.

---

## api/v1/routes/posts.js

### GET /api/v1/posts

Все посты.

Возвращает посты вместе с автором через `include`.

### GET /api/v1/posts/:id

Если нет → 404 `{ error: 'Пост не найден' }`.

Возвращает пост вместе с автором и комментариями через `include`.

### POST /api/v1/posts

Создать пост.  
Поля: `{ title, text }`.  
Пустое тело → 400.

Нужен заголовок `Authorization: Bearer <token>`.

Перед созданием проверяем, что пользователь существует через `req.user.id`:

```js
User.findByPk(req.user.id);
```

Если пользователя нет → 404.

### PUT /api/v1/posts/:id

Обновить `title` и `text`.

Нужен заголовок `Authorization: Bearer <token>`.

### DELETE /api/v1/posts/:id

Удалить пост.  
Ответ → 204.

Нужен заголовок `Authorization: Bearer <token>`.

### POST /api/v1/posts/:id/like

Увеличить лайки:

```js
post.increment('likes');
```

Нужен заголовок `Authorization: Bearer <token>`.

---

## api/v1/routes/comments.js

### GET /api/v1/comments/:postId

Все комментарии к посту.

### POST /api/v1/comments

Тело: `{ postId, text }`  
Перед созданием проверяем, что пост существует:

```js
Post.findByPk(postId);
```

Если нет → 404.

Перед созданием также проверяем, что пользователь существует:

```js
User.findByPk(req.user.id);
```

Если пользователя нет → 404.

Нужен заголовок `Authorization: Bearer <token>`.

### DELETE /api/v1/comments/:id

Удалить комментарий.

Нужен заголовок `Authorization: Bearer <token>`.

---

## api/v2/router.js

Собирает маршруты второй версии API.

Сейчас во `v2` подключён только:

- `api/v2/posts.js`

### `GET /api/v2/posts`

Пока заглушка для отдельной версии.
Возвращает `501`, чтобы было видно, что это не часть `v1`.

---

## JWT авторизация

`POST /api/v1/users/login` выдаёт access token, а защищённые мутационные роуты принимают его в заголовке:

```http
Authorization: Bearer <token>
```

Заголовок парсится как схема `Bearer` и значение токена, поэтому формат должен быть именно таким.

Защищены:

- `POST /api/v1/posts`
- `PUT /api/v1/posts/:id`
- `DELETE /api/v1/posts/:id`
- `POST /api/v1/posts/:id/like`
- `POST /api/v1/comments`
- `DELETE /api/v1/comments/:id`
- `POST /api/v1/recipes`

## Обработка ошибок

Все роуты обёрнуты в `try/catch`.

- 400 — если не хватает полей
- 404 — если сущность не найдена
- 409 — дубль email
- 500 — JSON‑ответ, сервер не падает

## Проверка кода

В проекте есть ESLint с базовыми правилами:

- `no-unused-vars`
- `prefer-const`
- `curly`
- `eqeqeq`

Запуск:

```bash
npm run lint
```

---

## Запуск приложения

```bash
npm start
```

Режим разработки:

```bash
npm run dev
```

Сервер доступен по адресу:

```
http://localhost:3333
```

---

## Примеры запросов

```bash
# Регистрация
curl -X POST http://localhost:3333/api/v1/users/register \
  -H 'Content-Type: application/json' \
  -d '{"fullname":"Artem","email":"artem@gmail.com","password":"12345678"}'

# Логин
curl -X POST http://localhost:3333/api/v1/users/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"artem@gmail.com","password":"12345678"}'

# Создать пост
curl -X POST http://localhost:3333/api/v1/posts \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{"title":"My post","text":"Hello"}'

# Лайк поста
curl -X POST http://localhost:3333/api/v1/posts/1/like

# Комментарий
curl -X POST http://localhost:3333/api/v1/comments \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{"postId":1,"text":"Nice!"}'
```

---

## Проверка проблем

Если сервер сообщает об ошибке подключения, проверяем:

1. запущен ли MySQL
2. существует ли база из `DB_NAME`
3. правильные ли `DB_USER`, `DB_PASSWORD`, `DB_HOST`
4. совпадают ли настройки CLI в `db/config.cjs`
5. выполнены ли миграции
6. выполнены ли сидеры (если нужны тестовые данные)

```
sequelize.authenticate()
```

проверяет подключение при запуске сервера.

```
npm run db:migrate
```

создаёт таблицы.

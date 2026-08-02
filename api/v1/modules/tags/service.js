import { ValidationError } from 'sequelize';
import { Tag } from '#models/index.js';
import { normalizeWhitespace, toSlug } from '#utils/text.js';

// TODO: заменить Sequelize ValidationError на общую ошибку валидации
// и передавать её в централизованный errorHandler без привязки service к ORM.
export async function findOrCreateTags(tagTitles, options = {}) {
  // Вариант через Map оставлен для сравнения: он удалял дубли по ключу,
  // но при повторе сохранял последнее написание title.
  // const uniqueTitles = [...new Map(
  //   tagTitles.map((title) => {
  //     const normalizedTitle = normalizeWhitespace(title);
  //     return [normalizedTitle.toLowerCase(), normalizedTitle];
  //   }),
  // ).values()];

  // Set хранит уже встреченные регистронезависимые ключи.
  const seen = new Set();
  // Сохраняем первое нормализованное написание каждого tag.
  const uniqueTitles = tagTitles.map(normalizeWhitespace).filter((title) => {
    // Один и тот же tag с разным регистром считается дублем.
    const key = title.toLowerCase();

    if (seen.has(key)) {
      // Дубликат исключаем из итогового массива uniqueTitles.
      return false;
    }

    // Запоминаем (записываем) новый ключ в seen и оставляем title в результирующем массиве.
    seen.add(key);
    return true;
  });

  // Здесь будут Sequelize-модели найденных или созданных tags.
  const tags = [];

  for (const title of uniqueTitles) {
    // Slug используется как стабильный уникальный ключ Tag.
    const slug = toSlug(title);

    if (!slug) {
      // Строка из одних недопустимых для slug символов не может быть сохранена.
      throw new ValidationError('Некорректное название tag');
    }

    // Ищем Tag по slug; если его нет, создаём с нормализованными title и slug.
    // options передаёт текущую транзакцию из recipes controller.
    const [tag] = await Tag.findOrCreate({
      where: { slug },
      defaults: { title, slug },
      ...options,
    });

    // Возвращаем полноценную Sequelize-модель для recipe.setTags().
    tags.push(tag);
  }

  return tags;
}

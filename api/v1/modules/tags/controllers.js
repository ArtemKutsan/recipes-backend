import { Tag } from '#models/index.js';
import { toTagResponse } from './responses.js';

export async function getAll(_req, res) {
  try {
    // Возвращаем весь справочник без поиска и query-параметров.
    const tags = await Tag.findAll({
      order: [['title', 'ASC']],
    });

    return res.json(tags.map(toTagResponse));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

import { MealType } from '#models/index.js';
import { toMealTypeResponse } from './responses.js';

export async function getAll(_req, res) {
  try {
    // Возвращаем контролируемый справочник для выбора meal types на клиенте.
    const mealTypes = await MealType.findAll({
      order: [['title', 'ASC']],
    });

    return res.json(mealTypes.map(toMealTypeResponse));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

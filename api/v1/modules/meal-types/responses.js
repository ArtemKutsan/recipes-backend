export function toMealTypeResponse(mealType) {
  const plainMealType = mealType.toJSON();

  return {
    id: plainMealType.id,
    title: plainMealType.title,
  };
}

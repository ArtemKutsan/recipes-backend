import { parseListField } from '#utils/parseListField.js';

export function toRecipeResponse(recipe) {
  const plainRecipe = recipe.toJSON();

  return {
    id: plainRecipe.id,
    title: plainRecipe.title,
    ingredients: parseListField(plainRecipe.ingredients),
    instructions: parseListField(plainRecipe.instructions),
    // cuisineId: plainRecipe.cuisineId,
    cuisine: plainRecipe.cuisine?.title ?? null,
    author: plainRecipe.user?.fullname ?? null,
    userId: plainRecipe.userId,
    createdAt: plainRecipe.createdAt,
    updatedAt: plainRecipe.updatedAt,
  };
}

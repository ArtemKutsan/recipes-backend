import { parseListField } from '#utils/parseListField.js';

function toRecipeBaseResponse(recipe) {
  const plainRecipe = recipe.toJSON();

  return {
    id: plainRecipe.id,
    title: plainRecipe.title,
    cuisine: plainRecipe.cuisine?.title ?? null,
    author: plainRecipe.user?.fullname ?? null,
    tags: plainRecipe.tags?.map(({ id, title, slug }) => ({ id, title, slug })) ?? [],
    userId: plainRecipe.userId,
    createdAt: plainRecipe.createdAt,
    updatedAt: plainRecipe.updatedAt,
  };
}

export function toRecipeListResponse(recipe) {
  return toRecipeBaseResponse(recipe);
}

export function toRecipeDetailResponse(recipe) {
  const baseResponse = toRecipeBaseResponse(recipe);

  return {
    ...baseResponse,
    ingredients: parseListField(recipe.ingredients),
    instructions: parseListField(recipe.instructions),
  };
}

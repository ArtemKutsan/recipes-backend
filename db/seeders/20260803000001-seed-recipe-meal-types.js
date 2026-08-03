export async function up(queryInterface) {
  await queryInterface.bulkInsert('recipe_meal_types', [
    { recipe_id: 1, meal_type_id: 2 },
    { recipe_id: 1, meal_type_id: 3 },
    { recipe_id: 2, meal_type_id: 2 },
    { recipe_id: 2, meal_type_id: 3 },
    { recipe_id: 3, meal_type_id: 2 },
    { recipe_id: 3, meal_type_id: 6 },
    { recipe_id: 4, meal_type_id: 1 },
    { recipe_id: 4, meal_type_id: 4 },
    { recipe_id: 4, meal_type_id: 5 },
    { recipe_id: 4, meal_type_id: 6 },
    { recipe_id: 4, meal_type_id: 7 },
    { recipe_id: 5, meal_type_id: 2 },
    { recipe_id: 5, meal_type_id: 3 },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('recipe_meal_types', {
    recipe_id: [1, 2, 3, 4, 5],
  });
}

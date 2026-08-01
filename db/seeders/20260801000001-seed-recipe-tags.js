export async function up(queryInterface) {
  await queryInterface.bulkInsert('recipe_tags', [
    { recipe_id: 1, tag_id: 1 },
    { recipe_id: 2, tag_id: 2 },
    { recipe_id: 3, tag_id: 3 },
    { recipe_id: 4, tag_id: 4 },
    { recipe_id: 5, tag_id: 5 },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('recipe_tags', {
    recipe_id: [1, 2, 3, 4, 5],
  });
}

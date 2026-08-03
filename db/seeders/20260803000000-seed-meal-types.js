export async function up(queryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert('meal_types', [
    { id: 1, title: 'Breakfast', created_at: now, updated_at: now },
    { id: 2, title: 'Lunch', created_at: now, updated_at: now },
    { id: 3, title: 'Dinner', created_at: now, updated_at: now },
    { id: 4, title: 'Snack', created_at: now, updated_at: now },
    { id: 5, title: 'Dessert', created_at: now, updated_at: now },
    { id: 6, title: 'Brunch', created_at: now, updated_at: now },
    { id: 7, title: 'Afternoon Tea', created_at: now, updated_at: now },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('meal_types', {
    id: [1, 2, 3, 4, 5, 6, 7],
  });
}

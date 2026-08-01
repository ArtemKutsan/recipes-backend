export async function up(queryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert('tags', [
    { id: 1, title: 'Pasta', slug: 'pasta', created_at: now, updated_at: now },
    { id: 2, title: 'Curry', slug: 'curry', created_at: now, updated_at: now },
    { id: 3, title: 'Salad', slug: 'salad', created_at: now, updated_at: now },
    { id: 4, title: 'Breakfast', slug: 'breakfast', created_at: now, updated_at: now },
    { id: 5, title: 'Soup', slug: 'soup', created_at: now, updated_at: now },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('tags', {
    id: [1, 2, 3, 4, 5],
  });
}

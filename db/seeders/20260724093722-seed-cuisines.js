export async function up(queryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert('cuisines', [
    {
      id: 1,
      title: 'Italian',
      created_at: now,
      updated_at: now,
    },
    {
      id: 2,
      title: 'Indian',
      created_at: now,
      updated_at: now,
    },
    {
      id: 3,
      title: 'Greek',
      created_at: now,
      updated_at: now,
    },
    {
      id: 4,
      title: 'American',
      created_at: now,
      updated_at: now,
    },
    {
      id: 5,
      title: 'European',
      created_at: now,
      updated_at: now,
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('cuisines', {
    id: [1, 2, 3, 4, 5],
  });
}

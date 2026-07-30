export async function up(queryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert('comments', [
    {
      id: 1,
      post_id: 1,
      user_id: 2,
      text: 'Nice post!',
      created_at: now,
      updated_at: now,
    },
    {
      id: 2,
      post_id: 1,
      user_id: 3,
      text: 'Thanks for sharing.',
      created_at: now,
      updated_at: now,
    },
    {
      id: 3,
      post_id: 2,
      user_id: 1,
      text: 'Good point.',
      created_at: now,
      updated_at: now,
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('comments', {
    id: [1, 2, 3],
  });
}

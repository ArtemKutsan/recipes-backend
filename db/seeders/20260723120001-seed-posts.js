export async function up(queryInterface) {
  const now = new Date();

  await queryInterface.bulkInsert('posts', [
    {
      id: 1,
      title: 'First post',
      text: 'Hello from Artem',
      user_id: 1,
      likes: 3,
      created_at: now,
      updated_at: now,
    },
    {
      id: 2,
      title: 'Second post',
      text: 'Hello from Mila',
      user_id: 2,
      likes: 1,
      created_at: now,
      updated_at: now,
    },
    {
      id: 3,
      title: 'Third post',
      text: 'Hello from Ivan',
      user_id: 3,
      likes: 0,
      created_at: now,
      updated_at: now,
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('posts', {
    id: [1, 2, 3],
  });
}

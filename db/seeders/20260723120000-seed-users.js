import bcrypt from 'bcrypt';

export async function up(queryInterface) {
  const passwordHash = await bcrypt.hash('12345678', 10);

  await queryInterface.bulkInsert('users', [
    {
      id: 1,
      fullname: 'Artem',
      email: 'artem@gmail.com',
      password_hash: passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      fullname: 'Mila',
      email: 'mila@gmail.com',
      password_hash: passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 3,
      fullname: 'Ivan',
      email: 'ivan@gmail.com',
      password_hash: passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('users', {
    id: [1, 2, 3],
  });
}

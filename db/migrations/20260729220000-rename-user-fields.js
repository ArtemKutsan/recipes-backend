export async function up(queryInterface) {
  await queryInterface.renameColumn('users', 'name', 'fullname');
  await queryInterface.renameColumn('users', 'password', 'password_hash');
}

export async function down(queryInterface) {
  await queryInterface.renameColumn('users', 'password_hash', 'password');
  await queryInterface.renameColumn('users', 'fullname', 'name');
}

import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('recipe_tags', {
    recipe_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: { model: 'recipes', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    tag_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: { model: 'tags', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('recipe_tags');
}

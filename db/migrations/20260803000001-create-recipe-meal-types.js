import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('recipe_meal_types', {
    recipeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: { model: 'recipes', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'recipe_id',
    },
    mealTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: { model: 'meal_types', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      field: 'meal_type_id',
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('recipe_meal_types');
}

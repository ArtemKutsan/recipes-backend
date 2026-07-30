import { DataTypes } from 'sequelize';
import sequelize from '#config/db.js';

const Recipe = sequelize.define(
  'Recipe',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cuisineId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    difficulty: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'easy',
    },
    prepTimeMinutes: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    cookTimeMinutes: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    servings: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    caloriesPerServing: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'recipes',
    timestamps: false,
    underscored: true,
  },
);

export default Recipe;

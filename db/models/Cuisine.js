import { DataTypes } from 'sequelize';
import sequelize from '#config/db.js';

const Cuisine = sequelize.define(
  'Cuisine',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
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
    tableName: 'cuisines',
    timestamps: false,
    underscored: true,
  },
);

export default Cuisine;

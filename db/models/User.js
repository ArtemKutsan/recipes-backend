import { DataTypes } from 'sequelize';
import sequelize from '#config/db.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
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
    tableName: 'users',
    timestamps: false,
    underscored: true,
  },
);

export default User;

/*
Вариант через class extends Model:

import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '#config/db.js';

class User extends Model {
  async comparePassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  },
);

export default User;
*/

/*
Пример расширения текущей модели через prototype:

import bcrypt from 'bcrypt';

User.prototype.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

Тогда в роуте можно писать:

const isValidPassword = await user.comparePassword(req.body.password);
*/

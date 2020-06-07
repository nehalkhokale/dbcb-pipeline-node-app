'use strict';
module.exports = (sequelize, DataTypes) => {
  var token = sequelize.define('Token', {
    email: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    token: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      required: true,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      required: false,
      allowNull: true
    },
  }, {
    freezeTableName: true,
    tableName: 'Token',
    timestamps: false,
    paranoid: true
  })
  return token
}
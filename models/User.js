'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('Users', {
    userId: {
      type: DataTypes.INTEGER,
      required: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    hash: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false
    },
    middleName: {
        type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      required: true,
      allowNull: true
    },
    mobileNumber: {
      type: DataTypes.INTEGER,
      required: true,
      allowNull: true
    },
    alternateNumber: {
      type: DataTypes.INTEGER,
      required: true,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      required: true,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING,
      required: true,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      required: false,
      allowNull: true
    },
    isActive: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:1
    }
  }, {
    freezeTableName: true,
    tableName: 'Users',
    timestamps: false,
    paranoid: true
  })
  return user
}
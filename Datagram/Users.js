const { DataTypes, Model } = require("sequelize");
const { sequelizeInstance } = require("./index");

class Users extends Model {}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ApiID: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ApiHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    abonnement: {
      type: DataTypes.DATE,
      allowNull: false
    },
    linked: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    sequelize: sequelizeInstance,
    timestamps: false
  }
);

module.exports = Users;

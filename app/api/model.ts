import { Sequelize, DataTypes } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite",
});

export const Pot = sequelize.define("Pot", {
  // 锅哪
  location: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  // 几点
  time: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  // 口味
  flavor: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  // 备注
  remarks: DataTypes.STRING,
});

export const User = sequelize.define("User", {
  // 你谁啊
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  // 几饭
  rice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

  // 几面
  noodle: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

Pot.hasMany(User);

sequelize.sync();

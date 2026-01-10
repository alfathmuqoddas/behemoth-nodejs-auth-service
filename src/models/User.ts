import { DataTypes, Model, UUIDV4 } from "sequelize";
import sequelize from "../config/database";

class User extends Model {
  public id!: string;
  public email!: string;
  public userName!: string;
  public firstName!: string;
  public lastName!: string;
  public avatar!: string;
  public password!: string;
  public role!: "admin" | "user";
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
    schema: "auth_service",
    timestamps: true,
  }
);

export default User;

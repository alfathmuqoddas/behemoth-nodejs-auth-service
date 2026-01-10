require("dotenv").config();

module.exports = {
  development: {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    // 🔑 schema for DDL
    schema: "auth_service",

    // 🔑 isolate migrations per service
    migrationStorageTableName: "SequelizeMeta_auth",
    migrationStorageTableSchema: "auth_service",
  },

  test: {
    dialect: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },

  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },

    schema: "auth_service",
    migrationStorageTableName: "SequelizeMeta_auth",
    migrationStorageTableSchema: "auth_service",
  },
};

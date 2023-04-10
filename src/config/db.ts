import { Sequelize } from "sequelize";
import * as pg from "pg";

import { isInDevelopment } from "@config";

const dbConfig = isInDevelopment()
  ? {
      username: "postgres",
      password: "Root100!",
      database: "outdefine_db",
      host: "outdefine-db-instance-1.cwbwj2faznvi.us-west-1.rds.amazonaws.com",
      dialect: "postgres",
      port: 5432,
    }
  : {
      username: "postgres",
      password: "Root100!",
      database: "outdefine_db",
      host: "outdefine-db-instance-1.cnntvujm7z1k.us-east-1.rds.amazonaws.com",
      dialect: "postgres",
      port: 5432,
    };

const sequelize = new Sequelize(
  `${dbConfig.dialect}://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`,
  {
    host: dbConfig.host,
    logging: true,
    dialect: "postgres",
    dialectModule: pg,
    pool: {
      min: 0,
      max: 10,
      idle: 10000,
    },
  },
);

export { dbConfig, sequelize };

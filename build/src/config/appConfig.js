import mysql from 'mysql2/promise';
import dotenv from "dotenv";
import appConf from "../../app-config/app-config.json";
dotenv.config();
export const configuration = {
    ...appConf,
    pool: mysql.createPool({
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }),
    mongoUri: process.env.MONGO_URI || "dev db address",
    jwt: {
        secret: process.env.JWT_SECRET || "super-secret",
        exp: process.env.JWT_EXP || "1h"
    }
};

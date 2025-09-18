import dotenv from "dotenv";
// import appConf from "../../app-config/app-config.json" with {type: "json"};
import { readFileSync } from "node:fs";
import path from "node:path";
const jsonPath = path.resolve(process.cwd(), "app-config", "app-config.json");
const appConf = JSON.parse(readFileSync(jsonPath, "utf-8"));
dotenv.config();
export const configuration = {
    ...appConf,
    mongoUri: process.env.MONGO_URI || "dev db address",
    mongoAccountingUrl: process.env.MONGO_ACCOUNTING_URL || "dev db address",
    jwt: {
        secret: process.env.JWT_SECRET || "super-secret",
        exp: process.env.JWT_EXP || "1h"
    }
};

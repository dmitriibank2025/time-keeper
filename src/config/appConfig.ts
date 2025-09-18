import dotenv from "dotenv";
 import appConf from "../../app-config/app-config.json";
// import {readFileSync} from "node:fs";
// import path from "node:path";
//
// const jsonPath = path.resolve(process.cwd(), "app-config", "app-config.json");
// const appConf = JSON.parse(readFileSync(jsonPath, "utf-8"));

export interface AppConfig {
    port:number,
    skipRoutes:string[],
    pathRoles: Record<string, string[]>,
    checkIdRoutes:string[],
    mongoUri:string,
    mongoAccountingUrl:string,
    jwt:{
        secret:string,
        exp:string|number
    },
    logLevel:string
}
dotenv.config();


export const configuration:AppConfig = {
    ...appConf,
    mongoUri: process.env.MONGO_URI || "dev db address",
    mongoAccountingUrl: process.env.MONGO_ACCOUNTING_URL || "dev db address",
    jwt:{
        secret: process.env.JWT_SECRET || "super-secret",
        exp: process.env.JWT_EXP || "1h"
    }
}


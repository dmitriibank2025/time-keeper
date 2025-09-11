import winston from 'winston';
import {configuration} from "../config/appConfig.js";

export const logger = winston.createLogger({
    level: configuration.logLevel,
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'error.log', level: "error"}),
        new winston.transports.File({filename: 'combine.log'}),
    ]
})
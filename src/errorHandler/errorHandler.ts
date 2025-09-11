import {HttpError} from "./HttpError.js";
import {Request, Response,NextFunction} from "express";
import {WriteStream} from "node:fs";

export const errorHandler = (errorStream: WriteStream) => {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
        let status: number = 500;
        let message = 'Unknown server error! ' + err.message;

        if (err instanceof HttpError) {
            status = err.status;
            message = err.message;
        }

        const errLog = `[${new Date().toISOString()}] ${req.method} ${req.url} - ${status} - ${err.message}\n`;
        errorStream.write(errLog);
        res.status(status).send(message);
    };
};

// errorHandler.ts
import { HttpError } from "./HttpError.js";
import { Request, Response, NextFunction } from "express";
import { WriteStream } from "node:fs";

export const errorHandler = (errorStream: WriteStream) => {
    return (err: Error, req: Request, res: Response, _next: NextFunction) => {
        let status = 500;
        let message = "Unknown server error";

        if (err instanceof HttpError) {
            status = err.status;
            message = err.message;
        }

        const errLog = `[${new Date().toISOString()}] ${req.method} ${
            req.url
        } - ${status} - ${err.message}\n`;
        errorStream.write(errLog);

        const body: any = {
            error: message,
            status,
            path: req.method + " " + req.originalUrl,
            timestamp: new Date().toISOString(),
        };

        res.status(status).json(body);
    };
};

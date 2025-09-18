// errorHandler.ts
import { HttpError } from "./HttpError.js";
export const errorHandler = (errorStream) => {
    return (err, req, res, _next) => {
        let status = 500;
        let message = "Unknown server error";
        if (err instanceof HttpError) {
            status = err.status;
            message = err.message;
        }
        const errLog = `[${new Date().toISOString()}] ${req.method} ${req.url} - ${status} - ${err.message}\n`;
        errorStream.write(errLog);
        const body = {
            error: message,
            status,
            path: req.method + " " + req.originalUrl,
            timestamp: new Date().toISOString(),
        };
        res.status(status).json(body);
    };
};

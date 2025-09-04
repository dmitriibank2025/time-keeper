export class HttpError extends Error {
    status;
    message;
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
        this.name = 'HttpError';
        this.isOperational = true;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

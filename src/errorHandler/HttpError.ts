
export class HttpError extends Error {
    constructor(public status: number, public message:string) {
        super(message);
        this.name = 'HttpError';
        (this as any).isOperational = true;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
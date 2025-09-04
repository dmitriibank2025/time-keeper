import { HttpError } from "./HttpError.js";
export const errorHandler = (err, req, res, next) => {
    if (err instanceof HttpError) {
        res.status(err.status).send(err.message);
    }
    else {
        res.status(500).send("Internal Server Error");
    }
};

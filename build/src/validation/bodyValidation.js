import { HttpError } from "../errorHandler/HttpError.js";
export const bodyValidation = (schema) => (req, res, next) => {
    if (!req.body)
        throw new HttpError(400, "Body required");
    const { error } = schema.validate(req.body);
    if (error)
        throw new HttpError(400, error.message);
    next();
};

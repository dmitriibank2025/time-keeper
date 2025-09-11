
import {AuthRequest, Roles} from "../utils/appTypes.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {NextFunction, Response} from "express";


export const authorize = (pathRoute: Record<string, Roles[]>) =>
    (req: AuthRequest, res: Response, next: NextFunction) => {
        const route = req.method + req.path
        const roles = req.roles;
        if (!roles || roles.some(r => pathRoute[route].includes(r))) {
            console.log("Access granted")
            next();
        } else {
            console.log("Access denied")
            throw new HttpError(403, "")
        }
    }


export const checkAccountById = (checkPathId:string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const route = req.method + req.path;
        const roles = req.roles;
        if (!roles || !checkPathId.includes(route) || (!req.roles!.includes(Roles.MNG)
            && req.roles!.includes(Roles.CREW)
            && req.empId == req.query.id))
            next();
        else throw new HttpError(403, "You can modify only your account")
    }
}
import {AccountService} from "../services/accountService.js";
import {NextFunction, Request, Response} from "express";
import bcrypt from "bcryptjs";
import {HttpError} from "../errorHandler/HttpError.js";
import {AuthRequest, Roles} from "../utils/appTypes.js";
import jwt, {JwtPayload} from "jsonwebtoken";
import {configuration} from "../config/appConfig.js";

const BASIC = 'Basic ';
const BEARER = 'Bearer '

async function getBasicAuth(authHeader: string, service: AccountService, req: AuthRequest, res: Response) {

    const auth = Buffer.from(authHeader.substring(BASIC.length), "base64").toString("ascii");
    console.log(auth);
    const [id, password] = auth.split(":");
    if (id === process.env.OWNER && password === process.env.OWNER_PASS) {
        req.roles = [Roles.SUP]
    } else {
        try {
            const account = await service.getEmployeeById(id);
            if (bcrypt.compareSync(password, account.passHash)) {
                req.empId = account._id;
                req.empName = account.empName;
                req.roles = account.roles;
                console.log("AUTHENTICATED")
            } else {
                console.log("NOT AUTHENTICATED")
            }
        } catch (e) {
            console.log(e)
        }
    }
}

function jwtAuth(authHeader: string, req: AuthRequest) {
    const token = authHeader.substring(BEARER.length);
    try {
        const payload = jwt.verify(token, configuration.jwt.secret) as JwtPayload;
        console.log(payload);
        req.empId = payload.sub;
        req.roles = JSON.parse(payload.roles) as Roles[];
        req.empName = "Anonymous";
    } catch (e) {
        console.log(e)
    }
}

export const authentication = (service: AccountService) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.header('Authorization');
        console.log(authHeader)
        if (authHeader && authHeader.startsWith(BASIC)) await getBasicAuth(authHeader, service, req, res)
        else if (authHeader && authHeader.startsWith(BEARER)) {
            jwtAuth(authHeader, req)
        }
        next();
    }
}

export const skipRoutes = (skipRoutes: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
    const route = req.method + req.path
    if (!skipRoutes.includes(route) && !req.roles) {
        res.json("No skip route")
        throw new HttpError(401, '')
    }
    next();
}
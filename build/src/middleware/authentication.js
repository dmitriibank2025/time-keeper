import bcrypt from "bcryptjs";
import { Roles } from "../utils/appTypes.js";
import jwt from "jsonwebtoken";
import { configuration } from "../config/appConfig.js";
const BASIC = 'Basic ';
const BEARER = 'Bearer ';
async function getBasicAuth(authHeader, service, req, res) {
    const auth = Buffer.from(authHeader.substring(BASIC.length), "base64").toString("ascii");
    console.log(auth);
    const [id, password] = auth.split(":");
    if (id === process.env.OWNER && password === process.env.OWNER_PASS) {
        req.roles = [Roles.SUP];
    }
    else {
        try {
            const account = await service.getEmployeeById(id);
            if (bcrypt.compareSync(password, account.passHash)) {
                req.empId = account._id;
                req.empName = account.empName;
                req.roles = account.roles;
                console.log("AUTHENTICATED");
            }
            else {
                console.log("NOT AUTHENTICATED");
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}
function jwtAuth(authHeader, req) {
    const token = authHeader.substring(BEARER.length);
    try {
        const payload = jwt.verify(token, configuration.jwt.secret);
        console.log(payload);
        req.empId = payload.sub;
        req.roles = JSON.parse(payload.roles);
        req.empName = "Anonymous";
    }
    catch (e) {
        console.log(e);
    }
}
export const authentication = (service) => {
    return async (req, res, next) => {
        const authHeader = req.header('Authorization');
        console.log(authHeader);
        if (authHeader && authHeader.startsWith(BASIC))
            await getBasicAuth(authHeader, service, req, res);
        else if (authHeader && authHeader.startsWith(BEARER)) {
            jwtAuth(authHeader, req);
        }
        next();
    };
};
// export const skipRoutes = (skipRoutes: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
//     const route = req.method + req.path
//     if (!skipRoutes.includes(route) && !req.roles) throw new HttpError(401, '')
//     next();
// }

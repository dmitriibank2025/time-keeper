import {NextFunction, Request, Response} from "express";
import {
    accountServiceImplMongo as service
} from "../services/AccountServiceImplMongo.js";
import {convertEmployeeDtoToEmployee} from "../utils/tools.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {Employee, EmployeeDto} from "../model/Employee.js";
import {AuthRequest, Roles} from "../utils/appTypes.js";
import {logger} from "../Logger/winston.js";

export const checkID = (req: AuthRequest, res: Response, next: NextFunction) => {
    const id = req.query.id;
    if (typeof id !== "string" || id.trim() === "")  {
        logger.error(`${new Date().toISOString()} => Invalid ID`);
        throw new HttpError(400, "Invalid ID");
    }
    next();
}

export const actorData = (req: AuthRequest,res: Response,next: NextFunction)=>{
    const actorId = req.empId;
    const actorRoles = req.roles;
    if (!actorId || !actorRoles) {
        logger.error(`${new Date().toISOString()} => Actor's data invalid`);
        throw new HttpError(400, "Actor's data invalid");
    }
    next()
}

export const hireEmployee = async (req: AuthRequest, res: Response) => {
    const body = req.body;
    const actorId = req.empId;
    const actorRoles = req.roles;
    const employee = await convertEmployeeDtoToEmployee(body as EmployeeDto)
    const result = await service.hireEmployee(employee as Employee, actorId as string, actorRoles as Roles[]);
    res.json(result)
}

export const fireEmployee = async (req: AuthRequest, res: Response) => {
    const {id} = req.query;
    const actorId = req.empId;
    const actorRoles = req.roles;
    const result = await service.fireEmployee(id as string, actorId as string, actorRoles as Roles[]);
    return res.status(200).json(result);
}

export const getEmployeeById = async (req: Request, res: Response) => {
    const {id} = req.query;
    const result = await service.getEmployeeById(id as string);
    res.json(result)
}

export const getAllEmployees = async (req: Request, res: Response) => {
    const result = await service.getAllEmployees();
    res.json(result)
}


export const changePassword = async (req: AuthRequest, res: Response) => {
    const {empId, newPassword} = req.body;
    if (!newPassword) {
        logger.error(`${new Date().toISOString()} => New password invalid`);
        throw new HttpError(400, "New password invalid");
    }
    const actorId = req.empId;
    const actorRoles = req.roles;
    const result = await service.changePassword(empId, newPassword, actorId as string, actorRoles as Roles[]);
    res.json(result)

}

export const updateEmployee = async (req: AuthRequest, res: Response) => {
    const { empId, employee} = req.body;
    if (!empId || !employee) {
        logger.error(`${new Date().toISOString()} => Employee's data invalid`);
        throw new HttpError(400, "Data invalid");
    }
    const actorId = req.empId;
    const actorRoles = req.roles;
    const result = await service.updateEmployee(empId as string, employee, actorId as string, actorRoles as Roles[]);
    res.json(result)

}

export const setRole = async (req: AuthRequest, res: Response) => {
    const {id, newRole} = req.body;
    if (!id){
        logger.error(`${new Date().toISOString()} => Employee's data invalid`);
        throw new HttpError(400, "Data invalid");
    }
    const actorId = "1000000";
    const actorRoles = ['supervisor'];
    const result = await service.setRole(id, newRole, actorId, actorRoles as Roles[]);
    res.json(result)

}


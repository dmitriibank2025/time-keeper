import {Request, Response} from "express";
import {
    accountServiceImplMongo as service
} from "../services/AccountServiceImplMongo.js";
import {convertEmployeeDtoToEmployee} from "../utils/tools.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {Employee, EmployeeDto} from "../model/Employee.js";
import {AuthRequest, Roles} from "../utils/appTypes.js";


export const hireEmployee = async (req: AuthRequest, res: Response) => {
    const body = req.body;
    const actorId = req.empId;
    const actorRoles = req.roles;
    if (!actorId || !actorRoles)
        throw new HttpError(400, "Actor's data invalid");
    const employee = await convertEmployeeDtoToEmployee(body as EmployeeDto)
    const result = await service.hireEmployee(employee as Employee, actorId!, actorRoles);
    res.json(result)
}

export const fireEmployee = async (req: AuthRequest, res: Response) => {
    const {id} = req.query;
    if (!id)
        throw new HttpError(400, "Invalid ID");
    const actorId = req.empId;
    const actorRoles = req.roles;
    if (!actorId || !actorRoles)
        throw new HttpError(400, "Actor's data invalid");
    const result = await service.fireEmployee(id as string, actorId, actorRoles);
    return res.status(200).json(result);
}

export const getEmployeeById = async (req: Request, res: Response) => {
    const {id} = req.query;
    if (!id)
        throw new HttpError(400, "Invalid ID");
    const result = await service.getEmployeeById(id as string);
    res.json(result)
}

export const getAllEmployees = async (req: Request, res: Response) => {
    const result = await service.getAllEmployees();
    res.json(result)
}


export const changePassword = async (req: AuthRequest, res: Response) => {
    const {empId, newPassword} = req.body;
    if (!empId || !newPassword)
        throw new HttpError(400, "Data invalid");
    const actorId = req.empId;
    const actorRoles = req.roles;
    if (!actorId || !actorRoles)
        throw new HttpError(400, "Actor's data invalid");
    const result = await service.changePassword(empId, newPassword, actorId, actorRoles as Roles[]);
    res.json(result)

}

export const updateEmployee = async (req: AuthRequest, res: Response) => {
    const {empId, employee} = req.body;
    if (!empId)
        throw new HttpError(400, "Data invalid");
    const actorId = req.empId;
    const actorRoles = req.roles;
    if (!actorId || !actorRoles)
        throw new HttpError(400, "Actor's data invalid");
    const result = await service.updateEmployee(empId, employee, actorId, actorRoles as Roles[]);
    res.json(result)

}

export const setRole = async (req: AuthRequest, res: Response) => {
    const {id, newRole} = req.body;
    if (!id)
        throw new HttpError(400, "Data invalid");
    const actorId = "1000000";
    const actorRoles = ['supervisor'];
    const result = await service.setRole(id, newRole, actorId, actorRoles as Roles[]);
    res.json(result)

}


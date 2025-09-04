import {Request, Response} from "express";
import {
    accountServiceImplMongo as service
} from "../services/AccountServiceImplMongo.js";
import {convertEmployeeDtoToEmployee} from "../utils/tools.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {Employee, EmployeeDto} from "../model/Employee.js";


export const hireEmployee = async (req: Request, res: Response) => {
    const body = req.body;
    const employee = await convertEmployeeDtoToEmployee(body as EmployeeDto)
    const result = await service.hireEmployee(employee as Employee);
    res.json(result)
}

export const fireEmployee = async (req: Request, res: Response) => {
    const {id} = req.query;
    if (!id)
        throw new HttpError(400, "Invalid ID");
    const result = await service.fireEmployee(id as string);
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


export const changePassword = async (req: Request, res: Response) => {
    const {empId, newPassword} = req.body;
    if (!empId || !newPassword)
        throw new HttpError(400, "Data invalid");
    const result = await service.changePassword(empId, newPassword);
    res.json(result)

}

export const updateEmployee = async (req: Request, res: Response) => {
    const {empId, employee} = req.body;
    if (!empId)
        throw new HttpError(400, "Data invalid");
    const result = await service.updateEmployee(empId, employee);
    res.json(result)

}

export const setRole = async (req: Request, res: Response) => {
    const {id, newRole} = req.body;
    if (!id)
        throw new HttpError(400, "Data invalid");
    const result = await service.setRole(id, newRole);
    res.json(result)

}


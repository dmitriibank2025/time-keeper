import { accountServiceImplMongo as service } from "../services/AccountServiceImplMongo.js";
import { convertEmployeeDtoToEmployee } from "../utils/tools.js";
import { HttpError } from "../errorHandler/HttpError.js";
import { logger } from "../Logger/winston.js";
export const checkID = (req, res, next) => {
    const id = req.query.id;
    if (typeof id !== "string" || id.trim() === "") {
        logger.error(`${new Date().toISOString()} => Invalid ID`);
        throw new HttpError(400, "Invalid ID");
    }
    next();
};
export const actorData = (req, res, next) => {
    const actorId = req.empId;
    const actorRoles = req.roles;
    if (!actorId || !actorRoles) {
        logger.error(`${new Date().toISOString()} => Actor's data invalid`);
        throw new HttpError(400, "Actor's data invalid");
    }
    next();
};
export const hireEmployee = async (req, res) => {
    const body = req.body;
    const actorId = req.empId;
    const actorRoles = req.roles;
    const employee = await convertEmployeeDtoToEmployee(body);
    const result = await service.hireEmployee(employee, actorId, actorRoles);
    res.json(result);
};
export const fireEmployee = async (req, res) => {
    const { id } = req.query;
    const actorId = req.empId;
    const actorRoles = req.roles;
    const result = await service.fireEmployee(id, actorId, actorRoles);
    return res.status(200).json(result);
};
export const getEmployeeById = async (req, res) => {
    const { id } = req.query;
    const result = await service.getEmployeeById(id);
    res.json(result);
};
export const getAllEmployees = async (req, res) => {
    const result = await service.getAllEmployees();
    res.json(result);
};
export const changePassword = async (req, res) => {
    const { empId, newPassword } = req.body;
    if (!newPassword) {
        logger.error(`${new Date().toISOString()} => New password invalid`);
        throw new HttpError(400, "New password invalid");
    }
    const actorId = req.empId;
    const actorRoles = req.roles;
    const result = await service.changePassword(empId, newPassword, actorId, actorRoles);
    res.json(result);
};
export const updateEmployee = async (req, res) => {
    const { empId, employee } = req.body;
    if (!empId || !employee) {
        logger.error(`${new Date().toISOString()} => Employee's data invalid`);
        throw new HttpError(400, "Data invalid");
    }
    const actorId = req.empId;
    const actorRoles = req.roles;
    const result = await service.updateEmployee(empId, employee, actorId, actorRoles);
    res.json(result);
};
export const setRole = async (req, res) => {
    const { id, newRole } = req.body;
    if (!id) {
        logger.error(`${new Date().toISOString()} => Employee's data invalid`);
        throw new HttpError(400, "Data invalid");
    }
    const actorId = "1000000";
    const actorRoles = ['supervisor'];
    const result = await service.setRole(id, newRole, actorId, actorRoles);
    res.json(result);
};

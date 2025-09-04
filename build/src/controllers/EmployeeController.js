import { accountServiceImplMongo as service } from "../services/AccountServiceImplMongo.js";
import { convertEmployeeDtoToEmployee } from "../utils/tools.js";
import { HttpError } from "../errorHandler/HttpError.js";
export const hireEmployee = async (req, res) => {
    const body = req.body;
    const employee = await convertEmployeeDtoToEmployee(body);
    const result = await service.hireEmployee(employee);
    res.json(result);
};
export const fireEmployee = async (req, res) => {
    const { id } = req.query;
    if (!id)
        throw new HttpError(400, "Invalid ID");
    const result = await service.fireEmployee(id);
    return res.status(200).json(result);
};
export const getEmployeeById = async (req, res) => {
    const { id } = req.query;
    if (!id)
        throw new HttpError(400, "Invalid ID");
    const result = await service.getEmployeeById(id);
    res.json(result);
};
export const getAllEmployees = async (req, res) => {
    const result = await service.getAllEmployees();
    res.json(result);
};
export const changePassword = async (req, res) => {
    const { empId, newPassword } = req.body;
    if (!empId || !newPassword)
        throw new HttpError(400, "Data invalid");
    const result = await service.changePassword(empId, newPassword);
    res.json(result);
};
export const updateEmployee = async (req, res) => {
    const { empId, employee } = req.body;
    if (!empId)
        throw new HttpError(400, "Data invalid");
    const result = await service.updateEmployee(empId, employee);
    res.json(result);
};
export const setRole = async (req, res) => {
    const { id, newRole } = req.body;
    if (!id)
        throw new HttpError(400, "Data invalid");
    const result = await service.setRole(id, newRole);
    res.json(result);
};

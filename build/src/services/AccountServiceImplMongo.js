import { EmployeeModel, FiredEmployeeModel } from "../model/EmployeeMongooseModel.js";
import { HttpError } from "../errorHandler/HttpError.js";
import bcrypt from "bcryptjs";
export class AccountServiceImplMongo {
    async hireEmployee(employee) {
        const exist = await EmployeeModel.findById(employee._id).lean();
        if (exist)
            throw new HttpError(409, "Employee already exists");
        const firedBefore = await FiredEmployeeModel.findById(employee._id).lean();
        if (firedBefore)
            throw new HttpError(409, "Employee was fired before");
        const saved = await new EmployeeModel(employee).save();
        const emp = await EmployeeModel.findById(saved._id).lean();
        if (!emp)
            throw new HttpError(500, "Failed to create employee");
        return emp;
    }
    async fireEmployee(id) {
        const deleted = await EmployeeModel.findByIdAndDelete(id);
        if (!deleted)
            throw new HttpError(404, `Employee with id ${id} not found`);
        const employeeFiredDoc = new FiredEmployeeModel(deleted);
        const result = await employeeFiredDoc.save();
        return result;
    }
    async changePassword(id, newPassword) {
        const editEmployeePassword = await EmployeeModel.findById(id);
        if (!editEmployeePassword)
            throw new HttpError(409, `Employee with id ${id} not found`);
        const isSame = await bcrypt.compare(newPassword, editEmployeePassword.passHash);
        if (isSame) {
            throw new HttpError(400, "The new password must not be the same as the old one");
        }
        const newPassHash = await bcrypt.hash(newPassword, 10);
        editEmployeePassword.passHash = newPassHash;
        await editEmployeePassword.save();
    }
    async getAllEmployees() {
        const allEmp = await EmployeeModel.find().lean();
        return allEmp;
    }
    async getEmployeeById(id) {
        const res = await EmployeeModel.findByIdAndDelete(id);
        if (!res)
            throw new HttpError(404, `Employee with id ${id} not found`);
        return res;
    }
    async setRole(id, newRole) {
        const editEmployeeRole = await EmployeeModel.findByIdAndUpdate({ _id: id }, {
            $addToSet: { role: newRole },
        }).lean();
        if (!editEmployeeRole)
            throw new HttpError(404, "Role with id ${id} not found");
        return editEmployeeRole;
    }
    async updateEmployee(empId, employee) {
        const newEmpName = `${employee.firstName} ${employee.lastName}`;
        const editEmployee = await EmployeeModel.findByIdAndUpdate(empId, {
            $addToSet: { empName: newEmpName },
        }).lean();
        if (!editEmployee)
            throw new HttpError(404, `Employee with id ${empId} not found`);
        return editEmployee;
    }
}
export const accountServiceImplMongo = new AccountServiceImplMongo();

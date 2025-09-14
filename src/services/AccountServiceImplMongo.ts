import {AccountService} from "./accountService.js";
import {
    EmployeeModel,
    FiredEmployeeModel
} from "../model/EmployeeMongooseModel.js";
import {HttpError} from "../errorHandler/HttpError.js";
import bcrypt from "bcryptjs";
import {
    Employee,
    EmployeeDataPatch,
    SavedFiredEmployee
} from "../model/Employee.js";
import {auditLog} from "../model/Audit.js";
import {Roles} from "../utils/appTypes.js";
import {logger} from "../Logger/winston.js";
import {archiveShifts} from "./archiveService.js";


export class AccountServiceImplMongo implements AccountService {

    async hireEmployee(employee: Employee, actorId: string, actorRoles: Roles[]): Promise<Employee> {
        const exist = await EmployeeModel.findById(employee._id);
        if (exist) {
            await auditLog({
                actorId: actorId,
                actorRoles: actorRoles,
                action: 'HIRE',
                targetId: employee._id,
                status: 'DENIED',
                textError: "Employee already exists"
            });
            throw new HttpError(409, `Employee with ${employee._id} already exists`)
        }
        const firedBefore = await FiredEmployeeModel.findById(employee._id);
        if (firedBefore) {
            await auditLog({
                actorId: actorId,
                actorRoles: actorRoles,
                action: 'HIRE',
                targetId: employee._id,
                status: 'DENIED',
                textError: "Employee was fired before"
            })
            throw new HttpError(409, "Employee was fired before")
        }


        const saved = await new EmployeeModel(employee).save();
        if (!saved) throw new HttpError(500, "Failed to save employee");
        return saved as Employee;

        // const emp = await EmployeeModel.findById(saved._id);
        // if (!emp) throw new HttpError(500, "Failed to create employee");
        // await auditLog({
        //     actorId: actorId,
        //     actorRoles: actorRoles,
        //     action: 'HIRE',
        //     targetId: employee._id,
        //     status: 'SUCCESS'
        // })
        // return emp as Employee;
    }

    async fireEmployee(id: string, actorId: string, actorRoles: Roles[]): Promise<SavedFiredEmployee> {
        const deletedDoc = await EmployeeModel.findByIdAndDelete(id);
        if (!deletedDoc) {
            logger.error(`${new Date().toISOString()} => Employee with id ${id} not found`);
            throw new HttpError(404, `Employee with id ${id} not found`);
        }
        try {
            const {table_num, workTimeList} = deletedDoc
            if (workTimeList) {
                try {
                    await archiveShifts(table_num, workTimeList);
                    logger.info(`${new Date().toISOString()} => Archived ${workTimeList.length} shifts for employee ${table_num}`);
                } catch (error) {
                    logger.error(`${new Date().toISOString()} => Failed to archive shifts for employee ${table_num}: ${error}`);
                    throw new HttpError(500, "Failed to archive old shifts");
                }
            }

            const firedDoc = new FiredEmployeeModel(deletedDoc.toObject());
            const savedFired = await firedDoc.save();

            await auditLog({
                actorId: actorId,
                actorRoles: actorRoles,
                action: 'FIRE',
                targetId: id,
                status: 'SUCCESS'
            })
            return savedFired as SavedFiredEmployee;
        } catch (e) {
            logger.error(`${new Date().toISOString()} => DB error on fireEmployee (id=${id}): ${e}`);
            throw new HttpError(500, "Failed to fire employee");
        }
    }


    async changePassword(empId: string, newPassword: string, actorId: string, actorRoles: Roles[]): Promise<void> {
        const editEmployeePassword = await EmployeeModel.findById(empId);
        if (!editEmployeePassword) {
            logger.error(`${new Date().toISOString()} => Employee with id ${empId} not found`);
            throw new HttpError(409, `Employee with id ${empId} not found`)
        }
        const isSame = await bcrypt.compare(newPassword, editEmployeePassword.passHash);
        if (isSame) {
            logger.error(`${new Date().toISOString()} => New password equals old (id=${empId})`);
            throw new HttpError(400, "The new password must not be the same as the old one");
        }
        try {
            const newPassHash = await bcrypt.hash(newPassword, 10);
            editEmployeePassword.passHash = newPassHash;
            await editEmployeePassword.save()
            await auditLog({
                actorId: actorId,
                actorRoles: actorRoles,
                action: 'change password',
                targetId: empId,
                status: 'SUCCESS'
            })
        } catch (e) {
            logger.error(`${new Date().toISOString()} => DB error on changePassword (id=${empId}): ${e}`);
            throw new HttpError(500, "Failed to update password");
        }
    }

    async getAllEmployees(): Promise<Employee[]> {
        const allEmp = await EmployeeModel.find().lean<Employee[]>();
        return allEmp as Employee[];
    }

    async getEmployeeById(id: string): Promise<Employee> {
        const res = await EmployeeModel.findById(id).exec();
        if (!res) {
            logger.error(`${new Date().toISOString()} => Employee with id ${id} not found`);
            throw new HttpError(404, `Employee with id ${id} not found`);
        }
        return res as Employee;
    }


    async setRole(id: string, newRole: string, actorId: string, actorRoles: Roles[]): Promise<Employee> {
        console.log(newRole);
        const editEmployeeRole = await EmployeeModel.findByIdAndUpdate(
            id,
            {
                $addToSet: {roles: newRole},
            }).lean<Employee>();
        if (!editEmployeeRole) {
            logger.error(`${new Date().toISOString()} => Role with id ${id} not found`);
            throw new HttpError(404, `Role with id ${id} not found`);
        }
        await auditLog({
            actorId: actorId,
            actorRoles: actorRoles,
            action: 'set role',
            targetId: id,
            status: 'SUCCESS'
        })
        return editEmployeeRole;
    }

    async updateEmployee(empId: string, employee: EmployeeDataPatch, actorId: string, actorRoles: Roles[]): Promise<Employee> {
        const newEmpName = `${employee.firstName} ${employee.lastName}`;
        const editEmployee = await EmployeeModel.findByIdAndUpdate(
            empId,
            {
                $set: {empName: newEmpName},
            }).lean<Employee>();
        if (!editEmployee) {
            logger.error(`${new Date().toISOString()} => Employee with id ${empId} not found`);
            throw new HttpError(404, `Employee with id ${empId} not found`);
        }
        const res = await EmployeeModel.findById(empId).lean<Employee>();
        await auditLog({
            actorId: actorId,
            actorRoles: actorRoles,
            action: `update  employee's data`,
            targetId: empId,
            status: 'SUCCESS'
        })
        return res as Employee;
    }


}

export const accountServiceImplMongo = new AccountServiceImplMongo()
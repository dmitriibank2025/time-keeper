import {Employee, EmployeeDto, SavedFiredEmployee} from "../model/Employee.js";
import {Roles} from "../utils/appTypes.js";

export interface AccountService {
    hireEmployee: (employee: Employee, actorId:string, actorRoles: Roles[]) => Promise<Employee>;
    fireEmployee: (empId:string, actorId:string, actorRoles: Roles[]) => Promise<SavedFiredEmployee>;
    updateEmployee: (empId:string , employee: EmployeeDto, actorId:string, actorRoles: Roles[]) => Promise<Employee>;
    changePassword:  (empId:string , newPassword: string, actorId:string, actorRoles: Roles[]) => Promise<void>;
    getEmployeeById: (id: string) => Promise<Employee>;
    getAllEmployees: () => Promise<SavedFiredEmployee[]>;
    setRole: (id:string, newRole:string, actorId:string, actorRoles: Roles[]) => Promise<Employee>;
}
import {Roles} from "../utils/appTypes.js";

export type EmployeeDto = {
    firstName: string,
    lastName: string,
    password: string,
    id: string,

}

export type Employee = {
    _id: string,
    empName: string,
    passHash: string,
    roles: Roles[],
    workTimeList: WorkTimeRecord[]
}

export type EmployeeDataPatch = {
    firstName?: string;
    lastName?: string;
};

export type WorkTimeRecord = {
    id: string,
    login_time: string,
    logout_time: string | null
}


export type SavedFiredEmployee = {
    _id: string,
    empName: string,
}

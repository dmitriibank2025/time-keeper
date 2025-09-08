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
    table_num: string,
    roles: Roles[],
    workTimeList: WorkTimeRecord[]
}

export type EmployeeDataPatch = {
    firstName?: string;
    lastName?: string;
};

export type WorkTimeRecord = {
    shift_id: string,
    startShift: string,
    finishShift: string | null,
    // table_num: string,
    shiftDuration: number,
    breaks: number,
    correct: string | null,
    monthHours: number
}

export type SavedFiredEmployee = {
    _id: string,
    empName: string,
    table_num: string,
    fireDate?: string
}

export type CurrentCrewShift = {
    _id: string,
    empName: string,
    table_num: string,
}
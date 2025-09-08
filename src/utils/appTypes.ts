import e from "express";

export interface AuthRequest extends e.Request{
    empId?: string,
    empName?: string,
    roles?: Roles[],
    tab_num?: string,
}

export enum Roles {
    CREW = 'crew',
    MNG = 'manager',
    HR = 'hr',
    SUP = 'supervisor'
}


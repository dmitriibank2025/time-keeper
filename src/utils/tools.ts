import {EmployeeDto} from "../model/Employee.js";
import bcrypt from 'bcryptjs'
import {Roles} from "./appTypes.js";
import jwt from "jsonwebtoken";
import {configuration} from "../config/appConfig.js";

export const convertEmployeeDtoToEmployee = async (dto: EmployeeDto) => {
    const hashedPassword = await bcrypt.hash(dto.password, 10)
    const userName = `${dto.firstName} ${dto.lastName}`
    return {
        _id: dto.id,
        empName: userName,
        passHash: hashedPassword,
        roles: [Roles.CREW],
        workTimeList: []
    }
}

export const getJWT = (userId: string, roles: Roles[]) => {
    const payload = {roles: JSON.stringify(roles)};
    const secret = configuration.jwt.secret;
    const options = {
        expiresIn: configuration.jwt.exp as any,
        subject: userId
    }
    return jwt.sign(payload, secret, options)
}
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Roles } from "./appTypes.js";
import jwt from "jsonwebtoken";
import { configuration } from "../config/appConfig.js";
function generateNumber() {
    return uuidv4();
}
export const convertEmployeeDtoToEmployee = async (dto) => {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const userName = `${dto.firstName} ${dto.lastName}`;
    return {
        _id: dto.id,
        empName: userName,
        passHash: hashedPassword,
        roles: [Roles.CREW],
        table_num: generateNumber(),
        workTimeList: []
    };
};
export const getJWT = (userId, roles) => {
    const payload = { roles: JSON.stringify(roles) };
    const secret = configuration.jwt.secret;
    const options = {
        expiresIn: configuration.jwt.exp,
        subject: userId
    };
    return jwt.sign(payload, secret, options);
};

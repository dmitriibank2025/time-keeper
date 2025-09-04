import Joi from 'joi'
import {Roles} from "../utils/appTypes.js";

export const EmployeeDtoSchema = Joi.object({
    id: Joi.number().positive().max(999999999).min(100000000),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    password: Joi.string().alphanum().min(8).required(),
    roles: Joi.string().valid('crew', 'manager', 'hr').default('crew'),
})


export const ChangePassDtoSchema = Joi.object({
    empId: Joi.number().positive().max(999999999).min(100000000).required(),
    newPassword: Joi.string().alphanum().min(8).required()
})

export const ChangeDataDtoSchema = Joi.object({
    empId: Joi.number().positive().max(999999999).min(100000000).required(),
    employee: Joi.object({
        firstName: Joi.string().min(1),
        lastName: Joi.string().min(1),
          })
        .min(1)
        .required(),
}).prefs({ convert: true });


export const ChangeRolesSchema = Joi.object({
    id: Joi.number().positive().max(999999999).min(100000000).required(),
    newRole: Joi.string().valid('crew','manager','hr').required(),
})



import Joi from 'joi';
export const EmployeeDtoSchema = Joi.object({
    id: Joi.number().positive().max(999999999).min(100000000),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    password: Joi.string().alphanum().min(8).required(),
    roles: Joi.string().valid('crew', 'manager', 'hr').default('crew'),
});
export const ChangePassDtoSchema = Joi.object({
    id: Joi.number().positive().max(999999999).min(100000000),
    newPassword: Joi.string().alphanum().min(8).required()
});
export const ChangeDataDtoSchema = Joi.object({
    id: Joi.number().positive().max(999999999).min(100000000),
    newEmpName: Joi.string().min(1),
});
export const ChangeRolesSchema = Joi.object({
    id: Joi.number().positive().max(999999999).min(100000000).required(),
    newRole: Joi.array(),
});

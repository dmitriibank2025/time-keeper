import express from "express";
import {bodyValidation} from "../validation/bodyValidation.js";
import * as controller from "../controllers/EmployeeController.js"
import {
    ChangeDataDtoSchema,
    ChangePassDtoSchema,
    ChangeRolesSchema,
    EmployeeDtoSchema
} from "../validation/appSchemas.js";


export const empRouter = express.Router()


empRouter.post('/hireEmployee', bodyValidation(EmployeeDtoSchema), controller.hireEmployee);

empRouter.get('/employee', controller.getEmployeeById);

empRouter.get('/employees', controller.getAllEmployees);

empRouter.delete('/fireEmployee', controller.fireEmployee);

empRouter.patch('/password', bodyValidation(ChangePassDtoSchema), controller.changePassword)

empRouter.patch('/updateEmployee', bodyValidation(ChangeDataDtoSchema), controller.updateEmployee)

empRouter.patch('/setRole', bodyValidation(ChangeRolesSchema), controller.setRole)

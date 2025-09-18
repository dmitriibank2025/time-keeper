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


empRouter.get('/employees', controller.getAllEmployees);
empRouter.post('/hireEmployee', bodyValidation(EmployeeDtoSchema), controller.actorData, controller.hireEmployee);

empRouter.get('/employee', controller.checkID, controller.getEmployeeById);
empRouter.patch('/updateEmployee', bodyValidation(ChangeDataDtoSchema),  controller.updateEmployee)
empRouter.delete('/fireEmployee', controller.checkID, controller.fireEmployee);

empRouter.patch('/password', bodyValidation(ChangePassDtoSchema), controller.changePassword)
empRouter.patch('/setRole', bodyValidation(ChangeRolesSchema), controller.setRole)



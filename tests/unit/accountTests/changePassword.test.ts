import {
    accountServiceImplMongo
} from "../../../src/services/AccountServiceImplMongo.ts";
import {Roles} from "../../../src/utils/appTypes.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseModel.ts";
import bcrypt from "bcryptjs";
jest.mock("../../../src/model/EmployeeMongooseModel.ts");
jest.mock("bcryptjs");

describe("changePassword", () => {
    const service = accountServiceImplMongo;
    const mockEmployee = {
        _id: "123",
        empName: "MockEmp Mock",
        passHash: "12345678",
        table_num: "tab_num",
        roles: [],
        workTimeList: [],
    };

    const mockActorId = "0000";
    const mockActorRoles: Roles[] = []

    const mockEmployeeWithSave = {
        ...mockEmployee,
        save: jest.fn().mockResolvedValue(undefined)
    };

    test("Failed test: Employee not found", async () => {
        (EmployeeModel.findById as jest.Mock).mockResolvedValue(null);

        await expect(service.changePassword("123", "newPassword", mockActorId, mockActorRoles))
            .rejects.toThrow("Employee with id 123 not found");
        expect(EmployeeModel.findById).toHaveBeenCalledWith("123");
    });

    test("Failed test: New password same as old", async () => {
        (EmployeeModel.findById as jest.Mock).mockResolvedValue(mockEmployeeWithSave);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        await expect(service.changePassword("123", "newPassword", mockActorId, mockActorRoles))
            .rejects.toThrow("The new password must not be the same as the old one");
        expect(EmployeeModel.findById).toHaveBeenCalledWith("123");
        expect(bcrypt.compare).toHaveBeenCalledWith("newPassword", mockEmployee.passHash);
    });

    test("Passed test", async () => {
        (EmployeeModel.findById as jest.Mock).mockResolvedValue(mockEmployeeWithSave);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);
        (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");

        await service.changePassword("123", "newPassword", mockActorId, mockActorRoles);

        expect(EmployeeModel.findById).toHaveBeenCalledWith("123");
        expect(bcrypt.compare).toHaveBeenCalledWith("newPassword", mockEmployee.passHash);
        expect(bcrypt.hash).toHaveBeenCalledWith("newPassword", 10);
        expect(mockEmployeeWithSave.save).toHaveBeenCalled();
        expect(mockEmployeeWithSave.passHash).toBe("newHashedPassword");
    });
});



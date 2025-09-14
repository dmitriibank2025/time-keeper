import {EmployeeDataPatch} from "../../../src/model/Employee.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseModel.ts";
import {
    accountServiceImplMongo
} from "../../../src/services/AccountServiceImplMongo.ts";
import {Roles} from "../../../src/utils/appTypes.ts";
jest.mock("../../../src/model/EmployeeMongooseModel.ts");

describe("updateEmployee", () => {
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

    const mockEmployeeDataPatch: EmployeeDataPatch = {
        firstName: "John",
        lastName: "Doe"
    };

    test("Failed test: Employee not found on update", async () => {
        (EmployeeModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });

        await expect(service.updateEmployee("123", mockEmployeeDataPatch, mockActorId, mockActorRoles))
            .rejects.toThrow("Employee with id 123 not found");
        expect(EmployeeModel.findByIdAndUpdate).toHaveBeenCalledWith(
            "123",
            { $set: { empName: "John Doe" } }
        );
    });

    test("Passed test", async () => {
        (EmployeeModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockEmployee)
        });
        (EmployeeModel.findById as jest.Mock).mockReturnValue({
            lean: jest.fn().mockResolvedValue({ ...mockEmployee, empName: "John Doe" })
        });

        const res = await service.updateEmployee("123", mockEmployeeDataPatch, mockActorId, mockActorRoles);

        expect(EmployeeModel.findByIdAndUpdate).toHaveBeenCalledWith(
            "123",
            { $set: { empName: "John Doe" } }
        );
        expect(EmployeeModel.findById).toHaveBeenCalledWith("123");
        expect(res).toEqual({ ...mockEmployee, empName: "John Doe" });
    });
});

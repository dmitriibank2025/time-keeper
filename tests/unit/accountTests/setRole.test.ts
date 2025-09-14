import {EmployeeModel} from "../../../src/model/EmployeeMongooseModel.ts";
import {
    accountServiceImplMongo
} from "../../../src/services/AccountServiceImplMongo.ts";
import {Roles} from "../../../src/utils/appTypes.ts";
jest.mock("../../../src/model/EmployeeMongooseModel.ts");

describe("setRole", () => {
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

    test("Failed test: Employee not found", async () => {
        (EmployeeModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        });

        await expect(service.setRole("123", Roles.MNG, mockActorId, mockActorRoles))
            .rejects.toThrow("Role with id 123 not found");
        expect(EmployeeModel.findByIdAndUpdate).toHaveBeenCalledWith(
            "123",
            { $addToSet: { roles: Roles.MNG } }
        );
    });

    test("Passed test", async () => {
        (EmployeeModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockEmployee)
        });
        await expect(service.setRole("123", Roles.MNG, mockActorId, mockActorRoles)).resolves.toEqual(mockEmployee);
        expect(EmployeeModel.findByIdAndUpdate).toHaveBeenCalledWith(
            "123",
            { $addToSet: { roles: Roles.MNG } }
        );

    });
});
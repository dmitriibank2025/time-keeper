import {
    accountServiceImplMongo
} from "../../../src/services/AccountServiceImplMongo.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseModel.ts";

jest.mock("../../../src/model/EmployeeMongooseModel.ts");

describe("AccountServiceMongoImpl.getEmployeeById", () => {
    const service = accountServiceImplMongo;
    test("Failed test: employee not found", async () => {
        (EmployeeModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        });
        await expect(service.getEmployeeById("UNKNOWN")).rejects.toThrow(`Employee with id UNKNOWN not found`);
    })
    test("Passed test: ", async () => {
        const mockEmployee = {
            _id: "123",
            empName: "MockEmp Mock",
            passHash: "12345678",
            table_num: "tab_num",
            roles: [],
            workTimeList: [],
        };
        (EmployeeModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockEmployee),
        });
        await expect(service.getEmployeeById("123")).resolves.toEqual(mockEmployee);
        expect(EmployeeModel.findById).toHaveBeenCalledWith("123");
    })
})
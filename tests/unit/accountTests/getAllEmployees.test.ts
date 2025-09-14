import {EmployeeModel} from "../../../src/model/EmployeeMongooseModel.ts";
import {
    accountServiceImplMongo
} from "../../../src/services/AccountServiceImplMongo.ts";
import {Employee} from "../../../src/model/Employee.ts";
jest.mock("../../../src/model/EmployeeMongooseModel.ts");

describe("getAllEmployees", () => {
    const service = accountServiceImplMongo;

    test("Passed test: Returns all employees", async () => {
        const mockEmployees: Employee[] = [];
        (EmployeeModel.find as jest.Mock).mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockEmployees)
        });

        const res = await service.getAllEmployees();
        expect(EmployeeModel.find).toHaveBeenCalled();
        expect(res).toEqual(mockEmployees);
    });
});
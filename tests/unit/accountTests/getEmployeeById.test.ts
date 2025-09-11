import {
    accountServiceImplMongo
} from "../../../src/services/AccountServiceImplMongo.ts";
import {EmployeeModel} from "../../../src/model/EmployeeMongooseModel.ts";

jest.mock("../../../src/model/EmployeeMongooseModel.ts");

describe("AccountServiceMongoImpl.getEmployeeById", () => {
    test("Failed test: employee not found", async () => {
        const service = accountServiceImplMongo;
        (EmployeeModel.findById as jest.Mock).mockResolvedValue(null)
        await expect(service.getEmployeeById("UNKNOWN")).rejects.toThrow(`Employee with id UNKNOWN not found`)

    })
})
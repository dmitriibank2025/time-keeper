import {
    accountServiceImplMongo
} from "../../../src/services/AccountServiceImplMongo.ts";
import {
    EmployeeModel,
    FiredEmployeeModel
} from "../../../src/model/EmployeeMongooseModel.ts";
import {Roles} from "../../../src/utils/appTypes.ts";
import {Employee} from "../../../src/model/Employee.ts";

jest.mock("../../../src/model/EmployeeMongooseModel.ts");

describe("AccountServiceImpMongo.hireEmployee", () => {
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
    //===============1. Employee already exists======
    test("Failed test:  Employee already exists", async () => {
        (EmployeeModel.findById as jest.Mock).mockResolvedValue(mockEmployee);

        await expect(service.hireEmployee(mockEmployee as Employee, mockActorId, mockActorRoles)).rejects.toThrow(`Employee with ${mockEmployee._id} already exists`);
        expect(EmployeeModel.findById).toHaveBeenCalledWith(mockEmployee._id)
    });

    //===============2. Employee was fired early======
    test("Failed test:  Employee was fired early", async () => {
        (EmployeeModel.findById as jest.Mock).mockResolvedValue(null);
        (FiredEmployeeModel.findById as jest.Mock).mockRejectedValue(new Error('mock Error'))
        await expect(service.hireEmployee(mockEmployee as Employee, mockActorId, mockActorRoles)).rejects.toThrow(`mock Error`);
        expect(EmployeeModel.findById).toHaveBeenCalledWith(mockEmployee._id)
        expect(FiredEmployeeModel.findById).toHaveBeenCalledWith(mockEmployee._id)
    })

    test("Passed test",  async () => {
        (EmployeeModel.findById as jest.Mock).mockResolvedValue(null);
        (FiredEmployeeModel.findById as jest.Mock).mockResolvedValue(undefined);
        (EmployeeModel as unknown as jest.Mock).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(mockEmployee)
        }));
        const res = await service.hireEmployee(mockEmployee as Employee, mockActorId, mockActorRoles);
        expect(EmployeeModel.findById).toHaveBeenCalledWith(mockEmployee._id);
        expect(FiredEmployeeModel.findById).toHaveBeenCalledWith(mockEmployee._id)
        expect(res).toEqual(mockEmployee);
    } )
})
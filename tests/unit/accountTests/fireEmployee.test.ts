import {
    accountServiceImplMongo
} from "../../../src/services/AccountServiceImplMongo.ts";
import {Roles} from "../../../src/utils/appTypes.ts";
import {
    EmployeeModel,
    FiredEmployeeModel
} from "../../../src/model/EmployeeMongooseModel.ts";
import {archiveShifts} from "../../../src/services/archiveService.ts";
jest.mock("../../../src/model/EmployeeMongooseModel.ts");
jest.mock("../../../src/services/archiveService.ts");

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
    const mockFiredEmployee = {
        _id: "123",
        empName: "MockEmp Mock",
        table_num: "tab_num",
        fireDate: 'now'
    }

    const mockActorId = "0000";
    const mockActorRoles: Roles[] = []

    test("Failed test: Employee not found", async () => {
        (EmployeeModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        await expect(service.fireEmployee("1235", mockActorId, mockActorRoles))
            .rejects.toThrow(`Employee with id 1235 not found`);
        expect(EmployeeModel.findByIdAndDelete).not.toHaveBeenCalledWith("123");
    });

    test("Failed test: Archive shifts fails", async () => {
        (EmployeeModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockEmployee);
        (archiveShifts as jest.Mock).mockRejectedValue(new Error("Archive failed"));

        await expect(service.fireEmployee(mockEmployee._id, mockActorId, mockActorRoles))
            .rejects.toThrow("Failed to fire employee");
        expect(EmployeeModel.findByIdAndDelete).toHaveBeenCalledWith(mockEmployee._id);
        expect(archiveShifts).toHaveBeenCalledWith("tab_num", mockEmployee.workTimeList);
    });

    test("Passed test", async () => {
        const mockDocument = {
            ...mockEmployee,
            toObject: jest.fn().mockReturnValue(mockEmployee)
        };

        (EmployeeModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDocument);
        (archiveShifts as jest.Mock).mockResolvedValue(undefined);
        (FiredEmployeeModel as unknown as jest.Mock).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(mockFiredEmployee)
        }));

        await expect(
            service.fireEmployee("123", mockActorId, mockActorRoles)
        ).resolves.toEqual(
            expect.objectContaining({
                _id: "123",
                empName: "MockEmp Mock",
                table_num: "tab_num",
                fireDate: 'now',
            })
        );

        expect(EmployeeModel.findByIdAndDelete).toHaveBeenCalledWith("123");
        expect(archiveShifts).toHaveBeenCalledWith("tab_num", mockEmployee.workTimeList);
        expect((FiredEmployeeModel as unknown as jest.Mock)).toHaveBeenCalledWith(mockEmployee);
        expect(mockDocument.toObject).toHaveBeenCalled();
    });

});
import {WorkTimeService} from "./workTimeService.js";
import {CurrentCrewShift} from "../model/Employee.js";
import {EmployeeModel} from "../model/EmployeeMongooseModel.js";
import {HttpError} from "../errorHandler/HttpError.js";


export class WorkTimeImpMongo implements WorkTimeService {

    async breakTime(tab_n: string, num: number): Promise<void> {

        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = Date.now();

        const emp = await EmployeeModel.findOne({table_num: tab_n});

        if (!emp) throw new HttpError(404, `Employee with id ${tab_n} not found`);

        const shift = emp.workTimeList.find(w => w.shift_id === currentDate && !w.finishShift);
        if (!shift) throw new HttpError(400, "Shift not found.");

        const start = new Date(shift.startShift).getTime();

        const durationHours = (currentTime - start) / (1000 * 60 * 60);

        if (durationHours >= 4 && durationHours < 6 && num === 15) {
            shift.breaks = 15;
            console.log("Break start 15 min")
        } else if (durationHours >= 6 && durationHours <= 8 && (shift.breaks + num <= 30)) {
            shift.breaks += num;
            console.log(`Break start ${shift.breaks} min`)
        } else throw new HttpError(400, "You can't have a break")

        await emp.save()
    }


    async correctShift(
        tab_n_crew: string,
        tab_n_mng: string,
        start?: string,
        finish?: string
    ): Promise<void> {
        const today = new Date().toISOString().split("T")[0];

        const emp = await EmployeeModel.findOne({table_num: tab_n_crew});
        if (!emp) throw new HttpError(404, `Employee with table number ${tab_n_crew} not found`);

        const shift = emp.workTimeList.find(w => w.shift_id === today);
        if (!shift) throw new HttpError(400, "Shift not found");

        if (!start && !finish) throw new HttpError(400, "Nothing to update");

        const nextStart = start ? new Date(start).getTime() : 0;
        const nextFinish = finish ? new Date(finish).getTime() : 0;

        const curStart = new Date(shift.startShift).getTime();
        const curFinish = new Date(shift.finishShift).getTime() ?? undefined;


        if (start && !finish && (nextStart >= curFinish)) {
            throw new HttpError(400, "Start must be earlier than existing finish");
        }
        if (!start && finish && (nextFinish <= curStart)) {
            throw new HttpError(400, "Finish must be later than existing start");
        }
        if (start && finish && (nextFinish <= nextStart)) {
            throw new HttpError(400, "Finish must be later than start");
        }

        if (start) shift.startShift = start;
        if (finish) shift.finishShift = finish;


        shift.shiftDuration = Math.round((new Date(shift.finishShift).getTime() - new Date(shift.startShift).getTime()) / (1000 * 60*60));


        shift.correct = tab_n_mng;

        try {
            await emp.save();
        } catch (e) {
            console.error("Save error", e);
            throw new HttpError(500, "Failed to save shift correction");
        }
    }


    async finishShift(tab_n: string): Promise<{
        tab_num: string;
        time: string
    }> {

        const currentDate = new Date().toISOString().split('T')[0];
        const emp = await EmployeeModel.findOne({table_num: tab_n});
        if (!emp) throw new HttpError(404, `Employee with id ${tab_n} not found`);

        const shift = emp.workTimeList.find(w => w.shift_id === currentDate && !w.finishShift);
        if (!shift) throw new HttpError(400, "Shift not found.");

        const start = new Date(shift.startShift).getTime();
        const finish = Date.now();
        const currentTime = new Date().toISOString()
        shift.finishShift = currentTime;

        const durationHours = (finish - start) / (1000 * 60*60);
        shift.shiftDuration = durationHours
        let autoBreak = 0;

        if (durationHours >= 4 && durationHours < 6) autoBreak = 15;
        else if (durationHours >= 6 && durationHours <= 8) autoBreak = 30;

        shift.breaks = autoBreak;
        await emp.save();

        return {
            tab_num: emp.table_num,
            time: currentTime
        };
    }


    async getCurrentShiftStaff(): Promise<{ shift: CurrentCrewShift[] }> {

        const currentDate = new Date().toISOString().split('T')[0];

        const res = await EmployeeModel.aggregate([
            {
                $match: {
                    'workTimeList.shift_id': currentDate,
                    'workTimeList.finishShift': null
                }
            },
            {
                $sort: {_id: -1}
            }
        ]);
        if (!res.length) throw new HttpError(404, `Nobody work now`);
        return {shift: res as CurrentCrewShift[]};
    }

    async startShift(tab_n: string): Promise<{
        tab_num: string;
        time: string
    }> {

        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = Date.now();

        const emp = await EmployeeModel.findOne({table_num: tab_n});
        if (!emp) throw new HttpError(404, `Employee with id ${tab_n} not found`);

        const openShift = emp.workTimeList.find(
            (w) => w.shift_id === currentDate && w.finishShift === null
        );
        if (openShift) {
            throw new HttpError(400, "Shift already started and not finished yet");
        }

        if (emp.workTimeList.length > 0) {
            const lastShift = emp.workTimeList[emp.workTimeList.length - 1];
            const finish = new Date(lastShift.finishShift).getTime();
            if (finish) {
                const diffHours = (currentTime - finish) / (1000 * 60*60);
                if (diffHours < 8) {
                    throw new HttpError(403, "Shift work prohibited: 8 hours of rest have not passed");
                }
            }
        }

        const start = new Date(currentTime).toISOString()

        const newShift = {
            shift_id: currentDate,
            startShift: start,
            finishShift: null,
            // table_num: tab_n,
            shiftDuration: 0,
            breaks: 0,
            correct: null,
            monthHours: 0
        }

        const res = await EmployeeModel.findOneAndUpdate(
            {table_num: tab_n},
            {
                $push: {workTimeList: newShift},
            })
        if (!res) throw new HttpError(404, `Employee with table_num ${tab_n} not found`);
        return {
            tab_num: emp.table_num,
            time: start
        };
    }

}

export const workTimeImpMongo = new WorkTimeImpMongo()
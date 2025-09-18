import {WorkTimeService} from "./workTimeService.js";
import {CurrentCrewShift} from "../model/Employee.js";
import {EmployeeModel, ShiftModel} from "../model/EmployeeMongooseModel.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {logger} from "../Logger/winston.js";
import {archiveShifts} from "./archiveService.js";
import { startSession } from "mongoose";

export class WorkTimeImpMongo implements WorkTimeService {

    async breakTime(tab_n: string, num: number): Promise<void> {

        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = Date.now();

        const emp = await EmployeeModel.findOne({table_num: tab_n});

        if (!emp) {
            logger.error(`${new Date().toISOString()} => Employee with tab_n ${tab_n} not found`);
            throw new HttpError(404, `Employee with tab_n ${tab_n} not found`);
        }

        const shift = emp.workTimeList.find(w => w.shift_id === currentDate && !w.finishShift);
        if (!shift) {
            logger.error(`${new Date().toISOString()} => Shift not found`);
            throw new HttpError(404, "Shift not found.");
        }

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
        if (!emp) {
            logger.error(`${new Date().toISOString()} => Employee with table number ${tab_n_crew} not found`);
            throw new HttpError(404, `Employee with table number ${tab_n_crew} not found`);
        }

        const shift = emp.workTimeList.find(w => w.shift_id === today);
        if (!shift) {
            logger.error(`${new Date().toISOString()} => Shift not found`);
            throw new HttpError(404, "Shift not found");
        }

        if (!start && !finish) {
            logger.error(`${new Date().toISOString()} => Nothing to update`);
            throw new HttpError(400, "Nothing to update");
        }

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
        if (finish && (nextFinish >= curFinish)) {
            throw new HttpError(400, "Finish must be earlier than existing finish");
        }

        if (start) shift.startShift = start;
        if (finish) shift.finishShift = finish;


        shift.shiftDuration = Math.round((new Date(shift.finishShift).getTime() - new Date(shift.startShift).getTime()) / (1000 * 60 * 60));


        shift.correct = tab_n_mng;

        try {
            await emp.save();
        } catch (e) {
            console.error("Save error", e);
            logger.error(`${new Date().toISOString()} => Failed to save shift correction`);
            throw new HttpError(500, "Failed to save shift correction");
        }
    }


    async finishShift(tab_n: string): Promise<{
        tab_num: string;
        time: string
    }> {

        const currentDate = new Date().toISOString().split('T')[0];
        const emp = await EmployeeModel.findOne({table_num: tab_n});
        if (!emp) {
            logger.error(`${new Date().toISOString()} => Employee with table number ${tab_n} not found`);
            throw new HttpError(404, `Employee with table number ${tab_n} not found`);
        }


        const shift = emp.workTimeList.find(w => w.shift_id === currentDate && !w.finishShift);
        if (!shift) {
            logger.error(`${new Date().toISOString()} => Shift not found`);
            throw new HttpError(404, "Shift not found.");
        }

        const start = new Date(shift.startShift).getTime();
        const finish = Date.now();
        const currentTime = new Date().toISOString()
        shift.finishShift = currentTime;

        const durationHours = (finish - start) / (1000 * 60 * 60);
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
        if (!res.length) {
            logger.error(`${new Date().toISOString()} => Nobody work now`);
            throw new HttpError(404, `Nobody work now`);
        }
        return {shift: res as CurrentCrewShift[]};
    }

    async startShift(tab_n: string): Promise<{
        tab_num: string;
        time: string
    }> {
        logger.info('start to processed')
        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = Date.now();
        const start = new Date(currentTime).toISOString()

        const now = new Date();
        const twoLastMonths = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const cutoff = twoLastMonths.toISOString().split("T")[0];

        const emp = await EmployeeModel.findOne({table_num: tab_n});
        if (!emp) {
            logger.error(`${new Date().toISOString()} => Employee with table number ${tab_n} not found`);
            throw new HttpError(404, `Employee with table number ${tab_n} not found`);
        }

        const toArchive = (emp.workTimeList ?? []).filter((w: any) => new Date(w.shift_id) < twoLastMonths);
        if (toArchive.length) {
            try {
                await archiveShifts(tab_n, toArchive);
                logger.info(`${new Date().toISOString()} => Archived ${toArchive.length} shifts for employee ${tab_n}`);
            } catch (error) {
                logger.error(`${new Date().toISOString()} => Failed to archive shifts for employee ${tab_n}: ${error}`);
                throw new HttpError(500, "Failed to archive old shifts");
            }
        }

        const openShift = emp.workTimeList.find(
            (w) => w.shift_id === currentDate && w.finishShift === null
        );
        if (openShift) {
            logger.error(`${start} => Shift already started and not finished yet`)
            throw new HttpError(409, "Shift already started and not finished yet");
        }

        if (emp.workTimeList.length > 0) {
            const lastShift = emp.workTimeList[emp.workTimeList.length - 1];
            if (lastShift) {
                const finish = new Date(lastShift.finishShift).getTime();
                const diffHours = (currentTime - finish) / (1000 * 60 * 60);
                if (diffHours < 8) {
                    throw new HttpError(403, "Shift work prohibited: 8 hours of rest have not passed");
                }
            }
        }

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

        // const res = await EmployeeModel.findOneAndUpdate(
        //     {table_num: tab_n},
        //     {
        //         $push: {workTimeList: newShift},
        //         $pull: {workTimeList: {shift_id: {$lt: twoLastMonthes.toISOString().split('T')[0]}}}
        //     },
        //     {new: true}
        // )
        // if (!res) {
        //     logger.error(`${new Date().toISOString()} => Employee with table number ${tab_n} not found`);
        //     throw new HttpError(404, `Employee with table number ${tab_n} not found`);
        // }

        const session = await startSession();
        try {
            await session.withTransaction(async () => {
                if (toArchive.length) {
                    await EmployeeModel.updateOne(
                        { table_num: tab_n },
                        { $pull: { workTimeList: { shift_id: { $lt: cutoff } } } },
                        { session }
                    );
                }

                const res = await EmployeeModel.findOneAndUpdate(
                    {
                        table_num: tab_n,
                        workTimeList: { $not: { $elemMatch: { shift_id: currentDate, finishShift: null } } }
                    },
                    { $push: { workTimeList: newShift } },
                    { new: true, session }
                );

                if (!res) {
                    throw new HttpError(409, "Shift already started and not finished yet");
                }

                logger.info(`Shift for tab num ${tab_n} started`);
            });
        } finally {
            await session.endSession();
        }

        return {
            tab_num: emp.table_num,
            time: start
        };
    }

}

export const workTimeImpMongo = new WorkTimeImpMongo()
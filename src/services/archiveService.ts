
import {logger} from "../Logger/winston.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {ShiftModel} from "../model/EmployeeMongooseModel.js";

export const archiveShifts = async (
    table_n: string,
    shifts: any[]
)=> {
    if (!shifts?.length) return;
    const docs = shifts.map(s => ({
        table_num: table_n,
        shift_id: s.shift_id,
        startShift: s.startShift,
        finishShift: s.finishShift,
        shiftDuration: s.shiftDuration,
        breaks: s.breaks,
        correct: s.correct,
        monthHours: s.monthHours,
    }));
    try {
        await ShiftModel.insertMany(docs, { ordered: false });
    } catch (e) {
        logger.error(`${new Date().toISOString()} => Archive insert error: ${e}`);
        throw new HttpError(400, "Archive not found");
    }
}

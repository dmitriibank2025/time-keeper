import {AuthRequest} from "../utils/appTypes.js";
import {workTimeImpMongo as service} from "../services/WorkTimeImpMongo.js";
import {HttpError} from "../errorHandler/HttpError.js";
import { Request, Response } from 'express';
import {logger} from "../Logger/winston.js";

export const startShift = async (req: AuthRequest, res: Response) => {
    logger.debug(new Date().toISOString() +  " => Starting shift request...");
    const {tab_n} = req.body;
    logger.debug(`Tab number: ${tab_n}`);
    const result = await service.startShift(tab_n);
    res.json(result)
}
export const finishShift = async (req: AuthRequest, res: Response) => {
    const {tab_n} = req.body;
    const result = await service.finishShift(tab_n);
    res.json(result)
}

export const breakTime = async (req: AuthRequest, res: Response) => {
    const {tab_n, minutes} = req.body;
    const result = await service.breakTime(tab_n, minutes);
    res.json(result)
}
export const correctShift = async (req: AuthRequest, res: Response) => {
    const {tab_n_crew, start, finish} = req.body;
    if (!tab_n_crew) {
        logger.error(`${new Date().toISOString()} => Data invalid`);
        throw new HttpError(400, "Data invalid");
    }
    const tab_n_mng = req.empId;
    if (!tab_n_mng) {
        logger.error(`${new Date().toISOString()} => Manager's data invalid`);
        throw new HttpError(400, "Manager's data invalid");
    }
    await service.correctShift(tab_n_crew, tab_n_mng, start, finish);
    res.status(200).json({ message: "Shift corrected" })
}

export const getCurrentShiftStaff = async (req: Request, res: Response) => {
    const result = await service.getCurrentShiftStaff();
    res.json(result)
}



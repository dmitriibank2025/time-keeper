import express from "express";
import * as controller from "../controllers/WorkTimeController.js"

export const workTimeRouter = express.Router()

workTimeRouter.post("/start",  controller.startShift)
workTimeRouter.patch("/finish",  controller.finishShift)
workTimeRouter.patch("/break",  controller.breakTime)
workTimeRouter.patch("/correct",  controller.correctShift)
workTimeRouter.get("/",  controller.getCurrentShiftStaff)

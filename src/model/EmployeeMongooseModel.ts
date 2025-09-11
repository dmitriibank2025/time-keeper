import mongoose from "mongoose";
import {Roles} from "../utils/appTypes.js";

const WorkTimeSchema = new mongoose.Schema(
    {
        shift_id:          { type: String, required: true },
        startShift:  { type: String,   required: true },
        finishShift: { type: String,   default: null },
        // table_num:  { type: String, required: true },
        shiftDuration: { type: Number, required: true },
        breaks: { type: Number, default: 0 },
        correct: { type: String,   default: null },
        monthHours: { type: Number, default: 0 },
    },
    { _id: false }
);
export const  employeeMongooseSchema = new mongoose.Schema({
    _id:       { type: String, required: true },
    empName:  { type: String, required: true, trim: true },
    passHash:  { type: String, required: true },
    roles: { type: [String], enum: Object.values(Roles), required: true},
    table_num: { type: String, required: true },
    workTimeList: { type: [WorkTimeSchema], default: [] },
}, { timestamps: true });

export const EmployeeModel = mongoose.model('Crew', employeeMongooseSchema, 'crew_collection')

export const  firedMongooseSchema = new mongoose.Schema({
    _id:       { type: String, required: true },
    empName:  { type: String, required: true, trim: true },
    table_num: { type: String, required: true },
}, { timestamps: true });

export const FiredEmployeeModel = mongoose.model('Fired', firedMongooseSchema, 'fired_collection')

export const shiftSchema = new mongoose.Schema({
    table_num: { type: String, required: true },
    shift_id: { type: String, required: true },
    startShift: { type: String, required: true },
    finishShift: { type: String, required: false },
    shiftDuration: { type: Number, required: true },
    breaks: { type: Number, required: true },
    correct: { type: String},
    monthHours: { type: Number, required: true },
})

export const ShiftModel = mongoose.model('Shift', shiftSchema, 'shift_collection')

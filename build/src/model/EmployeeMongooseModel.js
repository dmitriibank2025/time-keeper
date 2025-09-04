import mongoose from "mongoose";
import { Roles } from "../utils/appTypes.js";
const WorkTimeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    login_date: { type: String, required: true },
    logout_date: { type: String, default: null },
}, { _id: false });
export const employeeMongooseSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    empName: { type: String, required: true, trim: true },
    passHash: { type: String, required: true },
    roles: { type: [String], enum: Object.values(Roles), required: true },
    workTimeList: { type: [WorkTimeSchema], default: [] },
}, { timestamps: true });
export const EmployeeModel = mongoose.model('Crew', employeeMongooseSchema, 'crew_collection');
export const firedMongooseSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    empName: { type: String, required: true, trim: true },
}, { timestamps: true });
export const FiredEmployeeModel = mongoose.model('Fired', employeeMongooseSchema, 'fired_collection');

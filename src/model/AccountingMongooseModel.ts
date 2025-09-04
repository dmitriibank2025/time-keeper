
import mongoose from 'mongoose';
import {configuration} from "../config/appConfig.js";


export const auditConnection = mongoose.createConnection(configuration.mongoAccountingUrl);

const auditSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    actorId: { type: String, required: true },
    actorRoles: { type: [String], default: [] },
    action: { type: String, required: true },
    targetId: { type: String },
    diff: { type: Object },
}, { timestamps: true });

export const AuditModel = auditConnection.model('AccountingLog', auditSchema, 'accounting_log');

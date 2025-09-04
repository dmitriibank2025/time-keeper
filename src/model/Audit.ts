import {AuditModel} from "./AccountingMongooseModel.js";


export async function auditLog(data: {
    actorId: string;
    actorRoles: string[];
    action: string;
    targetId: string;
    status: 'SUCCESS' | 'DENIED' | 'ERROR';
    diff?: any;
    textError?: string;
}) {
    try {
        await AuditModel.create(data);
    } catch (err) {
        console.error('[AUDIT ERROR]', err);
    }
}
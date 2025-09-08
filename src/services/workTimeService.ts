import {CurrentCrewShift} from "../model/Employee.js";


export interface WorkTimeService {
    startShift: (tab_n: string) => Promise<{ tab_num: string; time: string }>;
    finishShift: (tab_n: string) => Promise<{ tab_num: string; time: string }>;
    breakTime: (tab_n: string, num: number) => Promise<void>;
    correctShift: (tab_n_crew: string, tab_n_mng: string, start: string, finish: string) => Promise<void>;
    getCurrentShiftStaff: () => Promise<{ shift: CurrentCrewShift[] }>;
}
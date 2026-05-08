import { Report } from "./reports";
import { Subject } from "./subjects";

export interface DetailReport {
    id: string;
    report: Report[];
    subject: Subject[];
}
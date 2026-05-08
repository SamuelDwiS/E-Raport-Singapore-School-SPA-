export interface Criteria {
    id: number;
    teacher_id: number;
    name: string;
    criteria_categories: {
        id: number;
        name: string;
    };
}

export interface DetailReport {
    id: string;
    report: Report[];
    subject: Subject[];
}

export interface DetailSubject {
    id: number;
    subject_id: number;
    criteria: Criteria[];
    description: string;
    score: number;
}

export interface Subject {
    id: number;
    detail_report_id: number;
    detail_subjects: DetailSubject[];
}

export interface Report {
    id: number;
    student: {
        "name": string;
        "gender": string;
    };
    term_id: number;
    mentor: {
        "name": string;
        "phone_number": string;
    };
    name: string;
    average_value: number;
    description: string;
    attendance: number;
}
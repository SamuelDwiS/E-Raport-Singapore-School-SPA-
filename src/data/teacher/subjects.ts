import { Criteria } from "./criterias";
import { Report } from "./reports";
import { DetailSubject } from "./detail-subjects";

export interface Subject {
    id: number;
    detail_report_id: number;
    detail_subjects: DetailSubject[];
}

export const subjects: Subject[] = [
    {
        id: 1,
        detail_report_id: 1,
        detail_subjects: [
            {
                id: 1,
                subject_id: 1,
                criteria: [
                    {
                        "id": 1,
                        "teacher_id": 1,
                        "criteria_categories": {
                            "id": 4,
                            "name": "Affective Domain"
                        },
                        "name": "Passion"
                    },
                    {
                        "id": 2,
                        "teacher_id": 1,
                        "criteria_categories": {
                            "id": 4,
                            "name": "Affective Domain"
                        },
                        "name": "Attitude"
                    }],
                description: "Description 1",
                score: 85.5,
            },
            {
                id: 2,
                subject_id: 1,
                criteria: [
                    {
                        "id": 1,
                        "teacher_id": 1,
                        "criteria_categories": {
                            "id": 4,
                            "name": "Affective Domain"
                        },
                        "name": "Passion"
                    },
                    {
                        "id": 2,
                        "teacher_id": 1,
                        "criteria_categories": {
                            "id": 4,
                            "name": "Affective Domain"
                        },
                        "name": "Attitude"
                    }],
                description: "Description 1",
                score: 85.5,
            },
        ]
    }
]
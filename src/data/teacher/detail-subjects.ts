import { Criteria } from "./criterias";

export interface DetailSubject {
    id: number;
    subject_id: number;
    criteria: Criteria[];
    description: string;
    score: number;
}

export const detail_subjects: DetailSubject[] = [
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
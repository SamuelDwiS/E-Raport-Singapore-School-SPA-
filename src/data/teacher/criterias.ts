export interface Criteria {
    id: number;
    teacher_id: number;
    name: string;
    criteria_categories: {
        id: number;
        name: string;
    };
}

export const criterias: Criteria[] = [
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
    },
    {
        "id": 3,
        "teacher_id": 1,
        "criteria_categories": {
            "id": 4,
            "name": "Affective Domain"
        },
        "name": "Cooperation"
    },
    {
        "id": 4,
        "teacher_id": 1,
        "criteria_categories": {
            "id": 4,
            "name": "Affective Domain"
        },
        "name": "Self Discipline"
    },
    {
        "id": 5,
        "teacher_id": 1,
        "criteria_categories": {
            "id": 4,
            "name": "Affective Domain"
        },
        "name": "Respect"
    },
    {
        "id": 6,
        "teacher_id": 1,
        "criteria_categories": {
            "id": 4,
            "name": "Affective Domain"
        },
        "name": "Responsibility"
    },
]
// as {
//     create: (data: any) => Promise<AxiosResponse<any, any>>,
// }
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

export const reports: Report[] = [
    {
        id: 1,
        student: {
            name: "Budi Santoso",
            gender: "Laki-laki"
        },
        term_id: 1,
        mentor: {
            name: "Mr. Ari",
            phone_number: "08123456789"
        },
        name: "Budi Santoso",
        average_value: 85.5,
        description: "Budi is a good student and always follows the teacher's instructions",
        attendance: 43
    },
    {
        id: 2,
        student: {
            name: "Citra Dewi",
            gender: "Perempuan"
        },
        term_id: 1,
        mentor: {
            name: "Mrs. Ari",
            phone_number: "08123456789"
        },
        name: "Citra Dewi",
        average_value: 85.5,
        description: "Citra is a good student and always follows the teacher's instructions",
        attendance: 43
    },
]
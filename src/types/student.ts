import { Mentor } from '@/types/mentor';
import { AcademicYear } from '@/types/academic_year';

export interface Student {
    id: number;
    academic_year: Pick<AcademicYear, "id" | "year_academic">;
    level_class: number;
    religion_name: string;
    mentor: Mentor[];
    name: string;
    gender: string;
    address: string;
    phone_number: string;
}
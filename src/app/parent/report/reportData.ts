// ─── Types ────────────────────────────────────────────────────────────────────
export type Level = "Exceeding" | "Meeting" | "Improving" | "—";

export type SubjectReport = {
  name: string;
  teacher: string;
  criteria: { description: string; score: string }[];
  average: string;
  level: Level;
  domain?: string;
};

export type TermReport = {
  term: string;
  academicYear: string;
  status: "Aktif" | "Selesai";
  class: string;
  studentName: string;
  domain: string;
  subjects: SubjectReport[];
  teacherNote: string;
  mentor: string;
};

// ─── Slug helpers ──────────────────────────────────────────────────────────────
export function termToSlug(report: TermReport): string {
  return `${report.academicYear.replace("/", "-")}-${report.term
    .replace(" ", "-")
    .toLowerCase()}`;
}

export function subjectToSlug(name: string): string {
  return encodeURIComponent(
    name.toLowerCase().replace(/\s+/g, "-").replace(/[&]/g, "and")
  );
}

export function slugToSubject(slug: string): string {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getLevelStyle(level: Level) {
  switch (level) {
    case "Exceeding":
      return {
        badge:
          "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400",
        text: "text-success-600 dark:text-success-400",
        bar: "bg-success-500",
        glow: "shadow-success-200 dark:shadow-success-900/40",
      };
    case "Meeting":
      return {
        badge:
          "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400",
        text: "text-brand-600 dark:text-brand-400",
        bar: "bg-brand-500",
        glow: "shadow-brand-200 dark:shadow-brand-900/40",
      };
    case "Improving":
      return {
        badge:
          "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
        text: "text-warning-600 dark:text-warning-400",
        bar: "bg-warning-500",
        glow: "shadow-warning-200 dark:shadow-warning-900/40",
      };
    default:
      return {
        badge:
          "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
        text: "text-gray-400 dark:text-gray-500",
        bar: "bg-gray-400",
        glow: "",
      };
  }
}

export function getOverallLevel(subjects: SubjectReport[]): Level {
  const scored = subjects.filter((s) => s.average !== "—");
  if (scored.length === 0) return "—";
  const avg =
    scored.reduce((sum, s) => sum + parseFloat(s.average), 0) / scored.length;
  if (avg >= 2.5) return "Exceeding";
  if (avg >= 2.0) return "Meeting";
  return "Improving";
}

export function getOverallAvg(subjects: SubjectReport[]): string {
  const scored = subjects.filter((s) => s.average !== "—");
  if (scored.length === 0) return "—";
  const avg =
    scored.reduce((sum, s) => sum + parseFloat(s.average), 0) / scored.length;
  return avg.toFixed(2);
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
export const REPORTS: TermReport[] = [
  {
    term: "Term 4",
    academicYear: "2024/2025",
    status: "Selesai",
    class: "Year 1",
    studentName: "Emmy Kurniawan Lukminto",
    domain: "AESTHETICS DOMAIN",
    mentor: "Pak Hartono",
    teacherNote: "Ananda menunjukkan progres yang sangat baik di akhir tahun ajaran.",
    subjects: [
      {
        name: "AESTHETICS DOMAIN",
        teacher: "Mr Dhudy Cahyanto",
        domain: "AESTHETICS DOMAIN",
        criteria: [
          { description: "Displays good spatial awareness while performing activities", score: "3.00" },
          { description: "Shows developmentally appropriate motor/physical fitness", score: "3.00" },
          { description: "Demonstrates a good level of skill in most PE activities", score: "3.00" },
        ],
        average: "3.00",
        level: "Exceeding",
      },
      {
        name: "PHYSICAL EDUCATION",
        teacher: "Mr Dhudy Cahyanto",
        domain: "AESTHETICS DOMAIN",
        criteria: [
          { description: "Displays good spatial awareness while performing activities", score: "3.00" },
          { description: "Shows developmentally appropriate motor/physical fitness", score: "3.00" },
          { description: "Demonstrates a good level of skill in most PE activities", score: "3.00" },
        ],
        average: "3.00",
        level: "Exceeding",
      },
      {
        name: "PERFORMING ARTS (Music)",
        teacher: "Mr Ari Irawan",
        domain: "AESTHETICS DOMAIN",
        criteria: [
          { description: "Displays good knowledge & appreciation of performing art", score: "3.00" },
          { description: "Demonstrates developmentally appropriate skills", score: "3.00" },
          { description: "Shows creativity in performance", score: "3.00" },
        ],
        average: "3.00",
        level: "Exceeding",
      },
      {
        name: "ART & CRAFT",
        teacher: "Ms Katrin",
        domain: "AESTHETICS DOMAIN",
        criteria: [
          { description: "Demonstrates appropriate application of skills", score: "3.00" },
          { description: "Shows creativity and good quality of work done", score: "3.00" },
          { description: "Shows keen interest in art projects", score: "3.00" },
        ],
        average: "3.00",
        level: "Exceeding",
      },
      {
        name: "INFORMATION & COMMUNICATION TECHNOLOGY",
        teacher: "Mr Rado Aditya",
        domain: "AESTHETICS DOMAIN",
        criteria: [
          { description: "Possesses good grasp of ICT knowledge", score: "3.00" },
          { description: "Demonstrates good application of ICT skills", score: "3.00" },
        ],
        average: "3.00",
        level: "Exceeding",
      },
      {
        name: "SCIENCE",
        teacher: "Ms Sarah",
        domain: "SCIENCE DOMAIN",
        criteria: [
          { description: "Understanding basic science concepts", score: "3.00" },
          { description: "Conducting simple experiments", score: "3.00" },
        ],
        average: "3.00",
        level: "Exceeding",
      },
      {
        name: "BAHASA INDONESIA",
        teacher: "Bu Sari",
        domain: "LANGUAGE DOMAIN",
        criteria: [
          { description: "Membaca dengan pemahaman baik", score: "3.00" },
          { description: "Menulis narasi sederhana", score: "3.00" },
        ],
        average: "3.00",
        level: "Exceeding",
      },
      {
        name: "ENGLISH",
        teacher: "Ms Jennifer",
        domain: "LANGUAGE DOMAIN",
        criteria: [
          { description: "Reading and listening skills", score: "3.00" },
          { description: "Speaking and writing skills", score: "3.00" },
        ],
        average: "3.00",
        level: "Exceeding",
      },
      {
        name: "MATHEMATICS",
        teacher: "Mr Kevin",
        domain: "MATHEMATICS DOMAIN",
        criteria: [
          { description: "Number sense and operations", score: "3.00" },
          { description: "Geometry and measurement", score: "3.00" },
        ],
        average: "3.00",
        level: "Exceeding",
      },
    ],
  },
  {
    term: "Term 1",
    academicYear: "2025/2026",
    status: "Aktif",
    class: "Year 2",
    studentName: "Emmy Kurniawan Lukminto",
    domain: "AESTHETICS DOMAIN",
    mentor: "Pak Hartono",
    teacherNote: "Semangat belajar yang tinggi di awal kelas baru.",
    subjects: [
      {
        name: "SCIENCE",
        teacher: "Ms Sarah",
        criteria: [
          { description: "Understanding basic science concepts", score: "2.80" },
          { description: "Conducting simple experiments", score: "2.70" },
        ],
        average: "2.75",
        level: "Exceeding",
      },
      {
        name: "BAHASA INDONESIA",
        teacher: "Bu Sari",
        criteria: [
          { description: "Membaca dengan pemahaman baik", score: "2.90" },
          { description: "Menulis narasi sederhana", score: "2.85" },
        ],
        average: "2.88",
        level: "Exceeding",
      },
    ],
  },
  {
    term: "Term 2",
    academicYear: "2025/2026",
    status: "Aktif",
    class: "Year 2",
    studentName: "Emmy Kurniawan Lukminto",
    domain: "AESTHETICS DOMAIN",
    mentor: "Pak Hartono",
    teacherNote: "Semangat belajar yang tinggi di awal kelas baru.",
    subjects: [
      {
        name: "SCIENCE",
        teacher: "Ms Sarah",
        criteria: [
          { description: "Understanding basic science concepts", score: "2.80" },
          { description: "Conducting simple experiments", score: "2.70" },
        ],
        average: "2.75",
        level: "Exceeding",
      },
      {
        name: "BAHASA INDONESIA",
        teacher: "Bu Sari",
        criteria: [
          { description: "Membaca dengan pemahaman baik", score: "2.90" },
          { description: "Menulis narasi sederhana", score: "2.85" },
        ],
        average: "2.88",
        level: "Exceeding",
      },
    ],
  },
];

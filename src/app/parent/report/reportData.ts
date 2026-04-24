// ─── Types ────────────────────────────────────────────────────────────────────
export type Level = "Exceeding" | "Meeting" | "Improving" | "—";

export type SubjectReport = {
  name: string;
  teacher: string;
  criteria: { description: string; score: string }[];
  average: string;
  level: Level;
};

export type TermReport = {
  term: string;
  academicYear: string;
  status: "Aktif" | "Selesai";
  class: string;
  studentName: string;
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
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        text: "text-emerald-600 dark:text-emerald-400",
        bar: "bg-emerald-500",
        glow: "shadow-emerald-200 dark:shadow-emerald-900/40",
      };
    case "Meeting":
      return {
        badge:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        text: "text-blue-600 dark:text-blue-400",
        bar: "bg-blue-500",
        glow: "shadow-blue-200 dark:shadow-blue-900/40",
      };
    case "Improving":
      return {
        badge:
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        text: "text-amber-600 dark:text-amber-400",
        bar: "bg-amber-500",
        glow: "shadow-amber-200 dark:shadow-amber-900/40",
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
    term: "Term 1",
    academicYear: "2025/2026",
    status: "Aktif",
    class: "Year 5",
    studentName: "Adrian Li Preman",
    mentor: "Pak Hartono",
    teacherNote:
      "Ananda menunjukkan semangat belajar yang baik di Term 1. Aktif dalam diskusi kelas dan mengerjakan tugas dengan tepat waktu.",
    subjects: [
      {
        name: "Physical Education",
        teacher: "Mr Dhudy Cahyanto",
        criteria: [
          { description: "Displays good spatial awareness while performing activities", score: "2.80" },
          { description: "Shows developmentally appropriate motor/physical fitness", score: "2.60" },
          { description: "Demonstrates a good level of skill in most PE activities", score: "2.70" },
        ],
        average: "2.70",
        level: "Exceeding",
      },
      {
        name: "Performing Arts (Music)",
        teacher: "Mr Ari Irawan",
        criteria: [
          { description: "Displays good knowledge & appreciation of performing art", score: "2.40" },
          { description: "Demonstrates developmentally appropriate skills", score: "2.20" },
          { description: "Shows creativity in performance", score: "2.30" },
        ],
        average: "2.30",
        level: "Meeting",
      },
      {
        name: "Art & Craft",
        teacher: "Ms Paulina",
        criteria: [
          { description: "Demonstrates appropriate application of skills", score: "2.60" },
          { description: "Shows creativity and good quality of work done", score: "2.80" },
          { description: "Shows keen interest in art projects", score: "2.70" },
        ],
        average: "2.70",
        level: "Exceeding",
      },
      {
        name: "Information & Communication Technology",
        teacher: "Mr Rado Aditya",
        criteria: [
          { description: "Possesses good grasp of ICT knowledge", score: "2.50" },
          { description: "Demonstrates good application of ICT skills", score: "2.40" },
        ],
        average: "2.45",
        level: "Meeting",
      },
      {
        name: "English Language",
        teacher: "Ms Sarah Tan",
        criteria: [
          { description: "Reads with good comprehension and fluency", score: "2.70" },
          { description: "Writes clearly and with good structure", score: "2.50" },
          { description: "Communicates orally with confidence", score: "2.60" },
        ],
        average: "2.60",
        level: "Exceeding",
      },
      {
        name: "Mathematics",
        teacher: "Mr Kevin Lim",
        criteria: [
          { description: "Demonstrates strong number sense", score: "2.30" },
          { description: "Applies problem solving strategies effectively", score: "2.20" },
          { description: "Interprets and analyses data accurately", score: "2.40" },
        ],
        average: "2.30",
        level: "Meeting",
      },
    ],
  },
  {
    term: "Term 2",
    academicYear: "2025/2026",
    status: "Selesai",
    class: "Year 5",
    studentName: "Adrian Li Preman",
    mentor: "Pak Hartono",
    teacherNote:
      "Perkembangan yang sangat baik di Term 2. Ananda mulai menunjukkan kepercayaan diri lebih dalam presentasi.",
    subjects: [
      {
        name: "Physical Education",
        teacher: "Mr Dhudy Cahyanto",
        criteria: [
          { description: "Displays good spatial awareness while performing activities", score: "2.60" },
          { description: "Shows developmentally appropriate motor/physical fitness", score: "2.50" },
          { description: "Demonstrates a good level of skill in most PE activities", score: "2.40" },
        ],
        average: "2.50",
        level: "Exceeding",
      },
      {
        name: "Performing Arts (Music)",
        teacher: "Mr Ari Irawan",
        criteria: [
          { description: "Displays good knowledge & appreciation of performing art", score: "2.20" },
          { description: "Demonstrates developmentally appropriate skills", score: "2.00" },
          { description: "Shows creativity in performance", score: "2.10" },
        ],
        average: "2.10",
        level: "Meeting",
      },
      {
        name: "Art & Craft",
        teacher: "Ms Paulina",
        criteria: [
          { description: "Demonstrates appropriate application of skills", score: "2.40" },
          { description: "Shows creativity and good quality of work done", score: "2.50" },
          { description: "Shows keen interest in art projects", score: "2.30" },
        ],
        average: "2.40",
        level: "Meeting",
      },
      {
        name: "Information & Communication Technology",
        teacher: "Mr Rado Aditya",
        criteria: [
          { description: "Possesses good grasp of ICT knowledge", score: "2.30" },
          { description: "Demonstrates good application of ICT skills", score: "2.20" },
        ],
        average: "2.25",
        level: "Meeting",
      },
      {
        name: "English Language",
        teacher: "Ms Sarah Tan",
        criteria: [
          { description: "Reads with good comprehension and fluency", score: "2.50" },
          { description: "Writes clearly and with good structure", score: "2.40" },
          { description: "Communicates orally with confidence", score: "2.50" },
        ],
        average: "2.47",
        level: "Meeting",
      },
      {
        name: "Mathematics",
        teacher: "Mr Kevin Lim",
        criteria: [
          { description: "Demonstrates strong number sense", score: "2.10" },
          { description: "Applies problem solving strategies effectively", score: "2.00" },
          { description: "Interprets and analyses data accurately", score: "2.20" },
        ],
        average: "2.10",
        level: "Meeting",
      },
    ],
  },
  {
    term: "Term 3",
    academicYear: "2024/2025",
    status: "Selesai",
    class: "Year 4",
    studentName: "Adrian Li Preman",
    mentor: "Bu Sari",
    teacherNote:
      "Ananda menunjukkan progres yang stabil. Perlu lebih banyak latihan pada mata pelajaran seni.",
    subjects: [
      {
        name: "Physical Education",
        teacher: "Mr Dhudy Cahyanto",
        criteria: [
          { description: "Displays good spatial awareness while performing activities", score: "2.40" },
          { description: "Shows developmentally appropriate motor/physical fitness", score: "2.20" },
          { description: "Demonstrates a good level of skill in most PE activities", score: "2.30" },
        ],
        average: "2.30",
        level: "Meeting",
      },
      {
        name: "Performing Arts (Music)",
        teacher: "Mr Ari Irawan",
        criteria: [
          { description: "Displays good knowledge & appreciation of performing art", score: "1.80" },
          { description: "Demonstrates developmentally appropriate skills", score: "1.90" },
          { description: "Shows creativity in performance", score: "2.00" },
        ],
        average: "1.90",
        level: "Improving",
      },
      {
        name: "Art & Craft",
        teacher: "Ms Paulina",
        criteria: [
          { description: "Demonstrates appropriate application of skills", score: "2.10" },
          { description: "Shows creativity and good quality of work done", score: "2.20" },
          { description: "Shows keen interest in art projects", score: "2.00" },
        ],
        average: "2.10",
        level: "Meeting",
      },
      {
        name: "Information & Communication Technology",
        teacher: "Mr Rado Aditya",
        criteria: [
          { description: "Possesses good grasp of ICT knowledge", score: "2.20" },
          { description: "Demonstrates good application of ICT skills", score: "2.10" },
        ],
        average: "2.15",
        level: "Meeting",
      },
      {
        name: "English Language",
        teacher: "Ms Sarah Tan",
        criteria: [
          { description: "Reads with good comprehension and fluency", score: "2.30" },
          { description: "Writes clearly and with good structure", score: "2.20" },
          { description: "Communicates orally with confidence", score: "2.40" },
        ],
        average: "2.30",
        level: "Meeting",
      },
      {
        name: "Mathematics",
        teacher: "Mr Kevin Lim",
        criteria: [
          { description: "Demonstrates strong number sense", score: "1.90" },
          { description: "Applies problem solving strategies effectively", score: "1.80" },
          { description: "Interprets and analyses data accurately", score: "2.00" },
        ],
        average: "1.90",
        level: "Improving",
      },
    ],
  },
  {
    term: "Term 4",
    academicYear: "2024/2025",
    status: "Selesai",
    class: "Year 4",
    studentName: "Adrian Li Preman",
    mentor: "Bu Sari",
    teacherNote:
      "Penutup tahun yang memuaskan. Ananda berhasil meningkatkan nilai hampir di semua mata pelajaran.",
    subjects: [
      {
        name: "Physical Education",
        teacher: "Mr Dhudy Cahyanto",
        criteria: [
          { description: "Displays good spatial awareness while performing activities", score: "2.20" },
          { description: "Shows developmentally appropriate motor/physical fitness", score: "2.10" },
          { description: "Demonstrates a good level of skill in most PE activities", score: "2.00" },
        ],
        average: "2.10",
        level: "Meeting",
      },
      {
        name: "Performing Arts (Music)",
        teacher: "Mr Ari Irawan",
        criteria: [
          { description: "Displays good knowledge & appreciation of performing art", score: "1.70" },
          { description: "Demonstrates developmentally appropriate skills", score: "1.60" },
          { description: "Shows creativity in performance", score: "1.80" },
        ],
        average: "1.70",
        level: "Improving",
      },
      {
        name: "Art & Craft",
        teacher: "Ms Paulina",
        criteria: [
          { description: "Demonstrates appropriate application of skills", score: "2.00" },
          { description: "Shows creativity and good quality of work done", score: "2.10" },
          { description: "Shows keen interest in art projects", score: "1.90" },
        ],
        average: "2.00",
        level: "Meeting",
      },
      {
        name: "Information & Communication Technology",
        teacher: "Mr Rado Aditya",
        criteria: [
          { description: "Possesses good grasp of ICT knowledge", score: "2.00" },
          { description: "Demonstrates good application of ICT skills", score: "1.90" },
        ],
        average: "1.95",
        level: "Improving",
      },
      {
        name: "English Language",
        teacher: "Ms Sarah Tan",
        criteria: [
          { description: "Reads with good comprehension and fluency", score: "2.10" },
          { description: "Writes clearly and with good structure", score: "2.00" },
          { description: "Communicates orally with confidence", score: "2.20" },
        ],
        average: "2.10",
        level: "Meeting",
      },
      {
        name: "Mathematics",
        teacher: "Mr Kevin Lim",
        criteria: [
          { description: "Demonstrates strong number sense", score: "1.80" },
          { description: "Applies problem solving strategies effectively", score: "1.70" },
          { description: "Interprets and analyses data accurately", score: "1.90" },
        ],
        average: "1.80",
        level: "Improving",
      },
    ],
  },
];

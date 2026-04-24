"use client";
import React from "react";
import Link from "next/link";
import { REPORTS, termToSlug } from "./reportData";

// ─────────────────────────────────────────────────────────────────────────────
// TIPE DATA & DATA — diimpor dari reportData.ts (satu sumber kebenaran)
// Nanti kalau pakai Firebase, ganti REPORTS dengan hasil fetch dari Firestore.
// ─────────────────────────────────────────────────────────────────────────────
type Level = "Exceeding" | "Meeting" | "Improving" | "—";

type SubjectReport = {
  name: string;
  teacher: string;
  criteria: { description: string; score: string }[];
  average: string;
  level: Level;
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA DUMMY
// TODO: Ganti bagian ini dengan fetch dari Firebase Firestore, contoh:
//   const reports = await getDocs(collection(db, "reports"));
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// FUNGSI BANTU
// ─────────────────────────────────────────────────────────────────────────────
function getAverage(subjects: SubjectReport[]): string {
  const valid = subjects.filter((s) => s.average !== "—");
  if (valid.length === 0) return "—";
  const avg = valid.reduce((sum, s) => sum + parseFloat(s.average), 0) / valid.length;
  return avg.toFixed(2);
}

function getLevel(subjects: SubjectReport[]): Level {
  const avg = parseFloat(getAverage(subjects));
  if (isNaN(avg)) return "—";
  if (avg >= 2.5) return "Exceeding";
  if (avg >= 2.0) return "Meeting";
  return "Improving";
}

function levelStyle(level: Level) {
  if (level === "Exceeding") return { badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", text: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500" };
  if (level === "Meeting")   return { badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",       text: "text-blue-600 dark:text-blue-400",       bar: "bg-blue-500" };
  if (level === "Improving") return { badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",   text: "text-amber-600 dark:text-amber-400",     bar: "bg-amber-500" };
  return { badge: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400", text: "text-gray-400", bar: "bg-gray-400" };
}

// ─────────────────────────────────────────────────────────────────────────────
// HALAMAN UTAMA — Daftar Term
// ─────────────────────────────────────────────────────────────────────────────
export default function ReportListPage() {
  const latest = REPORTS[0];
  const latestAvg = getAverage(latest.subjects);
  const latestLevel = getLevel(latest.subjects);
  const latestStyle = levelStyle(latestLevel);

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Laporan Nilai</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Rekap raport siswa per term akademik</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 px-5 py-3 shadow-sm">
          <div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Nilai Term Terkini</p>
            <p className={`text-xl font-black ${latestStyle.text}`}>{latestAvg}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${latestStyle.badge}`}>{latestLevel}</span>
        </div>
      </div>

      {/* Skala penilaian */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 px-6 py-4 flex flex-wrap gap-5 items-center shadow-sm">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skala Penilaian:</span>
        {[
          { label: "Exceeding Expectations", range: "≥ 2.50", dot: "bg-emerald-500" },
          { label: "Meeting Expectations",   range: "2.00 – 2.49", dot: "bg-blue-500" },
          { label: "Improving",              range: "< 2.00", dot: "bg-amber-500" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{s.label}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">({s.range})</span>
          </div>
        ))}
      </div>

      {/* Kartu per term */}
      <div className="space-y-5">
        {REPORTS.map((report) => {
          const slug = termToSlug(report);
          const avg = getAverage(report.subjects);
          const level = getLevel(report.subjects);
          const style = levelStyle(level);
          return (
            <div key={slug} className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow">

              {/* Header kartu */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-gray-800 dark:text-white/90">
                    {report.academicYear} — {report.term}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${report.status === "Aktif" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>
                    {report.status}
                  </span>
                </div>
                {/* Tombol navigasi ke halaman detail */}
                <Link
                  href={`/parent/report/${slug}`}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                  Lihat Raport
                </Link>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 dark:divide-gray-800">
                {[
                  { label: "Kelas", value: report.class },
                  { label: "Mata Pelajaran", value: `${report.subjects.length} Mapel` },
                  { label: "Rata-rata", value: avg, className: style.text },
                  { label: "Level", value: level, badge: style.badge },
                ].map((item) => (
                  <div key={item.label} className="px-6 py-4">
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide mb-1">{item.label}</p>
                    {item.badge
                      ? <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badge}`}>{item.value}</span>
                      : <p className={`text-sm font-bold ${item.className ?? "text-gray-800 dark:text-white/90"}`}>{item.value}</p>
                    }
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
"use client";
import React from "react";
import Link from "next/link";
import { REPORTS, getOverallAvg, getOverallLevel, getLevelStyle } from "./reportData";

// ─── Score Bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ score }: { score: string }) {
  const val = parseFloat(score);
  const pct = isNaN(val) ? 0 : (val / 3) * 100;
  const color =
    val >= 2.5 ? "bg-emerald-500" : val >= 2.0 ? "bg-blue-500" : "bg-amber-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
        <div
          className={`${color} h-1.5 rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-8 text-right">
        {score}
      </span>
    </div>
  );
}

// ─── Term Card ─────────────────────────────────────────────────────────────────
function TermCard({ report }: { report: (typeof REPORTS)[0] }) {
  const overallLevel = getOverallLevel(report.subjects);
  const overallAvg = getOverallAvg(report.subjects);
  const levelStyle = getLevelStyle(overallLevel);
  const slug = `${report.academicYear.replace("/", "-")}-${report.term.replace(" ", "-").toLowerCase()}`;

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-gray-800 dark:text-white/90">
            {report.academicYear} — {report.term}
          </span>
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              report.status === "Aktif"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {report.status}
          </span>
        </div>
        <Link
          href={`/parent/report/${slug}`}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Lihat Raport
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 dark:divide-gray-800">
        <div className="px-6 py-4">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide mb-1">Kelas</p>
          <p className="text-sm font-bold text-gray-800 dark:text-white/90">{report.class}</p>
        </div>
        <div className="px-6 py-4">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide mb-1">Mata Pelajaran</p>
          <p className="text-sm font-bold text-gray-800 dark:text-white/90">{report.subjects.length} Mapel</p>
        </div>
        <div className="px-6 py-4">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide mb-1">Rata-rata</p>
          <p className={`text-sm font-black ${levelStyle.text}`}>{overallAvg}</p>
        </div>
        <div className="px-6 py-4">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide mb-1">Level Pencapaian</p>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${levelStyle.badge}`}>{overallLevel}</span>
        </div>
      </div>

      {/* Subject Mini Bar */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide mb-3">
          Nilai per Mata Pelajaran
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {report.subjects.map((subj) => (
            <div key={subj.name}>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[160px]">{subj.name}</span>
                <span className={`text-xs font-bold ${getLevelStyle(subj.level).text}`}>{subj.average}</span>
              </div>
              <ScoreBar score={subj.average} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ParentReportPage() {
  const latestTerm = REPORTS[0];
  const latestAvg = getOverallAvg(latestTerm.subjects);
  const latestLevel = getOverallLevel(latestTerm.subjects);
  const latestStyle = getLevelStyle(latestLevel);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Page Header */}
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

      {/* Scale Legend Bar */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 px-6 py-4 flex flex-wrap gap-5 items-center shadow-sm">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skala Penilaian:</span>
        {[
          { label: "Exceeding Expectations", range: "≥ 2.50", dot: "bg-emerald-500" },
          { label: "Meeting Expectations", range: "2.00 – 2.49", dot: "bg-blue-500" },
          { label: "Improving", range: "< 2.00", dot: "bg-amber-500" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{s.label}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">({s.range})</span>
          </div>
        ))}
      </div>

      {/* Term Cards */}
      <div className="space-y-5">
        {REPORTS.map((report) => (
          <TermCard key={`${report.academicYear}-${report.term}`} report={report} />
        ))}
      </div>
    </div>
  );
}
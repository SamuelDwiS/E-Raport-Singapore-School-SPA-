"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  REPORTS,
  getLevelStyle,
  getOverallAvg,
  getOverallLevel,
  termToSlug,
} from "../reportData";

// ─── Score Badge ───────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: string }) {
  const val = parseFloat(score);
  const colorClass =
    val >= 2.5
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : val >= 2.0
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[52px] px-2.5 py-1 rounded-lg text-sm font-black ${colorClass}`}
    >
      {score}
    </span>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ReportDetailPage() {
  const params = useParams();
  const slug = params.term as string;

  const report = REPORTS.find((r) => termToSlug(r) === slug);

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-5xl">📭</div>
        <p className="text-gray-500 dark:text-gray-400 font-semibold">
          Raport tidak ditemukan.
        </p>
        <Link
          href="/parent/report"
          className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Kembali ke Daftar Raport
        </Link>
      </div>
    );
  }

  const overallAvg = getOverallAvg(report.subjects);
  const overallLevel = getOverallLevel(report.subjects);
  const overallStyle = getLevelStyle(overallLevel);

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* ── Breadcrumb + Cetak Button ─────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
          <Link
            href="/parent/report"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Laporan Nilai
          </Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-gray-600 dark:text-gray-300 font-semibold">
            {report.academicYear} — {report.term}
          </span>
        </nav>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition shrink-0 shadow-sm"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Cetak Raport
        </button>
      </div>

      {/* ── Report Info Card ─────────────────────────────────────────── */}
      <div className="bg-indigo-900 dark:bg-indigo-950 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-1">
              Singapore School — Academic Report
            </p>
            <h1 className="text-xl font-black uppercase tracking-wide">
              {report.term} Report {report.academicYear}
            </h1>
            <p className="text-indigo-300 text-xs font-semibold uppercase mt-0.5 tracking-wide">
              Aesthetics Domain
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Class</p>
            <p className="text-2xl font-black">{report.class}</p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-indigo-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Name of Student", value: report.studentName },
            { label: "Class Teacher", value: report.mentor },
            { label: "Academic Year", value: report.academicYear },
            { label: "Status", value: report.status },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                {item.label}
              </p>
              <p className="text-sm font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Subject Cards (one card per subject) ─────────────────────── */}
      <div className="space-y-4">
        {report.subjects.map((subj) => {
          const subStyle = getLevelStyle(subj.level);
          return (
            <div
              key={subj.name}
              className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
            >
              {/* Card header: subject name + level badge + average score */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-6 rounded-full shrink-0 ${subStyle.bar}`} />
                  <div>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-0.5">
                      {subj.teacher}
                    </p>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-white/90 uppercase tracking-wide">
                      {subj.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${subStyle.badge}`}>
                    {subj.level}
                  </span>
                  <span className={`text-lg font-black ${subStyle.text}`}>
                    {subj.average}
                  </span>
                </div>
              </div>

              {/* Criteria mini-table */}
              <div>
                {/* Column labels */}
                <div className="grid grid-cols-[1fr_auto] px-6 py-2.5 bg-gray-50 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Learning Objective
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider w-20 text-center">
                    Score
                  </span>
                </div>

                {/* Criteria rows */}
                <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
                  {subj.criteria.map((c, cIdx) => (
                    <div
                      key={cIdx}
                      className="grid grid-cols-[1fr_auto] items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-3 pr-4">
                        <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-[10px] font-black flex items-center justify-center shrink-0">
                          {cIdx + 1}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-snug">
                          {c.description}
                        </span>
                      </div>
                      <div className="w-20 flex justify-center">
                        <ScoreBadge score={c.score} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Average + Level Scale + Teachers Card ─────────────────────── */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">

        {/* Average row */}
        <div className="grid grid-cols-[1fr_auto] items-center px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
          <span className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-wider">
            Average
          </span>
          <div className="w-20 flex justify-center">
            <span className={`text-base font-black px-3 py-1 rounded-lg ${overallStyle.badge}`}>
              {overallAvg}
            </span>
          </div>
        </div>

        {/* Level Scale + Teachers */}
        <div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Level scale */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              Level Scale
            </p>
            <div className="space-y-2.5">
              {[
                { range: "1.00 – 1.99", label: "Improving", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
                { range: "2.00 – 2.49", label: "Meeting Expectations", dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" },
                { range: "2.50 – 3.00", label: "Exceeding Expectations", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500 min-w-[92px]">
                    [{s.range}]
                  </span>
                  <span className={`text-xs font-semibold ${s.text}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Teachers */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              Teachers
            </p>
            <div className="space-y-2.5">
              {report.subjects.map((subj) => (
                <div key={subj.name} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800 dark:text-white/80 shrink-0">
                    {subj.teacher}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    [{subj.name}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

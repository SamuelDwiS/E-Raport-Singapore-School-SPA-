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
  subjectToSlug,
} from "../../reportData";

// ─── Score Bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ score, max = 3 }: { score: string; max?: number }) {
  const val = parseFloat(score);
  const pct = isNaN(val) ? 0 : (val / max) * 100;
  const color =
    val >= 2.5 ? "bg-emerald-500" : val >= 2.0 ? "bg-blue-500" : "bg-amber-500";
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-black text-gray-700 dark:text-gray-300 w-10 text-right shrink-0">
        {score}
      </span>
    </div>
  );
}

// ─── Radial Score ──────────────────────────────────────────────────────────────
function RadialScore({ score, label }: { score: string; label: string }) {
  const val = parseFloat(score);
  const pct = isNaN(val) ? 0 : (val / 3) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;
  const color = val >= 2.5 ? "#10b981" : val >= 2.0 ? "#3b82f6" : "#f59e0b";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" className="dark:stroke-gray-700" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black text-gray-800 dark:text-white">{score}</span>
          <span className="text-[9px] text-gray-400 font-medium">/3.00</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center max-w-[100px] leading-tight">
        {label}
      </p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function SubjectDetailPage() {
  const params = useParams();
  const termSlug = params.term as string;
  const subjectSlug = params.subject as string;

  const report = REPORTS.find((r) => termToSlug(r) === termSlug);
  const subject = report?.subjects.find((s) => subjectToSlug(s.name) === subjectSlug);

  if (!report || !subject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-5xl">📭</div>
        <p className="text-gray-500 dark:text-gray-400 font-semibold">Data mata pelajaran tidak ditemukan.</p>
        <Link
          href="/parent/report"
          className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Kembali ke Daftar Raport
        </Link>
      </div>
    );
  }

  const style = getLevelStyle(subject.level);

  // Find same subject in other terms for trend
  const trend = REPORTS.map((r) => ({
    term: `${r.academicYear} ${r.term}`,
    shortTerm: r.term,
    year: r.academicYear,
    avg: r.subjects.find((s) => s.name === subject.name)?.average ?? null,
    level: r.subjects.find((s) => s.name === subject.name)?.level ?? "—",
  })).filter((t) => t.avg !== null);

  // Sibling subjects for navigation
  const subjectIdx = report.subjects.findIndex((s) => s.name === subject.name);
  const prevSubject = report.subjects[subjectIdx - 1];
  const nextSubject = report.subjects[subjectIdx + 1];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 flex-wrap">
        <Link href="/parent/report" className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
          Laporan Nilai
        </Link>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        <Link href={`/parent/report/${termSlug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
          {report.academicYear} — {report.term}
        </Link>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        <span className="text-gray-600 dark:text-gray-300 font-semibold">{subject.name}</span>
      </nav>

      {/* Hero Header */}
      <div
        className={`rounded-3xl p-7 text-white shadow-xl ${
          subject.level === "Exceeding"
            ? "bg-gradient-to-br from-emerald-700 to-emerald-900"
            : subject.level === "Meeting"
            ? "bg-gradient-to-br from-blue-700 to-blue-900"
            : "bg-gradient-to-br from-amber-600 to-amber-800"
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">
              {report.academicYear} • {report.class} • {report.term}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black leading-tight">{subject.name}</h1>
            <p className="text-white/70 text-sm mt-2">Wali Kelas: {report.mentor}</p>
            <div className="flex items-center gap-3 mt-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm`}>
                {subject.level} Expectations
              </span>
              <span className="text-white/70 text-sm">{subject.criteria.length} Kriteria Penilaian</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Rata-rata</p>
            <p className="text-5xl font-black">{subject.average}</p>
            <p className="text-white/50 text-xs">/3.00</p>
          </div>
        </div>
      </div>

      {/* Criteria Cards + Radial Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Criteria Breakdown */}
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-base font-bold text-gray-800 dark:text-white/90">Rincian Kriteria</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Nilai tiap kriteria penilaian</p>
          </div>
          <div className="p-6 space-y-5">
            {subject.criteria.map((c, i) => {
              const val = parseFloat(c.score);
              const critStyle = getLevelStyle(
                val >= 2.5 ? "Exceeding" : val >= 2.0 ? "Meeting" : "Improving"
              );
              return (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-black flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {c.description}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${critStyle.badge}`}>
                      {val >= 2.5 ? "Exceeding" : val >= 2.0 ? "Meeting" : "Improving"}
                    </span>
                  </div>
                  <ScoreBar score={c.score} />
                </div>
              );
            })}

            {/* Divider + Overall */}
            <div className="pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Rata-rata Keseluruhan</span>
                <span className={`text-lg font-black ${style.text}`}>{subject.average}</span>
              </div>
              <ScoreBar score={subject.average} />
            </div>
          </div>
        </div>

        {/* Radial Visual */}
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-base font-bold text-gray-800 dark:text-white/90">Visualisasi Nilai</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Perbandingan nilai per kriteria</p>
          </div>
          <div className="p-6 flex flex-wrap gap-4 justify-center">
            {subject.criteria.map((c, i) => (
              <RadialScore key={i} score={c.score} label={c.description} />
            ))}
          </div>

          {/* Level Info Box */}
          <div className={`mx-6 mb-6 rounded-xl p-4 ${
            subject.level === "Exceeding"
              ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40"
              : subject.level === "Meeting"
              ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40"
              : "bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40"
          }`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${style.text}`}>
              Status Pencapaian
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {subject.level === "Exceeding"
                ? "Luar biasa! Siswa telah melampaui ekspektasi dalam mata pelajaran ini."
                : subject.level === "Meeting"
                ? "Bagus! Siswa sudah memenuhi standar yang diharapkan dalam mata pelajaran ini."
                : "Perlu peningkatan lebih lanjut untuk mencapai standar yang diharapkan."}
            </p>
          </div>
        </div>
      </div>

      {/* Trend across terms */}
      {trend.length > 1 && (
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-base font-bold text-gray-800 dark:text-white/90">Tren Nilai — {subject.name}</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Perbandingan nilai antar term</p>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <th className="text-left px-4 py-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Term</th>
                  <th className="text-center px-4 py-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Rata-rata</th>
                  <th className="text-center px-4 py-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="text-left px-4 py-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider hidden md:table-cell">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {trend.map((t, i) => {
                  const tStyle = getLevelStyle(t.level as never);
                  const isCurrentTerm = termSlug === REPORTS.find((r) => `${r.academicYear} ${r.term}` === t.term && termToSlug(r) === termSlug) !== undefined;
                  return (
                    <tr
                      key={i}
                      className={`${
                        `${report.academicYear} ${report.term}` === t.term
                          ? "bg-indigo-50/50 dark:bg-indigo-900/10"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {`${report.academicYear} ${report.term}` === t.term && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          )}
                          <span className={`font-medium text-sm ${
                            `${report.academicYear} ${report.term}` === t.term
                              ? "text-indigo-700 dark:text-indigo-400 font-bold"
                              : "text-gray-600 dark:text-gray-400"
                          }`}>
                            {t.term}
                          </span>
                          {`${report.academicYear} ${report.term}` === t.term && (
                            <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-md">
                              Saat ini
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-base font-black ${tStyle.text}`}>{t.avg}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${tStyle.badge}`}>
                          {t.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell w-48">
                        <ScoreBar score={t.avg!} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subject navigation */}
      <div className="flex items-center justify-between gap-4">
        {prevSubject ? (
          <Link
            href={`/parent/report/${termSlug}/${subjectToSlug(prevSubject.name)}`}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            <div className="text-left">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Sebelumnya</p>
              <p className="truncate max-w-[120px]">{prevSubject.name}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        <Link
          href={`/parent/report/${termSlug}`}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Semua Mapel
        </Link>

        {nextSubject ? (
          <Link
            href={`/parent/report/${termSlug}/${subjectToSlug(nextSubject.name)}`}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md"
          >
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Berikutnya</p>
              <p className="truncate max-w-[120px]">{nextSubject.name}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

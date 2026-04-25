"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { REPORTS, subjectToSlug, termToSlug } from "./reportData";

export default function ReportPage() {
  // Static options for Class Level (Year 1 - 12) and Term (Term 1 - 4)
  const availableClasses = useMemo(() => Array.from({ length: 12 }, (_, i) => `Year ${i + 1}`), []);
  const availableTerms = useMemo(() => Array.from({ length: 4 }, (_, i) => `Term ${i + 1}`), []);

  // Default to the first report's class and term
  const [selectedClass, setSelectedClass] = useState(REPORTS[0]?.class || "");
  const [selectedTerm, setSelectedTerm] = useState(REPORTS[0]?.term || "");

  // Find the report matching the selected class and term
  const report = useMemo(() => {
    return REPORTS.find((r) => r.class === selectedClass && r.term === selectedTerm);
  }, [selectedClass, selectedTerm]);

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto">
      {/* ── Header & Filters ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Laporan Nilai</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Rekap raport siswa per term akademik</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Class Level</label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-semibold rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-10 py-2.5 text-gray-700 dark:text-gray-200 cursor-pointer outline-none transition-all"
              >
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Term</label>
            <div className="relative">
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-semibold rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-10 py-2.5 text-gray-700 dark:text-gray-200 cursor-pointer outline-none transition-all"
              >
                {availableTerms.map((term) => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      {!report ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors">
          <div className="text-4xl">📭</div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-center">
            Raport tidak ditemukan untuk <strong className="text-gray-700 dark:text-gray-300">{selectedClass}</strong> — <strong className="text-gray-700 dark:text-gray-300">{selectedTerm}</strong>.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500 w-16 text-center">No</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Subject</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Teacher</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500 text-center">Nilai</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {report.subjects.map((subj, index) => {
                  const slug = termToSlug(report);
                  return (
                    <tr className="hover:bg-gray-50 dark:hover:bg-indigo-900/20 transition-colors group">
                      <td className="px-6 py-4 text-sm font-mono text-gray-500 text-center">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-800 dark:text-white/90">
                          {subj.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {subj.teacher}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center font-black text-gray-800 dark:text-white tabular-nums">
                        {parseFloat(subj.average).toFixed(1)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/parent/report/${slug}/${subjectToSlug(subj.name)}`}
                          className="inline-block px-4 py-1.5 rounded-lg text-[10px] font-bold bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-all"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
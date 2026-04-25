"use client";
import React, { useState } from 'react';

const CLASSES = Array.from({ length: 12 }, (_, i) => `Year ${i + 1}`);
const TERMS = ["Term 1", "Term 2", "Term 3", "Term 4"];

export default function MentorReportPage() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  // Data dummy siswa - nanti dihubungkan ke API Laravel
  const students = [
    { id: 1, name: "Adrian Li Preman", nis: "2324001", status: "Belum Lengkap", class: "Year 2", Terms: " 2" },
    { id: 2, name: "Budi Setiawan", nis: "2324002", status: "Lengkap", class: "Year 2", Terms: " 2" },
    { id: 3, name: "Citra Lestari", nis: "2324003", status: "Belum Lengkap", class: "Year 2", Terms: " 2" },
    { id: 4, name: "Deni Ramadhan", nis: "2324004", status: "Belum Lengkap", class: "Year 2", Terms: " 2" },
  ];

  return (
    <div className="p-4 flex flex-col gap-6">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Laporan Hasil Belajar</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pilih siswa untuk mengisi deskripsi raport.</p>
        </div>

        
        
        {/* Filter & Search Sederhana */}
        <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-3">
          <select 
            className="w-full md:w-auto px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Semua Year</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            className="w-full md:w-auto px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            <option value="">Semua Term</option>
            {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input 
            type="text" 
            placeholder="Cari nama siswa..." 
            className="w-full md:w-auto px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Tabel Siswa */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">NIS</th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Nama Siswa</th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Kelas</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Terms</th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Status</th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.nis}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-200">{student.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.class}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.Terms}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    student.status === 'Lengkap' 
                      ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400' 
                      : 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <button className="bg-brand-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-600 transition-all shadow-sm">
                      Detail Report
                    </button>
                    <button onClick={() => window.print()} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all" title="Print/Export PDF">
                      🖨️ Export PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Informasi Tambahan */}
      <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 rounded-xl p-4 flex gap-3 transition-colors">
        <div className="w-5 h-5 bg-brand-500 dark:bg-brand-400 rounded-full flex items-center justify-center text-white dark:text-brand-900 text-[10px] font-bold shrink-0">!</div>
        <p className="text-xs text-brand-800 dark:text-brand-300 leading-relaxed">
          <strong>Tips:</strong> Tombol "Detail Report" akan membawa Anda ke halaman detail raport siswa. Pastikan nilai dari Guru Mapel sudah lengkap sebelum memfinalisasi deskripsi. Gunakan tombol "Export PDF" untuk mencetak raport masing-masing.
        </p>
      </div>
    </div>
  );
}
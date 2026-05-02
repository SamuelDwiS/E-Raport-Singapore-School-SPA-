"use client";
import React, { useState, useCallback, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Criterion = { id: string; description: string };
type Subject = { id: string; name: string; teacher: string; criteria: Criterion[] };
type StudentGrade = { [criterionId: string]: string };
type Student = {
  id: string;
  name: string;
  nis: string;
  class: string;
  Terms: string;
  status: "Lengkap" | "Belum Lengkap";
  grades: StudentGrade;
  keterangan: string;
};

// ─── Subject Master Data ──────────────────────────────────────────────────────
const INITIAL_SUBJECTS: Subject[] = [
  {
    id: "pe",
    name: "Physical Education",
    teacher: "Mr Dhudy Cahyanto",
    criteria: [
      { id: "pe1", description: "Displays good spatial awareness while performing activities" },
      { id: "pe2", description: "Shows developmentally appropriate motor/physical fitness" },
      { id: "pe3", description: "Demonstrates a good level of skill in most PE activities" },
    ],
  },
  {
    id: "music",
    name: "Performing Arts (Music)",
    teacher: "Mr Ari Irawan",
    criteria: [
      { id: "mu1", description: "Displays good knowledge & appreciation of performing art" },
      { id: "mu2", description: "Demonstrates developmentally appropriate skills" },
      { id: "mu3", description: "Shows creativity in performance" },
    ],
  },
  {
    id: "art",
    name: "Art & Craft",
    teacher: "Ms Paulina",
    criteria: [
      { id: "ar1", description: "Demonstrates appropriate application of skills" },
      { id: "ar2", description: "Shows creativity and good quality of work done" },
      { id: "ar3", description: "Shows keen interest in art projects" },
    ],
  },
  {
    id: "ict",
    name: "Information & Communication Technology",
    teacher: "Mr Rado Aditya",
    criteria: [
      { id: "ict1", description: "Possesses good grasp of ICT knowledge" },
      { id: "ict2", description: "Demonstrates good application of ICT skills" },
    ],
  },
];

const CLASSES = Array.from({ length: 12 }, (_, i) => `Year ${i + 1}`);
const TERMS = ["Term 1", "Term 2", "Term 3", "Term 4"];

// Menambahkan data class, Terms, dan status untuk memperbaiki error pada type
const INITIAL_STUDENTS: Student[] = [
  { id: "1", name: "Adrian Li Preman",  nis: "85448598001", class: "Year 1", Terms: "Term 1", status: "Lengkap", grades: { pe1: "2.20", pe2: "2.20", pe3: "2.40" }, keterangan: "" },
  { id: "2", name: "Budi Santoso",       nis: "85168598003", class: "Year 1", Terms: "Term 1", status: "Belum Lengkap", grades: {}, keterangan: "" },
  { id: "3", name: "Citra Dewi",         nis: "85168598005", class: "Year 1", Terms: "Term 1", status: "Belum Lengkap", grades: {}, keterangan: "" },
  { id: "4", name: "Daffa Ramadhan",     nis: "86148888002", class: "Year 1", Terms: "Term 1", status: "Belum Lengkap", grades: {}, keterangan: "" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MentorReportPage() {
  // State manajemen untuk view dan data
  const [view, setView] = useState<"list" | "form">("list");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedClass,   setSelectedClass]   = useState(CLASSES[0]);
  const [selectedTerm,    setSelectedTerm]    = useState(TERMS[0]);
  const [subjects,        setSubjects]        = useState<Subject[]>(INITIAL_SUBJECTS);
  const [selectedSubject, setSelectedSubject] = useState(INITIAL_SUBJECTS[0].id);
  const [students]        = useState<Student[]>(INITIAL_STUDENTS); // Mentor tidak perlu mengubah student disini
  const [saved,           setSaved]           = useState(false);

  // Mengambil data subject dan student saat ini
  const subject = useMemo(() => subjects.find((s) => s.id === selectedSubject) || subjects[0], [subjects, selectedSubject]);
  const currentStudent = useMemo(() => students.find(s => s.id === selectedStudentId), [students, selectedStudentId]);

  // Fungsi untuk update deskripsi kriteria
  const updateCriterion = useCallback((subjId: string, critId: string, desc: string) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjId) return s;
      return {
        ...s,
        criteria: s.criteria.map(c => c.id === critId ? { ...c, description: desc } : c)
      };
    }));
  }, []);

  // Fungsi untuk menambah kriteria baru
  const addCriterion = useCallback((subjId: string) => {
    const newId = `crit_${Date.now()}`;
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjId) return s;
      return {
        ...s,
        criteria: [...s.criteria, { id: newId, description: "" }]
      };
    }));
  }, []);

  // Fungsi untuk menghapus kriteria
  const removeCriterion = useCallback((subjId: string, critId: string) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjId) return s;
      if (s.criteria.length <= 1) return s; // Minimal 1 kriteria
      return {
        ...s,
        criteria: s.criteria.filter(c => c.id !== critId)
      };
    }));
  }, []);

  // Handler simulasi simpan data
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { 
      setSaved(false); 
      setView("list"); // Kembali ke list setelah simpan
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors print:bg-white print:p-0">
      
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Mentor E-Report Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Laporan Hasil Belajar • {selectedClass} • {selectedTerm}</p>
        </div>

        {/* Filter & Search Sederhana ketika di view list */}
        {view === "list" && (
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
        )}
      </div>

      {view === "list" ? (
        /* ─── TAMPILAN LIST SISWA ─── */
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
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => { setSelectedStudentId(student.id); setView("form"); }}
                          className="bg-brand-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-600 transition-all shadow-sm"
                        >
                          Detail Report
                        </button>
                        <button 
                          onClick={() => window.print()} 
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all" 
                          title="Print/Export PDF"
                        >
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
      ) : (
        /* ─── TAMPILAN FORM EDIT (MENTOR VIEW) ─── */
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 print:m-0 print:shadow-none print:border-none">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden print:border-none print:shadow-none">
            
            {/* Header Detail Form */}
            <div className="p-6 md:p-8 bg-brand-600 dark:bg-brand-900 text-white print:bg-white print:text-black print:border-b-2 print:border-black print:p-4">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h2 className="text-3xl font-black">{currentStudent?.name}</h2>
                  <p className="text-brand-100 dark:text-brand-300 text-sm mt-1 font-medium print:text-gray-500">NIS: {currentStudent?.nis}</p>
                </div>
                <div className="md:text-right">
                   <p className="text-brand-200 dark:text-brand-400 text-[10px] font-bold uppercase mb-1 print:text-gray-600">Edit Kriteria Subject</p>
                   {/* Pilihan Subject untuk diedit deskripsinya */}
                   <select 
                     className="mt-1 bg-white/20 border border-white/30 text-white text-sm rounded-lg px-3 py-2 outline-none"
                     value={selectedSubject} 
                     onChange={(e) => setSelectedSubject(e.target.value)}
                   >
                      {subjects.map(s => <option key={s.id} value={s.id} className="text-gray-900">{s.name}</option>)}
                   </select>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button onClick={() => setView("list")} className="text-sm font-bold text-brand-100 hover:text-white transition">
                  ← Kembali ke Daftar
                </button>
              </div>
            </div>

            {/* Area Edit Kriteria untuk Subject yang dipilih */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Kriteria / Indikator Penilaian</h3>
                <button 
                  onClick={() => addCriterion(subject.id)}
                  className="bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors"
                >
                  + Tambah Kriteria
                </button>
              </div>
              
              <div className="space-y-4">
                {subject.criteria.map((c, idx) => (
                  <div key={c.id} className="flex gap-4 items-start bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <span className="text-brand-500 font-bold mt-2">{idx + 1}.</span>
                    <textarea
                      value={c.description}
                      onChange={(e) => updateCriterion(subject.id, c.id, e.target.value)}
                      placeholder="Masukkan deskripsi kriteria..."
                      className="w-full text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all resize-none"
                      rows={2}
                    />
                    <button 
                      onClick={() => removeCriterion(subject.id, c.id)}
                      className="mt-2 text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Hapus Kriteria"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Footer Actions */}
            <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6 print:hidden">
               <div className="flex gap-6 w-full md:w-auto">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Scale Info</p>
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">2.50+ Exceeding</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Teacher</p>
                    <p className="text-[11px] font-bold text-gray-700 dark:text-gray-500">{subject.teacher}</p>
                  </div>
               </div>
               <button 
                onClick={handleSave} 
                className={`w-full md:w-auto px-10 py-4 rounded-2xl font-black text-sm tracking-wide transition-all shadow-xl ${saved ? 'bg-emerald-500 dark:bg-emerald-600 text-white' : 'bg-brand-600 dark:bg-brand-500 hover:bg-brand-700 dark:hover:bg-brand-600 text-white shadow-brand-200 dark:shadow-none active:scale-95'}`}
               >
                 {saved ? "✓ BERHASIL DISIMPAN" : "SIMPAN DESKRIPSI"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
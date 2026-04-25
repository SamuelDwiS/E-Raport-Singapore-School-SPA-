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

const INITIAL_STUDENTS: Student[] = [
  { id: "1", name: "Adrian Li Preman",  nis: "85448598001", grades: { pe1: "2.20", pe2: "2.20", pe3: "2.40" }, keterangan: "" },
  { id: "2", name: "Budi Santoso",       nis: "85168598003", grades: {}, keterangan: "" },
  { id: "3", name: "Citra Dewi",         nis: "85168598005", grades: {}, keterangan: "" },
  { id: "4", name: "Daffa Ramadhan",     nis: "86148888002", grades: {}, keterangan: "" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcAverage(grades: StudentGrade, criteria: Criterion[]): string {
  const vals = criteria.map((c) => parseFloat(grades[c.id] || "0")).filter((v) => v > 0);
  if (vals.length === 0) return "—";
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return avg.toFixed(2);
}

function getLevelLabel(avg: string): { label: string; color: string } {
  const v = parseFloat(avg);
  if (isNaN(v) || avg === "—") return { label: "—", color: "text-gray-400 dark:text-gray-500" };
  if (v >= 2.5)  return { label: "Exceeding Expectations", color: "text-emerald-600 dark:text-emerald-400" };
  if (v >= 2.0)  return { label: "Meeting Expectations",  color: "text-blue-600 dark:text-blue-400" };
  return            { label: "Improving",               color: "text-amber-600 dark:text-amber-400" };
}

function scoreColor(val: string): string {
  const v = parseFloat(val);
  if (isNaN(v) || val === "") return "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";
  if (v >= 2.5) return "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400";
  if (v >= 2.0) return "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400";
  return "border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400";
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TeacherReportPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedClass,   setSelectedClass]   = useState(CLASSES[0]);
  const [selectedTerm,    setSelectedTerm]    = useState(TERMS[0]);
  const [subjects,        setSubjects]        = useState<Subject[]>(INITIAL_SUBJECTS);
  const [selectedSubject, setSelectedSubject] = useState(INITIAL_SUBJECTS[0].id);
  const [students,        setStudents]        = useState<Student[]>(INITIAL_STUDENTS);
  const [saved,           setSaved]           = useState(false);

  const subject = useMemo(() => subjects.find((s) => s.id === selectedSubject) || subjects[0], [subjects, selectedSubject]);

  const updateCriterion = useCallback((subjId: string, critId: string, desc: string) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjId) return s;
      return {
        ...s,
        criteria: s.criteria.map(c => c.id === critId ? { ...c, description: desc } : c)
      };
    }));
  }, []);

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

  const removeCriterion = useCallback((subjId: string, critId: string) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== subjId) return s;
      if (s.criteria.length <= 1) return s;
      return {
        ...s,
        criteria: s.criteria.filter(c => c.id !== critId)
      };
    }));
  }, []);
  const currentStudent = useMemo(() => students.find(s => s.id === selectedStudentId), [students, selectedStudentId]);

  const updateGrade = useCallback((studentId: string, criterionId: string, value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, "");
    setStudents((prev) => prev.map((s) => s.id === studentId ? { ...s, grades: { ...s.grades, [criterionId]: cleaned } } : s));
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); setView("list"); }, 1500);
  };

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors print:bg-white print:p-0">
      
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">E-Report Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{subject.teacher} • {selectedClass} • {selectedTerm}</p>
        </div>
        {view === "form" && (
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <button onClick={handleExport} className="flex-1 md:flex-none text-sm font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              🖨️ Export Raport
            </button>
            <button onClick={() => setView("list")} className="flex-1 md:flex-none text-sm font-bold text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition text-center md:text-left">
              ← Kembali ke Daftar
            </button>
          </div>
        )}
      </div>

      {view === "list" ? (
        /* ─── TAMPILAN LIST SISWA ─── */
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-50 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/30 dark:bg-gray-800/50">
            <h2 className="font-bold text-gray-700 dark:text-gray-200">Daftar Siswa {selectedClass} - {selectedTerm}</h2>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
               <select className="flex-1 md:flex-none text-xs font-bold border-none bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 outline-none" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
               <select className="flex-1 md:flex-none text-xs font-bold border-none bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 outline-none" value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
                  {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
               <select className="w-full md:w-auto text-xs font-bold border-none bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 outline-none" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
               </select>
            </div>
          </div>
          {/* Desktop View: Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-gray-900/50">
                  <th className="px-8 py-4">Siswa</th>
                  <th className="px-6 py-4">NIS</th>
                  <th className="px-6 py-4 text-center">Avg</th>
                  <th className="px-8 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {students.map((s) => {
                  const avg = calcAverage(s.grades, subject.criteria);
                  return (
                    <tr key={s.id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-all group">
                      <td className="px-8 py-5">
                        <p className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{s.name}</p>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-400 dark:text-gray-500 font-mono">{s.nis}</td>
                      <td className="px-6 py-5 text-center">
                        <span className={`text-sm font-black ${getLevelLabel(avg).color}`}>{avg}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => { setSelectedStudentId(s.id); setView("form"); }}
                          className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 dark:hover:bg-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                        >
                          Input Nilai
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Cards */}
          <div className="sm:hidden divide-y divide-gray-50 dark:divide-gray-700">
            {students.map((s) => {
              const avg = calcAverage(s.grades, subject.criteria);
              return (
                <div key={s.id} className="p-5 space-y-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-gray-900 dark:text-white">{s.name}</p>
                      <p className="text-xs text-gray-400 font-mono mt-1">{s.nis}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg</p>
                      <p className={`text-lg font-black ${getLevelLabel(avg).color}`}>{avg}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSelectedStudentId(s.id); setView("form"); }}
                    className="w-full bg-indigo-600 text-white py-3 rounded-2xl text-xs font-bold hover:bg-indigo-700 shadow-md active:scale-[0.98] transition-all"
                  >
                    Input Nilai Detail
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ─── TAMPILAN FORM DINAMIS (SESUAI GAMBAR EXCEL) ─── */
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 print:m-0 print:shadow-none print:border-none">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden print:border-none print:shadow-none">
            {/* Form Header */}
            <div className="p-6 md:p-8 bg-indigo-900 dark:bg-indigo-950 text-white print:bg-white print:text-black print:border-b-2 print:border-black print:p-4">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <p className="text-indigo-300 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 print:text-gray-600">Aesthetics Domain • {selectedClass} • {selectedTerm}</p>
                  <h2 className="text-3xl font-black">{currentStudent?.name}</h2>
                  <p className="text-indigo-200 dark:text-indigo-300 text-sm mt-1 font-medium print:text-gray-500">NIS: {currentStudent?.nis}</p>
                </div>
                <div className="md:text-right">
                   <p className="text-indigo-300 dark:text-indigo-400 text-[10px] font-bold uppercase mb-1 print:text-gray-600">Subject</p>
                   <p className="font-bold text-xl">{subject.name}</p>
                </div>
              </div>
            </div>

            {/* Input Form Section */}
            <div className="print:block">
              {/* Desktop View: Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 print:bg-white">
                      <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest print:text-black print:px-4">Kriteria / Indikator Penilaian</th>
                      <th className="px-8 py-4 text-center text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest w-40 print:text-black print:px-4">Level (1-3)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700 print:divide-gray-300">
                    {subject.criteria.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition group/row print:hover:bg-white">
                        <td className="px-8 py-6 print:px-4 print:py-4">
                          <div className="flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900 transition-all shadow-sm dark:shadow-none print:border-none print:shadow-none print:bg-white">
                            <textarea
                              value={c.description}
                              onChange={(e) => updateCriterion(subject.id, c.id, e.target.value)}
                              placeholder="Deskripsi kriteria/indikator..."
                              className="w-full text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed p-3 bg-transparent border-none outline-none resize-none print:p-0 print:text-black print:resize-none"
                              rows={2}
                            />
                            {subject.criteria.length > 1 && (
                              <button
                                onClick={() => removeCriterion(subject.id, c.id)}
                                className="px-4 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center justify-center font-bold text-xl group-hover/row:text-red-400 print:hidden"
                                title="Hapus Kriteria"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center align-middle print:px-4 print:py-4">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={currentStudent?.grades[c.id] || ""}
                            onChange={(e) => updateGrade(currentStudent!.id, c.id, e.target.value)}
                            placeholder="0.00"
                            className={`w-24 text-center py-3 border-2 dark:border-gray-700 rounded-2xl text-lg font-black outline-none focus:ring-4 focus:ring-indigo-100 dark:focus-within:ring-indigo-900 transition-all print:border-none print:text-black print:bg-white ${scoreColor(currentStudent?.grades[c.id] || "")}`}
                          />
                        </td>
                      </tr>
                    ))}
                    
                    <tr className="bg-white dark:bg-gray-800 print:hidden">
                      <td colSpan={2} className="px-8 py-4 text-center border-t border-dashed border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => addCriterion(subject.id)}
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-6 py-2 rounded-xl transition-colors shadow-sm outline-none"
                        >
                          + Tambah Kriteria / Indikator
                        </button>
                      </td>
                    </tr>

                    <tr className="bg-indigo-50/50 dark:bg-indigo-900/20 print:bg-white print:border-t-2 print:border-black">
                      <td className="px-8 py-6 text-right print:px-4 print:py-4">
                        <span className="text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest print:text-black">Average Score</span>
                      </td>
                      <td className="px-8 py-6 text-center print:px-4 print:py-4">
                        <div className="flex flex-col items-center">
                          <span className={`text-2xl font-black print:text-black ${getLevelLabel(calcAverage(currentStudent!.grades, subject.criteria)).color}`}>
                            {calcAverage(currentStudent!.grades, subject.criteria)}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mt-1 print:text-gray-600">
                            {getLevelLabel(calcAverage(currentStudent!.grades, subject.criteria)).label}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mobile View: Cards */}
              <div className="sm:hidden p-4 space-y-6 print:hidden">
                {subject.criteria.map((c) => (
                  <div key={c.id} className="space-y-3 p-4 bg-gray-50/50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kriteria / Indikator</p>
                      {subject.criteria.length > 1 && (
                        <button 
                          onClick={() => removeCriterion(subject.id, c.id)}
                          className="text-red-500 text-xs font-bold bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    <textarea
                      value={c.description}
                      onChange={(e) => updateCriterion(subject.id, c.id, e.target.value)}
                      placeholder="Masukkan deskripsi kriteria..."
                      className="w-full text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      rows={3}
                    />
                    <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Level Skor (1-3)</p>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={currentStudent?.grades[c.id] || ""}
                        onChange={(e) => updateGrade(currentStudent!.id, c.id, e.target.value)}
                        placeholder="0.00"
                        className={`w-24 text-center py-2.5 border-2 dark:border-gray-700 rounded-xl text-lg font-black outline-none ${scoreColor(currentStudent?.grades[c.id] || "")}`}
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => addCriterion(subject.id)}
                  className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-xs font-bold text-gray-400 hover:text-indigo-500 hover:border-indigo-500/50 transition-all bg-gray-50/50 dark:bg-transparent"
                >
                  + Tambah Kriteria Baru
                </button>

                <div className="bg-indigo-600 dark:bg-indigo-500 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-1">Average Score</p>
                    <p className="text-xs font-bold">{getLevelLabel(calcAverage(currentStudent!.grades, subject.criteria)).label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black">{calcAverage(currentStudent!.grades, subject.criteria)}</p>
                  </div>
                </div>
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
                className={`w-full md:w-auto px-10 py-4 rounded-2xl font-black text-sm tracking-wide transition-all shadow-xl ${saved ? 'bg-emerald-500 dark:bg-emerald-600 text-white' : 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none active:scale-95'}`}
               >
                 {saved ? "✓ BERHASIL DISIMPAN" : "SIMPAN NILAI RAPORT"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Criterion = { id: string; description: string };
type Subject = { id: string; name: string; teacher: string; domain: string; criteria: Criterion[] };
type StudentGrade = { [criterionId: string]: string };
type Attendance = { sick: number; leave: number; unexcused: number };
type Student = {
  id: string;
  name: string;
  nis: string;
  class: string;
  Terms: string;
  status: "Lengkap" | "Belum Lengkap";
  grades: StudentGrade;
  keterangan: string;
  attendance: Attendance;
};

// ─── Assessment Categories / Domains ─────────────────────────────────────────
const DOMAINS = ["All Domains", "Active Domain", "Aesthetic Domain", "Cognitive Domain"];

// ─── Subject Master Data ──────────────────────────────────────────────────────
const INITIAL_SUBJECTS: Subject[] = [
  {
    id: "pe",
    name: "Physical Education",
    teacher: "Mr Dhudy Cahyanto",
    domain: "Active Domain",
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
    domain: "Aesthetic Domain",
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
    domain: "Aesthetic Domain",
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
    domain: "Cognitive Domain",
    criteria: [
      { id: "ict1", description: "Possesses good grasp of ICT knowledge" },
      { id: "ict2", description: "Demonstrates good application of ICT skills" },
    ],
  },
];

const CLASSES = Array.from({ length: 2 }, (_, i) => `Year ${i + 1}`);
const TERMS = ["Term 1", "Term 2", "Term 3", "Term 4"];

const INITIAL_STUDENTS: Student[] = [
  { id: "1", name: "Adrian Li Preman",  nis: "85448598001", class: "Year 1", Terms: "Term 1", status: "Lengkap", grades: { pe1: "2.20", pe2: "2.20", pe3: "2.40" }, keterangan: "Adrian menunjukkan perkembangan yang sangat baik di semester ini. Tetap pertahankan semangat belajarnya.", attendance: { sick: 0, leave: 1, unexcused: 0 } },
  { id: "2", name: "Budi Santoso",       nis: "85168598003", class: "Year 1", Terms: "Term 1", status: "Belum Lengkap", grades: {}, keterangan: "", attendance: { sick: 2, leave: 0, unexcused: 1 } },
  { id: "3", name: "Citra Dewi",         nis: "85168598005", class: "Year 1", Terms: "Term 1", status: "Belum Lengkap", grades: {}, keterangan: "", attendance: { sick: 0, leave: 0, unexcused: 0 } },
  { id: "4", name: "Daffa Ramadhan",     nis: "86148888002", class: "Year 1", Terms: "Term 1", status: "Belum Lengkap", grades: {}, keterangan: "", attendance: { sick: 1, leave: 2, unexcused: 0 } },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MentorReportPage() {
  const [view, setView] = useState<"list" | "form">("list");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedClass,   setSelectedClass]   = useState(CLASSES[0]);
  const [selectedTerm,    setSelectedTerm]    = useState(TERMS[0]);
  const [subjects,        setSubjects]        = useState<Subject[]>(INITIAL_SUBJECTS);
  const [selectedDomain,  setSelectedDomain]  = useState<string>("All Domains");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [students,        setStudents]        = useState<Student[]>(INITIAL_STUDENTS);
  const [saved,           setSaved]           = useState(false);

  // Filter subjects by selected domain
  const filteredSubjects = useMemo(() => {
    if (selectedDomain === "All Domains") return subjects;
    return subjects.filter(s => s.domain === selectedDomain);
  }, [subjects, selectedDomain]);

  // Auto-select subject when domain changes
  useEffect(() => {
    if (filteredSubjects.length > 0) {
      setSelectedSubject(prev => {
        const exists = filteredSubjects.some(s => s.id === prev);
        return exists ? prev : filteredSubjects[0].id;
      });
    } else {
      setSelectedSubject(null);
    }
  }, [filteredSubjects]);

  const subject = useMemo(() => subjects.find((s) => s.id === selectedSubject) || null, [subjects, selectedSubject]);
  const currentStudent = useMemo(() => students.find(s => s.id === selectedStudentId), [students, selectedStudentId]);

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

  const updateAttendance = useCallback((studentId: string, field: keyof Attendance, value: string) => {
    const num = parseInt(value) || 0;
    setStudents(prev => prev.map(s => s.id === studentId ? { 
      ...s, 
      attendance: { ...s.attendance, [field]: num } 
    } : s));
  }, []);

  const updateKeterangan = useCallback((studentId: string, value: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, keterangan: value } : s));
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { 
      setSaved(false); 
      setView("list");
    }, 1500);
  };

  // Helper to get domain badge color
  const getDomainBadge = (domain: string) => {
    switch (domain) {
      case "Active Domain":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
      case "Aesthetic Domain":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
      case "Cognitive Domain":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors print:bg-white print:p-0">
      
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Mentor E-Report Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Laporan Hasil Belajar • {selectedClass} • {selectedTerm}</p>
        </div>

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
                          onClick={() => { setSelectedStudentId(student.id); setSelectedDomain("All Domains"); setView("form"); }}
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
                <div className="md:text-right space-y-3">
                   <p className="text-brand-200 dark:text-brand-400 text-[10px] font-bold uppercase print:text-gray-600">Pilih Kategori & Subject</p>
                   
                   {/* Domain Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-brand-200 dark:text-brand-300 uppercase tracking-wider mb-1.5 text-left">
                          Kategori Penilaian
                        </label>
                        <select 
                          className="w-full bg-white/20 border border-white/30 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-white/60 transition-colors"
                          value={selectedDomain} 
                          onChange={(e) => setSelectedDomain(e.target.value)}
                        >
                          {DOMAINS.map(d => <option key={d} value={d} className="text-gray-900">{d}</option>)}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-brand-200 dark:text-brand-300 uppercase tracking-wider mb-1.5 text-left">
                          Subject
                        </label>
                        <select 
                          className="w-full bg-white/20 border border-white/30 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-white/60 transition-colors"
                          value={selectedSubject || ""} 
                          onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                          {filteredSubjects.length === 0 ? (
                            <option className="text-gray-900">Tidak ada subject untuk kategori ini</option>
                          ) : (
                            filteredSubjects.map(s => <option key={s.id} value={s.id} className="text-gray-900">{s.name}</option>)
                          )}
                        </select>
                      </div>
                   </div>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button onClick={() => setView("list")} className="text-sm font-bold text-brand-100 hover:text-white transition">
                  ← Kembali ke Daftar
                </button>
              </div>
            </div>

            {/* Area Attendance & Teacher's Notes */}
            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50/50 dark:bg-gray-900/20 border-b border-gray-100 dark:border-gray-700">
              {/* Attendance Card */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Attendance (Ketidakhadiran)</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total", field: "sick" as keyof Attendance, color: "text-blue-600", bg: "bg-blue-50" },
                  ].map((item) => (
                    <div key={item.field} className={`${item.bg} dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md`}>
                      <label className={`block text-[10px] font-black uppercase tracking-wider mb-2 ${item.color} dark:text-gray-400`}>
                        {item.label}
                      </label>
                      <input 
                        type="number"
                        min="0"
                        value={currentStudent?.attendance[item.field] || 0}
                        onChange={(e) => updateAttendance(currentStudent!.id, item.field, e.target.value)}
                        className="w-full bg-white dark:bg-gray-900 border-2 border-transparent focus:border-brand-500 rounded-xl px-3 py-2 text-center font-black text-xl outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher's Notes Card */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Teacher's Comments (Catatan)</h3>
                </div>
                
                <div className="relative group">
                  <textarea 
                    value={currentStudent?.keterangan || ""}
                    onChange={(e) => updateKeterangan(currentStudent!.id, e.target.value)}
                    placeholder="Tuliskan catatan perkembangan siswa di sini..."
                    className="w-full h-[120px] bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 focus:border-brand-500 rounded-2xl p-4 text-sm font-medium text-gray-700 dark:text-gray-200 outline-none transition-all resize-none shadow-sm group-hover:shadow-md"
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none">
                    Mentor's Desk
                  </div>
                </div>
              </div>
            </div>

            {/* Area Edit Kriteria untuk Subject yang dipilih */}
            {subject ? (
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Kriteria / Indikator Penilaian</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{subject.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getDomainBadge(subject.domain)}`}>
                        {subject.domain}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">• {subject.teacher}</span>
                    </div>
                  </div>
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
                        className="mt-2 text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
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
            ) : (
              <div className="p-16 md:p-24 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-600 dark:text-gray-300">Pilih Kategori dan Subject</h4>
                <p className="text-sm text-gray-400 dark:text-gray-500">Silakan pilih kategori penilaian terlebih dahulu, lalu pilih subject untuk mengedit kriteria.</p>
              </div>
            )}

            {/* Form Footer Actions */}
            {subject && (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}

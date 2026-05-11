"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation"; // Changed from next/router to next/navigation for App Router
import api from '@/lib/axios';

function getLevelLabel(avg: string | number | null): { label: string; color: string } {
  if (!avg) return { label: "—", color: "text-gray-400 dark:text-gray-500" };
  const v = typeof avg === 'string' ? parseFloat(avg) : avg;
  if (isNaN(v)) return { label: "—", color: "text-gray-400 dark:text-gray-500" };
  if (v >= 2.5)  return { label: "Exceeding Expectations", color: "text-emerald-600 dark:text-emerald-400" };
  if (v >= 2.0)  return { label: "Meeting Expectations",  color: "text-blue-600 dark:text-blue-400" };
  return            { label: "Improving",               color: "text-amber-600 dark:text-amber-400" };
}

function scoreColor(val: string | number): string {
  const v = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(v) || val === "") return "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";
  if (v >= 2.5) return "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400";
  if (v >= 2.0) return "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400";
  return "border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400";
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TeacherReportPage() {
  const router = useRouter();
  
  const [view, setView] = useState<"list" | "form">("list");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Data States
  const [profile, setProfile] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  // Selection States
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Form States (Detail Rubrik)
  const [scoreForm, setScoreForm] = useState<any>(null);
  const [inputScores, setInputScores] = useState<any[]>([]);

  // 1. Fetch Profile & Subjects on Mount secara PARALEL (Lebih Cepat!)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {

        const [profileRes, subjectRes] = await Promise.all([
          api.get('/teacher/profile'),
          api.get('/teacher/subjects')
        ]);

        setProfile(profileRes.data.data);
        setSubjects(subjectRes.data.data);
        
        if (subjectRes.data.data.length > 0) {
          setSelectedSubjectId(subjectRes.data.data[0].subject_id);
        }
      } catch (err) {
        console.error("Gagal memuat data", err);
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [router]);

  // 2. Fetch Students when Subject changes
  const fetchStudents = useCallback(async () => {
    if (!selectedSubjectId) return;
    try {
      const res = await api.get(`/teacher/subjects/${selectedSubjectId}/students`);
      setStudents(res.data.data.students);
    } catch (err) {
      console.error("Gagal memuat murid", err);
    }
  }, [selectedSubjectId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // 3. Open Form and Fetch Rubrics
  const handleOpenForm = async (studentId: string) => {
    setSelectedStudentId(studentId);
    try {
      const res = await api.get(`/teacher/subjects/${selectedSubjectId}/students/${studentId}/scores`);
      const data = res.data.data;
      setScoreForm(data);
      
      const initialFormState = data.rubrics.map((r: any) => ({
        rubric_id: r.rubric_id,
        score: r.current_score || '',
        description_subject: r.description_subject || ''
      }));
      setInputScores(initialFormState);
      setView("form");
    } catch (err) {
      console.error("Gagal memuat form nilai", err);
    }
  };

  // 4. Handle Input Change
  const handleScoreChange = (index: number, field: string, value: string) => {
    const updated = [...inputScores];
    updated[index][field] = value;
    setInputScores(updated);
  };

  // 5. Submit Form
  const handleSave = async () => {
    try {
      // Format ulang data sebelum dikirim: ubah tanda koma (,) menjadi titik (.) agar lolos validasi 'numeric' Laravel
      const formattedScores = inputScores.map(item => ({
        ...item,
        score: String(item.score).replace(',', '.')
      }));

      const payload = {
        academic_year: "2023/2024", // Menggunakan slash (/) sesuai database
        scores: formattedScores
      };
      await api.post(`/teacher/subjects/${selectedSubjectId}/students/${selectedStudentId}/scores`, payload);
      
      setSaved(true);
      setTimeout(() => { 
        setSaved(false); 
        setView("list"); 
        fetchStudents(); 
      }, 1500);
    } catch (err) {
      console.error("Gagal simpan nilai", err);
      alert('Gagal menyimpan nilai. Pastikan input angka yang valid (1.00 - 3.00)');
    }
  };

  const handleExport = () => {
    window.print();
  };

  // Helpers to safely get current selection details
  const currentSubject = subjects.find(s => s.subject_id === selectedSubjectId) || {};
  const currentStudent = students.find(s => s.student_id === selectedStudentId) || {};
  
  // Calculate Average from current inputScores dynamically in Form View
  const currentFormAverage = useMemo(() => {
    if (!inputScores || inputScores.length === 0) return "—";
    const vals = inputScores.map(i => parseFloat(i.score || "0")).filter(v => v > 0);
    if (vals.length === 0) return "—";
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
  }, [inputScores]);

  if (loading || !profile) return <div className="p-8 text-center text-white">Memuat Data Dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors print:bg-white print:p-0">
      
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">E-Report Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{profile.name} • {profile.nip}</p>
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
            <h2 className="font-bold text-gray-700 dark:text-gray-200">Daftar Siswa</h2>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
               <select className="w-full md:w-auto text-xs font-bold border-none bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 outline-none" value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)}>
                  {subjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.category_subject} ({s.level_class})</option>)}
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
                {students.map((s) => (
                  <tr key={s.student_id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20 transition-all group">
                    <td className="px-8 py-5">
                      <p className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{s.name_student}</p>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-400 dark:text-gray-500 font-mono">{s.nis}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`text-sm font-black ${getLevelLabel(s.average_value).color}`}>{s.average_value || '—'}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleOpenForm(s.student_id)}
                        className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 dark:hover:bg-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                      >
                        {s.has_score ? 'Edit Nilai' : 'Input Nilai'}
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-5 text-center text-gray-500">Belum ada siswa di kelas ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Cards */}
          <div className="sm:hidden divide-y divide-gray-50 dark:divide-gray-700">
            {students.map((s) => (
              <div key={s.student_id} className="p-5 space-y-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-gray-900 dark:text-white">{s.name_student}</p>
                    <p className="text-xs text-gray-400 font-mono mt-1">{s.nis}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg</p>
                    <p className={`text-lg font-black ${getLevelLabel(s.average_value).color}`}>{s.average_value || '—'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleOpenForm(s.student_id)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-2xl text-xs font-bold hover:bg-indigo-700 shadow-md active:scale-[0.98] transition-all"
                >
                  {s.has_score ? 'Edit Nilai Detail' : 'Input Nilai Detail'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ─── TAMPILAN FORM DINAMIS (SESUAI GAMBAR EXCEL) ─── */
        scoreForm && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 print:m-0 print:shadow-none print:border-none">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden print:border-none print:shadow-none">
              {/* Form Header */}
              <div className="p-6 md:p-8 bg-indigo-900 dark:bg-indigo-950 text-white print:bg-white print:text-black print:border-b-2 print:border-black print:p-4">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <p className="text-indigo-300 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 print:text-gray-600">{currentSubject.level_class}</p>
                    <h2 className="text-3xl font-black">{scoreForm.student.name_student}</h2>
                    <p className="text-indigo-200 dark:text-indigo-300 text-sm mt-1 font-medium print:text-gray-500">NIS: {scoreForm.student.nis}</p>
                  </div>
                  <div className="md:text-right">
                    <p className="text-indigo-300 dark:text-indigo-400 text-[10px] font-bold uppercase mb-1 print:text-gray-600">Subject</p>
                    <p className="font-bold text-xl">{scoreForm.subject.category_subject}</p>
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
                      {scoreForm.rubrics.map((r: any, i: number) => (
                        <tr key={r.rubric_id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition group/row print:hover:bg-white">
                          <td className="px-8 py-6 print:px-4 print:py-4">
                            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">{r.rubric_name}</p>
                            <div className="flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900 transition-all shadow-sm dark:shadow-none print:border-none print:shadow-none print:bg-white">
                              <textarea
                                value={inputScores[i]?.description_subject || ""}
                                onChange={(e) => handleScoreChange(i, 'description_subject', e.target.value)}
                                placeholder="Deskripsi/catatan kriteria..."
                                className="w-full text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed p-3 bg-transparent border-none outline-none resize-none print:p-0 print:text-black print:resize-none"
                                rows={2}
                              />
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center align-middle print:px-4 print:py-4">
                            <input
                              type="number"
                              step="0.01" min="1" max="3"
                              value={inputScores[i]?.score || ""}
                              onChange={(e) => handleScoreChange(i, 'score', e.target.value)}
                              placeholder="0.00"
                              className={`w-24 text-center py-3 border-2 dark:border-gray-700 rounded-2xl text-lg font-black outline-none focus:ring-4 focus:ring-indigo-100 dark:focus-within:ring-indigo-900 transition-all print:border-none print:text-black print:bg-white ${scoreColor(inputScores[i]?.score || "")}`}
                            />
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-indigo-50/50 dark:bg-indigo-900/20 print:bg-white print:border-t-2 print:border-black">
                        <td className="px-8 py-6 text-right print:px-4 print:py-4">
                          <span className="text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest print:text-black">Average Score</span>
                        </td>
                        <td className="px-8 py-6 text-center print:px-4 print:py-4">
                          <div className="flex flex-col items-center">
                            <span className={`text-2xl font-black print:text-black ${getLevelLabel(currentFormAverage).color}`}>
                              {currentFormAverage}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase mt-1 print:text-gray-600">
                              {getLevelLabel(currentFormAverage).label}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Mobile View: Cards */}
                <div className="sm:hidden p-4 space-y-6 print:hidden">
                  {scoreForm.rubrics.map((r: any, i: number) => (
                    <div key={r.rubric_id} className="space-y-3 p-4 bg-gray-50/50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{r.rubric_name}</p>
                      </div>
                      <textarea
                        value={inputScores[i]?.description_subject || ""}
                        onChange={(e) => handleScoreChange(i, 'description_subject', e.target.value)}
                        placeholder="Masukkan deskripsi kriteria..."
                        className="w-full text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none transition-all"
                        rows={3}
                      />
                      <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Level Skor (1-3)</p>
                        <input
                          type="number"
                          step="0.01" min="1" max="3"
                          value={inputScores[i]?.score || ""}
                          onChange={(e) => handleScoreChange(i, 'score', e.target.value)}
                          placeholder="0.00"
                          className={`w-24 text-center py-2.5 border-2 dark:border-gray-700 rounded-xl text-lg font-black outline-none ${scoreColor(inputScores[i]?.score || "")}`}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="bg-indigo-600 dark:bg-indigo-500 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-1">Average Score</p>
                      <p className="text-xs font-bold">{getLevelLabel(currentFormAverage).label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black">{currentFormAverage}</p>
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
                    <p className="text-[11px] font-bold text-gray-700 dark:text-gray-500">{profile.name}</p>
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
        )
      )}
    </div>
  );
}
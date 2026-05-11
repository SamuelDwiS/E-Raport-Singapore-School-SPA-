"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import api from '@/lib/axios';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Helpers ───────────────────────────────────────────────────────────
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
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  
  const [saved, setSaved] = useState(false);
  const [inputScores, setInputScores] = useState<any[]>([]); // Flat array for all criteria

  const studentId = searchParams.get('student');
  const subjectId = searchParams.get('subject');

  useEffect(() => {
    if (!studentId || !subjectId) {
      router.replace('/teacher/students');
    }
  }, [studentId, subjectId, router]);

  const { data: profile } = useQuery({
    queryKey: ['teacher-profile'],
    queryFn: async () => {
      const res = await api.get('/teacher/profile');
      return res.data.data;
    }
  });

  const { data: scoreForm, isLoading } = useQuery({
    queryKey: ['score-form', subjectId, studentId],
    queryFn: async () => {
      const res = await api.get(`/teacher/subjects/${subjectId}/students/${studentId}/scores`);
      const data = res.data.data;
      
      // Initialize flat input state from nested rubrics
      const initialFormState: any[] = [];
      data.rubrics.forEach((r: any) => {
        r.criteria.forEach((c: any) => {
          initialFormState.push({
            criteria_id: c.criteria_id,
            score: c.current_score || '',
            description_subject: c.description_subject || ''
          });
        });
      });
      setInputScores(initialFormState);
      
      return data;
    },
    enabled: !!studentId && !!subjectId
  });

  const scoreMutation = useMutation({
    mutationFn: async (payload: any) => {
      return api.post(`/teacher/subjects/${subjectId}/students/${studentId}/scores`, payload);
    },
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ['teacher-students'] });
      setTimeout(() => { 
        setSaved(false); 
        router.push('/teacher/students');
      }, 1500);
    },
    onError: (err) => {
      console.error("Gagal simpan nilai", err);
      alert('Gagal menyimpan nilai. Pastikan input angka yang valid (1.00 - 3.00)');
    }
  });

  const handleScoreChange = (criteriaId: number, field: string, value: string) => {
    setInputScores(prev => prev.map(item => 
      item.criteria_id === criteriaId ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    const payload = {
      academic_year: "2024/2025",
      scores: inputScores.map(i => ({ ...i, score: String(i.score).replace(',', '.') }))
    };
    scoreMutation.mutate(payload);
  };

  const currentFormAverage = useMemo(() => {
    const vals = inputScores.map(i => parseFloat(i.score || "0")).filter(v => v > 0);
    if (vals.length === 0) return "—";
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
  }, [inputScores]);

  if (isLoading || !studentId) return <div className="p-20 text-center text-indigo-600 font-bold animate-pulse">Menyiapkan Lembar Penilaian Sub-Kriteria...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Input Nilai Per Kriteria</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{profile?.name || "Teacher"}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => router.replace('/teacher/students')} 
            className="text-sm font-bold bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
          >
            ← Kembali ke Daftar
          </button>
        </div>
      </div>

      {scoreForm && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Header Data Murid */}
            <div className="p-6 md:p-8 bg-indigo-900 dark:bg-indigo-950 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-indigo-400">
                        <Image src="/images/user/owner.jpg" width={64} height={64} alt="Student" />
                    </div>
                    <div>
                        <p className="text-indigo-300 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{scoreForm.subject.level_class} • {scoreForm.subject.term}</p>
                        <h2 className="text-3xl font-black">{scoreForm.student.name_student}</h2>
                        <p className="text-indigo-200 dark:text-indigo-300 text-sm mt-1 font-medium italic">"{scoreForm.subject.category_subject}"</p>
                    </div>
                </div>
                <div className="md:text-right hidden md:block">
                    <p className="text-indigo-300 text-[10px] font-bold uppercase mb-1">Rata-rata Saat Ini</p>
                    <p className="text-4xl font-black">{currentFormAverage}</p>
                </div>
              </div>
            </div>

            {/* List Penilaian (Nested) */}
            <div className="p-0">
                {scoreForm.rubrics.map((rubric: any) => (
                    <div key={rubric.rubric_id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                        {/* Judul Kategori (Parent) */}
                        <div className="bg-gray-50/50 dark:bg-gray-900/30 px-8 py-4 flex items-center gap-3">
                            <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                            <h3 className="font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest text-xs">{rubric.rubric_name}</h3>
                        </div>

                        {/* Baris Kriteria (Children) */}
                        <div className="divide-y divide-gray-50 dark:divide-gray-800">
                            {rubric.criteria.map((c: any) => {
                                const currentInput = inputScores.find(i => i.criteria_id === c.criteria_id);
                                return (
                                    <div key={c.criteria_id} className="px-8 py-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50/30 dark:hover:bg-indigo-900/10 transition-all group">
                                        <div className="flex-1 space-y-3">
                                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {c.criteria_name}
                                            </p>
                                            <textarea 
                                                value={currentInput?.description_subject || ""}
                                                onChange={(e) => handleScoreChange(c.criteria_id, 'description_subject', e.target.value)}
                                                placeholder="Berikan catatan spesifik untuk indikator ini..."
                                                className="w-full text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                                                rows={2}
                                            />
                                        </div>
                                        <div className="flex flex-col items-center justify-center min-w-[120px] gap-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase">Skor (1-3)</label>
                                            <input 
                                                type="number"
                                                step="0.01" min="1" max="3"
                                                value={currentInput?.score || ""}
                                                onChange={(e) => handleScoreChange(c.criteria_id, 'score', e.target.value)}
                                                placeholder="0.00"
                                                className={`w-24 text-center py-3 border-2 dark:border-gray-700 rounded-2xl text-lg font-black outline-none transition-all ${scoreColor(currentInput?.score || "")}`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Summary & Save */}
            <div className="p-8 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Final Grade</p>
                  <p className={`text-3xl font-black ${getLevelLabel(currentFormAverage).color}`}>{currentFormAverage}</p>
                </div>
                <div className="h-10 w-[1px] bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
                <div className="hidden md:block">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Predikat</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{getLevelLabel(currentFormAverage).label}</p>
                </div>
              </div>
              <button 
                onClick={handleSave} 
                disabled={scoreMutation.isPending}
                className={`w-full md:w-auto px-12 py-4 rounded-2xl font-black text-sm tracking-widest transition-all shadow-xl active:scale-95 ${saved ? 'bg-emerald-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-none'} ${scoreMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {scoreMutation.isPending ? "MEMPROSES..." : (saved ? "✓ NILAI TERSIMPAN" : "KONFIRMASI & SIMPAN NILAI")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
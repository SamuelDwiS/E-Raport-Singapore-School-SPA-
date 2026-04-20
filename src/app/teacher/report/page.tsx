"use client";
import React, { useState, useCallback } from "react";

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

// ─── Subject Master Data (based on Excel template) ────────────────────────────
const SUBJECTS: Subject[] = [
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
  {
    id: "math",
    name: "Mathematics",
    teacher: "Mr Budi Santoso",
    criteria: [
      { id: "ma1", description: "Demonstrates understanding of number concepts" },
      { id: "ma2", description: "Applies mathematical skills to solve problems" },
      { id: "ma3", description: "Shows logical thinking and reasoning" },
    ],
  },
];

const CLASSES = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"];

const INITIAL_STUDENTS: Student[] = [
  { id: "1", name: "Adrian Li Preman",  nis: "85448598001", grades: {}, keterangan: "" },
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
  if (isNaN(v) || avg === "—") return { label: "—", color: "text-gray-400" };
  if (v >= 2.5)  return { label: "Exceeding Expectations", color: "text-emerald-600 dark:text-emerald-400" };
  if (v >= 2.0)  return { label: "Meeting Expectations",  color: "text-blue-600 dark:text-blue-400" };
  return            { label: "Improving",               color: "text-amber-600 dark:text-amber-400" };
}

function scoreColor(val: string): string {
  const v = parseFloat(val);
  if (isNaN(v) || val === "") return "";
  if (v >= 2.5) return "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20";
  if (v >= 2.0) return "border-blue-400 bg-blue-50 dark:bg-blue-900/20";
  return "border-amber-400 bg-amber-50 dark:bg-amber-900/20";
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function LevelBadge({ avg }: { avg: string }) {
  const { label, color } = getLevelLabel(avg);
  return <span className={`text-xs font-semibold ${color}`}>{label}</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TeacherReportPage() {
  const [selectedClass,   setSelectedClass]   = useState(CLASSES[1]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0].id);
  const [students,        setStudents]        = useState<Student[]>(INITIAL_STUDENTS);
  const [editingId,       setEditingId]       = useState<string | null>(null);
  const [showAddForm,     setShowAddForm]     = useState(false);
  const [newStudent,      setNewStudent]      = useState({ name: "", nis: "" });
  const [saved,           setSaved]           = useState(false);
  const [term,            setTerm]            = useState("Term 1");
  const [year,            setYear]            = useState("2024 - 2025");

  const subject = SUBJECTS.find((s) => s.id === selectedSubject)!;

  // ── Grade update ─────────────────────────────────────────────────────────────
  const updateGrade = useCallback(
    (studentId: string, criterionId: string, value: string) => {
      // Allow only numbers with up to 2 decimal places between 1.00–3.00
      const cleaned = value.replace(/[^0-9.]/g, "");
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? { ...s, grades: { ...s.grades, [criterionId]: cleaned } }
            : s
        )
      );
    },
    []
  );

  const updateKeterangan = useCallback((studentId: string, value: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, keterangan: value } : s))
    );
  }, []);

  // ── Add student ──────────────────────────────────────────────────────────────
  const handleAddStudent = () => {
    if (!newStudent.name.trim() || !newStudent.nis.trim()) return;
    setStudents((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newStudent.name.trim(), nis: newStudent.nis.trim(), grades: {}, keterangan: "" },
    ]);
    setNewStudent({ name: "", nis: "" });
    setShowAddForm(false);
  };

  // ── Delete student ───────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    // TODO: integrate with API
    console.log("Saved:", { class: selectedClass, subject: selectedSubject, students });
  };

  // ─ Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Input Nilai Siswa</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Guru Mata Pelajaran · {subject.teacher}
          </p>
        </div>

        {/* Term & Year badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-brand-500"
          >
            {["Term 1", "Term 2", "Term 3"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-brand-500 w-32"
            placeholder="2024 - 2025"
          />
        </div>
      </div>

      {/* ── Filter Row ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Kelas / Year
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500 min-w-[130px]"
          >
            {CLASSES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Mata Pelajaran / Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500 min-w-[280px]"
          >
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Siswa
          </button>
        </div>
      </div>

      {/* ── Main Card ──────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] overflow-hidden shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
              Daftar Siswa &amp; Nilai
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {selectedClass} · {subject.name} · {term} {year}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-brand-500 hover:bg-brand-600 text-white"
              }`}
            >
              {saved ? "✓ Tersimpan!" : "Simpan Nilai"}
            </button>
            <button className="px-4 py-2 rounded-xl border border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-sm font-semibold transition">
              Unggah Excel
            </button>
          </div>
        </div>

        {/* Level Legend */}
        <div className="flex flex-wrap gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-900/40 border-b border-gray-100 dark:border-gray-800 text-xs">
          <span className="font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Level Scale:</span>
          <span className="text-amber-600 dark:text-amber-400 font-medium">[1.00 – 1.99] Improving</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">[2.00 – 2.49] Meeting Expectations</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">[2.50 – 3.00] Exceeding Expectations</span>
        </div>

        {/* ── Table ───────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/30">
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap w-8">#</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap min-w-[160px]">Nama Siswa</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">NIS</th>
                {subject.criteria.map((c, i) => (
                  <th key={c.id} className="px-3 py-3 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap text-center min-w-[90px]">
                    Kriteria {i + 1}
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-center whitespace-nowrap">Avg</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap min-w-[200px]">Keterangan</th>
                <th className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 text-center">Aksi</th>
              </tr>
              {/* Criteria descriptions sub-header */}
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-blue-50/40 dark:bg-blue-900/10">
                <td className="px-5 py-2" />
                <td className="px-4 py-2 text-xs text-gray-400 italic">Deskripsi Kriteria:</td>
                <td className="px-4 py-2" />
                {subject.criteria.map((c) => (
                  <td key={c.id} className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 italic text-center leading-tight">
                    {c.description}
                  </td>
                ))}
                <td colSpan={3} />
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {students.map((student, idx) => {
                const avg = calcAverage(student.grades, subject.criteria);
                const isEditing = editingId === student.id;
                return (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      isEditing
                        ? "bg-blue-50/60 dark:bg-blue-900/10"
                        : "hover:bg-gray-50/60 dark:hover:bg-gray-800/30"
                    }`}
                  >
                    {/* # */}
                    <td className="px-5 py-3 text-gray-400 dark:text-gray-600 text-xs">{idx + 1}</td>

                    {/* Nama */}
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/80 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          className="border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm bg-white dark:bg-gray-900 dark:text-gray-200 w-full outline-none focus:ring-2 focus:ring-brand-400"
                          value={student.name}
                          onChange={(e) =>
                            setStudents((prev) =>
                              prev.map((s) => s.id === student.id ? { ...s, name: e.target.value } : s)
                            )
                          }
                        />
                      ) : (
                        student.name
                      )}
                    </td>

                    {/* NIS */}
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs whitespace-nowrap">
                      {isEditing ? (
                        <input
                          className="border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm bg-white dark:bg-gray-900 dark:text-gray-200 w-28 outline-none focus:ring-2 focus:ring-brand-400 font-mono"
                          value={student.nis}
                          onChange={(e) =>
                            setStudents((prev) =>
                              prev.map((s) => s.id === student.id ? { ...s, nis: e.target.value } : s)
                            )
                          }
                        />
                      ) : (
                        student.nis
                      )}
                    </td>

                    {/* Grade inputs per criterion */}
                    {subject.criteria.map((c) => (
                      <td key={c.id} className="px-3 py-3 text-center">
                        <input
                          type="text"
                          inputMode="decimal"
                          maxLength={4}
                          value={student.grades[c.id] ?? ""}
                          onChange={(e) => updateGrade(student.id, c.id, e.target.value)}
                          placeholder="—"
                          className={`w-16 text-center border rounded-lg px-2 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-400 transition dark:bg-gray-900 dark:text-gray-200 ${scoreColor(student.grades[c.id] ?? "")}`}
                        />
                      </td>
                    ))}

                    {/* Average */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={`text-sm font-bold ${getLevelLabel(avg).color}`}>{avg}</span>
                        <LevelBadge avg={avg} />
                      </div>
                    </td>

                    {/* Keterangan */}
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={student.keterangan}
                        onChange={(e) => updateKeterangan(student.id, e.target.value)}
                        placeholder="Tambahkan keterangan..."
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-brand-400 placeholder:text-gray-300 dark:placeholder:text-gray-600"
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {isEditing ? (
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition"
                        >
                          ✓ Done
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditingId(student.id)}
                            title="Edit"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-3z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            title="Hapus"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 0h10" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* ── Add Student Form Row ────────────────────────────────────── */}
              {showAddForm && (
                <tr className="bg-blue-50/40 dark:bg-blue-900/10">
                  <td className="px-5 py-3 text-gray-400 text-xs">{students.length + 1}</td>
                  <td className="px-4 py-3">
                    <input
                      autoFocus
                      value={newStudent.name}
                      onChange={(e) => setNewStudent((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Nama Siswa"
                      className="w-full border border-blue-300 dark:border-blue-700 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-900 dark:text-gray-200 outline-none focus:ring-2 focus:ring-brand-400"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      value={newStudent.nis}
                      onChange={(e) => setNewStudent((p) => ({ ...p, nis: e.target.value }))}
                      placeholder="NIS"
                      className="w-28 font-mono border border-blue-300 dark:border-blue-700 rounded-lg px-2 py-1.5 text-sm bg-white dark:bg-gray-900 dark:text-gray-200 outline-none focus:ring-2 focus:ring-brand-400"
                    />
                  </td>
                  {subject.criteria.map((c) => (
                    <td key={c.id} className="px-3 py-3 text-center">
                      <div className="w-16 h-8 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 mx-auto" />
                    </td>
                  ))}
                  <td colSpan={3} className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddStudent}
                        className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg transition"
                      >
                        Tambah
                      </button>
                      <button
                        onClick={() => { setShowAddForm(false); setNewStudent({ name: "", nis: "" }); }}
                        className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 text-gray-500 text-xs font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        Batal
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* ── Class Average Row ───────────────────────────────────────── */}
              {students.length > 0 && (
                <tr className="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/40">
                  <td colSpan={3} className="px-5 py-3 font-bold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                    Class Average
                  </td>
                  {subject.criteria.map((c) => {
                    const vals = students
                      .map((s) => parseFloat(s.grades[c.id] || "0"))
                      .filter((v) => v > 0);
                    const avg = vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : "—";
                    return (
                      <td key={c.id} className="px-3 py-3 text-center">
                        <span className={`text-sm font-bold ${getLevelLabel(avg).color}`}>{avg}</span>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center">
                    {(() => {
                      const allAvgs = students
                        .map((s) => parseFloat(calcAverage(s.grades, subject.criteria)))
                        .filter((v) => !isNaN(v));
                      const classAvg = allAvgs.length > 0
                        ? (allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length).toFixed(2)
                        : "—";
                      return (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className={`text-sm font-bold ${getLevelLabel(classAvg).color}`}>{classAvg}</span>
                          <LevelBadge avg={classAvg} />
                        </div>
                      );
                    })()}
                  </td>
                  <td colSpan={2} />
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            {students.length} siswa · {subject.name} · {selectedClass}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm ${
                saved ? "bg-emerald-500 text-white" : "bg-brand-500 hover:bg-brand-600 text-white"
              }`}
            >
              {saved ? "✓ Tersimpan!" : "Simpan Nilai"}
            </button>
            <button className="px-4 py-2 rounded-xl border border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-sm font-semibold transition">
              Unggah Excel
            </button>
          </div>
        </div>
      </div>

      {/* ── Criteria Detail Card ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-4 text-sm uppercase tracking-wide">
          Kriteria Penilaian — {subject.name}
        </h3>
        <div className="space-y-2">
          {subject.criteria.map((c, i) => (
            <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/40">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{c.description}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
          </svg>
          Nilai diinput dalam rentang 1.00 – 3.00. Sistem akan otomatis menghitung rata-rata (Average) per siswa.
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function MentorDashboard() {
  // Data dummy
  const stats = [
    { label: "Total Siswa", value: "24", color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-900/30" },
    { label: "Deskripsi Selesai", value: "18", color: "text-success-600 dark:text-success-400", bg: "bg-success-50 dark:bg-success-900/30" },
    { label: "Perlu Catatan", value: "6", color: "text-warning-600 dark:text-warning-400", bg: "bg-warning-50 dark:bg-warning-900/30" },
  ];

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Welcome Banner */}
      <div className="bg-brand-500 dark:bg-brand-700 rounded-[2rem] p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Halo, Mentor! 👋</h1>
        <p className="opacity-90 max-w-md">
          Selamat datang di dashboard mentor anda.
        </p>
        {/* <button className="mt-6 bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all">
          Lengkapi Sekarang
        </button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-1 transition-colors">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
            <h3 className={`text-3xl font-bold ${item.color}`}>{item.value}</h3>
            <div className={`h-1 w-12 mt-2 rounded-full ${item.bg.replace('bg-', 'bg-opacity-50 bg-')}`}></div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Daftar Update */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 transition-colors">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Aktivitas Terbaru Guru Mapel</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-50 dark:border-gray-700 last:border-0 transition-colors gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/50 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold shrink-0">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Siswa Ke-{i}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-italic">Nilai Raport telah diperbarui</p>
                  </div>
                </div>
                <button className="w-full sm:w-auto text-xs font-bold text-brand-600 dark:text-brand-400 border border-brand-500 dark:border-brand-400 px-3 py-2 sm:py-1 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors">
                  Cek Nilai
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Info Semester */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 transition-colors">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Info Akademik</h3>
          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-transparent dark:border-gray-700 transition-colors">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Tahun Ajaran</p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">2026 / 2027</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-transparent dark:border-gray-700 transition-colors">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Term</p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">2</p>
            </div>
            <div className="p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning-100 dark:border-warning-900/30 rounded-xl mt-4 transition-colors">
              <p className="text-xs text-warning-700 dark:text-warning-400 leading-snug">
                <strong>Catatan:</strong> Batas pengisian deskripsi adalah 3 hari sebelum pembagian raport.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
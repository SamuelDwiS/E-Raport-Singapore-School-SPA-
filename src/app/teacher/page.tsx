import React from 'react';

export default function MentorDashboard() {
  // Data dummy
  const stats = [
    { label: "Total Siswa", value: "24", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
    { label: "Total Subject", value: "18", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/30" },
    { label: "Total Kelas", value: "6", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/30" },
    { label: "Belum di nilai", value: "4", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/30" },
  ];

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white/90">Halo, Teacher! 👋</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Selamat datang di dashboard Teacher anda.
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
              <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-700 last:border-0 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Siswa Ke-{i}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-italic">Nilai Raport telah diperbarui</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 px-3 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
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
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Years</p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">1</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-transparent dark:border-gray-700 transition-colors">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Term</p>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-200">2</p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 rounded-xl mt-4 transition-colors">
              <p className="text-xs text-orange-700 dark:text-orange-400 leading-snug">
                <strong>Catatan:</strong> Batas pengisian deskripsi adalah 3 hari sebelum pembagian raport.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
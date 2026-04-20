import React from 'react';

export default function MentorDashboard() {
  // Data dummy
  const stats = [
    { label: "Total Siswa", value: "24", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Deskripsi Selesai", value: "18", color: "text-green-600", bg: "bg-green-50" },
    { label: "Perlu Catatan", value: "6", color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Welcome Banner */}
      <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-lg">
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
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-500">{item.label}</p>
            <h3 className={`text-3xl font-bold ${item.color}`}>{item.value}</h3>
            <div className={`h-1 w-12 mt-2 rounded-full ${item.bg.replace('bg-', 'bg-opacity-50 bg-')}`}></div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Daftar Update */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 mb-4">Aktivitas Terbaru Guru Mapel</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                    S
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Siswa Ke-{i}</p>
                    <p className="text-xs text-gray-500 font-italic">Nilai Raport telah diperbarui</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-indigo-600 border border-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-50">
                  Cek Nilai
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Info Semester */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Info Akademik</h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Tahun Ajaran</p>
              <p className="text-sm font-bold text-gray-700">2026 / 2027</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Term</p>
              <p className="text-sm font-bold text-gray-700">2</p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl mt-4">
              <p className="text-xs text-orange-700 leading-snug">
                <strong>Catatan:</strong> Batas pengisian deskripsi adalah 3 hari sebelum pembagian raport.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
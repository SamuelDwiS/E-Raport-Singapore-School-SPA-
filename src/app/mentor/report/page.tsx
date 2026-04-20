import React from 'react';

export default function MentorReportPage() {
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
          <h1 className="text-2xl font-bold text-gray-800">Laporan Hasil Belajar</h1>
          <p className="text-sm text-gray-500">Pilih siswa untuk mengisi deskripsi raport.</p>
        </div>
        
        {/* Filter & Search Sederhana */}
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Cari nama siswa..." 
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Tabel Siswa */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500">NIS</th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500">Nama Siswa</th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500">Kelas</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500">Terms</th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500">Status</th>
              <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">{student.nis}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-800">{student.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.class}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.Terms}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    student.status === 'Lengkap' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all">
                    Detail Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Informasi Tambahan */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">!</div>
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>Tips:</strong> Tombol "Isi Deskripsi" akan membawa Anda ke halaman detail raport siswa. Pastikan nilai dari Guru Mapel sudah lengkap sebelum memfinalisasi deskripsi.
        </p>
      </div>
    </div>
  );
}
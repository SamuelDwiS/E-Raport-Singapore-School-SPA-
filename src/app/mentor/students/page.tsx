"use client";
import React, { useState } from 'react';

const CLASSES = Array.from({ length: 12 }, (_, i) => `Year ${i + 1}`);

type Student = {
  id: number;
  nis: string;
  name: string;
  year: string;
  gender: string;
  address: string;
  mentor: string;
};

export default function MentorStudentsPage() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Adrian Li Preman", nis: "2324001", year: "Year 2", gender: "Laki-laki", address: "Jl. Contoh No. 1", mentor: "Pak Budi" },
    { id: 2, name: "Budi Setiawan", nis: "2324002", year: "Year 2", gender: "Laki-laki", address: "Jl. Contoh No. 2", mentor: "Pak Budi" },
    { id: 3, name: "Citra Lestari", nis: "2324003", year: "Year 2", gender: "Perempuan", address: "Jl. Contoh No. 3", mentor: "Pak Budi" },
    { id: 4, name: "Deni Ramadhan", nis: "2324004", year: "Year 3", gender: "Laki-laki", address: "Jl. Contoh No. 4", mentor: "Pak Budi" },
  ]);

  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nis: '', name: '', year: 'Year 1', gender: 'Laki-laki', address: '', mentor: '' });

  // Filtering
  const filteredStudents = students.filter(student => {
    const matchYear = selectedYear ? student.year === selectedYear : true;
    const matchSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        student.nis.toLowerCase().includes(searchTerm.toLowerCase());
    return matchYear && matchSearch;
  });

  // Handlers
  const openAddModal = () => {
    setEditingId(null);
    setFormData({ nis: '', name: '', year: 'Year 1', gender: 'Laki-laki', address: '', mentor: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingId(student.id);
    setFormData({ nis: student.nis, name: student.name, year: student.year, gender: student.gender, address: student.address, mentor: student.mentor });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Apakah anda yakin ingin menghapus data siswa ini?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setStudents(students.map(s => s.id === editingId ? { ...s, ...formData } : s));
    } else {
      const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
      setStudents([...students, { id: newId, ...formData }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Data Siswa</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola data siswa yang dipantau mentor.</p>
        </div>

        {/* Filter, Search, Action */}
        <div className="flex items-center gap-2 flex-wrap">
          <select 
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Semua Year</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input 
            type="text" 
            placeholder="Cari NIS / Nama..." 
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={openAddModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all ml-auto md:ml-0 shadow-sm"
          >
            + Tambah Siswa
          </button>
        </div>
      </div>

      {/* Tabel Siswa */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">NIS</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Nama Siswa</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Year</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Gender</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Address</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Mentor</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-indigo-900/20 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.nis}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-200">{student.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      {student.year}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.gender}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.address}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.mentor}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => openEditModal(student)}
                        className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-all border border-amber-200 dark:border-amber-800"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 dark:hover:bg-red-900/60 transition-all border border-red-200 dark:border-red-800"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Tidak ada data siswa yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 dark:border-gray-700 flex flex-col max-h-full">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {editingId ? "Edit Data Siswa" : "Tambah Siswa Baru"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Tutup"
              >
                ✕
              </button>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">NIS</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors dark:text-white"
                      placeholder="Masukkan NIS..."
                      value={formData.nis}
                      onChange={(e) => setFormData({...formData, nis: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nama Siswa</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors dark:text-white"
                      placeholder="Masukkan nama lengkap siswa..."
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Year / Kelas</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors dark:text-white"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                    >
                      {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors dark:text-white"
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Address</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors dark:text-white"
                      placeholder="Masukkan alamat..."
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Mentor</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors dark:text-white"
                      placeholder="Masukkan nama mentor..."
                      value={formData.mentor}
                      onChange={(e) => setFormData({...formData, mentor: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-2 flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
                  >
                    {editingId ? "Simpan Perubahan" : "Tambahkan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

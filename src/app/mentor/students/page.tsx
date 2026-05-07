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
  parent: string;
};

export default function MentorStudentsPage() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Adrian Li Preman", nis: "2324001", year: "Year 2", gender: "Laki-laki", address: "Jl. Contoh No. 1", parent: "Pak Budi" },
    { id: 2, name: "Budi Setiawan", nis: "2324002", year: "Year 2", gender: "Laki-laki", address: "Jl. Contoh No. 2", parent: "Pak Budi" },
    { id: 3, name: "Citra Lestari", nis: "2324003", year: "Year 2", gender: "Perempuan", address: "Jl. Contoh No. 3", parent: "Pak Budi" },
    { id: 4, name: "Deni Ramadhan", nis: "2324004", year: "Year 3", gender: "Laki-laki", address: "Jl. Contoh No. 4", parent: "Pak Budi" },
  ]);

  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nis: '', name: '', year: 'Year 1', gender: 'Laki-laki', address: '', parent: '' });

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
    setFormData({ nis: '', name: '', year: 'Year 1', gender: 'Laki-laki', address: '', parent: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingId(student.id);
    setFormData({ nis: student.nis, name: student.name, year: student.year, gender: student.gender, address: student.address, parent: student.parent });
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
          <p className="text-sm text-gray-500 dark:text-gray-400">Kelola data siswa yang dipantau parent.</p>
        </div>

        {/* Filter, Search, Action */}
        <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-3">
          <select 
            className="w-full md:w-auto px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Semua Year</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input 
            type="text" 
            placeholder="Cari NIS / Nama..." 
            className="w-full md:w-auto px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={openAddModal}
            className="w-full md:w-auto bg-brand-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-brand-600 transition-all shadow-sm"
          >
            + Tambah Siswa
          </button>
        </div>
      </div>

      {/* Tabel Siswa */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
        {/* Desktop View: Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">NIS</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Nama Siswa</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Year</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Gender</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Address</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">parent</th>
                <th className="px-6 py-4 text-xs uppercase font-bold text-gray-500 dark:text-gray-400 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                <tr key={`desktop-${student.id}`} className="hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.nis}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-200">{student.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400">
                      {student.year}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.gender}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.address}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{student.parent}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => openEditModal(student)}
                        className="bg-warning-100 dark:bg-warning-900/40 text-warning-700 dark:text-warning-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-warning-200 dark:hover:bg-warning-900/60 transition-all border border-warning-200 dark:border-warning-800"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="bg-error-100 dark:bg-error-900/40 text-error-700 dark:text-error-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-error-200 dark:hover:bg-error-900/60 transition-all border border-error-200 dark:border-error-800"
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

        {/* Mobile View: Cards */}
        <div className="lg:hidden divide-y divide-gray-50 dark:divide-gray-700">
          {filteredStudents.length > 0 ? filteredStudents.map((student) => (
            <div key={`mobile-${student.id}`} className="p-5 space-y-4 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 leading-tight">{student.name}</h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-1">NIS: {student.nis} • {student.year}</p>
                </div>
                <span className="px-2 py-1 rounded-lg text-[9px] font-black uppercase bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400">
                  {student.gender}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Address</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">{student.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => openEditModal(student)}
                  className="bg-warning-500 text-white py-2.5 rounded-xl text-xs font-bold active:scale-[0.98] transition-all"
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => handleDelete(student.id)}
                  className="bg-error-500 text-white py-2.5 rounded-xl text-xs font-bold active:scale-[0.98] transition-all"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          )) : (
            <div className="p-10 text-center text-gray-500 dark:text-gray-400">
               Tidak ada data siswa yang ditemukan.
            </div>
          )}
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
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors dark:text-white"
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
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors dark:text-white"
                      placeholder="Masukkan nama lengkap siswa..."
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Year / Kelas</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors dark:text-white"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                    >
                      {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                    <select 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors dark:text-white"
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
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors dark:text-white"
                      placeholder="Masukkan alamat..."
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">parent</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors dark:text-white"
                      placeholder="Masukkan nama parent..."
                      value={formData.parent}
                      onChange={(e) => setFormData({...formData, parent: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-2 flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-sm transition-colors"
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

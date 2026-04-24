  "use client"
import React from 'react'
import StatisticGrade from './components/StatisticGrade'

const ParentDashboard = () => {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Baris 1: Sambutan + Catatan Wali Kelas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kolom kiri: Sambutan & Ringkasan Nilai */}
        <div className="md:col-span-2 space-y-6">
          {/* Sambutan */}
          <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Selamat Datang, Budi!</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Selamat datang Tatang, Wali Murid</p>
          </div>

          {/* Ringkasan Nilai & Performa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ringkasan Nilai */}
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-3">Ringkasan Nilai Terbaru</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">Math A</span>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">Science A</span>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">Ind B</span>
              </div>
              <div className="text-4xl font-bold text-gray-800 dark:text-white/90">88%</div>
              <div className="text-gray-400 dark:text-gray-500 text-sm mt-1">Rata-rata Nilai</div>
            </div>

            {/* Performa Mata Pelajaran */}
            <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-3">Performa Mata Pelajaran</h3>
              <div className="space-y-3">
                {[
                  { label: "Matematika", value: 88, color: "bg-blue-500" },
                  { label: "IPA", value: 82, color: "bg-indigo-400" },
                  { label: "Bahasa Indonesia", value: 79, color: "bg-violet-400" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                      <span className="font-medium text-gray-800 dark:text-white/80">{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Kolom kanan: Catatan Wali Kelas
        <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm h-fit">
          <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-3">Catatan Wali Kelas</h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
              H
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pak Hartono</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Ananda putri dari Pak Hartono menunjukkan kemajuan akademik yang baik.
            Menunjukkan kebiasaan belajar yang konsisten dan disiplin di kelas.
          </p>
          <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Lihat Raport Lengkap →
          </button>
        </div> */}
      </div>

      {/* Baris 2: Grafik Statistik Nilai – full width */}
      <StatisticGrade />
    </div>
  )
}

export default ParentDashboard
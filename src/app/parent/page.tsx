"use client"
import React from 'react'
import StatisticGrade from './components/StatisticGrade'

const ParentDashboard = () => {
  return (
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Kolom utama */}
      <div className="md:col-span-2 space-y-6">
        {/* Sambutan */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold">Selamat Datang, Budi!</h2>
          <p className="text-gray-500">Selamat datang Tatang, Wali Murid</p>
        </div>
        {/* Ringkasan Nilai & Grafik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-medium mb-2">Ringkasan Nilai Terbaru</h3>
            {/* Subject chips dan average */}
            <div className="flex gap-2 mb-2">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Math A</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Science A</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Ind B</span>
            </div>
            <div className="text-3xl font-bold">88%</div>
            <div className="text-gray-400 text-xs">Average</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <h3 className="font-medium mb-2">Performa Siswa (Matematika & IPA)</h3>
            {/* Placeholder grafik, ganti dengan komponen chart jika ada */}
            <div className="h-32 flex items-center justify-center text-gray-400">[Grafik]</div>
          </div>
        </div>
      </div>
      {/* Kolom samping: Catatan Wali Kelas */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <h3 className="font-medium mb-2">Catatan Wali Kelas</h3>
          <div className="text-sm text-gray-600 mb-2">
            Recent update from Pak Hartono<br />
            Ananda putri dari Pak Hartono menunjukkan kemajuan akademik.<br />
            Menunjukkan kebiasaan baik.
          </div>
          <button className="text-blue-600 font-medium hover:underline">Lihat Raport Lengkap</button>
        </div>  
      </div>
      <StatisticGrade></StatisticGrade>
    </div>
    
  )
}

export default ParentDashboard
"use client"
import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import StatisticGrade from './components/StatisticGrade'
import Link from 'next/link'
// import Skeleton from '@/components/common/Skeleton' // Asumsi ada skeleton loader

const ParentDashboard = () => {
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  // 1. Fetch daftar anak
  const { data: children, isLoading: loadingChildren } = useQuery({
    queryKey: ['parent-children'],
    queryFn: async () => {
      const response = await api.get('/parent/children');
      return response.data.data;
    }
  });

  // Set default child jika data sudah ada
  useEffect(() => {
    if (children && children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].student_id);
    }
  }, [children, selectedChildId]);

  // 2. Fetch Profil User (Orang Tua)
  const { data: userData } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await api.get('/auth/check');
      return response.data.user;
    }
  });

  // 3. Fetch ringkasan raport untuk anak yang dipilih
  const { data: reports, isLoading: loadingReports } = useQuery({
    queryKey: ['student-reports', selectedChildId],
    queryFn: async () => {
      if (!selectedChildId) return null;
      const response = await api.get(`/parent/children/${selectedChildId}/reports`);
      return response.data.data;
    },
    enabled: !!selectedChildId
  });

  const selectedChild = children?.find((c: any) => c.student_id === selectedChildId);
  const parentName = userData?.display_name || userData?.username || 'Wali Murid';

  if (loadingChildren) return <div className="p-6">Loading children data...</div>;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header & Student Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Orang Tua</h1>
          <p className="text-gray-500 dark:text-gray-400">Pantau perkembangan akademik anak Anda</p>
        </div>

        {children && children.length > 1 && (
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 ml-2">Pilih Anak:</span>
            <select 
              value={selectedChildId || ''} 
              onChange={(e) => setSelectedChildId(Number(e.target.value))}
              className="bg-transparent border-none text-sm font-bold text-brand-600 focus:ring-0 cursor-pointer"
            >
              {children.map((child: any) => (
                <option key={child.student_id} value={child.student_id}>
                  {child.name_student}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-400 rounded-2xl p-6 shadow-lg text-white">
            <h2 className="text-xl font-semibold text-white">
              Halo, {parentName}! 👋
            </h2>
            <p className="opacity-90 mt-1">
              Selamat datang di dashboard Orang Tua. Pantau perkembangan {selectedChild?.name_student || 'anak Anda'} di sini.
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-3">Rata-rata Nilai Keseluruhan</h3>
              {loadingReports ? (
                 <div className="h-10 w-24 bg-gray-100 animate-pulse rounded"></div>
              ) : (
                <>
                  <div className="text-4xl font-bold text-brand-600">
                    {reports && reports.length > 0 
                      ? (reports.reduce((acc: number, curr: any) => acc + parseFloat(curr.average_value), 0) / reports.length).toFixed(2)
                      : '0.00'}
                  </div>
                  <div className="text-gray-400 text-sm mt-1">Berdasarkan {reports?.length || 0} Mata Pelajaran</div>
                  {selectedChildId && (
                    <Link 
                      href={`/parent/report?student_id=${selectedChildId}`}
                      className="inline-block mt-4 text-xs font-bold text-brand-600 hover:underline"
                    >
                      Buka Semua Nilai &rarr;
                    </Link>
                  )}
                </>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-3">Status Kehadiran</h3>
              <div className="text-4xl font-bold text-success-600">100%</div>
              <div className="text-gray-400 text-sm mt-1">Hadir Tepat Waktu</div>
            </div>
          </div>
        </div>

        {/* Mentor Note Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm h-fit">
          <h3 className="font-semibold text-gray-800 dark:text-white/90 mb-3">Catatan Mentor (Affective)</h3>
          <div className="space-y-4">
            {reports && reports.length > 0 ? (
              reports.slice(0, 1).map((report: any) => (
                <div key={report.report_id}>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    "{report.mentor_note || 'Belum ada catatan dari mentor untuk periode ini.'}"
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">Belum ada data raport.</p>
            )}
            
            {selectedChildId ? (
              <Link 
                href={`/parent/report?student_id=${selectedChildId}`}
                className="block text-center w-full mt-4 bg-brand-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 shadow-lg shadow-brand-200 transition-all active:scale-[0.98]"
              >
                Lihat Raport Lengkap
              </Link>
            ) : (
              <button disabled className="w-full mt-4 bg-gray-100 text-gray-400 py-2.5 rounded-xl text-sm font-bold cursor-not-allowed">
                Pilih Anak Dahulu
              </button>
            )}
          </div>
        </div>
      </div>

      <StatisticGrade />
    </div>
  )
}

export default ParentDashboard;
# Frontend Context & UI Standards (E-Report)

## 🎨 UI/UX Philosophy
Menciptakan antarmuka yang premium, bersih, dan intuitif. Navigasi harus terasa "mengalir" dan memberikan umpan balik instan (loading states).

## 🚀 Technical Stack
- **Framework**: Next.js (App Router).
- **Data Fetching**: TanStack Query (React Query) untuk caching dan sinkronisasi data API.
- **Styling**: Vanilla CSS / Tailwind (sesuai `cn.ts` utility).
- **Icons**: SVG Icons dari folder `@/icons`.

## 🏛️ Domain Rules & Workflow
1. **Teacher Dashboard**: Pusat kontrol guru untuk memantau nilai.
2. **Siswa & Penilaian**: 
   - Menampilkan daftar murid per Mapel & Term.
   - Status Nilai: **Selesai**, **Draft (dengan % kelengkapan)**, atau **Belum Nilai**.
3. **Perancangan Penilaian (Master Rubrik)**:
   - Guru merancang kategori dan sub-kriteria secara bebas.
   - Perubahan di sini akan otomatis merubah form input nilai siswa.

## 🛠️ Frontend Coding Standards
- **Clean Components**: Pisahkan logika data fetching (TanStack) dari komponen presentasi jika memungkinkan.
- **Loading States**: Gunakan skeleton loaders untuk initial fetch dan `isPending` state pada tombol aksi.
- **Navigation**: Gunakan `router.replace` untuk kembali ke halaman daftar agar tidak meninggalkan history rute detail.
- **Active State**: Sidebar harus tetap menyorot menu yang relevan (misal: tetap menyala di "Siswa & Penilaian" saat membuka form report).

## 🤝 Collaborative Assessment & UI Handling
- **Multi-Teacher UI**: Form penilaian harus mampu menampilkan kriteria dari guru lain dalam satu grup raport yang sama.
- **Read-Only State**: Gunakan atribut `disabled` pada input kriteria yang bukan milik guru tersebut (`is_mine: false`).
- **Visual Distinction**: Berikan indikator visual (seperti warna background berbeda) untuk kriteria yang hanya bersifat "View-Only" bagi guru tersebut.

## 🔗 API Integration
- Semua request menggunakan Axios instance (`@/lib/axios`).
- Gunakan `invalidateQueries` setelah mutasi (simpan/hapus) untuk memastikan data di halaman lain tetap up-to-date.

## Language
- All response and communication must be in **English**.
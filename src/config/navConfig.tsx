import React from "react";
import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ListIcon,
  TableIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  BoxCubeIcon,
} from "@/icons/index";


export type SubItem = {
  name: string;
  path: string;
  badge?: "new" | "pro";
};

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubItem[];
};

export type NavSection = {
  label: string; // 
  items: NavItem[];
};

export type UserRole = "teacher" | "mentor" | "parent";


export const ROLE_META: Record<UserRole, { label: string; basePath: string; color: string }> = {
  teacher: { label: "Guru Mata Pelajaran", basePath: "/teacher", color: "text-blue-500" },
  mentor:  { label: "Wali Kelas",          basePath: "/mentor",  color: "text-emerald-500" },
  parent:  { label: "Wali Murid",          basePath: "/parent",  color: "text-orange-500" },
};


export const NAV_CONFIG: Record<UserRole, NavSection[]> = {

  teacher: [
    {
      label: "Menu",
      items: [
        { name: "Dashboard",      icon: <GridIcon />,       path: "/teacher" },
        {
          name: "Input Nilai",
          icon: <ListIcon />,
          subItems: [
            { name: "Per Mata Pelajaran", path: "/teacher/report" },
            { name: "Riwayat Input",      path: "/teacher/report/history" },
          ],
        },
        { name: "Jadwal",         icon: <CalenderIcon />,   path: "/teacher/schedule" },
        { name: "Profil",         icon: <UserCircleIcon />, path: "/teacher/profile" },
      ],
    },
  ],

  mentor: [
    {
      label: "Menu",
      items: [
        { name: "Dashboard",      icon: <GridIcon />,       path: "/mentor" },
        {
          name: "Raport Kelas",
          icon: <PageIcon />,
          subItems: [
            { name: "Rekap Nilai",       path: "/mentor/report" },
            { name: "Catatan Siswa",     path: "/mentor/notes" },
            { name: "Cetak Raport",      path: "/mentor/report/print" },
          ],
        },
        { name: "Data Siswa",     icon: <TableIcon />,      path: "/mentor/students" },
        { name: "Profil",         icon: <UserCircleIcon />, path: "/mentor/profile" },
      ],
    },
    {
      label: "Komunikasi",
      items: [
        { name: "Pesan",          icon: <BoxCubeIcon />,    path: "/mentor/messages" },
        { name: "Pengumuman",     icon: <PieChartIcon />,   path: "/mentor/announcements" },
      ],
    },
  ],

  parent: [
    {
      label: "Menu",
      items: [
        { name: "Dashboard",      icon: <GridIcon />,       path: "/parent" },
        {
          name: "Grade",
          icon: <PageIcon />,
          subItems: [
            { name: "Lihat Raport",   path: "/parent/report" },
            { name: "Grafik Nilai",   path: "/parent/report/chart" },
          ],
        },
        { name: "Jadwal",         icon: <CalenderIcon />,   path: "/parent/schedule" },
        { name: "Profil",         icon: <UserCircleIcon />, path: "/parent/profile" },
      ],
    },
    {
      label: "Komunikasi",
      items: [
        { name: "Catatan Guru",   icon: <ListIcon />,       path: "/parent/notes" },
      ],
    },
  ],
};

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
  label: string; 
  items: NavItem[];
};

export type UserRole = | "teacher" | "mentor" | "parent";


export const ROLE_META: Record<UserRole, { label: string; basePath: string; color: string }> = {
  teacher: { label: "Teacher", basePath: "/teacher", color: "text-blue-500" },
  mentor:  { label: "Mentor",          basePath: "/mentor",  color: "text-emerald-500" },
  parent:  { label: "Parent Student",          basePath: "/parent",  color: "text-blue-400" },
};


export const NAV_CONFIG: Record<UserRole, NavSection[]> = {

  teacher: [
    {
      label: "Menu",
      items: [
        { name: "Dashboard",      icon: <GridIcon />,       path: "/teacher" },
        {
          name: "Input Nilai",
          icon: <ListIcon />, path: "/teacher/report" 
        },
        { name: "Data Siswa",     icon: <TableIcon />,      path: "/teacher/students" },
      ],
    },
  ],

  mentor: [
    {
      label: "Menu",
      items: [
        { name: "Dashboard",      icon: <GridIcon />,       path: "/mentor" },
        { icon: <ListIcon />, name: "Report", path: "/mentor/report" },
        { name: "Data Siswa",     icon: <TableIcon />,      path: "/mentor/students" },
        // { name: "Profil",         icon: <UserCircleIcon />, path: "/mentor/profile" },
      ],
    },
    // {
    //   label: "Komunikasi",
    //   items: [
    //     { name: "Pesan",          icon: <BoxCubeIcon />,    path: "/mentor/messages" },
    //     { name: "Pengumuman",     icon: <PieChartIcon />,   path: "/mentor/announcements" },
    //   ],
    // },
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
        { name: "Catatan Guru",   icon: <ListIcon />,       path: "/parent/notes" },
        // { name: "Jadwal",         icon: <CalenderIcon />,   path: "/parent/schedule" },
      ],
    },
    // {
    //   label: "Komunikasi",
    //   items: [
        
    //   ],
    // },
  ],
};

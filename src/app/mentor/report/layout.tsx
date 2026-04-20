"use client";

import { useSidebar } from "@/context/SidebarContext";
// import AppHeader from "@/layout/AppHeader";
import SidebarMentor from "../components/SidebarMentor";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <SidebarMentor />
      <Backdrop />
      {/* Main Content Area */}
      <div
        // className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
        // className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >

        <div className="p-4 md:p-6 lg:p-8 mx-auto w-full max-w-7xl">{children}</div>
      </div>
    </div>
  );
}

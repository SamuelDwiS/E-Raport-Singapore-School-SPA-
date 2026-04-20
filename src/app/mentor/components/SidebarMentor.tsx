"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3H8.5V8.5H3V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.5 3H17V8.5H11.5V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 11.5H8.5V17H3V11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.5 11.5H17V17H11.5V11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    name: "Dashboard",
    path: "/mentor",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2.5H14C14.5523 2.5 15 2.94772 15 3.5V16.5C15 17.0523 14.5523 17.5 14 17.5H6C5.44772 17.5 5 17.0523 5 16.5V3.5C5 2.94772 5.44772 2.5 6 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 6H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 9H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    name: "Report",
    path: "/mentor/report",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 3.5H16C16.5523 3.5 17 3.94772 17 4.5V15.5C17 16.0523 16.5523 16.5 16 16.5H4C3.44772 16.5 3 16.0523 3 15.5V4.5C3 3.94772 3.44772 3.5 4 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 7H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 10H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    name: "Notes",
    path: "/mentor/notes",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16.1667 12.5C16.0558 12.7513 16.0226 13.0302 16.0716 13.3005C16.1207 13.5708 16.2496 13.8203 16.4417 14.0167L16.4917 14.0667C16.6467 14.2215 16.7696 14.4053 16.8534 14.6076C16.9373 14.8099 16.9805 15.0268 16.9805 15.2458C16.9805 15.4649 16.9373 15.6817 16.8534 15.8841C16.7696 16.0864 16.6467 16.2702 16.4917 16.425C16.3369 16.58 16.1531 16.7029 15.9507 16.7868C15.7484 16.8706 15.5316 16.9138 15.3125 16.9138C15.0934 16.9138 14.8766 16.8706 14.6743 16.7868C14.4719 16.7029 14.2881 16.58 14.1333 16.425L14.0833 16.375C13.887 16.1829 13.6374 16.054 13.3671 16.005C13.0968 15.9559 12.818 15.9891 12.5667 16.1C12.3203 16.2056 12.1098 16.3806 11.9611 16.604C11.8123 16.8275 11.7319 17.0893 11.7292 17.3583V17.5C11.7292 17.942 11.5536 18.366 11.2411 18.6785C10.9286 18.9911 10.5045 19.1667 10.0625 19.1667C9.62047 19.1667 9.19645 18.9911 8.88389 18.6785C8.57133 18.366 8.39583 17.942 8.39583 17.5V17.425C8.38788 17.1492 8.29955 16.882 8.14133 16.6573C7.98312 16.4326 7.76237 16.2604 7.50417 16.1625C7.25286 16.0516 6.97402 16.0184 6.70375 16.0674C6.43347 16.1165 6.18393 16.2454 5.9875 16.4375L5.9375 16.4875C5.78271 16.6425 5.59888 16.7654 5.39656 16.8493C5.19424 16.9331 4.97738 16.9763 4.75833 16.9763C4.53929 16.9763 4.32243 16.9331 4.12011 16.8493C3.91779 16.7654 3.73396 16.6425 3.57917 16.4875C3.42417 16.3327 3.30127 16.1489 3.21742 15.9466C3.13357 15.7442 3.09038 15.5274 3.09038 15.3083C3.09038 15.0893 3.13357 14.8724 3.21742 14.6701C3.30127 14.4678 3.42417 14.284 3.57917 14.1292L3.62917 14.0792C3.82125 13.8828 3.95022 13.6332 3.99926 13.363C4.0483 13.0927 4.01509 12.8139 3.90417 12.5625C3.79856 12.3161 3.62359 12.1056 3.40013 11.9568C3.17666 11.8081 2.91492 11.7277 2.64583 11.725H2.5C2.05797 11.725 1.63395 11.5494 1.32139 11.2369C1.00883 10.9244 0.833328 10.5003 0.833328 10.0583C0.833328 9.61631 1.00883 9.19229 1.32139 8.87973C1.63395 8.56717 2.05797 8.39167 2.5 8.39167H2.575C2.85083 8.38371 3.11805 8.29539 3.34273 8.13717C3.56742 7.97896 3.73963 7.7582 3.8375 7.5C3.94841 7.24869 3.98163 6.96986 3.93259 6.69958C3.88355 6.4293 3.75458 6.17977 3.5625 5.98333L3.5125 5.93333C3.3575 5.77854 3.2346 5.59471 3.15076 5.39239C3.06691 5.19007 3.02372 4.97321 3.02372 4.75417C3.02372 4.53512 3.06691 4.31826 3.15076 4.11594C3.2346 3.91362 3.3575 3.72979 3.5125 3.575C3.66729 3.42 3.85112 3.2971 4.05344 3.21325C4.25576 3.1294 4.47262 3.08621 4.69166 3.08621C4.91071 3.08621 5.12757 3.1294 5.32989 3.21325C5.53221 3.2971 5.71604 3.42 5.87083 3.575L5.92083 3.625C6.11727 3.81708 6.3668 3.94606 6.63708 3.9951C6.90736 4.04413 7.1862 4.01092 7.4375 3.9H7.5C7.74643 3.79439 7.9569 3.61943 8.10565 3.39596C8.2544 3.1725 8.33479 2.91076 8.3375 2.64167V2.5C8.3375 2.05797 8.513 1.63395 8.82556 1.32139C9.13812 1.00893 9.56214 0.833328 10.0042 0.833328C10.4462 0.833328 10.8702 1.00893 11.1828 1.32139C11.4953 1.63395 11.6708 2.05797 11.6708 2.5V2.575C11.6736 2.84409 11.7539 3.10583 11.9027 3.3293C12.0514 3.55276 12.2619 3.72773 12.5083 3.83333C12.7597 3.94425 13.0385 3.97746 13.3088 3.92842C13.579 3.87939 13.8286 3.75041 14.025 3.55833L14.075 3.50833C14.2298 3.35333 14.4136 3.23043 14.6159 3.14658C14.8182 3.06274 15.0351 3.01954 15.2542 3.01954C15.4732 3.01954 15.6901 3.06274 15.8924 3.14658C16.0947 3.23043 16.2785 3.35333 16.4333 3.50833C16.5883 3.66312 16.7112 3.84696 16.7951 4.04928C16.8789 4.2516 16.9221 4.46846 16.9221 4.6875C16.9221 4.90655 16.8789 5.12341 16.7951 5.32572C16.7112 5.52804 16.5883 5.71188 16.4333 5.86667L16.3833 5.91667C16.1913 6.1131 16.0623 6.36263 16.0132 6.63292C15.9642 6.9032 15.9974 7.18203 16.1083 7.43333V7.5C16.2139 7.74643 16.3889 7.9569 16.6124 8.10565C16.8358 8.2544 17.0976 8.33479 17.3667 8.3375H17.5C17.942 8.3375 18.366 8.513 18.6786 8.82556C18.9911 9.13812 19.1667 9.56214 19.1667 10.0042C19.1667 10.4462 18.9911 10.8702 18.6786 11.1828C18.366 11.4953 17.942 11.6708 17.5 11.6708H17.425C17.1559 11.6736 16.8942 11.7539 16.6707 11.9027C16.4472 12.0514 16.2723 12.2619 16.1667 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    name: "Settings",
    path: "/mentor/settings",
  },
];

const SidebarMentor: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const isActive = useCallback(
    (path: string) => path === pathname,
    [pathname]
  );

  const showText = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 px-5 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/mentor" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 flex-shrink-0">
            S
          </div>
          {showText && (
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              E-Raport
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-2">
        <ul className="flex flex-col gap-1">
          {navItems.map((nav) => (
            <li key={nav.name}>
              <Link
                href={nav.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center lg:px-3"
                      : ""
                  }
                  ${
                    isActive(nav.path)
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                <span
                  className={`flex-shrink-0 ${
                    isActive(nav.path) ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                  }`}
                >
                  {nav.icon}
                </span>
                {showText && <span>{nav.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section */}
      {showText && (
        <div className="px-4 py-6 mt-auto">
          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              E-Raport SPA
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              © 2024 Relig
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SidebarMentor;
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { ADMIN_NAV_ITEMS, isAdminActivePath } from "@/lib/admin-nav";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const showLabels = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed top-0 left-0 z-[99999] flex h-screen flex-col border-r border-gray-200 bg-white px-4 text-gray-900 transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900
        ${isExpanded || isMobileOpen || isHovered ? "w-[260px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex py-8 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/secret/admin" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            P
          </span>
          {showLabels && (
            <span className="text-xl font-semibold text-gray-800 dark:text-white/90">
              PCL Admin
            </span>
          )}
        </Link>
      </div>

      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto pt-4 pb-8 duration-300 ease-linear">
        <nav className="flex flex-1 flex-col gap-2">
          {showLabels ? (
            <ul className="mb-2 flex flex-col gap-0.5 border-b border-gray-200 pb-3 dark:border-gray-800">
              {ADMIN_NAV_ITEMS.map((item) => {
                const active = isAdminActivePath(pathname, item.path);
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`menu-item ${
                        active ? "menu-item-active" : "menu-item-inactive"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          active
                            ? "bg-orange-500"
                            : "border border-gray-400 dark:border-gray-500"
                        }`}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="mb-2 flex flex-col items-center gap-2 border-b border-gray-200 pb-3 dark:border-gray-800">
              {ADMIN_NAV_ITEMS.map((item) => {
                const active = isAdminActivePath(pathname, item.path);
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      title={item.name}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                        active
                          ? "bg-gray-200 dark:bg-white/[0.08]"
                          : "hover:bg-gray-100 dark:hover:bg-white/[0.04]"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          active
                            ? "bg-orange-500"
                            : "border border-gray-400 dark:border-gray-500"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  DoorOpen,
  Wrench,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  UtensilsCrossed,
  BookOpen,
  Zap,
  Ticket,
} from "lucide-react";

const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Operations", href: "/admin/operations", icon: Wrench },
  { label: "Bookings", href: "/admin/bookings", icon: Calendar },
  { label: "Rooms", href: "/admin/rooms", icon: DoorOpen },
  { label: "Experiences", href: "/admin/experiences", icon: Ticket },
  { label: "Menus", href: "/admin/menus", icon: UtensilsCrossed },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Popups", href: "/admin/popups", icon: Zap },
  { label: "Admin System", href: "/admin/users", icon: ShieldCheck },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminProfile, setAdminProfile] = useState<{
    username: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN";
  } | null>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/auth/me", {
          credentials: "include",
        });

        if (!response.ok) {
          router.replace("/admin-login");
          return;
        }

        const data = await response.json();
        setAdminProfile(data.admin || null);
      } catch {
        router.replace("/admin-login");
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.replace("/admin-login");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-300">Checking admin session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-linear-to-b from-gray-950 via-gray-900 to-gray-950 border-r border-gray-800 transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-800 bg-linear-to-r from-blue-900/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              Z
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">ZIBA</h1>
              <p className="text-gray-400 text-xs">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  active
                    ? "bg-linear-to-r from-blue-900 to-blue-800 text-white shadow-lg shadow-blue-900/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {active && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-700 bg-linear-to-t from-gray-800/40 to-transparent space-y-4">
          <div className="px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-2">
              Logged In As
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <div>
                <p className="text-white text-sm font-medium">
                  {adminProfile?.username || "Admin"}
                </p>
                <p className="text-gray-500 text-xs">
                  {adminProfile?.email || "system@ziba.local"}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-900/20 border border-transparent hover:border-red-900/50 transition-all duration-200 font-medium text-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* TopBar */}
        <div className="h-20 bg-linear-to-r from-gray-800 to-gray-900 border-b border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-2xl font-light text-white cormorant">
              Admin Dashboard
            </h2>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            {/* User Profile */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 cursor-pointer transition">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="hidden sm:block text-sm">
                <p className="text-white font-medium">
                  {adminProfile?.username || "Admin"}
                </p>
                <p className="text-gray-400 text-xs">
                  {adminProfile?.role || "ADMIN"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-950">
          <div className="p-6 md:p-8 max-w-full min-h-full bg-gray-950">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          onMenuClick={() =>
            setIsMobileMenuOpen(true)
          }
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 cursor-default bg-black/40"
            onClick={() =>
              setIsMobileMenuOpen(false)
            }
          />

          {/* Sidebar */}
          <div className="relative h-full w-72">
            <AdminSidebar
              mobile
              onClose={() =>
                setIsMobileMenuOpen(false)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Newspaper,
  Tags,
  Settings,
  X,
} from "lucide-react";

import LogoutButton from "@/components/admin/LogoutButton";

type AdminSidebarProps = {
  mobile?: boolean;
  onClose?: () => void;
};

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Articles",
    href: "/admin/articles",
    icon: Newspaper,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  mobile = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={
        mobile
          ? "flex h-full w-72 flex-col bg-white"
          : "hidden min-h-screen w-64 shrink-0 flex-col border-r bg-white lg:flex"
      }
    >
      <div className="flex items-center justify-between border-b px-6 py-5">
        <div>
          <h1 className="text-xl font-bold">
            News Admin
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Content Management
          </p>
        </div>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-gray-100"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="h-4 w-4" />

              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <LogoutButton />
      </div>
    </aside>
  );
}
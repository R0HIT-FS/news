"use client";

import { Menu } from "lucide-react";

type AdminHeaderProps = {
  onMenuClick: () => void;
};

export default function AdminHeader({
  onMenuClick,
}: AdminHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 hover:bg-gray-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-lg font-semibold">
            News Admin
          </h2>

          <p className="hidden text-sm text-gray-500 sm:block">
            Manage your news content
          </p>
        </div>
      </div>

      <span className="text-sm text-gray-500">
        Administrator
      </span>
    </header>
  );
}
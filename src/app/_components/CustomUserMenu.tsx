"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";

export function CustomUserMenu() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full border-2 border-white focus:outline-none transition hover:scale-105"
      >
        <img
          src={user.imageUrl}
          alt="Avatar"
          className="h-10 w-10 rounded-full object-cover"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 rounded-xl bg-white shadow-2xl ring-1 ring-gray-200">
          <div className="border-b px-4 py-3">
            <p className="text-sm font-semibold text-gray-800">
              {user.fullName}
            </p>
            <p className="text-xs text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
          <div className="flex flex-col gap-1 px-2 py-2">
            <Link
              href="/dashboard"
              className="rounded-md px-4 py-2 text-sm text-gray-800 transition hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <SignOutButton>
              <button className="rounded-md px-4 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-100">
                Wyloguj się
              </button>
            </SignOutButton>
          </div>
        </div>
      )}
    </div>
  );
}

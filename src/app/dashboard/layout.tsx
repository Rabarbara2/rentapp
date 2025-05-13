// app/dashboard/layout.tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./sidebar/page";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return <div className="flex h-screen items-center justify-center">Ładowanie...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="rounded-2xl bg-white p-8 shadow-lg">{children}</div>
      </div>
    </div>
  );
}

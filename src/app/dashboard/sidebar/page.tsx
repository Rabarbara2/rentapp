// app/dashboard/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Home, Building, Heart, Settings, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Moje mieszkania", href: "/dashboard/my-listings", icon: Building },
    { name: "Ulubione", href: "/dashboard/saved", icon: Heart },
    { name: "Ustawienia", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-white shadow-lg">
      <div className="flex items-center justify-center p-6">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          RentApp
        </Link>
      </div>
      
      <div className="flex justify-center py-4">
        <UserButton afterSignOutUrl="/" />
      </div>
      
      <nav className="mt-6 flex flex-1 flex-col">
        <ul className="space-y-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const ItemIcon = item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ItemIcon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="mt-auto p-4">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Wyloguj się
        </button>
      </div>
    </div>
  );
}

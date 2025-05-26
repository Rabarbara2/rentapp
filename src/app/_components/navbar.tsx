"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { CustomUserMenu } from "./customUserMenu";

export default function Navbar() {
  return (
    <header className="flex h-16 w-full items-center justify-between bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 text-white shadow-lg">
      <Link href="/" className="text-3xl font-extrabold">
        RentApp
      </Link>
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton>
            <button className="rounded border border-white px-4 py-2 font-medium text-white transition hover:bg-white hover:text-indigo-600">
              Zaloguj
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="rounded border border-white px-4 py-2 font-medium text-white transition hover:bg-white hover:text-indigo-600">
              Zarejestruj
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <CustomUserMenu />
        </SignedIn>
      </div>
    </header>
  );
}

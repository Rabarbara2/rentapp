"use client";

import { useRouter } from "next/navigation";
import TestForm from "~/app/_components/signUpForm";

export default function Signup() {
  const router = useRouter();
  return (
    <div className="min-h- flex w-full flex-col items-center justify-center bg-slate-50">
      <header className="flex h-16 w-full items-center justify-between bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 text-white shadow-lg">
        <h1
          className="text-3xl font-extrabold hover:cursor-pointer"
          onClick={() => router.push("/")}
        >
          RentApp
        </h1>
      </header>
      <div className="">
        <TestForm />
      </div>
    </div>
  );
}

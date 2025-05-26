"use client";
import { SignIn, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import SignInForm from "~/app/_components/signInForm";
import SignUpForm from "~/app/_components/signUpForm";

export default function Page() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <header className="top-0 flex h-16 w-full items-center justify-between bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 text-white shadow-lg">
        <h1
          className="text-3xl font-extrabold hover:cursor-pointer"
          onClick={() => router.push("/")}
        >
          RentApp
        </h1>
        <div className="flex items-center gap-4">
          <div>nie masz jeszcze konta?</div>
          <SignUpButton>
            <button className="rounded border border-white px-4 py-2 font-medium text-white transition hover:bg-white hover:text-indigo-600">
              Zarejestruj się!
            </button>
          </SignUpButton>
        </div>
      </header>
      <div className="flex h-full w-screen flex-1 items-center justify-center p-6">
        <SignInForm />
      </div>
    </div>
  );
}

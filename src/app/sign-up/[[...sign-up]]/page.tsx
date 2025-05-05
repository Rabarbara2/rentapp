"use client";
import React, { useState } from "react";
import { useSignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { postUsers } from "~/server/queries";

export default function Signup() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState("");

  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const { status, createdSessionId, id } = await signUp.create({
        emailAddress,
        password,
      });
      if (status !== "complete") {
        return;
      }
      if (status === "complete") {
        await setActive({ session: createdSessionId });
        //const image = useUser().user?.imageUrl;
        await postUsers({
          email: emailAddress,
          phone_number: phoneNumber,
          first_name: firstName,
          id: id!,
          last_name: lastName,
          bank_account: bankAccount,
        });

        router.push("/");
      }
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-cyan-700 text-white">
      <div className="gap-1">
        <div className="my-5 text-center text-2xl font-bold">
          Sign Up for RENTAPP
        </div>
        <div>
          <form onSubmit={submit} className="space-y-4 text-black">
            <div className="space-y-2">
              <div>phone number</div>
              <input
                className="rounded-2xl bg-white ps-2.5"
                id="phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div>Email</div>
              <input
                autoComplete="email"
                className="rounded-2xl bg-white ps-2.5"
                type="email"
                id="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div>first name</div>
              <input
                autoComplete="name"
                className="rounded-2xl bg-white ps-2.5"
                type="fisrt name"
                id="first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div>last name</div>
              <input
                autoComplete="family-name"
                className="rounded-2xl bg-white ps-2.5"
                type="last name"
                id="last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div>bank acc</div>
              <input
                className="rounded-2xl bg-white ps-2.5"
                autoComplete="off"
                type="number"
                id="bank account"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div>Password</div>
              <div className="relative flex">
                <input
                  autoComplete="off"
                  minLength={8}
                  className="rounded-2xl bg-white ps-2.5"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(showPassword ? "" : "jebac");
                  }}
                  className="w-full text-white hover:cursor-pointer"
                >
                  (*)
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="my-6 w-full rounded bg-white p-0.5 text-black hover:cursor-pointer"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

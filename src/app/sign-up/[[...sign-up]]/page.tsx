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
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <div>
          <div className="text-center text-2xl font-bold">
            Sign Up for RENTAPP
          </div>
        </div>
        <div>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <div>phone number</div>
              <input
                type="phone number"
                id="phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div>Email</div>
              <input
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
                type="bank account"
                id="bank account"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div>Password</div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="w-full hover:cursor-pointer">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

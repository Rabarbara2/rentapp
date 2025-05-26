"use client";

import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Eye from "../assets/eye";

type SignInFormType = {
  email: string;
  password: string;
};

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInFormType>();

  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<SignInFormType> = async (data) => {
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        console.log(result);
      }
    } catch (err: unknown) {
      alert("Nieprawidłowy e-mail lub hasło.");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full w-full flex-col items-center justify-around rounded-xl bg-slate-50 p-6 text-black drop-shadow-lg"
    >
      <div className="flex gap-2 px-6 text-3xl">
        Zaloguj się do
        <p className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-extrabold text-transparent">
          RENTAPP
        </p>
      </div>

      <div className="flex w-5/6 flex-col gap-4 p-6 text-lg">
        <div className="w-full">
          <div>adres e-mail:</div>
          <input
            type="email"
            autoComplete="off"
            required
            {...register("email", { required: true })}
            className="w-full rounded-2xl bg-slate-50 p-2 text-lg shadow-inner outline-1 outline-fuchsia-300"
          />
        </div>

        <div className="w-full">
          <div>hasło:</div>
          <div className="flex">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              required
              {...register("password", { required: true })}
              className="w-full rounded-2xl bg-slate-50 p-2 text-lg shadow-inner outline-1 outline-fuchsia-300"
            />
            <button
              type="button"
              className="px-3"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
            >
              <Eye className="h-[1.8em] w-fit fill-violet-600" />
            </button>
          </div>
        </div>
      </div>

      <input
        type="submit"
        disabled={isSubmitting}
        value="ZALOGUJ SIĘ"
        className="min-w-fit cursor-pointer rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 px-8 text-xl font-bold tracking-wider text-white drop-shadow hover:-translate-y-0.5 hover:contrast-150 disabled:bg-slate-500"
      />
    </form>
  );
}

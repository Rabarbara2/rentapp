import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import React, { useState } from "react";
import { type SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { user, type UsersType } from "~/server/db/schema";
import {
  getUserbyMail,
  getUserbyPhoneNumber,
  postUsers,
} from "~/server/queries";

import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";

type FormType = UsersType & { password: string; rePassword: string };

export default function SignUpForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, isSubmitSuccessful, errors },
  } = useForm<FormType>();

  const { isLoaded, signUp, setActive } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    if (!isLoaded) {
      return null;
    }
    const passwords = data.password === data.rePassword;
    const uMail = !(await getUserbyMail(data.email));
    const uPhone = !(await getUserbyPhoneNumber(data.phone_number!));

    if (!passwords || !uMail || !uPhone) {
      alert(
        (!passwords ? "Hasła nie są takie same. " : "") +
          (!uMail ? "Adres e-mail jest już używany. " : "") +
          (!uPhone ? "Numer telefonu jest już używany. " : ""),
      );
      throw new Error("Validation failed");
      return;
    }

    const { id, ...userData } = data;
    try {
      const { status, createdSessionId, id } = await signUp.create({
        emailAddress: userData.email,
        password: userData.password,
      });
      if (status !== "complete") {
        return null;
      }
      if (status === "complete") {
        await setActive({ session: createdSessionId });
        const addedUser = await postUsers({ id: id!, ...userData });
      }
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      router.back();
    }
  }, [isSubmitSuccessful, reset, router]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-full w-full flex-col items-center justify-around rounded-xl bg-slate-50 p-6 text-black drop-shadow-lg"
    >
      <div className="flex gap-2 px-6 text-3xl">
        Zarejestruj się w
        <p className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-extrabold text-transparent">
          RENTAPP
        </p>
      </div>
      <div className="flex w-5/6 flex-row justify-center gap-2 p-6 text-lg">
        <div className="flex basis-1/2 flex-col items-start gap-1 px-1">
          <div className="w-full">
            <div className="">imię:</div>
            <input
              autoComplete="off"
              defaultValue=""
              minLength={2}
              required
              about=""
              {...register("first_name", { required: true })}
              className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
            />
          </div>
          <div className="w-full">
            <div>nazwisko:</div>
            <input
              autoComplete="off"
              defaultValue=""
              minLength={2}
              required
              about=""
              {...register("last_name", { required: true })}
              className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
            />
          </div>
          <div className="w-full">
            <div>adres e-mail:</div>
            <input
              autoComplete="off"
              defaultValue=""
              minLength={2}
              type="email"
              required
              about=""
              {...register("email", { required: true })}
              className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
            />
          </div>

          <div className="w-full">
            <div>hasło:</div>
            <div className="flex">
              <input
                autoComplete="off"
                defaultValue=""
                minLength={2}
                type={showPassword ? "text" : "password"}
                required
                about=""
                {...register("password", { required: true })}
                className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
              />
              <button
                className="px-3"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onMouseLeave={() => setShowPassword(false)}
              >
                (*)
              </button>
            </div>
          </div>
          <div className="w-full">
            <div>powtórz hasło:</div>
            <div className="flex">
              <input
                autoComplete="off"
                defaultValue=""
                minLength={2}
                type={showRePassword ? "text" : "password"}
                required
                about=""
                {...register("rePassword", { required: true })}
                aria-invalid={errors.rePassword ? "true" : "false"}
                className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
              />
              <button
                className="px-3"
                onMouseDown={() => setShowRePassword(true)}
                onMouseUp={() => setShowRePassword(false)}
                onMouseLeave={() => setShowRePassword(false)}
              >
                (*)
              </button>
            </div>
            <p role="alert" className="h-1 px-4 text-pink-400">
              {watch("password") !== watch("rePassword") &&
                watch("rePassword")?.length > 2 &&
                "hasła nie są takie same!"}
            </p>
          </div>
        </div>

        <div className="flex basis-1/2 flex-col items-start gap-1 px-1">
          <div className="w-full">
            <div>numer konta bankowego:</div>
            <input
              onKeyPress={(e) => !/\d/.test(e.key) && e.preventDefault()}
              autoComplete="off"
              defaultValue=""
              minLength={2}
              required
              about=""
              {...register("bank_account", { required: true })}
              className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
            />
          </div>
          <div className="w-full">
            <div>numer telefonu:</div>
            <input
              autoComplete="off"
              defaultValue=""
              minLength={2}
              required
              onKeyPress={(e) => {
                const isDigit = /\d/.test(e.key);
                const isPlus =
                  e.key === "+" && e.currentTarget.selectionStart === 0;

                if (!isDigit && !isPlus) {
                  e.preventDefault();
                }
              }}
              about=""
              {...register("phone_number", {
                required: true,
              })}
              className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
            />
          </div>
        </div>
      </div>
      <input
        type="submit"
        disabled={isSubmitting}
        className="min-w-fit cursor-pointer rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 px-8 text-xl font-bold tracking-wider text-white drop-shadow hover:-translate-y-0.5 hover:contrast-150 disabled:bg-slate-500"
        value="ZAREJESTRUJ SIĘ!"
      />
    </form>
  );
}

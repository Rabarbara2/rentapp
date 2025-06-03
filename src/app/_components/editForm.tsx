"use client";

import { redirect, usePathname, useRouter } from "next/navigation";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type UsersType } from "~/server/db/schema";
import { editUser, getUserbyPhoneNumberEdit } from "~/server/queries";

type FormType = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  bank_account: string;
};

export default function EditForm({ user }: { user: UsersType }) {
  if (!user) {
    redirect("/");
  }
  const router = useRouter();
  const pathname = usePathname();
  const {
    register,
    handleSubmit,

    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<FormType>();

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    const uPhone = !(await getUserbyPhoneNumberEdit(
      data.phone_number,
      user.id,
    ));

    if (!uPhone) {
      alert(!uPhone ? "Numer telefonu jest już używany. " : "");
      throw new Error("Validation failed");
      return;
    }

    const userData = {
      ...data,
      id: user.id,
    };
    try {
      await editUser(userData);
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      router.push(`${pathname.replace(/\/edit$/, "")}`);
    }
  }, [isSubmitSuccessful, reset, router, pathname]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-fit w-3/4 flex-col items-center justify-around rounded-xl bg-slate-50 p-6 text-black drop-shadow-lg"
    >
      <div className="flex gap-2 px-6 text-3xl">
        <p className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-extrabold text-transparent">
          RENTAPP
        </p>
      </div>
      <div className="flex w-5/6 flex-row justify-center gap-2 p-6 text-lg">
        <div className="flex w-max basis-1/2 flex-col items-start gap-1 px-1">
          <div className="w-full">
            <div className="">Imię:</div>
            <input
              autoComplete="off"
              defaultValue={user.first_name ?? ""}
              minLength={2}
              required
              about=""
              {...register("first_name", { required: true })}
              className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
            />
          </div>
          <div className="w-full">
            <div>Nazwisko:</div>
            <input
              autoComplete="off"
              defaultValue={user.last_name ?? ""}
              minLength={2}
              required
              about=""
              {...register("last_name", { required: true })}
              className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
            />
          </div>
          <div className="w-full">
            <div>Numer telefonu:</div>
            <input
              autoComplete="off"
              defaultValue={user.phone_number ?? ""}
              minLength={2}
              maxLength={12}
              required
              onKeyDown={(e) => {
                const isDigit = /\d/.test(e.key);
                const isBackspace = e.key === "Backspace" || e.key === "Delete";
                const isArrow = e.key === "ArrowLeft" || e.key === "ArrowRight";
                const isPlus =
                  e.key === "+" && e.currentTarget.selectionStart === 0;

                if (!isDigit && !isPlus && !isBackspace && !isArrow) {
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

          {user.bank_account && (
            <div className="w-full">
              <div>Numer konta bankowego:</div>
              <input
                onKeyDown={(e) => {
                  const isDigit = /\d/.test(e.key);
                  const isBackspace =
                    e.key === "Backspace" || e.key === "Delete";
                  const isArrow =
                    e.key === "ArrowLeft" || e.key === "ArrowRight";

                  if (!isDigit && !isBackspace && !isArrow) {
                    e.preventDefault();
                  }
                }}
                autoComplete="off"
                defaultValue={user.bank_account}
                minLength={2}
                maxLength={26}
                required
                about=""
                {...register("bank_account", { required: true })}
                className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex w-max basis-1/2 flex-col items-start gap-1 px-1"></div>
      <input
        type="submit"
        disabled={isSubmitting}
        className="min-w-fit cursor-pointer rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 px-8 text-xl font-bold tracking-wider text-white drop-shadow hover:-translate-y-0.5 hover:contrast-150 disabled:bg-slate-500"
        value="Zmień dane"
      />
    </form>
  );
}

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type UsersType } from "~/server/db/schema";
import {
  addRoleToUser,
  getUserbyMail,
  getUserbyPhoneNumber,
  postUsers,
} from "~/server/queries";

import { useSignUp } from "@clerk/nextjs";
import Eye from "../assets/eye";
import House from "../assets/house";
import Person from "../assets/person";

type FormType = UsersType & {
  password: string;
  rePassword: string;
  role: number;
};

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
      const { status, createdSessionId, createdUserId } = await signUp.create({
        emailAddress: userData.email,
        password: userData.password,
      });
      if (status !== "complete") {
        return null;
      }
      if (status === "complete") {
        await setActive({ session: createdSessionId });
        await postUsers({ id: createdUserId!, ...userData });
        await addRoleToUser({ role_id: data.role, user_id: createdUserId! });
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
        <div className="flex w-max basis-1/2 flex-col items-start gap-1 px-1">
          <div className="w-full">
            <div className="">Imię:</div>
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
            <div>Nazwisko:</div>
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
            <div>Adres e-mail:</div>
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
            <div>Hasło:</div>
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
                <Eye className="h-[1.8em] w-fit fill-violet-600" />
              </button>
            </div>
          </div>
          <div className="w-full">
            <div>Powtórz hasło:</div>
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
                <Eye className="h-[1.8em] w-fit fill-violet-600" />
              </button>
            </div>
            <p role="alert" className="h-1 px-4 text-pink-400">
              {watch("password") !== watch("rePassword") &&
                watch("rePassword")?.length > 2 &&
                "hasła nie są takie same!"}
            </p>
          </div>
        </div>

        <div className="flex w-max basis-1/2 flex-col items-start gap-1 px-1">
          <div className="w-full">
            <div>Numer telefonu:</div>
            <input
              autoComplete="off"
              defaultValue=""
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
          <div>
            Wybierz typ konta:
            <div className="flex p-4">
              <label className="relative w-fit">
                <input
                  type="radio"
                  value={2}
                  {...register("role")}
                  className="absolute m-2 scale-150"
                />
                <Person className="h-fit w-1/3" />
                Najemca
              </label>
              <label className="relative w-fit">
                <input
                  type="radio"
                  value={1}
                  {...register("role")}
                  className="absolute m-2 scale-150"
                />
                <House className="h-fit w-1/3 p-1" />
                Wynajmujący
              </label>
            </div>
          </div>
          {watch("role") == 1 && (
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
                defaultValue=""
                minLength={2}
                maxLength={26}
                required
                about=""
                {...register("bank_account", { required: true })}
                className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
              />
              <div className="text-sm text-pink-300">
                Twój numer konta bankowego jest nam potrzebny, aby przyszli
                najemcy wiedzieli gdzie wpłacać opłaty za wynajem.
              </div>
            </div>
          )}
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

"use client";
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import {
  type ListingTypeInsert,
  type PropertyTypeSelect,
} from "~/server/db/schema";
import { postListing } from "~/server/queries";

type FormType = ListingTypeInsert;

export default function AddListingForm({
  property,
}: {
  property: PropertyTypeSelect;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<FormType>();

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    try {
      const filteredData = {
        ...data,
        property_id: property.id,
        listing_status: 1,
        available_from: "1990-01-01",
      };
      await postListing(filteredData);
    } catch (error) {
      console.error("Błąd podczas dodawania nieruchomości:", error);
    }
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      router.push(pathname.replace(/\/listing$/, ""));
    }
  }, [isSubmitSuccessful, reset, router, pathname]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-fit w-3/4 flex-col items-center justify-around rounded-xl bg-slate-50 p-6 text-black drop-shadow-lg"
    >
      <div className="flex gap-2 px-6 text-3xl">
        Dodaj ogłoszenie w
        <p className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-extrabold text-transparent">
          RENTAPP
        </p>
      </div>

      <div className="flex w-5/6 flex-row justify-center gap-2 p-6 text-lg">
        <div className="flex w-max flex-col items-start gap-1 px-1">
          <div className="w-full">
            <div>Cena za miesiąc:</div>
            <input
              autoComplete="off"
              minLength={2}
              required
              {...register("price_per_month", { required: true })}
              className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
              onKeyDown={(e) => {
                const isDigit = /\d/.test(e.key);
                const isBackspace = e.key === "Backspace" || e.key === "Delete";
                const isArrow = e.key === "ArrowLeft" || e.key === "ArrowRight";

                if (!isDigit && !isBackspace && !isArrow) {
                  e.preventDefault();
                }
              }}
            />
          </div>

          <div className="w-full">
            <div>Kaucja:</div>
            <input
              autoComplete="off"
              placeholder=""
              minLength={2}
              required
              {...register("security_deposit", { required: true })}
              className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
              onKeyDown={(e) => {
                const isDigit = /\d/.test(e.key);
                const isBackspace = e.key === "Backspace" || e.key === "Delete";
                const isArrow = e.key === "ArrowLeft" || e.key === "ArrowRight";

                if (!isDigit && !isBackspace && !isArrow) {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>
      </div>

      <input
        type="submit"
        disabled={isSubmitting}
        className="min-w-fit cursor-pointer rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 px-8 text-xl font-bold tracking-wider text-white drop-shadow hover:-translate-y-0.5 hover:contrast-150 disabled:bg-slate-500"
        value="Dodaj ogłoszenie"
      />
    </form>
  );
}

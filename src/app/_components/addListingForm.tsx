/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { redirect, usePathname, useRouter } from "next/navigation";
import {
  type ListingTypeInsert,
  type PropertyTypeInsert,
  type PropertyTypeSelect,
  type RoomType,
  type UsersType,
} from "~/server/db/schema";
import {
  addPropertyPhotos,
  addRooms,
  postListing,
  postProperty,
} from "~/server/queries";

type RoomTypeInsert = Omit<RoomType, "property_id">;
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
    control,
    watch,
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

          <div className="mt-2 flex w-full items-center gap-5">
            <div>Dostępne od:</div>
            <input
              autoComplete="off"
              type="date"
              required
              {...register("available_from", { required: true })}
              className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
            />
            <div className="min-w-fit">Dostępne do:</div>
            <input
              autoComplete="off"
              type="date"
              required
              {...register("available_until", { required: true })}
              className="w-1/4 rounded-2xl bg-slate-50 p-1 px-2 text-lg shadow-inner outline-1 outline-fuchsia-300"
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

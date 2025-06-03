"use client";
import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import {
  type ListingTypeInsert,
  type ListingTypeSelect,
  type PropertyTypeSelect,
} from "~/server/db/schema";
import { deleteListing, editListing } from "~/server/queries"; // <- dodaj deleteListing

type FormType = ListingTypeInsert;

export default function EditListingForm({
  property,
  listing,
}: {
  property: PropertyTypeSelect;
  listing: ListingTypeSelect;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<FormType>({
    defaultValues: {
      price_per_month: listing.price_per_month ?? 0,
      security_deposit: listing.security_deposit ?? 0,
      available_from: listing.available_from?.toString().split("T")[0] ?? "",
      available_until: listing.available_until?.toString().split("T")[0] ?? "",
    },
  });

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    try {
      const filteredData = {
        ...data,
        id: listing.id,
        property_id: property.id,
        created_at: listing.created_at,
        updated_at: listing.updated_at ?? null,
        available_until: data.available_until ?? null,
        listing_status: 1,
      };
      await editListing(filteredData);
    } catch (error) {
      console.error("Błąd podczas edycji ogłoszenia:", error);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć ogłoszenie?");
    if (!confirmed) return;

    try {
      await deleteListing({ id: listing.id });
      router.push(pathname.replace(/\/listingedit$/, ""));
    } catch (error) {
      console.error("Błąd podczas usuwania ogłoszenia:", error);
    }
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      router.push(pathname.replace(/\/listingedit$/, ""));
    }
  }, [isSubmitSuccessful, reset, router, pathname]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-fit w-3/4 flex-col items-center justify-around rounded-xl bg-slate-50 p-6 text-black drop-shadow-lg"
    >
      <div className="flex gap-2 px-6 text-3xl">
        Edytuj ogłoszenie w
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
                if (!isDigit && !isBackspace && !isArrow) e.preventDefault();
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
                if (!isDigit && !isBackspace && !isArrow) e.preventDefault();
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <input
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 px-8 text-xl font-bold tracking-wider text-white drop-shadow hover:-translate-y-0.5 hover:contrast-150 disabled:bg-slate-500"
          value="Zapisz zmiany"
        />
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-2xl bg-red-600 p-3 px-6 text-xl font-bold text-white hover:bg-red-700"
        >
          Usuń ogłoszenie
        </button>
        <div
          onClick={() => {
            router.push(pathname.replace(/\/listingedit$/, ""));
          }}
          className="flex items-center rounded bg-violet-400 px-6 py-1 text-white hover:cursor-pointer hover:bg-violet-500"
        >
          Anuluj
        </div>
      </div>
    </form>
  );
}

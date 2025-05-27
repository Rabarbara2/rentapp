/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import {
  type PropertyTypeInsert,
  type PropertyTypeSelect,
  type PropertyWithRelationsType,
  type RoomType,
} from "~/server/db/schema";
import { addPropertyPhotos, addRooms, editProperty } from "~/server/queries";

type RoomTypeInsert = Omit<RoomType, "property_id">;

export type FormType = PropertyTypeInsert & {
  photos: { url: string }[];
  rooms: RoomTypeInsert[];
};

type EditPropertyFormProps = {
  defaultValues: PropertyWithRelationsType;
  propId: number;
};

function convertToFormType(property: PropertyWithRelationsType): FormType {
  return {
    name: property.name,
    description: property.description,
    address: property.address,
    city: property.city,
    postal_code: property.postal_code,
    area_size: property.area_size,
    is_furnished: property.is_furnished ?? false,
    pets_allowed: property.pets_allowed ?? false,
    smoking_allowed: property.smoking_allowed ?? false,
    is_active: property.is_active,
    owner_id: property.owner_id,
    created_at: property.created_at,
    updated_at: property.updated_at,
    photos: property.photos?.map((p) => ({ url: p.file_path })) ?? [
      { url: "" },
    ],
    rooms: property.rooms?.map((r) => ({
      description: r.description ?? "",
      room_type: r.room_type ?? "",
      size_sqm: r.size_sqm ?? "",
    })) ?? [{ description: "", room_type: "", size_sqm: "" }],
  };
}

export default function EditPropertyForm({
  defaultValues,
}: EditPropertyFormProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<FormType>({
    defaultValues: convertToFormType(defaultValues),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "photos",
  });

  const {
    fields: roomFields,
    append: appendRoom,
    remove: removeRoom,
  } = useFieldArray({
    control,
    name: "rooms",
  });

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    try {
      const filteredData = {
        ...data,
        id: defaultValues.id,
        description: data.description ?? null,
        area_size: data.area_size ?? null,
        is_furnished: data.is_furnished ?? null,
        pets_allowed: data.pets_allowed ?? null,
        smoking_allowed: data.smoking_allowed ?? null,
        created_at: data.created_at ?? null,
        updated_at: data.updated_at ?? null,
      };

      const propertyResult = await editProperty(filteredData);
      await addPropertyPhotos(
        propertyResult!.id,
        filteredData.photos.map((p) => p.url),
      );
      await addRooms(
        propertyResult!.id,
        data.rooms.map((room) => ({
          ...room,
          property_id: propertyResult!.id,
        })),
      );

      router.push(pathname.replace(/\/edit$/, ""));
    } catch (error) {
      console.error("Błąd podczas edycji nieruchomości:", error);
    }
  };

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset, defaultValues]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-fit w-full flex-col items-center justify-around rounded-xl bg-slate-50 p-6 text-black drop-shadow-lg"
    >
      <div className="flex gap-2 px-6 text-3xl">
        Edytuj lokal w{" "}
        <p className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-3xl font-extrabold text-transparent">
          RENTAPP
        </p>
      </div>

      <div className="flex w-5/6 flex-row justify-center gap-2 p-6 text-lg">
        <div className="flex w-max flex-col items-start gap-1 px-1">
          <div className="w-full">
            <div>Nazwa:</div>
            <input
              autoComplete="off"
              minLength={2}
              required
              {...register("name", { required: true })}
              className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
            />
          </div>

          <div className="w-full">
            <div>Adres:</div>
            <input
              autoComplete="off"
              placeholder="ulica, nr domu/nr mieszkania"
              minLength={2}
              required
              {...register("address", { required: true })}
              className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
            />
          </div>

          <div className="mt-2 flex w-full items-center gap-5">
            <div>Miejscowość:</div>
            <input
              autoComplete="off"
              minLength={2}
              required
              {...register("city", { required: true })}
              className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
            />
            <div className="min-w-fit">Kod pocztowy:</div>
            <input
              autoComplete="off"
              minLength={2}
              maxLength={12}
              required
              {...register("postal_code", { required: true })}
              className="w-1/4 rounded-2xl bg-slate-50 p-1 px-2 text-lg shadow-inner outline-1 outline-fuchsia-300"
              onKeyDown={(e) => {
                const isDigit = /\d/.test(e.key);
                const isBackspace = e.key === "Backspace" || e.key === "Delete";
                const isArrow = e.key === "ArrowLeft" || e.key === "ArrowRight";
                const isPlus =
                  e.key === "-" && e.currentTarget.selectionStart === 2;

                if (!isDigit && !isPlus && !isBackspace && !isArrow) {
                  e.preventDefault();
                }
              }}
            />
          </div>

          <div className="flex w-full justify-between gap-6">
            <div className="flex h-full basis-1/3 flex-col items-stretch justify-between gap-2 py-5">
              <label className="w-fit">
                <input
                  type="checkbox"
                  {...register("is_furnished")}
                  className="m-2 scale-150"
                />
                Umeblowane
              </label>
              <label className="w-fit">
                <input
                  type="checkbox"
                  {...register("pets_allowed")}
                  className="m-2 scale-150"
                />
                Zwierzaki dozwolone
              </label>
              <label className="w-fit">
                <input
                  type="checkbox"
                  {...register("smoking_allowed")}
                  className="m-2 scale-150"
                />
                Palenie dozwolone
              </label>

              <div className="-pb-2 mt-1">Powierzchnia użytkowa:</div>
              <div className="flex gap-1">
                <input
                  autoComplete="off"
                  minLength={1}
                  required
                  {...register("area_size", { required: true })}
                  className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
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
                />
                <span>m²</span>
              </div>
            </div>
            <div className="flex h-full basis-2/3 flex-col gap-2 py-5">
              <div>Opis:</div>
              <textarea
                autoComplete="off"
                minLength={2}
                required
                {...register("description", { required: true })}
                className="h-full w-full resize-none rounded-2xl bg-slate-50 p-1 text-base shadow-inner outline-1 outline-fuchsia-300"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Zdjęcia */}
      <div className="w-full">
        <label className="mb-2 block font-semibold">Linki do zdjęć:</label>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Wklej URL zdjęcia"
              {...register(`photos.${index}.url` as const, {
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "URL musi zaczynać się od http(s)",
                },
              })}
              className="w-full rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              className="rounded-lg bg-rose-600 px-3 py-1 text-lg font-bold text-white hover:cursor-pointer hover:bg-rose-700 disabled:invisible"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ url: "" })}
          className="mt-2 mb-4 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white hover:cursor-pointer hover:bg-violet-700"
        >
          Dodaj kolejne zdjęcie
        </button>
        <div className="flex flex-wrap gap-2">
          {watch("photos").map((photo, index) =>
            photo.url ? (
              <img
                key={index}
                src={photo.url}
                alt={`Zdjęcie ${index + 1}`}
                className="h-24 w-24 rounded border object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "https://via.placeholder.com/100?text=Brak+zdj";
                }}
              />
            ) : null,
          )}
        </div>
      </div>

      {/* Pokoje */}
      <div className="my-4 w-full">
        <label className="mb-2 block font-semibold">Pokoje:</label>
        <div className="flex flex-col gap-5">
          {roomFields.map((field, index) => (
            <div
              key={field.id}
              className="mb-2 flex flex-wrap items-center gap-3"
            >
              <select
                {...register(`rooms.${index}.room_type` as const, {
                  required: true,
                })}
                className="flex min-w-1/3 basis-1/5 rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
              >
                <option value="" disabled className="text-gray-400">
                  Wybierz typ pokoju:
                </option>
                <option value="sypialnia">Sypialnia</option>
                <option value="salon">Salon</option>
                <option value="kuchnia">Kuchnia</option>
                <option value="łazienka">Łazienka</option>
                <option value="jadalnia">Jadalnia</option>
                <option value="gabinet">Gabinet / Biuro</option>
                <option value="pralnia">Pralnia</option>
                <option value="spiżarnia">Spiżarnia</option>
                <option value="korytarz">Korytarz / Hol</option>
                <option value="garderoba">Garderoba</option>
                <option value="piwnica">Piwnica</option>
                <option value="strych">Strych</option>
                <option value="pomieszczenie_gospodarcze">
                  Pomieszczenie gospodarcze
                </option>
                <option value="antresola">Antresola</option>
                <option value="weranda">Weranda</option>
                <option value="taras">Taras</option>
                <option value="balkon">Balkon</option>
                <option value="garaż">Garaż</option>
                <option value="inne">Inne</option>
              </select>
              <div className="flex basis-1/5">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  placeholder="rozmiar"
                  {...register(`rooms.${index}.size_sqm` as const, {
                    required: true,
                    min: 1,
                  })}
                  className="rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
                />
                <span className="p-1">m²</span>
              </div>
              <div className="flex w-full justify-between gap-5">
                <input
                  type="text"
                  maxLength={60}
                  placeholder="Opis (opcjonalnie)"
                  {...register(`rooms.${index}.description` as const)}
                  className="flex basis-1/1 rounded-2xl bg-slate-50 p-1 text-lg shadow-inner outline-1 outline-fuchsia-300"
                />

                <button
                  type="button"
                  onClick={() => removeRoom(index)}
                  disabled={roomFields.length === 1}
                  className="rounded-lg bg-rose-600 px-3 py-1 text-lg font-bold text-white hover:cursor-pointer hover:bg-rose-700 disabled:invisible"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            appendRoom({ description: "", room_type: "", size_sqm: "" })
          }
          className="mt-2 mb-4 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white hover:cursor-pointer hover:bg-violet-700"
        >
          Dodaj pokój
        </button>
      </div>

      {/* ✅ Submit */}
      <input
        type="submit"
        disabled={isSubmitting}
        className="min-w-fit cursor-pointer rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-3 px-8 text-xl font-bold tracking-wider text-white drop-shadow hover:-translate-y-0.5 hover:contrast-150 disabled:bg-slate-500"
        value="Zapisz zmiany"
      />
    </form>
  );
}

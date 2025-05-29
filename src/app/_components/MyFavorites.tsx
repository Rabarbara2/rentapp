/* eslint-disable @next/next/no-img-element */
// ClientSideProfile.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import type {
  FavoritesWithPropertyType,
  PropertyTypeInsert,
  PropertyWithRelationsType,
} from "~/server/db/schema";

type MyFavsProps = {
  favs: FavoritesWithPropertyType[];
};

export default function MyFavorites({ favs }: MyFavsProps) {
  const { isLoaded, user } = useUser();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded) setLoading(false);
  }, [isLoaded]);
  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);
  if (favs) {
    return (
      <div className="p-3 shadow">
        <div className="mb-5 text-2xl font-bold">Moje ulubione lokale:</div>

        <div className="flex w-full justify-center">
          <div className="flex w-full gap-5 overflow-scroll">
            {favs.map((fav) => (
              <div
                key={fav.listing_id}
                onClick={() => {
                  router.push(`/listing/${String(fav.listing_id)}`);
                }}
                className="flex w-1/3 min-w-1/3 flex-col rounded-xl border border-pink-400 p-4 shadow transition hover:cursor-pointer hover:shadow-xl"
              >
                <h2 className="h-[2.5em] text-xl font-semibold">
                  {fav.listing.property.name}
                </h2>
                <p className="text-gray-600">{fav.listing.property.address}</p>
                <p className="text-sm text-gray-500">
                  {fav.listing.property.city},{" "}
                  {fav.listing.property.postal_code}
                </p>

                <div className="py-2 text-sm text-gray-700">
                  {fav.listing.property.is_furnished
                    ? "Umeblowane"
                    : "Nieumeblowane"}{" "}
                  · {fav.listing.property.area_size ?? "?"} m²
                </div>
                <img
                  src={
                    fav.listing.property.photos[0]?.file_path ??
                    "https://reviveyouthandfamily.org/wp-content/uploads/2016/11/house-placeholder.jpg"
                  }
                  alt="image"
                  className="h-72 w-fit rounded-2xl border-b border-slate-800 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

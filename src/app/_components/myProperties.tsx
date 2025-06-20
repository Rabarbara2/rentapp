/* eslint-disable @next/next/no-img-element */
// ClientSideProfile.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type {
  PropertyWithRelationsType,
  RentalAgreementSelect,
} from "~/server/db/schema";

type MyPropertiesProps = {
  properties: PropertyWithRelationsType[];
  agreements: RentalAgreementSelect[];
};
function getListingStatusColor(status: string): string {
  switch (status) {
    case "Aktualnie wynajmowane":
      return "bg-blue-200 text-blue-800";
    case "Aktywne ogłoszenie":
      return "bg-green-200 text-green-800";
    case "Brak ogłoszeń":
    default:
      return "bg-gray-200 text-gray-600";
  }
}
function getListingStatus({
  property,
  agreements,
}: {
  property: PropertyWithRelationsType;
  agreements: RentalAgreementSelect[];
}): string {
  const listings = property.listings ?? [];

  // Pobierz ID listingów dla tego property
  const listingIds = listings.map((l) => l.id);

  // Sprawdź, czy istnieje aktywna umowa dla któregoś z listingów tego property
  const hasActiveAgreement = agreements.some(
    (agreement) =>
      listingIds.includes(agreement.listing_id) &&
      agreement.signed_by_owner_at !== null &&
      agreement.signed_by_tenant_at !== null,
  );

  if (hasActiveAgreement) {
    return "Aktualnie wynajmowane";
  }

  // Sprawdź, czy jest aktywne ogłoszenie
  const hasActiveListing = listings.some(
    (listing) => listing.listing_status === 1,
  );

  if (hasActiveListing) {
    return "Aktywne ogłoszenie";
  }

  return "Brak ogłoszeń";
}

export default function MyProperties({
  properties,
  agreements,
}: MyPropertiesProps) {
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
  if (properties) {
    return (
      <div className="p-3 shadow">
        <div className="flex justify-between pb-2">
          <div className="text-2xl font-bold">Moje Lokale:</div>
          <button
            onClick={() => {
              router.push(`${pathname}/add`);
            }}
            className="mb-2 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-2 font-semibold text-white opacity-95 hover:cursor-pointer hover:brightness-125"
          >
            + dodaj lokal
          </button>
        </div>
        <div className="flex w-full justify-center">
          <div className="flex w-full gap-5 overflow-scroll">
            {properties.map((property) => (
              <div
                key={property.id}
                onClick={() => {
                  router.push(
                    `${pathname}/propertyinfo/${String(property.id)}`,
                  );
                }}
                className="flex w-1/3 min-w-1/3 flex-col rounded-xl border border-pink-400 p-4 shadow transition hover:cursor-pointer hover:shadow-xl"
              >
                <h2 className="h-[2.5em] text-xl font-semibold">
                  {property.name}
                </h2>
                <p className="text-gray-600">{property.address}</p>
                <p className="text-sm text-gray-500">
                  {property.city}, {property.postal_code}
                </p>

                <div className="py-2 text-sm text-gray-700">
                  {property.is_furnished ? "Umeblowane" : "Nieumeblowane"} ·{" "}
                  {property.area_size ?? "?"} m²
                </div>
                <img
                  src={
                    property.photos[0]?.file_path ??
                    "https://reviveyouthandfamily.org/wp-content/uploads/2016/11/house-placeholder.jpg"
                  }
                  alt="image"
                  className="h-72 w-fit rounded-2xl border-b border-slate-800 object-cover"
                />

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span>{property.rooms.length} pokoi</span>
                  <span>{property.photos.length} zdjęć</span>
                  <span
                    className={`rounded-full px-2 py-1 font-semibold ${getListingStatusColor(
                      getListingStatus({ property, agreements }),
                    )}`}
                  >
                    {getListingStatus({ property, agreements })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

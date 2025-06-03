/* eslint-disable @next/next/no-img-element */
import React from "react";
import type {
  ListingWithFullRelations,
  RentalAgreementSelect,
} from "~/server/db/schema";

type MyRentedPropertiesProps = {
  agreements: RentalAgreementSelect[];
  listings: ListingWithFullRelations[];
};

function isActiveAgreement(agreement: RentalAgreementSelect): boolean {
  return (
    agreement.signed_by_owner_at !== null &&
    agreement.signed_by_tenant_at !== null
  );
}

export default function MyRentedProperties({
  agreements,
  listings,
}: MyRentedPropertiesProps) {
  const activeAgreements = agreements.filter(isActiveAgreement);

  const listingMap = new Map(listings.map((listing) => [listing.id, listing]));

  const agreementsWithDetails = activeAgreements.map((agreement) => {
    const listing = listingMap.get(agreement.listing_id);
    return {
      agreement,
      listing,
    };
  });

  if (agreementsWithDetails.length === 0) {
    return <p>Nie wynajmujesz aktualnie żadnych lokali.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Moje wynajmowane lokale</h2>
      <ul className="space-y-4">
        {agreementsWithDetails.map(({ agreement, listing }) => (
          <div
            key={agreement.id}
            className="flex gap-4 rounded-xl border border-pink-400 p-4 shadow transition"
          >
            {listing?.property.photos?.[0]?.file_path && (
              <img
                src={listing.property.photos[0].file_path}
                alt={listing.property.name + " photo"}
                className="h-24 w-32 rounded-xl object-cover"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold">
                {listing!.property.name}
              </h3>
              <p>
                {listing!.property.address}, {listing!.property.city}
              </p>
              <p className="mt-2 font-medium">
                Miesięczny czynsz:{" "}
                <span className="text-indigo-600">
                  {agreement.monthly_rent} zł
                </span>
              </p>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}

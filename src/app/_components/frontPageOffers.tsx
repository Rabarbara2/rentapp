/* eslint-disable @next/next/no-img-element */
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { getThreeListingsFull } from "~/server/queries";

export default async function FrontPageOffers() {
  const offers = await getThreeListingsFull();
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {offers.map((offer) => (
        <Link
          key={offer.id}
          href={`/listing/${offer.id}`}
          className="block transform overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
        >
          <img
            src={
              offer.property.photos[0]?.file_path ??
              "https://reviveyouthandfamily.org/wp-content/uploads/2016/11/house-placeholder.jpg"
            }
            alt={"zdjęcie"}
            className="h-56 w-full object-cover"
          />
          <div className="p-6">
            <h3 className="mb-2 h-20 text-2xl font-semibold text-indigo-600">
              {offer.property.name}
            </h3>
            <p className="text-lg font-medium">
              {offer.price_per_month} zł / miesiąc
            </p>
            <button className="mt-4 inline-block rounded bg-indigo-600 px-4 py-2 text-white transition hover:cursor-pointer hover:bg-indigo-700">
              Zobacz szczegóły
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}

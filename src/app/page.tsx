import Link from "next/link";

import Navbar from "./_components/navbar";
import FrontPageOffers from "./_components/frontPageOffers";
import OfferSearchSection from "./_components/mainPageSearch";
import { createRentalAgreementFromNotification } from "~/server/queries";
export const dynamic = "force-dynamic";
export default async function Home() {
  return (
    <div>
      <Navbar />
      <main className="flex flex-col items-center space-y-12 bg-gradient-to-b from-gray-100 to-gray-200 py-12 text-gray-800">
        {/* Sekcja polecanych ofert */}
        <section className="w-full max-w-6xl px-8">
          <h2 className="mb-8 text-center text-4xl font-bold text-gray-900 md:text-5xl">
            Najnowsze oferty
          </h2>
          <FrontPageOffers />
        </section>

        {/* Sekcja wyszukiwania */}
        <section className="w-full max-w-6xl px-8">
          <OfferSearchSection />
        </section>
      </main>
    </div>
  );
}

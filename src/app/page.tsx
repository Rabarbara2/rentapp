import Link from "next/link";

import Navbar from "./_components/navbar";
import FrontPageOffers from "./_components/frontPageOffers";

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
          <h2 className="mb-8 text-center text-4xl font-bold text-gray-900 md:text-5xl">
            Znajdź mieszkanie
          </h2>
          <form className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-6 shadow-md sm:grid-cols-2 lg:grid-cols-3">
            <input
              type="text"
              name="minPrice"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Cena min (zł)"
              className="appearance-none rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            <input
              type="text"
              name="maxPrice"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Cena max (zł)"
              className="appearance-none rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            <select
              name="rooms"
              className="rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            >
              <option value="">Dowolna liczba pokoi</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            <div className="flex justify-center sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                className="w-full rounded-md bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 lg:w-auto"
              >
                Szukaj
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

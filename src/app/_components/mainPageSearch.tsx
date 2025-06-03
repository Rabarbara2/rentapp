/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { getFilteredListings } from "~/server/queries";
import type { ListingWithFullRelations } from "~/server/db/schema";
import Link from "next/link";

type SortOption =
  | "price-asc"
  | "price-desc"
  | "date-asc"
  | "date-desc"
  | "area-asc"
  | "area-desc";

export default function OfferSearchSection() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rooms, setRooms] = useState("");
  const [sort, setSort] = useState<SortOption>("price-asc");
  const [listings, setListings] = useState<ListingWithFullRelations[]>([]);
  const [page, setPage] = useState(1);

  const offersPerPage = 12;

  const fetchOffers = async () => {
    const results = await getFilteredListings({
      minPrice: Number(minPrice) || 0,
      maxPrice: Number(maxPrice) || Infinity,
      rooms: Number(rooms) || 0,
      sort,
      page,
      limit: offersPerPage,
    });
    setListings((prev) => [...prev, ...results]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const results = await getFilteredListings({
      minPrice: Number(minPrice) || 0,
      maxPrice: Number(maxPrice) || Infinity,
      rooms: Number(rooms) || 0,
      sort,
      page: 1,
      limit: offersPerPage,
    });
    setListings(results);
  };

  const loadMore = () => setPage((prev) => prev + 1);

  useEffect(() => {
    if (page === 1) return;
    void fetchOffers();
  }, [page]);

  useEffect(() => {
    const loadInitial = async () => {
      const results = await getFilteredListings({
        minPrice: 0,
        maxPrice: Infinity,
        rooms: 0,
        sort,
        page: 1,
        limit: offersPerPage,
      });

      setListings(results);
    };

    if (listings.length === 0) {
      void loadInitial();
    }
  }, [listings.length, sort]);
  return (
    <section className="w-full max-w-6xl px-8">
      <h2 className="mb-8 text-center text-4xl font-bold text-gray-900 md:text-5xl">
        Znajdź mieszkanie
      </h2>

      {/* Formularz */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-6 shadow-md sm:grid-cols-2 lg:grid-cols-4"
      >
        <input
          type="text"
          name="minPrice"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Cena min (zł)"
          className="appearance-none rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
        <input
          type="text"
          name="maxPrice"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Cena max (zł)"
          className="appearance-none rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />
        <select
          name="rooms"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          className="rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        >
          <option value="">Dowolna liczba pokoi</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
        <select
          name="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        >
          <option value="price-asc">Cena rosnąco</option>
          <option value="price-desc">Cena malejąco</option>
          <option value="date-asc">Data dodania rosnąco</option>
          <option value="date-desc">Data dodania malejąco</option>
          <option value="area-asc">Powierzchnia rosnąco</option>
          <option value="area-desc">Powierzchnia malejąco</option>
        </select>
        <div className="flex justify-center sm:col-span-2 lg:col-span-4">
          <button
            type="submit"
            className="w-full rounded-md bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 lg:w-auto"
          >
            Szukaj
          </button>
        </div>
      </form>

      {/* Wyniki */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((offer) => (
          <Link
            href={"/listing/" + offer.id}
            key={offer.id}
            className="rounded-xl bg-white p-4 shadow-md transition hover:shadow-lg"
          >
            <img
              src={
                offer.property.photos[0]?.file_path ??
                "https://reviveyouthandfamily.org/wp-content/uploads/2016/11/house-placeholder.jpg"
              }
              alt="Zdjęcie"
              className="mb-4 h-48 w-full rounded-lg object-cover"
            />
            <h3 className="text-xl font-bold text-gray-800">
              {offer.property.name}
            </h3>
            <p className="text-gray-600">{offer.property.city}</p>
            <p className="mt-2 font-semibold text-purple-700">
              {offer.price_per_month} zł / mies.
            </p>
          </Link>
        ))}
      </div>

      {/* Pokaż więcej */}
      {listings.length >= page * offersPerPage && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            className="rounded-md bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Pokaż więcej
          </button>
        </div>
      )}
    </section>
  );
}

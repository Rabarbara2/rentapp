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
  const [city, setCity] = useState("");
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
      city,
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
      city,
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
        city,
      });

      setListings(results);
    };

    if (listings.length === 0) {
      void loadInitial();
    }
  }, [listings.length, sort]);

  return (
    <section className="w-full max-w-6xl px-6">
      <h2 className="mb-8 text-center text-4xl font-bold text-gray-900 md:text-5xl">
        Znajdź mieszkanie
      </h2>

      {/* FILTRY */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 grid grid-cols-1 gap-4 rounded-2xl bg-white p-6 shadow-md sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <input
          type="text"
          name="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Miasto"
          className="rounded-md border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
        />
        <input
          type="number"
          name="minPrice"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Cena min (zł)"
          className="rounded-md border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
        />
        <input
          type="number"
          name="maxPrice"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Cena max (zł)"
          className="rounded-md border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
        />
        <select
          name="rooms"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
        >
          <option value="">Liczba pokoi</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
        <select
          name="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-md border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
        >
          <option value="price-asc">Cena rosnąco</option>
          <option value="price-desc">Cena malejąco</option>
          <option value="date-asc">Data rosnąco</option>
          <option value="date-desc">Data malejąco</option>
          <option value="area-asc">Powierzchnia rosnąco</option>
          <option value="area-desc">Powierzchnia malejąco</option>
        </select>

        <div className="flex justify-center sm:col-span-2 lg:col-span-3 xl:col-span-4">
          <button
            type="submit"
            className="w-full max-w-xs rounded-md bg-purple-600 px-6 py-3 font-semibold text-white transition hover:cursor-pointer hover:bg-purple-700"
          >
            Szukaj
          </button>
        </div>
      </form>

      {/* WYNIKI */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((offer) => (
          <Link
            href={`/listing/${offer.id}`}
            key={offer.id}
            className="rounded-xl bg-white shadow-md transition hover:shadow-lg"
          >
            <img
              src={
                offer.property.photos[0]?.file_path ??
                "https://reviveyouthandfamily.org/wp-content/uploads/2016/11/house-placeholder.jpg"
              }
              alt="Zdjęcie"
              className="h-48 w-full rounded-t-xl object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {offer.property.name}
              </h3>
              <p className="text-gray-500">{offer.property.city}</p>
              <div className="mt-2 text-sm text-gray-700">
                <p>Powierzchnia: {offer.property.area_size} m²</p>
                <p>Liczba pokoi: {offer.property.rooms.length}</p>
              </div>
              <p className="mt-2 font-bold text-purple-700">
                {offer.price_per_month} zł / mies.
              </p>
            </div>
          </Link>
        ))}
      </div>

      {listings.length >= page * offersPerPage && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={loadMore}
            className="rounded-md bg-purple-600 px-6 py-3 font-semibold text-white transition hover:cursor-pointer hover:bg-purple-700"
          >
            Pokaż więcej
          </button>
        </div>
      )}
    </section>
  );
}

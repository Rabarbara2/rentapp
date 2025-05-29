"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  getUserbyId,
  getListingByIdFull,
  isListingFavorite,
  toggleFavorite,
} from "~/server/queries";
import type {
  ListingWithFullRelations,
  UserRoleType,
  UsersType,
  UserTypeWithRoles,
} from "~/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";

export default function ListingClient({ listingId }: { listingId: number }) {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserTypeWithRoles>();
  const [offer, setOffer] = useState<ListingWithFullRelations>();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const loadData = async () => {
      const [userDb, listing, favorite] = await Promise.all([
        getUserbyId(user.id),
        getListingByIdFull(listingId),
        isListingFavorite(listingId, user.id),
      ]);

      setUserData(userDb);
      setOffer(listing);
      setIsFavorite(favorite);
      setLoading(false);
    };

    void loadData();
  }, [isLoaded, user, listingId]);

  const handleFavorite = async () => {
    if (!user) return;
    await toggleFavorite(listingId, user.id);
    setIsFavorite((prev) => !prev);
  };

  if (!isLoaded) return <p className="min-h-screen p-4">Ładowanie...</p>;
  if (!user) return <p className="min-h-screen p-4">Musisz być zalogowany.</p>;
  if (loading) return <p className="min-h-screen p-4">Pobieranie danych...</p>;
  if (!offer) return <p className="min-h-screen p-4">Nie znaleziono oferty.</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-4xl font-bold text-gray-900">
          {offer.property.name}
        </h1>
        {/* Zdjęcia */}
        {offer.property.photos.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {offer.property.photos.map((photo) => (
              <img
                key={photo.id}
                src={photo.file_path}
                alt="Zdjęcie nieruchomości"
                className="h-72 w-full rounded-xl object-cover"
              />
            ))}
          </div>
        )}
      </div>
      <div>
        <div className="flex gap-4">
          {/* Nagłówek */}

          <div className="flex basis-3/4 rounded-2xl bg-white p-8 shadow-md">
            <div className="min-w-full">
              {/* Sekcja: Szczegóły oferty */}
              <section className="mb-8">
                <div className="flex justify-between">
                  <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                    Szczegóły oferty
                  </h2>
                  <div className="flex flex-col items-center space-y-4">
                    {userData?.userRoles.some(
                      (role: UserRoleType) => role.role_id === 2,
                    ) && (
                      <button
                        onClick={handleFavorite}
                        className="rounded-md bg-purple-600 px-6 py-3 font-semibold text-white transition hover:cursor-pointer hover:bg-purple-700"
                      >
                        {isFavorite
                          ? "❤️ Usuń z ulubionych"
                          : "🤍 Dodaj do ulubionych"}
                      </button>
                    )}
                  </div>
                </div>
                <ul className="space-y-2 text-lg">
                  <li>
                    <strong>Miasto:</strong> {offer.property.city}
                  </li>
                  <li>
                    <strong>Adres:</strong> {offer.property.address}
                  </li>
                  <li>
                    <strong>Cena:</strong> {offer.price_per_month} zł/miesiąc
                  </li>
                  <li>
                    <strong>Opis:</strong>{" "}
                    {offer.property.description ?? <em>Brak opisu</em>}
                  </li>
                </ul>
              </section>

              <div>
                <strong className="text-lg">Pokoje:</strong>
                {offer?.property.rooms?.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {offer.property.rooms.map((room, index: number) => (
                        <div
                          key={index}
                          className="min-h-[5em] rounded-xl border bg-gray-50 p-4 shadow-sm"
                        >
                          <p className="font-medium text-gray-800">
                            {room.room_type} — {room.size_sqm} <span>m²</span>
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            {room.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Sekcja: Właściciel */}
          <section className="flex h-fit basis-1/4 flex-col gap-4 rounded-2xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Właściciel nieruchomości
            </h2>
            <ul className="space-y-2 text-lg">
              <li>
                <strong>Imię:</strong> {offer.property.owner?.first_name}
              </li>
              <li>
                <strong>Nazwisko:</strong> {offer.property.owner?.last_name}
              </li>
              <li>
                <strong>Email:</strong> {offer.property.owner?.email}
              </li>
              <li>
                <strong>Nr telefonu:</strong>{" "}
                {offer.property.owner?.phone_number}
              </li>
            </ul>
            <button className="mt-8 rounded-md bg-purple-600 px-6 py-3 font-semibold text-white transition hover:cursor-pointer hover:bg-purple-700">
              Skontaktuj się
            </button>
          </section>

          {/* Sekcja: Użytkownik i akcje */}
        </div>
      </div>
    </div>
  );
}

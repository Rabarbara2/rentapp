// app/dashboard/components/SavedListings.tsx
"use client";

import { useState } from "react";
import { Heart, X } from "lucide-react";
import Link from "next/link";

// Dummy data for example purposes
const dummySavedListings = [
  {
    id: "3",
    title: "Apartament z widokiem na rzekę",
    address: "ul. Bulwarowa 22, Kraków",
    price: 3200,
    bedrooms: 3,
    bathrooms: 2,
    area: 78,
    imageUrl: "https://wa-uploads.profitroom.com/apartamentytespis/1920x1080/16496727308676_apartamentytespisap1812.jpg",
  },
  {
    id: "4",
    title: "Przytulne mieszkanie na Kazimierzu",
    address: "ul. Józefa 14, Kraków",
    price: 2200,
    bedrooms: 2,
    bathrooms: 1,
    area: 52,
    imageUrl: "https://zdjecianoclegi.pl/imagesfly/big/9154/Kudowa%20Zdrój%20apartamenty-0whuslxX1EiL.jpg",
  },
];

export default function SavedListings() {
  const [savedListings, setSavedListings] = useState(dummySavedListings);
  
  const handleRemoveSaved = (id: string) => {
    // In a real app, this would make an API call
    setSavedListings(savedListings.filter(listing => listing.id !== id));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ulubione mieszkania</h2>
        <div className="flex items-center text-sm text-gray-600">
          <Heart className="mr-1 h-4 w-4 text-pink-500" fill="#ec4899" />
          <span>{savedListings.length} zapisanych</span>
        </div>
      </div>

      {savedListings.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-12 text-center">
          <p className="mb-4 text-lg text-gray-600">Nie masz jeszcze żadnych ulubionych mieszkań.</p>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
          >
            Przeglądaj mieszkania
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {savedListings.map((listing) => (
            <div key={listing.id} className="overflow-hidden rounded-lg bg-white shadow">
              <div className="relative">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="h-48 w-full object-cover"
                />
                <button
                  onClick={() => handleRemoveSaved(listing.id)}
                  className="absolute right-2 top-2 rounded-full bg-white p-1.5 shadow-md hover:bg-gray-100"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                <Link href={`/listings/${listing.id}`}>
                  <h3 className="text-lg font-bold hover:text-indigo-600">{listing.title}</h3>
                </Link>
                <p className="text-gray-600">{listing.address}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-lg font-semibold">{listing.price} zł/mies.</p>
                  <div className="flex space-x-2">
                    <span className="text-sm text-gray-600">{listing.bedrooms} pok.</span>
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-sm text-gray-600">{listing.bathrooms} łaz.</span>
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-sm text-gray-600">{listing.area} m²</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

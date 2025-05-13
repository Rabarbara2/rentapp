// app/dashboard/components/MyListings.tsx
"use client";

import { useState } from "react";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

// Dummy data for example purposes
const dummyListings = [
  {
    id: "1",
    title: "Nowoczesne mieszkanie w centrum",
    address: "ul. Warszawska 15, Kraków",
    price: 2500,
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    imageUrl: "https://r.profitroom.com/czorsztynprestige/images/rooms/3cedd504-5860-400d-abb0-0953e3f6cc1a.jpg",
  },
  {
    id: "2",
    title: "Studio blisko kampusu",
    address: "ul. Akademicka 8, Kraków",
    price: 1800,
    bedrooms: 1,
    bathrooms: 1,
    area: 38,
    imageUrl: "https://novabialka.pl/wp-content/uploads/2021/10/Apartamenty-NOVA-BIALKA-Bialka-Tatrzanska-apartament-1-salon.jpg",
  },
];

export default function MyListings() {
  const [listings, setListings] = useState(dummyListings);
  
  const handleDeleteListing = (id: string) => {
    // In a real app, this would make an API call
    setListings(listings.filter(listing => listing.id !== id));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Moje mieszkania</h2>
        <Link 
          href="/dashboard/my-listings/new"
          className="flex items-center rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Dodaj nowe
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-12 text-center">
          <p className="mb-4 text-lg text-gray-600">Nie masz jeszcze żadnych ogłoszeń.</p>
          <Link
            href="/dashboard/my-listings/new"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Dodaj pierwsze ogłoszenie
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {listings.map((listing) => (
            <div key={listing.id} className="overflow-hidden rounded-lg bg-white shadow">
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{listing.title}</h3>
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
                <div className="mt-4 flex justify-end space-x-2">
                  <Link
                    href={`/dashboard/my-listings/edit/${listing.id}`}
                    className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDeleteListing(listing.id)}
                    className="rounded-md p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

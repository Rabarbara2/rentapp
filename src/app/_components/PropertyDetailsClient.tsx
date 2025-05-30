"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Edit3, 
  Trash2, 
  Plus, 
  Settings,
  MapPin, 
  Home, 
  Users, 
  Cigarette, 
  PawPrint,
  ArrowLeft 
} from "lucide-react";

interface PropertyDetailsClientProps {
  id: string;
  propId: string;
  numericPropId: number;
  initialProperty: any;
  initialListing: any;
}

export default function PropertyDetailsClient({ 
  id, 
  propId, 
  numericPropId,
  initialProperty, 
  initialListing 
}: PropertyDetailsClientProps) {
  const [property] = useState(initialProperty);
  const [listing] = useState(initialListing);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Przycisk powrotu w lewym górnym rogu */}
      <div className="absolute top-20 left-6 z-10">
        <Link 
          href={`/profile/${id}`}
          className="inline-flex items-center text-violet-600 hover:text-violet-700 font-medium bg-white px-4 py-2 rounded-lg shadow-sm border hover:shadow-md transition-all"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Powrót do moich lokali
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Nagłówek z nazwą */}
        <div className="mb-6 pt-12">
          <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
        </div>

        {/* Przyciski akcji - ORYGINALNE LINKI */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/profile/${id}/propertyinfo/${numericPropId}/edit`}>
              <button className="inline-flex items-center justify-center px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium w-full sm:w-auto">
                <Edit3 className="w-5 h-5 mr-2" />
                Edytuj
              </button>
            </Link>
            
            <Link href={`/profile/${id}/propertyinfo/${numericPropId}/delete`}>
              <button className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium w-full sm:w-auto">
                <Trash2 className="w-5 h-5 mr-2" />
                Usuń
              </button>
            </Link>
            
            {listing ? (
              <Link href={`/profile/${id}/propertyinfo/${numericPropId}/listingedit`}>
                <button className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium w-full sm:w-auto">
                  <Settings className="w-5 h-5 mr-2" />
                  Edytuj listing
                </button>
              </Link>
            ) : (
              <Link href={`/profile/${id}/propertyinfo/${numericPropId}/listing`}>
                <button className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium w-full sm:w-auto">
                  <Plus className="w-5 h-5 mr-2" />
                  Dodaj listing
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Zdjęcia */}
            {property.photos && property.photos.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Galeria zdjęć</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                  {property.photos.map((photo: any) => (
                    <div key={photo.id} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={photo.file_path}
                        alt={`Photo ${photo.id}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 
                            "https://via.placeholder.com/400x300?text=Brak+zdjęcia";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Szczegóły oferty */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Szczegóły oferty</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Miasto: {property.city}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Home className="w-5 h-5 mr-3 text-gray-400" />
                  <span>Adres: {property.address}</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Kod pocztowy:</span> {property.postal_code}
                </div>
                {listing && (
                  <div className="text-lg font-semibold text-violet-600">
                    Cena: {listing.price_per_month} zł/miesiąc
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-900">Opis: </span>
                  <span className="text-gray-700">
                    {property.description ?? "Brak opisu"}
                  </span>
                </div>
              </div>
            </div>

            {/* Pokoje */}
            {property?.rooms?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Pokoje</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.rooms.map((room: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {room.room_type} — {room.size_sqm} m²
                          </span>
                        </div>
                        {room.description && (
                          <p className="text-sm text-gray-600">{room.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Status</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center p-4 rounded-lg bg-gray-50">
                  <div className={`w-3 h-3 rounded-full mr-3 ${listing ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="font-medium text-gray-900">
                    {listing ? 'Aktywna oferta' : 'Nieaktywna'}
                  </span>
                </div>
                {listing && (
                  <p className="text-sm text-gray-600 mt-3 text-center">
                    Oferta jest widoczna dla potencjalnych najemców
                  </p>
                )}
              </div>
            </div>

            {/* Szczegóły nieruchomości */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Szczegóły</h2>
              </div>
              <div className="p-6 space-y-4">
                {property.area_size && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Home className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-700">Powierzchnia</span>
                    </div>
                    <span className="font-medium text-gray-900">{property.area_size} m²</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Umeblowane</span>
                  </div>
                  <span className={`font-medium ${property.is_furnished ? 'text-green-600' : 'text-gray-500'}`}>
                    {property.is_furnished ? 'Tak' : 'Nie'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <PawPrint className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Zwierzęta</span>
                  </div>
                  <span className={`font-medium ${property.pets_allowed ? 'text-green-600' : 'text-red-500'}`}>
                    {property.pets_allowed ? 'Dozwolone' : 'Niedozwolone'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Cigarette className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">Palenie</span>
                  </div>
                  <span className={`font-medium ${property.smoking_allowed ? 'text-green-600' : 'text-red-500'}`}>
                    {property.smoking_allowed ? 'Dozwolone' : 'Niedozwolone'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

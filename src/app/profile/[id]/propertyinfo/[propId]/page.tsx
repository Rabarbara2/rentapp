import { redirect } from "next/navigation";
import {
  deleteProperty,
  getPropertyActiveListing,
  getPropertybyIdFull,
} from "~/server/queries";
import PropertyDetailsClient from "~/app/_components/PropertyDetailsClient";
import Navbar from "~/app/_components/navbar";

export async function generateStaticParams() {
  return [
    { id: "someId", propId: "123" },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; propId: string }>;
}) {
  const { id, propId } = await params;
  const numericPropId = Number(propId);

  if (isNaN(numericPropId)) {
    redirect("/");
  }

  const [property, listing] = await Promise.all([
    getPropertybyIdFull(numericPropId),
    getPropertyActiveListing(numericPropId),
  ]);

  if (!property || property.owner_id !== id) {
    redirect("/");
  }

<<<<<<< HEAD
  return (
    <div>
      <Navbar />
      <PropertyDetailsClient 
        id={id}
        propId={propId}
        numericPropId={numericPropId}
        initialProperty={property}
        initialListing={listing}
      />
    </div>
=======

 return (
      <main className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-8">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8">
          <div className="flex justify-between items-center mb-6">
            <Link href={`/profile/${id}/propertyinfo/${numericPropId - 1}`}>
              <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold">
                Poprzednie
              </button>
            </Link>
            <h1 className="text-4xl font-bold text-indigo-700">{property.name}</h1>
            <Link href={`/profile/${id}/propertyinfo/${numericPropId + 1}`}>
              <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold">
                Następne
              </button>
            </Link>
          </div>

          <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-800">
              {/* Description */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-xl font-semibold">Opis mieszkania</h3>
                <p>{property.description ?? "Brak opisu"}</p>
              </div>
              {/* Details Card */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <h3 className="text-lg font-bold text-indigo-600">Szczegóły</h3>
                <p><strong>Adres:</strong> {property.address}, {property.city}, {property.postal_code}</p>
                <p><strong>Rozmiar:</strong> {property.area_size ?? "Nie podano"} m²</p>
                <p><strong>Umeblowane:</strong> {property.is_furnished ? "Tak" : "Nie"}</p>
                <p><strong>Zwierzęta:</strong> {property.pets_allowed ? "Dozwolone" : "Niedozwolone"}</p>
                <p><strong>Palenie:</strong> {property.smoking_allowed ? "Dozwolone" : "Niedozwolone"}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {property.photos.map(photo => (
                <img
                  key={photo.id}
                  src={photo.file_path}
                  alt={`Photo ${photo.id}`}
                  className="w-full h-48 object-cover rounded-lg shadow"
                />
              ))}
            </div>
          </section>

          <div className="flex flex-wrap justify-center items-center gap-6 mt-6">
            <Link href={`/profile/${id}/propertyinfo/${numericPropId}/edit`}>
              <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all duration-200 font-bold">
                Edytuj
              </button>
            </Link>
            <Link href={`/profile/${id}/propertyinfo/${numericPropId}/delete`}>
              <button className="px-8 py-4 bg-red-500 text-white rounded-2xl shadow-lg hover:bg-red-600 transition-all duration-200 font-bold">
                Usuń
              </button>
            </Link>
            {listing ? (
              <Link href={`/profile/${id}/propertyinfo/${numericPropId}/listingedit`}>
                <button className="px-8 py-4 bg-green-600 text-white rounded-2xl shadow-lg hover:bg-green-700 transition-all duration-200 font-bold">
                  Edytuj listing
                </button>
              </Link>
            ) : (
              <Link href={`/profile/${id}/propertyinfo/${numericPropId}/listing`}>
                <button className="px-8 py-4 bg-purple-600 text-white rounded-2xl shadow-lg hover:bg-purple-700 transition-all duration-200 font-bold">
                  Dodaj listing
                </button>
              </Link>
            )}
          </div>
        </div>
      </main>
>>>>>>> 289150e31bb9453df2ce58c0ff4846fa241156f5
  );
}

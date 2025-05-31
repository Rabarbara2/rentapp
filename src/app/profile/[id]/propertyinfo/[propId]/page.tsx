import { redirect } from "next/navigation";
import {
  deleteProperty,
  getPropertyActiveListing,
  getPropertybyIdFull,
} from "~/server/queries";
import Link from "next/link";
import PropertyDetailsClient from "~/app/_components/PropertyDetailsClient";
import Navbar from "~/app/_components/navbar";
export const dynamic = "force-dynamic";
export async function generateStaticParams() {
  return [{ id: "someId", propId: "123" }];
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="mx-auto max-w-6xl space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <Link href={`/profile/${id}/propertyinfo/${numericPropId - 1}`}>
            <button className="rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-800 transition hover:bg-gray-400">
              Poprzednie
            </button>
          </Link>
          <h1 className="text-4xl font-bold text-indigo-700">
            {property.name}
          </h1>
          <Link href={`/profile/${id}/propertyinfo/${numericPropId + 1}`}>
            <button className="rounded-lg bg-gray-300 px-4 py-2 font-semibold text-gray-800 transition hover:bg-gray-400">
              Następne
            </button>
          </Link>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
          <div className="grid grid-cols-1 gap-6 text-gray-800 md:grid-cols-3">
            {/* Description */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-xl font-semibold">Opis mieszkania</h3>
              <p>{property.description ?? "Brak opisu"}</p>
            </div>
            {/* Details Card */}
            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-lg font-bold text-indigo-600">Szczegóły</h3>
              <p>
                <strong>Adres:</strong> {property.address}, {property.city},{" "}
                {property.postal_code}
              </p>
              <p>
                <strong>Rozmiar:</strong> {property.area_size ?? "Nie podano"}{" "}
                m²
              </p>
              <p>
                <strong>Umeblowane:</strong>{" "}
                {property.is_furnished ? "Tak" : "Nie"}
              </p>
              <p>
                <strong>Zwierzęta:</strong>{" "}
                {property.pets_allowed ? "Dozwolone" : "Niedozwolone"}
              </p>
              <p>
                <strong>Palenie:</strong>{" "}
                {property.smoking_allowed ? "Dozwolone" : "Niedozwolone"}
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {property.photos.map((photo) => (
              <img
                key={photo.id}
                src={photo.file_path}
                alt={`Photo ${photo.id}`}
                className="h-48 w-full rounded-lg object-cover shadow"
              />
            ))}
          </div>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
          <Link href={`/profile/${id}/propertyinfo/${numericPropId}/edit`}>
            <button className="rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:bg-indigo-700">
              Edytuj
            </button>
          </Link>
          <Link href={`/profile/${id}/propertyinfo/${numericPropId}/delete`}>
            <button className="rounded-2xl bg-red-500 px-8 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:bg-red-600">
              Usuń
            </button>
          </Link>
          {listing ? (
            <Link
              href={`/profile/${id}/propertyinfo/${numericPropId}/listingedit`}
            >
              <button className="rounded-2xl bg-green-600 px-8 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:bg-green-700">
                Edytuj listing
              </button>
            </Link>
          ) : (
            <Link href={`/profile/${id}/propertyinfo/${numericPropId}/listing`}>
              <button className="rounded-2xl bg-purple-600 px-8 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:bg-purple-700">
                Dodaj listing
              </button>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

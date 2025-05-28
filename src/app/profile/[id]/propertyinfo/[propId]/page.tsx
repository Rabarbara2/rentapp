import { redirect } from "next/navigation";
import {
  deleteProperty,
  getPropertyActiveListing,
  getPropertybyIdFull,
} from "~/server/queries";
import Link from "next/link";

export async function generateStaticParams() {
  return [
    { id: "someId", propId: "123" }, // propId jako string, nazwa taka sama
  ];
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string; propId: string }>;
}) {
  const { id, propId } = await params;
  const numericPropId = Number(propId);
  const listing = await getPropertyActiveListing(numericPropId);

  if (isNaN(numericPropId)) {
    redirect("/");
  }

  const property = await getPropertybyIdFull(numericPropId);

  if (!property || property.owner_id !== id) {
    redirect("/");
  }

  return (
    <div className="flex min-w-full flex-col justify-center p-12">
      <h1 className="pb-4 text-3xl font-bold">{property.name}</h1>

      <div className="text-gray-800">
        <p>
          <strong>Opis:</strong> {property.description ?? "Brak opisu"}
        </p>
        <p>
          <strong>Adres:</strong> {property.address}
        </p>
        <p>
          <strong>Miasto:</strong> {property.city}
        </p>
        <p>
          <strong>Kod pocztowy:</strong> {property.postal_code}
        </p>
        <p>
          <strong>Rozmiar:</strong> {property.area_size ?? "Nie podano"} m²
        </p>
        <p>
          <strong>Umeblowane:</strong> {property.is_furnished ? "Tak" : "Nie"}
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

      {property.photos.map((photo) => (
        <div key={photo.id}>
          <img src={photo.file_path} alt={`Photo ${photo.id}`} />
        </div>
      ))}

      <div className="flex gap-4">
        <Link href={`/profile/${id}/propertyinfo/${numericPropId}/edit`}>
          <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Edytuj
          </button>
        </Link>
        <Link href={`/profile/${id}/propertyinfo/${numericPropId}/delete`}>
          <button className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
            Usuń
          </button>
        </Link>
        {listing ? (
          <Link
            href={`/profile/${id}/propertyinfo/${numericPropId}/listingedit`}
          >
            <button className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
              edytuj listing
            </button>
          </Link>
        ) : (
          <Link href={`/profile/${id}/propertyinfo/${numericPropId}/listing`}>
            <button className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
              dodaj listing
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

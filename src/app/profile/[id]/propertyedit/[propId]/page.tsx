import { redirect } from "next/navigation";
import { getPropertiesByUserId, getPropertybyId } from "~/server/queries";
import { currentUser } from "@clerk/nextjs/server";

export default async function PropertyPage({
  params,
}: {
  params: { id: string; propId: string };
}) {
  const properties = await getPropertiesByUserId(params.id);
  const property = properties.find((p) => p.id === Number(params.propId));

  if (!property || property.owner_id !== params.id) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-3xl font-bold">{property.name}</h1>

      <div className="space-y-2 text-gray-800">
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
          <img src={photo.file_path} />
        </div>
      ))}

      <div className="mt-6 flex gap-4">
        <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Edytuj
        </button>
        <button className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
          Usuń
        </button>
        <button className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
          Dodaj listing
        </button>
      </div>
    </div>
  );
}

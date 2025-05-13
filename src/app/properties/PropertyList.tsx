"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function PropertyList() {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: properties, isLoading, error, refetch } = api.property.getAll.useQuery();

  const deleteProperty = api.property.delete.useMutation({
    onSuccess: () => {
      refetch();
      setDeletingId(null);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Czy na pewno chcesz usunąć ten lokal?")) {
      setDeletingId(id);
      deleteProperty.mutate({ id });
    }
  };

  if (isLoading) return <div>Ładowanie lokali...</div>;
  if (error) return <div>Błąd podczas ładowania lokali: {error.message}</div>;
  if (!properties || properties.length === 0) {
    return <div className="text-center text-gray-500">Nie masz jeszcze żadnych lokali.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="p-4">
              <h3 className="mb-2 text-lg font-semibold">{property.name}</h3>
              <p className="mb-1 text-sm text-gray-600">{property.address}</p>
              <p className="mb-1 text-sm text-gray-600">
                {property.city}, {property.postal_code}
              </p>
              
              {property.area_size && (
                <p className="mb-2 text-sm text-gray-600">
                  Powierzchnia: {property.area_size} m²
                </p>
              )}
              
              {property.description && (
                <p className="mb-2 mt-2 text-sm text-gray-700">{property.description}</p>
              )}
              
              <div className="mt-3 flex flex-wrap gap-2">
                {property.is_furnished && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    Umeblowane
                  </span>
                )}
                
                {property.pets_allowed && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Przyjazne zwierzętom
                  </span>
                )}
                
                {property.smoking_allowed && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Dla palących
                  </span>
                )}
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => router.push(`/properties/${property.id}`)}
                  className="rounded bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-700"
                >
                  Podgląd
                </button>
                <button
                  onClick={() => router.push(`/properties/${property.id}/edit`)}
                  className="rounded bg-amber-600 px-3 py-1 text-xs text-white hover:bg-amber-700"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
                  disabled={deletingId === property.id}
                  className={`rounded px-3 py-1 text-xs text-white ${
                    deletingId === property.id
                      ? "bg-gray-400"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {deletingId === property.id ? "Usuwanie..." : "Usuń"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
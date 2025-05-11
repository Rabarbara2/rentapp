import { Suspense } from "react";
import PropertyForm from "./PropertyForm";
import PropertyList from "./PropertyList";

export default async function PropertiesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Moje lokale</h1>
      
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Dodaj nowy lokal</h2>
        <Suspense fallback={<div>Ładowanie formularza...</div>}>
          <PropertyForm />
        </Suspense>
      </div>
      
      <div>
        <h2 className="mb-4 text-xl font-semibold">Twoje lokale</h2>
        <Suspense fallback={<div>Ładowanie danych...</div>}>
          <PropertyList />
        </Suspense>
      </div>
    </div>
  );
} 
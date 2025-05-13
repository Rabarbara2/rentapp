// app/dashboard/components/ProfileInfo.tsx
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function ProfileInfo() {
  const { user, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Ensure user data is loaded
  if (!isLoaded || !user) {
    return <div className="animate-pulse">Ładowanie danych użytkownika...</div>;
  }

  const handleSaveChanges = async () => {
    try {
      // In a real implementation, update phone number
      // await user.update({ phoneNumber });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Informacje o profilu</h2>
        <button
          onClick={() => {
            if (isEditing) {
              handleSaveChanges();
            } else {
              setIsEditing(!isEditing);
            }
          }}
          className="rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
        >
          {isEditing ? "Zapisz zmiany" : "Edytuj profil"}
        </button>
      </div>

      <div className="rounded-lg bg-gray-50 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Imię</label>
            <div className="mt-1">
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={user.firstName || ""}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                  disabled
                />
              ) : (
                <p className="text-lg">{user.firstName || "Nie podano"}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nazwisko</label>
            <div className="mt-1">
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={user.lastName || ""}
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                  disabled
                />
              ) : (
                <p className="text-lg">{user.lastName || "Nie podano"}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1">
              <p className="text-lg">{user.primaryEmailAddress?.emailAddress || "Brak adresu email"}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Numer telefonu</label>
            <div className="mt-1">
              {isEditing ? (
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Twój numer telefonu"
                  className="w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
                />
              ) : (
                <p className="text-lg">{user.phoneNumbers?.[0]?.phoneNumber || phoneNumber || "Nie podano"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

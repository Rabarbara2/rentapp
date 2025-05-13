// app/dashboard/components/Settings.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    newMessages: true,
    listingUpdates: true,
    newListings: false,
    marketingEmails: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const handleNotificationChange = (setting: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof notificationSettings],
    }));
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Hasła nie są zgodne");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Hasło musi mieć co najmniej 8 znaków");
      return;
    }

    setIsSubmitting(true);
    // In a real app, this would make an API call to change password
    setTimeout(() => {
      setIsSubmitting(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Hasło zostało zmienione!");
    }, 1000);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Czy na pewno chcesz usunąć swoje konto? Tej operacji nie można cofnąć."
    );
    if (confirmed) {
      // In a real app, this would make an API call to delete account
      alert("Konto zostało usunięte");
      router.push("/");
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Ustawienia</h2>

      {/* Password Change Section */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">Zmiana hasła</h3>
        <form onSubmit={handlePasswordChange}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Obecne hasło
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nowe hasło
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Potwierdź nowe hasło
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>
          {passwordError && (
            <p className="mb-4 text-sm text-red-600">{passwordError}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2 text-white transition-all hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Zapisywanie..." : "Zmień hasło"}
          </button>
        </form>
      </div>

      {/* Notification Settings */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">Powiadomienia</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Nowe wiadomości</h4>
              <p className="text-sm text-gray-600">
                Otrzymuj powiadomienia o nowych wiadomościach
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={notificationSettings.newMessages}
                onChange={() => handleNotificationChange("newMessages")}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Aktualizacje ogłoszeń</h4>
              <p className="text-sm text-gray-600">
                Otrzymuj powiadomienia o zmianach w obserwowanych ogłoszeniach
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={notificationSettings.listingUpdates}
                onChange={() => handleNotificationChange("listingUpdates")}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Nowe ogłoszenia</h4>
              <p className="text-sm text-gray-600">
                Otrzymuj powiadomienia o nowych ogłoszeniach pasujących do Twoich preferencji
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={notificationSettings.newListings}
                onChange={() => handleNotificationChange("newListings")}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Wiadomości marketingowe</h4>
              <p className="text-sm text-gray-600">
                Otrzymuj oferty specjalne i aktualności od RentApp
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={notificationSettings.marketingEmails}
                onChange={() => handleNotificationChange("marketingEmails")}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-semibold">Usunięcie konta</h3>
        <p className="mb-4 text-gray-600">
          Usunięcie konta spowoduje trwałe usunięcie wszystkich Twoich danych, 
          ogłoszeń i wiadomości. Tej operacji nie można cofnąć.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Usuń konto
        </button>
      </div>
    </div>
  );
}

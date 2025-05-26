// app/dashboard/components/ProfileInfo.tsx

import { currentUser } from "@clerk/nextjs/server";
import { getUserbyId } from "~/server/queries";

export default async function ProfileInfo() {
  const cUser = await currentUser();
  const user = await getUserbyId(cUser!.id);

  // Ensure user data is loaded

  const handleSaveChanges = async () => {
    try {
      // In a real implementation, update phone number
      // await user.update({ phoneNumber });
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Informacje o profilu</h2>
        <button>button</button>
      </div>

      <div className="rounded-lg bg-gray-50 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Imię
            </label>
            <div className="mt-1">
              <p className="text-lg">{user?.first_name ?? "Nie podano"}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nazwisko
            </label>
            <div className="mt-1">
              {<p className="text-lg">{user?.last_name ?? "Nie podano"}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1">
              <p className="text-lg">{user?.email ?? "Brak adresu email"}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Numer telefonu
            </label>
            <div className="mt-1">
              {<p className="text-lg">{user?.phone_number ?? "Nie podano"}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function ProfilePage() {
  // Placeholder user data
  const user = {
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jan.kowalski@example.com",
    phone: "",
    imageUrl: "/default-avatar.png",
    registrationDate: "2025-01-15",
    isActive: true,
    bankAccount: "PL12345678901234567890123456",
  };

  return (
    <HydrateClient>
      <header className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-full mx-auto flex items-center justify-between h-16 px-8">
          <h1 className="text-3xl font-extrabold">RentApp</h1>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton>
                <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-indigo-600 transition font-semibold text-lg">
                  Zaloguj
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-indigo-600 transition font-semibold text-lg">
                  Zarejestruj
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "ring-4 ring-white" } }} />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 px-8 py-12">
          {/* Sidebar */}
          <aside className="bg-white p-6 rounded-2xl shadow-md space-y-6">
            <div className="flex flex-col items-center">
              <img
                src={user.imageUrl}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover shadow-md"
              />
              <button className="mt-4 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-base">
                Zmień zdjęcie
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm">Imię i nazwisko</label>
                <input
                  type="text"
                  defaultValue={`${user.firstName} ${user.lastName}`}
                  className="w-full rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm">Email</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm">Telefon</label>
                <input
                  type="tel"
                  defaultValue={user.phone}
                  placeholder="Opcjonalnie"
                  className="w-full rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
                />
              </div>
            </div>
            <button className="w-full px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold text-base">
              Zapisz zmiany
            </button>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Moje mieszkania */}
            <section className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-indigo-600">Moje mieszkania</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[
                  { id: 101, title: "Przytulna kawalerka", status: "Wynajęte" },
                  { id: 102, title: "3-pokojowe mieszkanie", status: "Dostępne" },
                  { id: 103, title: "Mieszkanie najemcy", status: "Zamieszkałe" },
                ].map((apt) => (
                  <div key={apt.id} className="flex flex-col justify-between border p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800">{apt.title}</h3>
                    <p className="mt-2 text-gray-600">
                      Status: <span className={apt.status === "Wynajęte" ? "text-red-500" : "text-green-500"}>{apt.status}</span>
                    </p>
                    <Link href={`/listings/${apt.id}`}>
                      <button className="mt-4 self-start px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold text-base">
                        Zobacz
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* Czat */}
            <section className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-indigo-600">Czat z użytkownikami</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 mb-2 text-sm">Wybierz użytkownika:</label>
                  <select className="w-full rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base">
                    <option value="anna">Anna</option>
                    <option value="jan">Jan Kowalski</option>
                    <option value="teresak">Teresa Kowalska</option>
                  </select>
                </div>
                <div className="h-48 overflow-y-auto border rounded-md p-4 bg-gray-50 text-base">
                  {/* messages */}
                  {[
                    { from: "Anna", text: "Czy kawalerka jest dostępna?" },
                    { from: "Jan", text: "Tak, proszę o kontakt." },
                  ].map((msg, idx) => (
                    <div key={idx} className="mb-2">
                      <span className="font-semibold text-indigo-600">{msg.from}:</span>
                      <span className="ml-2 text-gray-800">{msg.text}</span>
                    </div>
                  ))}
                </div>
                <form className="flex">
                  <input
                    type="text"
                    placeholder="Napisz wiadomość..."
                    className="flex-1 rounded-l-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition font-semibold text-base"
                  >
                    Wyślij
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

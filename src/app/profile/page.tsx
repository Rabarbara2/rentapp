import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { getUserbyId, getUserbyMail } from "~/server/queries";

export default async function ProfilePage() {
  // Placeholder user data
  const user = await getUserbyMail("cokolwiek@wp.pl");

  return (
    <div>
      <header className="flex h-16 w-full items-center justify-between bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 text-white shadow-lg">
        <h1 className="text-3xl font-extrabold">RentApp</h1>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <button className="rounded border border-white px-4 py-2 font-medium text-white transition hover:bg-white hover:text-indigo-600">
                Zaloguj
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="rounded border border-white px-4 py-2 font-medium text-white transition hover:bg-white hover:text-indigo-600">
                Zarejestruj
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/properties"
              className="mr-4 font-medium text-white hover:text-gray-200"
            >
              Moje lokale
            </Link>
            <UserButton
              appearance={{
                elements: { userButtonAvatarBox: "ring-2 ring-white" },
              }}
            />
          </SignedIn>
        </div>
      </header>

      <main className="flex min-h-screen flex-col bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800">
        <div className="grid grid-cols-1 gap-8 px-8 py-12 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="space-y-6 rounded-2xl bg-white p-6 shadow-md">
            <div className="flex flex-col items-center">
              <img
                src={
                  "https://www.vipazor.pl/img/imagecache/ae4dea579ef5c0f6f447c6755ef195765814519f.webp"
                }
                alt="Avatar"
                className="h-32 w-32 rounded-full object-cover shadow-md"
              />
              <button className="mt-4 rounded-lg bg-purple-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-purple-700">
                Zmień zdjęcie
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">
                  Imię i nazwisko
                </label>
                <input
                  type="text"
                  defaultValue={`${user?.first_name} ${user?.last_name}`}
                  className="w-full rounded-md border border-gray-300 p-3 text-base focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="w-full rounded-md border border-gray-300 p-3 text-base focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Telefon</label>
                <input
                  type="tel"
                  defaultValue={user?.phone_number ?? "brak"}
                  placeholder="Opcjonalnie"
                  className="w-full rounded-md border border-gray-300 p-3 text-base focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>
            </div>
            <button className="w-full rounded-lg bg-indigo-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-indigo-700">
              Zapisz zmiany
            </button>
          </aside>

          {/* Main Content */}
          <div className="space-y-8 lg:col-span-3">
            {/* Moje mieszkania */}
            <section className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-2xl font-bold text-indigo-600">
                Moje mieszkania
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[
                  { id: 101, title: "Przytulna kawalerka", status: "Wynajęte" },
                  {
                    id: 102,
                    title: "3-pokojowe mieszkanie",
                    status: "Dostępne",
                  },
                  {
                    id: 103,
                    title: "Mieszkanie najemcy",
                    status: "Zamieszkałe",
                  },
                ].map((apt) => (
                  <div
                    key={apt.id}
                    className="flex flex-col justify-between rounded-lg border p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {apt.title}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Status:{" "}
                      <span
                        className={
                          apt.status === "Wynajęte"
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        {apt.status}
                      </span>
                    </p>
                    <Link href={`/listings/${apt.id}`}>
                      <button className="mt-4 self-start rounded-lg bg-indigo-600 px-6 py-2 text-base font-semibold text-white transition hover:bg-indigo-700">
                        Zobacz
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* Czat */}
            <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-indigo-600">
                Skrzynka odbiorcza
              </h2>
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
                {/* Email list */}
                <aside className="col-span-1 border-r pr-4">
                  <ul className="space-y-4">
                    <li className="cursor-pointer rounded p-2 hover:bg-gray-100">
                      <h3 className="font-semibold text-gray-800">
                        Zapytanie o mieszkanie
                      </h3>
                      <p className="text-sm text-gray-600">Anna, 2025-05-10</p>
                    </li>
                    <li className="cursor-pointer rounded p-2 hover:bg-gray-100">
                      <h3 className="font-semibold text-gray-800">
                        Potwierdzenie rezerwacji
                      </h3>
                      <p className="text-sm text-gray-600">
                        Biuro RentApp, 2025-05-08
                      </p>
                    </li>
                    <li className="cursor-pointer rounded p-2 hover:bg-gray-100">
                      <h3 className="font-semibold text-gray-800">
                        Przypomnienie płatności
                      </h3>
                      <p className="text-sm text-gray-600">
                        Jan Kowalski, 2025-05-05
                      </p>
                    </li>
                  </ul>
                </aside>
                {/* Email content placeholder */}
                <div className="col-span-1 md:col-span-3">
                  <h3 className="mb-2 text-xl font-semibold">
                    Treść wiadomości
                  </h3>
                  <p className="text-gray-800">
                    Wybierz wiadomość z listy, aby zobaczyć jej treść.
                  </p>
                </div>
              </div>
              {/* Compose Email */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-indigo-600">
                  Wyślij nowy e-mail
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">
                      Do:
                    </label>
                    <input
                      type="text"
                      placeholder="Adres e-mail odbiorcy"
                      className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">
                      Temat:
                    </label>
                    <input
                      type="text"
                      placeholder="Temat wiadomości"
                      className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">
                      Treść:
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Napisz wiadomość..."
                      className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Wyślij e-mail
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

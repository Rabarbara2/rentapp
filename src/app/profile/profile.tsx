import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <HydrateClient>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 py-12 px-4">
          <Sidebar />
          <div className="lg:col-span-3 space-y-8">
            <MyApartments />
            <ChatSection />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

function Header() {
  return (
    <header className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow">
      <div className="flex h-16 items-center justify-between max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold">RentApp</h1>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-indigo-600 transition font-semibold">
                Zaloguj
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-indigo-600 transition font-semibold">
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
  );
}

function Sidebar() {
  const user = { firstName: "Jan", lastName: "Kowalski", email: "jan.kowalski@example.com", phone: "", imageUrl: "/default-avatar.png" };
  return (
    <aside className="bg-white p-6 rounded-2xl shadow-md space-y-6">
      <div className="flex flex-col items-center">
        <img src={user.imageUrl} alt="Avatar" className="w-32 h-32 rounded-full shadow" />
        <button className="mt-4 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold">
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
                disabled
                className="w-full rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
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
      <button className="w-full px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold">
        Zapisz zmiany
      </button>
    </aside>
  );
}

function Field({ label, value, disabled, placeholder }) {
  return (
    <div>
      <label className="block text-gray-600 text-sm">{label}</label>
      <input
        type="text"
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
    </div>
  );
}

function MyApartments() {
  const apartments = [
    { id: 101, title: "Przytulna kawalerka", status: "Wynajęte" },
    { id: 102, title: "3-pokojowe mieszkanie", status: "Dostępne" },
    { id: 103, title: "Mieszkanie najemcy", status: "Zamieszkałe" },
  ];
  return (
    <section className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-600">Moje mieszkania</h2>
        <select className="rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400">
          <option>Wszystkie</option>
          <option>Dostępne</option>
          <option>Wynajęte</option>
          <option>Zamieszkałe</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {apartments.map(apt => (
          <div key={apt.id} className="border p-6 rounded-lg flex flex-col justify-between">
            <h3 className="text-lg font-semibold">{apt.title}</h3>
            <p className="mt-2">
              Status: <span className={apt.status === "Wynajęte" ? "text-red-500" : "text-green-500"}>{apt.status}</span>
            </p>
            <Link href={`/listings/${apt.id}`}>              
              <button className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold">
                Zobacz
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChatSection() {
  return (
    <section className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6">Skrzynka odbiorcza</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Email list */}
        <aside className="col-span-1 border-r pr-4">
          <ul className="space-y-4">
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">
              <h3 className="font-semibold text-gray-800">Zapytanie o mieszkanie</h3>
              <p className="text-sm text-gray-600">Anna, 2025-05-10</p>
            </li>
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">
              <h3 className="font-semibold text-gray-800">Potwierdzenie rezerwacji</h3>
              <p className="text-sm text-gray-600">Biuro RentApp, 2025-05-08</p>
            </li>
            <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">
              <h3 className="font-semibold text-gray-800">Przypomnienie płatności</h3>
              <p className="text-sm text-gray-600">Jan Kowalski, 2025-05-05</p>
            </li>
          </ul>
        </aside>
        {/* Email content placeholder */}
        <div className="col-span-1 md:col-span-3">
          <h3 className="text-xl font-semibold mb-2">Treść wiadomości</h3>
          <p className="text-gray-800">Wybierz wiadomość z listy, aby zobaczyć jej treść.</p>
        </div>
      </div>
      {/* Compose Email */}
      <div>
        <h3 className="text-lg font-bold text-indigo-600 mb-4">Wyślij nowy e-mail</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Do:</label>
            <input
              type="text"
              placeholder="Adres e-mail odbiorcy"
              className="w-full rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Temat:</label>
            <input
              type="text"
              placeholder="Temat wiadomości"
              className="w-full rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Treść:</label>
            <textarea
              rows={4}
              placeholder="Napisz wiadomość..."
              className="w-full rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Wyślij e-mail
          </button>
        </form>
      </div>
    </section>
  );
}

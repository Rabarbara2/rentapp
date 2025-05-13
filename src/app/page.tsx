import Link from "next/link";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { CustomUserMenu } from "./_components/CustomUserMenu";



export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
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
            <CustomUserMenu />
          </SignedIn>
        </div>
      </header>

      <main className="flex flex-col items-center space-y-12 bg-gradient-to-b from-gray-100 to-gray-200 py-12 text-gray-800">
        {/* Sekcja polecanych ofert */}
        <section className="w-full max-w-6xl px-8">
          <h2 className="mb-8 text-center text-4xl font-bold text-gray-900 md:text-5xl">
            Polecane oferty
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 1,
                title: "Przytulna kawalerka w centrum",
                price: 800,
                img: "https://www.budnex.pl/blog/wp-content/uploads/2022/12/Jak-tanio-urzadzic-mieszkanie.jpg",
              },
              {
                id: 2,
                title: "Przestronne 2 pokoje na przedmieściach",
                price: 1200,
                img: "https://architecturaldigest.pl/i/publications/85/1920_1080/male-mieszkanie-w-spokojnym-i-relaksujacym-klasycznym-stylu-1838-85-18694.jpg",
              },
              {
                id: 3,
                title: "Luksusowy penthouse",
                price: 2500,
                img: "https://zainwestujwnieruchomosci.pl/images/article/penthouse-sektor-nieruchomosci-luksusowych-ktory-w-polsce-dziala-naprawde-preznie.jpg",
              },
            ].map((rental) => (
              <Link
                key={rental.id}
                href={`/listings/${rental.id}`}
                className="block transform overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <img
                  src={rental.img}
                  alt={rental.title}
                  className="h-56 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="mb-2 h-20 text-2xl font-semibold text-indigo-600">
                    {rental.title}
                  </h3>
                  <p className="text-lg font-medium">
                    {rental.price} zł / miesiąc
                  </p>
                  <button className="mt-4 inline-block rounded bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700">
                    Zobacz szczegóły
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Sekcja wyszukiwania */}
        <section className="w-full max-w-6xl px-8">
          <h2 className="mb-8 text-center text-4xl font-bold text-gray-900 md:text-5xl">
            Znajdź mieszkanie
          </h2>
          <form className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-6 shadow-md sm:grid-cols-2 lg:grid-cols-3">
            <input
              type="text"
              name="minPrice"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Cena min (zł)"
              className="appearance-none rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            <input
              type="text"
              name="maxPrice"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Cena max (zł)"
              className="appearance-none rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            <select
              name="rooms"
              className="rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            >
              <option value="">Dowolna liczba pokoi</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            <div className="flex justify-center sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                className="w-full rounded-md bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 lg:w-auto"
              >
                Szukaj
              </button>
            </div>
          </form>
        </section>

        {/* Sekcja użytkownika */}
        <section className="w-full max-w-6xl px-8 text-center">
          <p className="mb-4 text-xl text-gray-700">
            {session && (
              <span>
                Zalogowany jako <strong>{session.user?.name}</strong>
              </span>
            )}
          </p>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="inline-block rounded-md bg-pink-500 px-6 py-3 font-semibold text-white transition hover:bg-pink-600"
          >
            {session ? "Wyloguj" : "Zaloguj"}
          </Link>
        </section>
      </main>
    </HydrateClient>
  );
}

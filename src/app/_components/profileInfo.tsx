// ClientSideProfile.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileInfo({
  id,
  name,
  lastName,
  email,
  phone,
  bank,
}: {
  id: string;
  name: string | null | undefined;
  lastName: string | null | undefined;
  email: string | null | undefined;
  phone: string | null | undefined;
  bank: string | null | undefined;
}) {
  const { isLoaded, user } = useUser();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded) setLoading(false);
  }, [isLoaded]);
  useEffect(() => {
    if (isLoaded && (!user || user.id !== id)) {
      router.push("/");
    }
  }, [isLoaded, user, id, router]);

  return (
    <div className="flex min-h-[25rem] w-full flex-col gap-5 rounded p-3 text-lg shadow">
      <div className="flex justify-center pb-2 text-2xl font-bold">
        Informacje o profilu
      </div>
      {loading ? (
        <div className="items-center justify-center">Ładowanie danych...</div>
      ) : !user || user.id !== id ? (
        <div className="grow items-center justify-center">
          nie powinno cię tu być...
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-center">
            <div className="pl-0.5 text-sm text-zinc-600">imię i nazwisko</div>
            <div>
              {name} {lastName}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="pl-0.5 text-sm text-zinc-600">adres e-mail</div>
            <div>{email}</div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="pl-0.5 text-sm text-zinc-600">numer telefonu</div>
            <div>{phone}</div>
          </div>
          <div className="">
            {bank ? (
              <div className="flex flex-col justify-center">
                <div className="pl-0.5 text-sm text-zinc-600">
                  numer konta bankowego
                </div>
                <div>{bank}</div>
              </div>
            ) : null}
          </div>
          <button
            onClick={() => {
              router.push(`${pathname}/edit`);
            }}
            className="rounded-xl bg-violet-600 p-2 text-white hover:cursor-pointer hover:bg-violet-500"
          >
            Zmień dane
          </button>
        </>
      )}
    </div>
  );
}

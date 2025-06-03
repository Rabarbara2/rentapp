"use client";

import { useState } from "react";
import type { NotificationType } from "~/server/db/schema";
import {
  acceptRentalAgreementFromNotification,
  rejectRentalAgreementFromNotification,
} from "~/server/queries";

export default function NotificationsListR({
  notifications: initialNotifications,
}: {
  notifications: NotificationType[];
}) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleAccept = async (notificationId: number) => {
    const res = await acceptRentalAgreementFromNotification(notificationId);
    if (res.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } else {
      alert("Wystąpił błąd przy zatwierdzaniu umowy.");
    }
  };

  const handleReject = async (notificationId: number) => {
    console.log(await rejectRentalAgreementFromNotification(notificationId));
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  if (!notifications.length) {
    return (
      <div className="flex min-h-[15rem] w-full flex-col gap-4 rounded bg-white p-3 text-lg shadow">
        <div className="text-center text-xl font-bold text-gray-700">
          Powiadomienia
        </div>
        <p className="text-center text-zinc-600">Brak nowych powiadomień.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[15rem] w-full flex-col gap-4 rounded bg-white p-3 text-lg shadow">
      <div className="mb-2 text-center text-xl font-bold text-gray-700">
        Powiadomienia
      </div>
      <ul className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <li key={notification.id} className="py-3">
            <div className="font-semibold text-gray-800">
              {notification.title}
            </div>
            <p className="text-gray-600">{notification.content}</p>
            <div className="mt-1 text-xs text-gray-400">
              {new Date(notification.created_at).toLocaleString()}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleAccept(notification.id)}
                className="rounded-md bg-green-500 px-4 py-1 text-sm text-white hover:bg-green-600"
              >
                ✅ Zaakceptuj
              </button>
              <button
                onClick={() => handleReject(notification.id)}
                className="rounded-md bg-red-500 px-4 py-1 text-sm text-white hover:bg-red-600"
              >
                ❌ Odrzuć
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

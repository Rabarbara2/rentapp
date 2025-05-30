// NotificationsList.tsx
"use client";

import type { NotificationType } from "~/server/db/schema";

export default function NotificationsList({
  notifications,
}: {
  notifications: NotificationType[];
}) {
  if (!notifications.length) {
    return (
      <div className="flex min-h-[15rem] w-full flex-col gap-4 rounded bg-white p-3 text-lg shadow">
        <div className="text-center text-xl font-bold">Powiadomienia</div>
        <p className="text-center text-zinc-600">Brak nowych powiadomień.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[15rem] w-full flex-col gap-4 rounded bg-white p-3 text-lg shadow">
      <div className="mb-2 text-center text-xl font-bold">Powiadomienia</div>
      <ul className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <li key={notification.id} className="py-2">
            <div className="font-semibold text-gray-800">
              {notification.title}
            </div>
            <p className="text-gray-600">{notification.content}</p>
            <div className="mt-1 text-xs text-gray-400">
              {new Date(notification.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

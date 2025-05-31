import MyFavorites from "~/app/_components/MyFavorites";
import MyProperties from "~/app/_components/myProperties";
import Navbar from "~/app/_components/navbar";
import ProfileInfo from "~/app/_components/profileInfo";
import NotificationsList from "~/app/_components/profileNotifications";
export const dynamic = "force-dynamic";
import type { UserRoleTypeWithRoles } from "~/server/db/schema";
import {
  getFavoritesByUserId,
  getPropertiesByUserId,
  getUserbyId,
  getUserRoles,
  getUnreadNotificationsByUserId,
} from "~/server/queries";

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getUserbyId(id);
  if (!user) return <p>Nie znaleziono użytkownika</p>;

  const properties = await getPropertiesByUserId(id);
  const favorites = await getFavoritesByUserId(id);
  const roles = await getUserRoles(user.id);
  const notifications = await getUnreadNotificationsByUserId(user.id);

  const isAdmin = roles.some(
    (role: UserRoleTypeWithRoles) => role.role.name === "ADMIN",
  );
  const isLandlord = roles.some(
    (role: UserRoleTypeWithRoles) => role.role.name === "LANDLORD",
  );
  const isRenter = roles.some(
    (role: UserRoleTypeWithRoles) => role.role.name === "RENTER",
  );

  return (
    <div className="h-screen w-screen">
      <Navbar />
      <div className="flex min-h-1/2 gap-6 p-12">
        <div className="flex min-h-1/2 w-1/4 flex-col gap-6">
          <ProfileInfo
            id={id}
            name={user.first_name}
            lastName={user.last_name}
            email={user.email}
            bank={user.bank_account}
            phone={user.phone_number}
          />
          <NotificationsList notifications={notifications} />
        </div>
        <div className="w-2/3">
          {isLandlord && <MyProperties properties={properties} />}
          {isRenter && <MyFavorites favs={favorites} />}
        </div>
      </div>
    </div>
  );
}

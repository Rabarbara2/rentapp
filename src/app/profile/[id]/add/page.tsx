import AddPropertyForm from "~/app/_components/addPropertyForm";
import MyProperties from "~/app/_components/myProperties";
import Navbar from "~/app/_components/navbar";
import ProfileInfo from "~/app/_components/profileInfo";
import { getPropertiesByUserId, getUserbyId } from "~/server/queries";

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserbyId(id);
  return (
    <div className="h-screen w-screen">
      <Navbar />
      <div className="flex min-h-1/2 w-full justify-center gap-6 p-12">
        <AddPropertyForm user={user!} />
      </div>
    </div>
  );
}

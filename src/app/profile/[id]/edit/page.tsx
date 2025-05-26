import EditForm from "~/app/_components/editForm";
import Navbar from "~/app/_components/navbar";
import { getUserbyId } from "~/server/queries";

export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserbyId(id);
  return (
    <div className="flex h-screen flex-col items-center">
      <Navbar />
      <div className="flex h-full w-full items-center justify-center">
        <EditForm user={user!} />
      </div>
    </div>
  );
}

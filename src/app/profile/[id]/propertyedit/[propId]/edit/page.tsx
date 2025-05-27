import { redirect } from "next/navigation";
import {
  getPropertiesByUserId,
  getPropertybyId,
  getPropertybyIdFull,
} from "~/server/queries";
import { currentUser } from "@clerk/nextjs/server";
import EditPropertyForm from "~/app/_components/editPropertyForm";
import Navbar from "~/app/_components/navbar";

export default async function PropertyPage({
  params,
}: {
  params: { id: string; propId: number };
}) {
  const property = await getPropertybyIdFull(params.propId);

  if (!property || property.owner_id !== params.id) {
    redirect("/");
  }

  return (
    <div>
      <Navbar />
      <div className="flex min-w-full flex-col justify-center p-12">
        <EditPropertyForm defaultValues={property} propId={property.id} />
      </div>
    </div>
  );
}

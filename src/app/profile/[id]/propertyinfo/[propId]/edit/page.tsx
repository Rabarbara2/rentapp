import { redirect } from "next/navigation";
import { getPropertybyIdFull } from "~/server/queries";

import EditPropertyForm from "~/app/_components/editPropertyForm";
import Navbar from "~/app/_components/navbar";
export const dynamic = "force-dynamic";
export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string; propId: string }>;
}) {
  const { id, propId } = await params;
  const propIdNumber = Number(propId);
  if (isNaN(propIdNumber)) {
    redirect("/");
  }

  const property = await getPropertybyIdFull(propIdNumber);

  if (!property || property.owner_id !== id) {
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

import { redirect } from "next/navigation";
import {
  getPropertyActiveListing,
  getPropertybyIdFull,
} from "~/server/queries";

import Navbar from "~/app/_components/navbar";

import EditListingForm from "~/app/_components/editListingForm";
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
  const listing = await getPropertyActiveListing(propIdNumber);
  if (!property || property.owner_id !== id) {
    redirect("/");
  }

  return (
    <div>
      <Navbar />
      <div className="flex min-w-full flex-col justify-center p-12">
        <EditListingForm property={property} listing={listing!} />
      </div>
    </div>
  );
}

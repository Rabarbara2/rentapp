import { redirect } from "next/navigation";
import {
  getPropertiesByUserId,
  getPropertyActiveListing,
  getPropertybyId,
  getPropertybyIdFull,
} from "~/server/queries";
import { currentUser } from "@clerk/nextjs/server";
import EditPropertyForm from "~/app/_components/editPropertyForm";
import Navbar from "~/app/_components/navbar";
import AddListingForm from "~/app/_components/addListingForm";
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

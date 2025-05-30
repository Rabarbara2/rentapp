import { redirect } from "next/navigation";
import {
  deleteProperty,
  getPropertyActiveListing,
  getPropertybyIdFull,
} from "~/server/queries";
import PropertyDetailsClient from "~/app/_components/PropertyDetailsClient";
import Navbar from "~/app/_components/navbar";

export async function generateStaticParams() {
  return [
    { id: "someId", propId: "123" },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; propId: string }>;
}) {
  const { id, propId } = await params;
  const numericPropId = Number(propId);

  if (isNaN(numericPropId)) {
    redirect("/");
  }

  const [property, listing] = await Promise.all([
    getPropertybyIdFull(numericPropId),
    getPropertyActiveListing(numericPropId),
  ]);

  if (!property || property.owner_id !== id) {
    redirect("/");
  }

  return (
    <div>
      <Navbar />
      <PropertyDetailsClient 
        id={id}
        propId={propId}
        numericPropId={numericPropId}
        initialProperty={property}
        initialListing={listing}
      />
    </div>
  );
}

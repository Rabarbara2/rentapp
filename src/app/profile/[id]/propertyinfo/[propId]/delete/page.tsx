import { redirect } from "next/navigation";
import Navbar from "~/app/_components/navbar";
import { getPropertybyIdFull, deleteProperty } from "~/server/queries";
export const dynamic = "force-dynamic";
export default async function DeletePropertyPage({
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

  async function handleDelete() {
    "use server";
    await deleteProperty({ id: propIdNumber });
    redirect(`/profile/${id}`); // lub gdziekolwiek chcesz przekierować po usunięciu
  }

  return (
    <div className="max-h-full min-h-full min-w-full">
      <Navbar />
      <div className="flex h-full w-full flex-col items-center justify-center p-12">
        <h1 className="mb-6 text-2xl font-bold">
          Czy na pewno chcesz usunąć: &quot;{property.name}&quot;?
        </h1>
        {property.photos[0] && (
          <img
            src={property.photos[0]?.file_path}
            alt={`Photo `}
            className="m-6 h-96 rounded-2xl"
          />
        )}

        <form action={handleDelete} className="flex gap-4">
          <button
            type="submit"
            className="rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700"
          >
            Tak, usuń
          </button>

          <a
            href={`/profile/${id}/propertyinfo/${propId}`}
            className="rounded bg-gray-400 px-6 py-2 text-white hover:bg-gray-500"
          >
            Anuluj
          </a>
        </form>
      </div>
    </div>
  );
}

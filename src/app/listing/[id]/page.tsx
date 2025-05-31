export const dynamic = "force-dynamic";
import ListingClient from "~/app/_components/listingPageClient";
import Navbar from "~/app/_components/navbar";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listingId = Number(id);

  return (
    <div>
      <Navbar />
      <main className="flex flex-col items-center space-y-12 bg-gradient-to-b from-gray-100 to-gray-200 py-12 text-gray-800">
        <section className="w-full px-8">
          <ListingClient listingId={listingId} />
        </section>
      </main>
    </div>
  );
}

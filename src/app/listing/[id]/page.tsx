import ListingClient from "~/app/_components/listingPageClient";
import Navbar from "~/app/_components/navbar";

export default function ListingPage({ params }: { params: { id: string } }) {
  const listingId = Number(params.id);

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

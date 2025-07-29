import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default async function TripPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return redirect("/api/auth/signin");

  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    include: {
      organizer: true,
      members: { include: { user: true } },
    },
  });

  if (!trip) return redirect("/trips");

  // Check membership
  const isMember = trip.members.some((m) => m.userId === session.user.id);
  if (!isMember) return redirect("/trips");

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="bg-white shadow rounded p-6">
        <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
        <p className="text-gray-600 mb-4">{trip.description}</p>
        <p className="text-sm text-gray-500 mb-2">
          {new Date(trip.startDate).toLocaleDateString()} - {" "}
          {new Date(trip.endDate).toLocaleDateString()}
        </p>
        <p className="text-gray-700 mb-4">Destination: {trip.destination}</p>
        <h3 className="font-medium mb-1">Participants ({trip.members.length})</h3>
        <ul className="list-disc list-inside text-gray-700">
          {trip.members.map((m) => (
            <li key={m.user.id}>{m.user.name || m.user.email}</li>
          ))}
        </ul>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Itinerary</h2>
        <p className="text-gray-600 mb-4">
          Drag & drop calendar functionality coming soon.
        </p>
        <Link
          href={`/trips/${trip.id}/activities/new`}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          + Add Activity
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Suggestions Board</h2>
        <p className="text-gray-600 mb-4">Activity voting board coming soon.</p>
        <Link
          href={`/trips/${trip.id}/suggestions/new`}
          className="px-4 py-2 bg-primary text-white rounded"
        >
          + New Suggestion
        </Link>
      </section>
    </div>
  );
}
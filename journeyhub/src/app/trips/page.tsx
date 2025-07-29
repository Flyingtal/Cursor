import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function TripsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return redirect("/api/auth/signin");

  const trips = await prisma.tripMember.findMany({
    where: { userId: session.user.id },
    include: { trip: true },
  });

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Trips</h1>
        <Link
          href="/trips/new"
          className="px-4 py-2 bg-primary text-white rounded"
        >
          + New Trip
        </Link>
      </div>
      {trips.length === 0 ? (
        <p>You haven&apos;t joined any trips yet.</p>
      ) : (
        <ul className="grid md:grid-cols-2 gap-6">
          {trips.map((tm) => (
            <li key={tm.trip.id} className="border rounded p-4 bg-white shadow">
              <h2 className="text-xl font-semibold mb-2">{tm.trip.title}</h2>
              <p className="text-sm text-gray-600">
                {new Date(tm.trip.startDate).toLocaleDateString()} - {" "}
                {new Date(tm.trip.endDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-2">{tm.trip.destination}</p>
              <Link
                href={`/trips/${tm.trip.id}`}
                className="text-primary hover:underline"
              >
                Open Trip
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
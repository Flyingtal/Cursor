import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <h1 className="text-5xl font-bold mb-4 text-primary">JourneyHub</h1>
      <p className="mb-8 text-lg max-w-xl">
        Plan unforgettable trips together. Create private trip circles, build collaborative itineraries, and share memories – all in one place.
      </p>
      {session ? (
        <Link
          href="/trips/new"
          className="px-6 py-3 bg-primary text-white rounded-full shadow hover:bg-primary-dark"
        >
          Create New Trip
        </Link>
      ) : (
        <Link
          href="/api/auth/signin"
          className="px-6 py-3 bg-primary text-white rounded-full shadow hover:bg-primary-dark"
        >
          Sign In to Get Started
        </Link>
      )}
    </main>
  );
}
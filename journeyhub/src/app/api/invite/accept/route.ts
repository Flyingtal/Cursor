import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const invitation = await prisma.invitation.findUnique({ where: { token } });
  if (!invitation) return NextResponse.json({ error: "Invalid invitation" }, { status: 400 });
  if (invitation.accepted) return NextResponse.json({ error: "Invitation already accepted" }, { status: 400 });

  await prisma.$transaction([
    prisma.invitation.update({ where: { id: invitation.id }, data: { accepted: true, acceptedAt: new Date() } }),
    prisma.tripMember.create({ data: { tripId: invitation.tripId, userId: session.user.id } }),
  ]);

  return NextResponse.json({ tripId: invitation.tripId });
}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const { title, description, startDate, endDate, destination, inviteEmails } = data;

  const trip = await prisma.trip.create({
    data: {
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      destination,
      organizerId: session.user.id,
      members: {
        create: [{ userId: session.user.id, role: "organizer" }],
      },
    },
  });

  if (inviteEmails && Array.isArray(inviteEmails)) {
    for (const email of inviteEmails) {
      const token = uuidv4();
      await prisma.invitation.create({
        data: {
          tripId: trip.id,
          email,
          token,
          invitedById: session.user.id,
        },
      });
      await sendInvitationEmail(email, token, trip);
    }
  }

  return NextResponse.json({ trip });
}

async function sendInvitationEmail(email: string, token: string, trip: any) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const link = `${process.env.NEXTAUTH_URL}/invite/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `You're invited to join ${trip.title} on JourneyHub`,
    html: `<p>Hello! You've been invited to join the trip circle <b>${trip.title}</b> on JourneyHub.</p>
           <p>Click the link below to accept the invitation and join:</p>
           <p><a href="${link}">Accept Invitation</a></p>
           <p>This link is unique to you and should not be shared.</p>`,
  });
}
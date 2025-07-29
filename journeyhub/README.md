# JourneyHub

JourneyHub is a private, social itinerary planner that helps groups collaboratively plan unforgettable trips.

## Features (MVP)

1. **Private Trip Circles & Invitations**
   - Organizers can create a named trip and invite participants by email.
   - Invitation emails include a secure join link; new users sign up or log in to join.
   - All trip content is visible only to invited members.

2. **Trip Overview**
   - Title, description, start/end dates, and destination details.
   - Summary card lists participants.

3. **Collaborative Itinerary Builder (Coming Soon)**
   - Calendar / timeline with drag-and-drop activities.
   - RSVP tracking per activity.

4. **Activity Suggestions & Voting (Coming Soon)**
   - Suggestion board with upvote/downvote and threaded comments.

5. **Discussion Board & Chat (Planned)**

6. **Notifications**
   - Email invitations now; Twilio & other notifications can be enabled via environment variables.

## Tech Stack

- **Next.js 14 App Router** (TypeScript, React Server Components)
- **Prisma + PostgreSQL** ORM/database
- **NextAuth.js** authentication (magic-link email provider by default)
- **Tailwind CSS** for sleek, pastel-accent UI
- **Nodemailer** for emails (Twilio optional)

## Getting Started

1. **Clone & install**

```bash
cd journeyhub
npm install
```

2. **Configure environment**

Copy the provided `.env.example` to `.env.local` and fill out required variables:

```bash
cp .env.example .env.local
```

Set up a PostgreSQL database and update `DATABASE_URL`.

3. **Generate Prisma client & migrate**

```bash
npx prisma migrate dev --name init
```

4. **Run the dev server**

```bash
npm run dev
```

Open http://localhost:3000 – sign in via email magic link and start creating trips!

## Roadmap

- Drag & drop itinerary calendar
- Suggestion voting board
- Real-time comments & chat (using Next.js Streaming or Socket.io)
- RSVP component with attendee counts
- Interactive maps and “Get directions” links
- Budget tracker with charts
- Photo gallery & auto-generated trip recap
- Organizer dashboard with analytics

Contributions welcome! 🎉
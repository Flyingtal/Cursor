# JourneyHub - Social Itinerary Planner

A private, social itinerary planner for trips and vacations. Plan your adventures collaboratively with friends and family in beautiful, warm-toned interface.

## ✨ Features

### 🎯 Core Features (Implemented)
- **Private Trip Circles**: Create named trip circles and invite participants by email
- **User Authentication**: Secure email-based authentication with NextAuth.js
- **Trip Creation & Management**: Set trip details, dates, destinations, and descriptions
- **Collaborative Itinerary Builder**: Add activities with drag-and-drop reordering
- **Activity Management**: Create activities with titles, descriptions, locations, costs, and timing
- **Members Management**: View trip members and their roles (organizer/member)
- **Responsive Design**: Beautiful, warm pastel design optimized for mobile and desktop

### 🚧 Features (Planned)
- **Activity Suggestions & Voting**: Propose and vote on activity suggestions
- **Discussion Board & Chat**: Threaded comments and real-time discussions
- **RSVP System**: Track attendance for each activity
- **Interactive Maps**: Embedded maps with directions integration
- **Budget Tracking**: Shared expense logging and budget management
- **Notifications**: Email reminders and activity updates
- **Post-Trip Memories**: Photo gallery and trip recaps
- **Organizer Dashboard**: Advanced trip management tools

## 🛠 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Authentication**: NextAuth.js with email provider
- **Database**: SQLite with Prisma ORM
- **UI Components**: Custom components with Radix UI primitives
- **Styling**: Tailwind CSS with warm pastel color scheme
- **Drag & Drop**: @dnd-kit for activity reordering
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd journeyhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Configure environment variables**
   
   Copy `.env` and update with your settings:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Email configuration (optional - for sending invitations)
   EMAIL_SERVER_HOST=""
   EMAIL_SERVER_PORT=""
   EMAIL_SERVER_USER=""
   EMAIL_SERVER_PASSWORD=""
   EMAIL_FROM=""
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### Creating Your First Trip
1. Sign in with your email address
2. Click "Create New Trip" on the dashboard
3. Fill in trip details: title, destination, dates, and description
4. Start building your itinerary by adding activities

### Managing Activities
- **Add Activity**: Click "Add Activity" to create new itinerary items
- **Reorder**: Drag and drop activities to rearrange your schedule
- **Edit Details**: Include descriptions, locations, costs, and timing
- **Track RSVPs**: See who's attending each activity (coming soon)

### Collaborating with Others
- **Invite Members**: Share trip access with friends and family (coming soon)
- **Discuss Plans**: Use threaded comments to plan together (coming soon)
- **Vote on Ideas**: Suggest and vote on activities (coming soon)

## 🎨 Design Philosophy

JourneyHub features a warm, minimalist design with:
- **Warm Pastel Colors**: Orange and pink gradients create a welcoming atmosphere
- **Clean Typography**: Clear, readable fonts with proper hierarchy
- **Intuitive Navigation**: Tab-based interface for easy feature access
- **Mobile-First**: Responsive design optimized for all devices
- **Accessible**: High contrast ratios and keyboard navigation support

## 🏗 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── trip/              # Individual trip pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   └── trip/              # Trip-specific components
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Helper functions
└── types/                 # TypeScript type definitions
```

## 🗄 Database Schema

The application uses a comprehensive database schema with:
- **Users & Authentication**: User accounts, sessions, verification
- **Trips & Members**: Trip details and member relationships
- **Activities**: Itinerary items with full details
- **Suggestions & Voting**: Community-driven activity suggestions
- **Comments & Discussion**: Threaded conversations
- **RSVPs & Attendance**: Activity attendance tracking
- **Expenses & Budget**: Shared cost management
- **Photos & Memories**: Trip photo sharing

## 🔒 Security

- **Email Authentication**: Secure, passwordless login via email links
- **Private Trip Circles**: Only invited members can access trip content
- **Session Management**: Secure JWT-based sessions
- **Database Security**: Parameterized queries prevent SQL injection
- **Access Control**: Role-based permissions (organizer/member)

## 🤝 Contributing

This is a demonstration project showcasing modern web development practices. The codebase demonstrates:
- **Clean Architecture**: Separation of concerns and modular design
- **Type Safety**: Full TypeScript coverage
- **Database Design**: Normalized schema with proper relationships
- **UI/UX Best Practices**: Accessible, responsive design
- **Modern React Patterns**: Hooks, context, and component composition

## 📄 License

This project is built for demonstration purposes and showcases a full-stack Next.js application with modern development practices.

---

**JourneyHub** - Plan trips together, make memories forever. ✈️
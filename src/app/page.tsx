'use client'

import { useSession, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Users, Calendar, MessageSquare, Camera, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen">
        <header className="border-b border-orange-100/50 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-orange-800">JourneyHub</h1>
            <Link href="/dashboard">
              <Button className="warm-button">Go to Dashboard</Button>
            </Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome back, {session.user?.name || session.user?.email}!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Ready to plan your next adventure?
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="warm-button">
              View Your Trips
            </Button>
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-orange-100/50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-800">JourneyHub</h1>
          <Button onClick={() => signIn()} className="warm-button">
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          Plan Trips
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
            Together
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create private trip circles, collaborate on itineraries, and make unforgettable memories with friends and family.
        </p>
        <Button 
          size="lg" 
          className="warm-button text-lg px-8 py-3"
          onClick={() => signIn()}
        >
          Start Planning Your Trip
        </Button>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Everything you need for the perfect trip
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="warm-card">
            <CardHeader>
              <Users className="h-10 w-10 text-orange-500 mb-2" />
              <CardTitle>Private Trip Circles</CardTitle>
              <CardDescription>
                Invite friends and family to join your exclusive trip planning group
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="warm-card">
            <CardHeader>
              <Calendar className="h-10 w-10 text-orange-500 mb-2" />
              <CardTitle>Collaborative Itinerary</CardTitle>
              <CardDescription>
                Build your schedule together with drag-and-drop simplicity
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="warm-card">
            <CardHeader>
              <MapPin className="h-10 w-10 text-orange-500 mb-2" />
              <CardTitle>Interactive Maps</CardTitle>
              <CardDescription>
                See all your destinations on a map with directions included
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="warm-card">
            <CardHeader>
              <MessageSquare className="h-10 w-10 text-orange-500 mb-2" />
              <CardTitle>Real-time Discussion</CardTitle>
              <CardDescription>
                Chat about activities, vote on suggestions, and stay connected
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="warm-card">
            <CardHeader>
              <DollarSign className="h-10 w-10 text-orange-500 mb-2" />
              <CardTitle>Budget Tracking</CardTitle>
              <CardDescription>
                Keep track of expenses and stay within budget together
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="warm-card">
            <CardHeader>
              <Camera className="h-10 w-10 text-orange-500 mb-2" />
              <CardTitle>Trip Memories</CardTitle>
              <CardDescription>
                Share photos and create beautiful trip recaps after your adventure
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="warm-card max-w-2xl mx-auto p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of travelers who plan better trips together with JourneyHub.
          </p>
          <Button 
            size="lg" 
            className="warm-button"
            onClick={() => signIn()}
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-orange-100/50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 JourneyHub. Built for travelers, by travelers.</p>
        </div>
      </footer>
    </div>
  )
}
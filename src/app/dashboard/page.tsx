'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, MapPin, Calendar, Users, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { CreateTripDialog } from '@/components/create-trip-dialog'
import { formatDate } from '@/lib/utils'

interface Trip {
  id: string
  title: string
  description: string | null
  destination: string
  startDate: string
  endDate: string
  _count: {
    members: number
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    if (session) {
      fetchTrips()
    }
  }, [session])

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips')
      if (response.ok) {
        const data = await response.json()
        setTrips(data)
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="warm-card">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need to be signed in to view this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="warm-button">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-orange-100/50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-orange-800">
            JourneyHub
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {session.user?.name || session.user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="border-orange-200 hover:bg-orange-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {session.user?.name?.split(' ')[0] || 'Traveler'}!
          </h1>
          <p className="text-gray-600">
            {trips.length === 0 
              ? "Ready to plan your first adventure?" 
              : `You have ${trips.length} trip${trips.length === 1 ? '' : 's'} planned.`
            }
          </p>
        </div>

        {/* Create Trip Button */}
        <div className="mb-8">
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="warm-button"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Trip
          </Button>
        </div>

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <Card className="warm-card text-center py-12">
            <CardContent>
              <MapPin className="h-16 w-16 text-orange-300 mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">No trips yet</CardTitle>
              <CardDescription className="mb-4">
                Start planning your first adventure by creating a new trip circle.
              </CardDescription>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="warm-button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Link key={trip.id} href={`/trip/${trip.id}`}>
                <Card className="warm-card hover:shadow-xl transition-all duration-200 cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{trip.title}</CardTitle>
                    <CardDescription>
                      {trip.description || 'No description'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {trip.destination}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(new Date(trip.startDate))} - {formatDate(new Date(trip.endDate))}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {trip._count.members} member{trip._count.members !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <CreateTripDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onTripCreated={() => {
            fetchTrips()
            setShowCreateDialog(false)
          }}
        />
      </main>
    </div>
  )
}
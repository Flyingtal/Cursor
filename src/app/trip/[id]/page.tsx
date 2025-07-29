'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import * as Tabs from '@radix-ui/react-tabs'
import { 
  Calendar, 
  MapPin, 
  Users, 
  MessageSquare, 
  Lightbulb, 
  DollarSign, 
  Camera,
  Settings,
  ArrowLeft,
  UserPlus
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { ItineraryTab } from '@/components/trip/itinerary-tab'
import { SuggestionsTab } from '@/components/trip/suggestions-tab'
import { DiscussionTab } from '@/components/trip/discussion-tab'
import { MembersTab } from '@/components/trip/members-tab'
import { BudgetTab } from '@/components/trip/budget-tab'
import { MemoriesTab } from '@/components/trip/memories-tab'

interface Trip {
  id: string
  title: string
  description: string | null
  destination: string
  startDate: string
  endDate: string
  organizerId: string
  members: Array<{
    id: string
    user: {
      id: string
      name: string | null
      email: string
    }
    role: string
  }>
  _count: {
    activities: number
    suggestions: number
  }
}

export default function TripPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const tripId = params.id as string
  
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('itinerary')

  useEffect(() => {
    if (session && tripId) {
      fetchTrip()
    }
  }, [session, tripId])

  const fetchTrip = async () => {
    try {
      const response = await fetch(`/api/trips/${tripId}`)
      if (response.ok) {
        const data = await response.json()
        setTrip(data)
      } else if (response.status === 404) {
        // Trip not found or no access
      }
    } catch (error) {
      console.error('Error fetching trip:', error)
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

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="warm-card">
          <CardHeader>
            <CardTitle>Trip Not Found</CardTitle>
            <CardDescription>
              This trip doesn't exist or you don't have access to it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="warm-button">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOrganizer = trip.organizerId === session.user?.id
  const currentMember = trip.members.find(m => m.user.id === session.user?.id)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-orange-100/50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{trip.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {trip.destination}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(new Date(trip.startDate))} - {formatDate(new Date(trip.endDate))}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {trip.members.length} member{trip.members.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
            
            {isOrganizer && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Members
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Trip Description */}
      {trip.description && (
        <div className="container mx-auto px-4 py-4">
          <Card className="warm-card">
            <CardContent className="pt-6">
              <p className="text-gray-700">{trip.description}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex space-x-1 bg-white/80 p-1 rounded-lg border border-orange-100/50 mb-6">
            <Tabs.Trigger
              value="itinerary"
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 text-gray-600 hover:text-gray-800"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Itinerary ({trip._count.activities})
            </Tabs.Trigger>
            <Tabs.Trigger
              value="suggestions"
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 text-gray-600 hover:text-gray-800"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Suggestions ({trip._count.suggestions})
            </Tabs.Trigger>
            <Tabs.Trigger
              value="discussion"
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 text-gray-600 hover:text-gray-800"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Discussion
            </Tabs.Trigger>
            <Tabs.Trigger
              value="members"
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 text-gray-600 hover:text-gray-800"
            >
              <Users className="h-4 w-4 mr-2" />
              Members
            </Tabs.Trigger>
            <Tabs.Trigger
              value="budget"
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 text-gray-600 hover:text-gray-800"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Budget
            </Tabs.Trigger>
            <Tabs.Trigger
              value="memories"
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 text-gray-600 hover:text-gray-800"
            >
              <Camera className="h-4 w-4 mr-2" />
              Memories
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="itinerary">
            <ItineraryTab trip={trip} isOrganizer={isOrganizer} />
          </Tabs.Content>

          <Tabs.Content value="suggestions">
            <SuggestionsTab trip={trip} />
          </Tabs.Content>

          <Tabs.Content value="discussion">
            <DiscussionTab trip={trip} />
          </Tabs.Content>

          <Tabs.Content value="members">
            <MembersTab trip={trip} isOrganizer={isOrganizer} />
          </Tabs.Content>

          <Tabs.Content value="budget">
            <BudgetTab trip={trip} />
          </Tabs.Content>

          <Tabs.Content value="memories">
            <MemoriesTab trip={trip} />
          </Tabs.Content>
        </Tabs.Root>
      </main>
    </div>
  )
}
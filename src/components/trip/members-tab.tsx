'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Crown, UserPlus } from 'lucide-react'

interface Member {
  id: string
  user: {
    id: string
    name: string | null
    email: string
  }
  role: string
}

interface Trip {
  id: string
  members: Member[]
  organizerId: string
}

interface MembersTabProps {
  trip: Trip
  isOrganizer: boolean
}

export function MembersTab({ trip, isOrganizer }: MembersTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Trip Members</h2>
          <p className="text-gray-600 text-sm">
            {trip.members.length} member{trip.members.length !== 1 ? 's' : ''}
          </p>
        </div>
        {isOrganizer && (
          <Button className="warm-button">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Members
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {trip.members.map((member) => (
          <Card key={member.id} className="warm-card">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {member.user.name || member.user.email}
                  </p>
                  <p className="text-sm text-gray-500">{member.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {member.user.id === trip.organizerId && (
                  <div className="flex items-center text-orange-600 text-sm">
                    <Crown className="h-4 w-4 mr-1" />
                    Organizer
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {trip.members.length === 1 && (
        <Card className="warm-card text-center py-8">
          <CardContent>
            <Users className="h-12 w-12 text-orange-300 mx-auto mb-3" />
            <CardTitle className="text-lg mb-2">Just you so far</CardTitle>
            <CardDescription className="mb-4">
              Invite friends and family to join your trip planning.
            </CardDescription>
            {isOrganizer && (
              <Button className="warm-button">
                <UserPlus className="h-4 w-4 mr-2" />
                Send Invitations
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
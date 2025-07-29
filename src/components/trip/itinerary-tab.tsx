'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, MapPin, Clock, DollarSign, Users, MoreHorizontal } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CreateActivityDialog } from './create-activity-dialog'

interface Activity {
  id: string
  title: string
  description: string | null
  location: string | null
  startTime: string
  endTime: string | null
  cost: number | null
  image: string | null
  order: number
  _count: {
    rsvps: number
  }
}

interface Trip {
  id: string
  title: string
  startDate: string
  endDate: string
}

interface ItineraryTabProps {
  trip: Trip
  isOrganizer: boolean
}

function ActivityCard({ activity }: { activity: Activity }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: activity.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="warm-card hover:shadow-md transition-shadow cursor-move">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg">{activity.title}</CardTitle>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Clock className="h-4 w-4 mr-1" />
                {formatDateTime(new Date(activity.startTime))}
                {activity.endTime && ` - ${formatDateTime(new Date(activity.endTime))}`}
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {activity.description && (
            <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              {activity.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {activity.location}
                </div>
              )}
              {activity.cost && (
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${activity.cost}
                </div>
              )}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {activity._count.rsvps} going
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ItineraryTab({ trip, isOrganizer }: ItineraryTabProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchActivities()
  }, [trip.id])

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/trips/${trip.id}/activities`)
      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = activities.findIndex((item) => item.id === active.id)
      const newIndex = activities.findIndex((item) => item.id === over.id)

      const newActivities = arrayMove(activities, oldIndex, newIndex)
      setActivities(newActivities)

      // Update order on server
      try {
        await fetch(`/api/trips/${trip.id}/activities/reorder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            activities: newActivities.map((activity, index) => ({
              id: activity.id,
              order: index,
            })),
          }),
        })
      } catch (error) {
        console.error('Error updating activity order:', error)
        // Revert on error
        fetchActivities()
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Trip Itinerary</h2>
          <p className="text-gray-600 text-sm">
            {activities.length} activit{activities.length !== 1 ? 'ies' : 'y'} planned
          </p>
        </div>
        {isOrganizer && (
          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="warm-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        )}
      </div>

      {/* Activities List */}
      {activities.length === 0 ? (
        <Card className="warm-card text-center py-12">
          <CardContent>
            <Clock className="h-16 w-16 text-orange-300 mx-auto mb-4" />
            <CardTitle className="text-xl mb-2">No activities yet</CardTitle>
            <CardDescription className="mb-4">
              Start building your itinerary by adding your first activity.
            </CardDescription>
            {isOrganizer && (
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="warm-button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Activity
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={activities.map(a => a.id)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <CreateActivityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        trip={trip}
        onActivityCreated={() => {
          fetchActivities()
          setShowCreateDialog(false)
        }}
      />
    </div>
  )
}
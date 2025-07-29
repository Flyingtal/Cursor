'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X } from 'lucide-react'

const activitySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  location: z.string().max(200, 'Location too long').optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().optional(),
  cost: z.string().optional(),
}).refine((data) => {
  if (data.endTime && data.startTime) {
    return new Date(data.endTime) >= new Date(data.startTime)
  }
  return true
}, {
  message: "End time must be after start time",
  path: ["endTime"],
})

type ActivityFormData = z.infer<typeof activitySchema>

interface CreateActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip: {
    id: string
    startDate: string
    endDate: string
  }
  onActivityCreated: () => void
}

export function CreateActivityDialog({ 
  open, 
  onOpenChange, 
  trip, 
  onActivityCreated 
}: CreateActivityDialogProps) {
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema)
  })

  const onSubmit = async (data: ActivityFormData) => {
    setLoading(true)
    
    try {
      const payload = {
        ...data,
        cost: data.cost ? parseFloat(data.cost) : null,
      }

      const response = await fetch(`/api/trips/${trip.id}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        reset()
        onActivityCreated()
      } else {
        const error = await response.json()
        setError('root', { message: error.message || 'Failed to create activity' })
      }
    } catch (error) {
      setError('root', { message: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Get min/max dates based on trip dates
  const minDate = new Date(trip.startDate).toISOString().slice(0, 16)
  const maxDate = new Date(trip.endDate).toISOString().slice(0, 16)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-white rounded-xl shadow-xl z-50 warm-card max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-800">
              Add Activity
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Activity Title *
              </label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., Visit Temple of Dawn"
                className="warm-input"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input
                id="location"
                {...register('location')}
                placeholder="e.g., Bangkok, Thailand"
                className="warm-input"
              />
              {errors.location && (
                <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  {...register('startTime')}
                  min={minDate}
                  max={maxDate}
                  className="warm-input"
                />
                {errors.startTime && (
                  <p className="text-sm text-red-600 mt-1">{errors.startTime.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  {...register('endTime')}
                  min={minDate}
                  max={maxDate}
                  className="warm-input"
                />
                {errors.endTime && (
                  <p className="text-sm text-red-600 mt-1">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Cost (USD)
              </label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                {...register('cost')}
                placeholder="25.00"
                className="warm-input"
              />
              {errors.cost && (
                <p className="text-sm text-red-600 mt-1">{errors.cost.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Tell your group about this activity..."
                className="warm-input"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            {errors.root && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200">
                {errors.root.message}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Dialog.Close asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button 
                type="submit" 
                className="flex-1 warm-button"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Activity'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
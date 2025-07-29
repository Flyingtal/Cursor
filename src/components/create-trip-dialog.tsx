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

const tripSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  destination: z.string().min(1, 'Destination is required').max(100, 'Destination too long'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date must be after start date",
  path: ["endDate"],
})

type TripFormData = z.infer<typeof tripSchema>

interface CreateTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTripCreated: () => void
}

export function CreateTripDialog({ open, onOpenChange, onTripCreated }: CreateTripDialogProps) {
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema)
  })

  const onSubmit = async (data: TripFormData) => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        reset()
        onTripCreated()
      } else {
        const error = await response.json()
        setError('root', { message: error.message || 'Failed to create trip' })
      }
    } catch (error) {
      setError('root', { message: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-white rounded-xl shadow-xl z-50 warm-card">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-semibold text-gray-800">
              Create New Trip
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
                Trip Title *
              </label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., Thailand April 2024"
                className="warm-input"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                Destination *
              </label>
              <Input
                id="destination"
                {...register('destination')}
                placeholder="e.g., Bangkok, Thailand"
                className="warm-input"
              />
              {errors.destination && (
                <p className="text-sm text-red-600 mt-1">{errors.destination.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                  className="warm-input"
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                  className="warm-input"
                />
                {errors.endDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Tell your group about this trip..."
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
                {loading ? 'Creating...' : 'Create Trip'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
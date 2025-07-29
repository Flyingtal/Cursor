'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera } from 'lucide-react'

interface MemoriesTabProps {
  trip: any
}

export function MemoriesTab({ trip }: MemoriesTabProps) {
  return (
    <div className="space-y-6">
      <Card className="warm-card text-center py-12">
        <CardContent>
          <Camera className="h-16 w-16 text-orange-300 mx-auto mb-4" />
          <CardTitle className="text-xl mb-2">Photo Gallery Coming Soon</CardTitle>
          <CardDescription>
            This feature will allow you to share photos and create trip recaps.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
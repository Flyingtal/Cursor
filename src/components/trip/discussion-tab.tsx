'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

interface DiscussionTabProps {
  trip: any
}

export function DiscussionTab({ trip }: DiscussionTabProps) {
  return (
    <div className="space-y-6">
      <Card className="warm-card text-center py-12">
        <CardContent>
          <MessageSquare className="h-16 w-16 text-orange-300 mx-auto mb-4" />
          <CardTitle className="text-xl mb-2">Discussion Coming Soon</CardTitle>
          <CardDescription>
            This feature will provide threaded discussions for trip planning.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
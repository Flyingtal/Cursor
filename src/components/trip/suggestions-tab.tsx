'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb } from 'lucide-react'

interface SuggestionsTabProps {
  trip: any
}

export function SuggestionsTab({ trip }: SuggestionsTabProps) {
  return (
    <div className="space-y-6">
      <Card className="warm-card text-center py-12">
        <CardContent>
          <Lightbulb className="h-16 w-16 text-orange-300 mx-auto mb-4" />
          <CardTitle className="text-xl mb-2">Suggestions Coming Soon</CardTitle>
          <CardDescription>
            This feature will allow members to suggest activities and vote on them.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
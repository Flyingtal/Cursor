'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'

interface BudgetTabProps {
  trip: any
}

export function BudgetTab({ trip }: BudgetTabProps) {
  return (
    <div className="space-y-6">
      <Card className="warm-card text-center py-12">
        <CardContent>
          <DollarSign className="h-16 w-16 text-orange-300 mx-auto mb-4" />
          <CardTitle className="text-xl mb-2">Budget Tracking Coming Soon</CardTitle>
          <CardDescription>
            This feature will help you track expenses and manage your trip budget.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
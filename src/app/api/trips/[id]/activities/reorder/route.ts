import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to this trip and is organizer
    const trip = await prisma.trip.findFirst({
      where: {
        id: params.id,
        organizerId: session.user.id
      }
    })

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found or access denied' }, { status: 404 })
    }

    const body = await request.json()
    const { activities } = body

    if (!Array.isArray(activities)) {
      return NextResponse.json({ error: 'Invalid activities data' }, { status: 400 })
    }

    // Update all activity orders in a transaction
    await prisma.$transaction(
      activities.map(({ id, order }) =>
        prisma.activity.update({
          where: { id },
          data: { order }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering activities:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
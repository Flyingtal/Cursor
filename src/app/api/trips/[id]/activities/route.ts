import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to this trip
    const trip = await prisma.trip.findFirst({
      where: {
        id: params.id,
        OR: [
          { organizerId: session.user.id },
          {
            members: {
              some: {
                userId: session.user.id
              }
            }
          }
        ]
      }
    })

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    const activities = await prisma.activity.findMany({
      where: {
        tripId: params.id
      },
      include: {
        _count: {
          select: {
            rsvps: true
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to this trip
    const trip = await prisma.trip.findFirst({
      where: {
        id: params.id,
        OR: [
          { organizerId: session.user.id },
          {
            members: {
              some: {
                userId: session.user.id
              }
            }
          }
        ]
      }
    })

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, location, startTime, endTime, cost } = body

    if (!title || !startTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the next order number
    const lastActivity = await prisma.activity.findFirst({
      where: { tripId: params.id },
      orderBy: { order: 'desc' }
    })

    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        location,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        cost,
        tripId: params.id,
        order: (lastActivity?.order ?? -1) + 1
      },
      include: {
        _count: {
          select: {
            rsvps: true
          }
        }
      }
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
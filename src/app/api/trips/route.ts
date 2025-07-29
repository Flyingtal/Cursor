import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const trips = await prisma.trip.findMany({
      where: {
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
      },
      include: {
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(trips)
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, destination, startDate, endDate } = body

    if (!title || !destination || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const trip = await prisma.trip.create({
      data: {
        title,
        description,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        organizerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: 'organizer'
          }
        }
      },
      include: {
        _count: {
          select: {
            members: true
          }
        }
      }
    })

    return NextResponse.json(trip, { status: 201 })
  } catch (error) {
    console.error('Error creating trip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
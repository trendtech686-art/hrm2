import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/comments?entityType=xxx&entityId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'entityType và entityId là bắt buộc' },
        { status: 400 }
      )
    }

    const comments = await prisma.comment.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST /api/comments - Create new comment
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.entityType || !body.entityId || !body.content) {
      return NextResponse.json(
        { error: 'entityType, entityId và content là bắt buộc' },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        entityType: body.entityType,
        entityId: body.entityId,
        content: body.content,
        attachments: body.attachments || [],
        createdBy: body.createdBy,
        createdByName: body.createdByName || body.author,
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

// DELETE /api/comments - Delete comment (by systemId in body)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const systemId = searchParams.get('systemId')

    if (!systemId) {
      return NextResponse.json(
        { error: 'systemId là bắt buộc' },
        { status: 400 }
      )
    }

    await prisma.comment.delete({
      where: { systemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}

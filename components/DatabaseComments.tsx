/**
 * Database-backed Comments Component
 * Wrapper cho Comments component, lưu vào database
 */

'use client'

import * as React from 'react'
import { Comments, type Comment as CommentType } from './Comments'
import { useAuth } from '@/contexts/auth-context'
import { asSystemId, type SystemId } from '@/lib/id-types'

interface DatabaseCommentsProps {
  entityType: string  // e.g., 'supplier', 'stock_transfer', 'leave'
  entityId: string    // ID of the entity
  className?: string
}

const API_BASE = '/api/comments'

/**
 * Comments component với database backend
 * Data được lưu trực tiếp vào PostgreSQL qua API
 */
export function DatabaseComments({ entityType, entityId, className }: DatabaseCommentsProps) {
  const { user, employee } = useAuth()
  const [comments, setComments] = React.useState<CommentType<SystemId>[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Load comments from database
  React.useEffect(() => {
    const loadComments = async () => {
      try {
        // Load from database API
        const res = await fetch(
          `${API_BASE}?entityType=${encodeURIComponent(entityType)}&entityId=${encodeURIComponent(entityId)}`
        )
        
        if (res.ok) {
          const data = await res.json()
          
          if (data && data.length > 0) {
            // Transform API data to component format
            const transformed = data.map((c: any) => ({
              id: asSystemId(c.systemId),
              content: c.content,
              author: {
                systemId: asSystemId(c.createdBy || 'system'),
                name: c.createdByName || 'Hệ thống',
              },
              createdAt: c.createdAt,
              updatedAt: c.updatedAt,
              attachments: c.attachments || [],
            }))
            setComments(transformed)
          }
        }
      } catch (error) {
        console.error(`Error loading comments for ${entityType}/${entityId}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    if (entityId) {
      loadComments()
    }
  }, [entityType, entityId])

  // Add comment
  const handleAddComment = React.useCallback(async (
    content: string,
    attachments?: string[],
    parentId?: string
  ) => {
    const tempId = asSystemId(`temp-${Date.now()}`)
    const newComment: CommentType<SystemId> = {
      id: tempId,
      content,
      author: {
        systemId: employee?.systemId ? asSystemId(employee.systemId) : asSystemId('system'),
        name: employee?.fullName || user?.fullName || 'Hệ thống',
        avatar: employee?.avatar,
      },
      createdAt: new Date().toISOString(),
      attachments,
      parentId: parentId as SystemId | undefined,
    }

    // Optimistic update
    setComments(prev => [...prev, newComment])

    // Save to database
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType,
          entityId,
          content,
          attachments: attachments || [],
          createdBy: user?.systemId || employee?.systemId,
          createdByName: employee?.fullName || user?.fullName,
        }),
      })

      if (res.ok) {
        const saved = await res.json()
        // Update with real ID
        setComments(prev => prev.map(c => 
          c.id === tempId 
            ? { ...c, id: asSystemId(saved.systemId) }
            : c
        ))
      }
    } catch (error) {
      console.error('Error saving comment:', error)
    }
  }, [entityType, entityId, user, employee])

  // Update comment
  const handleUpdateComment = React.useCallback((commentId: string, content: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId 
        ? { ...c, content, updatedAt: new Date().toISOString() } 
        : c
    ))
    // Note: API update not implemented yet
  }, [])

  // Delete comment
  const handleDeleteComment = React.useCallback(async (commentId: string) => {
    // Optimistic delete
    setComments(prev => prev.filter(c => c.id !== commentId))

    // Delete from database
    try {
      await fetch(`${API_BASE}?systemId=${encodeURIComponent(commentId)}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }, [])

  if (isLoading) {
    return <div className="p-4 text-muted-foreground">Đang tải bình luận...</div>
  }

  return (
    <Comments
      comments={comments}
      onAddComment={handleAddComment}
      onUpdateComment={handleUpdateComment}
      onDeleteComment={handleDeleteComment}
      entityType={entityType}
      entityId={entityId}
      className={className}
    />
  )
}

/**
 * Migrate localStorage comments to database
 */
async function migrateComments(
  entityType: string,
  entityId: string,
  comments: CommentType<SystemId>[]
): Promise<void> {
  try {
    for (const comment of comments) {
      await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType,
          entityId,
          content: comment.content,
          attachments: comment.attachments || [],
          createdBy: comment.author?.systemId,
          createdByName: comment.author?.name,
        }),
      })
    }
    console.log(`[Migration] Successfully migrated ${comments.length} comments to database`)
  } catch (error) {
    console.error(`[Migration] Failed to migrate comments:`, error)
  }
}

export default DatabaseComments

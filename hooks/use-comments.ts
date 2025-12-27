import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface Comment {
  systemId: string
  entityType: string
  entityId: string
  content: string
  attachments: string[]
  createdAt: string
  updatedAt: string
  createdBy?: string
  createdByName?: string
}

/**
 * Hook để quản lý comments cho bất kỳ entity nào
 * Thay thế localStorage cho leave-comments, supplier-comments, stock-transfer-comments, etc.
 * 
 * @param entityType - Loại entity (leave, supplier, stock_transfer, warranty, etc.)
 * @param entityId - ID của entity
 */
export function useComments(entityType: string, entityId: string) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load comments from database
  const loadComments = useCallback(async () => {
    if (!entityType || !entityId) {
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(
        `/api/comments?entityType=${encodeURIComponent(entityType)}&entityId=${encodeURIComponent(entityId)}`
      )
      if (res.ok) {
        const data = await res.json()
        setComments(data || [])
      }
    } catch (error) {
      console.error(`Error loading comments for ${entityType}/${entityId}:`, error)
    } finally {
      setIsLoading(false)
    }
  }, [entityType, entityId])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  // Add new comment
  const addComment = useCallback(
    async (content: string, attachments: string[] = []) => {
      if (!entityType || !entityId) return null

      try {
        const res = await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entityType,
            entityId,
            content,
            attachments,
            createdBy: user?.systemId,
            createdByName: user?.fullName || user?.email,
          }),
        })

        if (res.ok) {
          const newComment = await res.json()
          setComments((prev) => [newComment, ...prev])
          return newComment
        }
      } catch (error) {
        console.error('Error adding comment:', error)
      }
      return null
    },
    [entityType, entityId, user]
  )

  // Delete comment
  const deleteComment = useCallback(
    async (systemId: string) => {
      try {
        const res = await fetch(`/api/comments?systemId=${encodeURIComponent(systemId)}`, {
          method: 'DELETE',
        })

        if (res.ok) {
          setComments((prev) => prev.filter((c) => c.systemId !== systemId))
          return true
        }
      } catch (error) {
        console.error('Error deleting comment:', error)
      }
      return false
    },
    []
  )

  // Refresh comments
  const refresh = useCallback(() => {
    setIsLoading(true)
    loadComments()
  }, [loadComments])

  return {
    comments,
    isLoading,
    addComment,
    deleteComment,
    refresh,
    count: comments.length,
  }
}

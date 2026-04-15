/**
 * Comments Hook - React Query version
 * 
 * Hook để quản lý comments cho bất kỳ entity nào
 * Thay thế localStorage cho leave-comments, supplier-comments, stock-transfer-comments, etc.
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { useAuth } from '@/contexts/auth-context'
import { generateSubEntityId } from '@/lib/id-utils'

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

// Response shape from GET /api/comments (includes draft)
interface CommentsResponse {
  comments: Comment[]
  draft: unknown // JSON value from UserPreference
}

// Query keys
export const commentKeys = {
  all: ['comments'] as const,
  entity: (entityType: string, entityId: string) => 
    [...commentKeys.all, 'entity', entityType, entityId] as const,
}

// API functions
async function fetchComments(entityType: string, entityId: string): Promise<CommentsResponse> {
  const res = await fetch(
    `/api/comments?entityType=${encodeURIComponent(entityType)}&entityId=${encodeURIComponent(entityId)}`
  )
  if (!res.ok) throw new Error('Không thể tải bình luận')
  return res.json()
}

async function createComment(data: {
  entityType: string
  entityId: string
  content: string
  attachments: string[]
  createdBy?: string
  createdByName?: string
}): Promise<Comment> {
  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Không thể thêm bình luận')
  return res.json()
}

async function deleteCommentApi(systemId: string): Promise<void> {
  const res = await fetch(`/api/comments?systemId=${encodeURIComponent(systemId)}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Không thể xóa bình luận')
}

async function updateCommentApi(data: { systemId: string; content: string }): Promise<Comment> {
  const res = await fetch(`/api/comments?systemId=${encodeURIComponent(data.systemId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: data.content }),
  })
  if (!res.ok) throw new Error('Không thể cập nhật bình luận')
  return res.json()
}

/**
 * Hook để quản lý comments cho bất kỳ entity nào
 * 
 * @param entityType - Loại entity (leave, supplier, stock_transfer, warranty, etc.)
 * @param entityId - ID của entity
 * 
 * @example
 * ```tsx
 * const { comments, isLoading, addComment, deleteComment } = useComments('leave', leaveId)
 * 
 * // Add a comment
 * await addComment('This is a comment', ['attachment1.pdf'])
 * 
 * // Delete a comment
 * await deleteComment('comment-system-id')
 * ```
 */
export function useComments(entityType: string, entityId: string, options?: { enabled?: boolean }) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Query for fetching comments + draft
  const query = useQuery({
    queryKey: commentKeys.entity(entityType, entityId),
    queryFn: () => fetchComments(entityType, entityId),
    enabled: !!entityType && !!entityId && (options?.enabled ?? true),
    staleTime: 60_000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
  })

  // Extract comments and draft from response
  const comments = query.data?.comments || []
  const draft = typeof query.data?.draft === 'string' ? query.data.draft : ''

  // Mutation for adding comment
  const addMutation = useMutation({
    mutationFn: createComment,
    onMutate: async (newComment) => {
      // Optimistic update
      await queryClient.cancelQueries({ 
        queryKey: commentKeys.entity(entityType, entityId) 
      })
      
      const previousData = queryClient.getQueryData<CommentsResponse>(
        commentKeys.entity(entityType, entityId)
      )
      
      const optimisticComment: Comment = {
        systemId: generateSubEntityId('TEMP'),
        entityType: newComment.entityType,
        entityId: newComment.entityId,
        content: newComment.content,
        attachments: newComment.attachments,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: newComment.createdBy,
        createdByName: newComment.createdByName,
      }
      
      queryClient.setQueryData<CommentsResponse>(
        commentKeys.entity(entityType, entityId),
        (old) => ({
          comments: [optimisticComment, ...(old?.comments || [])],
          draft: null, // Clear draft when adding comment
        })
      )
      
      return { previousData }
    },
    onError: (_err, _newComment, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          commentKeys.entity(entityType, entityId),
          context.previousData
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.entity(entityType, entityId) 
      })
    },
  })

  // Mutation for deleting comment
  const deleteMutation = useMutation({
    mutationFn: deleteCommentApi,
    onMutate: async (systemId) => {
      // Optimistic update
      await queryClient.cancelQueries({ 
        queryKey: commentKeys.entity(entityType, entityId) 
      })
      
      const previousData = queryClient.getQueryData<CommentsResponse>(
        commentKeys.entity(entityType, entityId)
      )
      
      queryClient.setQueryData<CommentsResponse>(
        commentKeys.entity(entityType, entityId),
        (old) => ({
          comments: old?.comments?.filter(c => c.systemId !== systemId) || [],
          draft: old?.draft ?? null,
        })
      )
      
      return { previousData }
    },
    onError: (_err, _systemId, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          commentKeys.entity(entityType, entityId),
          context.previousData
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.entity(entityType, entityId) 
      })
    },
  })

  // Mutation for updating comment
  const updateMutation = useMutation({
    mutationFn: updateCommentApi,
    onMutate: async ({ systemId, content }) => {
      await queryClient.cancelQueries({ 
        queryKey: commentKeys.entity(entityType, entityId) 
      })
      
      const previousData = queryClient.getQueryData<CommentsResponse>(
        commentKeys.entity(entityType, entityId)
      )
      
      queryClient.setQueryData<CommentsResponse>(
        commentKeys.entity(entityType, entityId),
        (old) => ({
          comments: old?.comments?.map(c => 
            c.systemId === systemId 
              ? { ...c, content, updatedAt: new Date().toISOString() } 
              : c
          ) || [],
          draft: old?.draft ?? null,
        })
      )
      
      return { previousData }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          commentKeys.entity(entityType, entityId),
          context.previousData
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ 
        queryKey: commentKeys.entity(entityType, entityId) 
      })
    },
  })

  // Add new comment
  const addComment = async (content: string, attachments: string[] = []) => {
    if (!entityType || !entityId) return null

    return addMutation.mutateAsync({
      entityType,
      entityId,
      content,
      attachments,
      createdBy: user?.systemId,
      createdByName: user?.fullName || user?.email,
    })
  }

  // Delete comment
  const deleteComment = async (systemId: string) => {
    return deleteMutation.mutateAsync(systemId)
  }

  // Update comment
  const updateComment = async (systemId: string, content: string) => {
    return updateMutation.mutateAsync({ systemId, content })
  }

  return {
    comments,
    draft,
    isLoading: query.isLoading,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    addComment,
    updateComment,
    deleteComment,
    refresh: () => query.refetch(),
    count: comments.length,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

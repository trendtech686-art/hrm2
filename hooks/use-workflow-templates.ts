import { useState, useEffect, useCallback, useRef } from 'react'
import type { Subtask } from '@/components/shared/subtask-list'
import { nanoid } from 'nanoid'

export interface WorkflowTemplate {
  systemId: string
  id: string
  name: string // 'complaints', 'warranty' - workflow type
  label: string // Display name
  description: string
  subtasks: Subtask[]
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

// Default templates for initial setup
function getDefaultTemplates(): WorkflowTemplate[] {
  const now = new Date()
  return [
    {
      systemId: nanoid(),
      id: nanoid(),
      name: 'complaints',
      label: 'Quy trình Khiếu nại tiêu chuẩn',
      description: 'Các bước xử lý khiếu nại từ khách hàng',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: nanoid(), title: 'Tiếp nhận và ghi nhận', completed: false, order: 0, createdAt: now },
        { id: nanoid(), title: 'Phân loại và đánh giá', completed: false, order: 1, createdAt: now },
        { id: nanoid(), title: 'Xác minh thông tin', completed: false, order: 2, createdAt: now },
        { id: nanoid(), title: 'Đề xuất giải pháp', completed: false, order: 3, createdAt: now },
        { id: nanoid(), title: 'Thực hiện xử lý', completed: false, order: 4, createdAt: now },
        { id: nanoid(), title: 'Phản hồi khách hàng', completed: false, order: 5, createdAt: now },
        { id: nanoid(), title: 'Đánh giá kết quả', completed: false, order: 6, createdAt: now },
      ],
    },
    {
      systemId: nanoid(),
      id: nanoid(),
      name: 'warranty',
      label: 'Quy trình Bảo hành tiêu chuẩn',
      description: 'Các bước xử lý bảo hành sản phẩm',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: nanoid(), title: 'Tiếp nhận yêu cầu', completed: false, order: 0, createdAt: now },
        { id: nanoid(), title: 'Kiểm tra điều kiện BH', completed: false, order: 1, createdAt: now },
        { id: nanoid(), title: 'Kiểm tra lỗi sản phẩm', completed: false, order: 2, createdAt: now },
        { id: nanoid(), title: 'Báo giá sửa chữa', completed: false, order: 3, createdAt: now },
        { id: nanoid(), title: 'Thực hiện sửa chữa', completed: false, order: 4, createdAt: now },
        { id: nanoid(), title: 'Kiểm tra chất lượng', completed: false, order: 5, createdAt: now },
        { id: nanoid(), title: 'Trả hàng khách', completed: false, order: 6, createdAt: now },
      ],
    },
    {
      systemId: nanoid(),
      id: nanoid(),
      name: 'orders',
      label: 'Quy trình Đơn hàng tiêu chuẩn',
      description: 'Các bước xử lý đơn hàng',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: nanoid(), title: 'Xác nhận đơn hàng', completed: false, order: 0, createdAt: now },
        { id: nanoid(), title: 'Kiểm tra tồn kho', completed: false, order: 1, createdAt: now },
        { id: nanoid(), title: 'Chuẩn bị hàng hóa', completed: false, order: 2, createdAt: now },
        { id: nanoid(), title: 'Đóng gói', completed: false, order: 3, createdAt: now },
        { id: nanoid(), title: 'Giao hàng', completed: false, order: 4, createdAt: now },
        { id: nanoid(), title: 'Thu tiền', completed: false, order: 5, createdAt: now },
        { id: nanoid(), title: 'Hoàn tất', completed: false, order: 6, createdAt: now },
      ],
    },
    {
      systemId: nanoid(),
      id: nanoid(),
      name: 'sales-returns',
      label: 'Quy trình Đổi trả hàng',
      description: 'Các bước xử lý đổi trả hàng bán',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: nanoid(), title: 'Tiếp nhận yêu cầu', completed: false, order: 0, createdAt: now },
        { id: nanoid(), title: 'Kiểm tra điều kiện', completed: false, order: 1, createdAt: now },
        { id: nanoid(), title: 'Kiểm tra sản phẩm', completed: false, order: 2, createdAt: now },
        { id: nanoid(), title: 'Xử lý hoàn tiền/đổi hàng', completed: false, order: 3, createdAt: now },
        { id: nanoid(), title: 'Cập nhật kho', completed: false, order: 4, createdAt: now },
        { id: nanoid(), title: 'Hoàn tất', completed: false, order: 5, createdAt: now },
      ],
    },
    {
      systemId: nanoid(),
      id: nanoid(),
      name: 'purchase-returns',
      label: 'Quy trình Trả hàng NCC',
      description: 'Các bước trả hàng cho nhà cung cấp',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: nanoid(), title: 'Phát hiện sản phẩm lỗi/hỏng', completed: false, order: 0, createdAt: now },
        { id: nanoid(), title: 'Tạo phiếu trả hàng', completed: false, order: 1, createdAt: now },
        { id: nanoid(), title: 'Liên hệ NCC', completed: false, order: 2, createdAt: now },
        { id: nanoid(), title: 'Đóng gói trả hàng', completed: false, order: 3, createdAt: now },
        { id: nanoid(), title: 'Gửi hàng trả', completed: false, order: 4, createdAt: now },
        { id: nanoid(), title: 'Nhận hoàn tiền/đổi hàng', completed: false, order: 5, createdAt: now },
        { id: nanoid(), title: 'Cập nhật kho', completed: false, order: 6, createdAt: now },
      ],
    },
    {
      systemId: nanoid(),
      id: nanoid(),
      name: 'stock-transfers',
      label: 'Quy trình Chuyển kho',
      description: 'Các bước chuyển hàng giữa các kho',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: nanoid(), title: 'Tạo phiếu chuyển kho', completed: false, order: 0, createdAt: now },
        { id: nanoid(), title: 'Kiểm tra tồn kho xuất', completed: false, order: 1, createdAt: now },
        { id: nanoid(), title: 'Lấy hàng và kiểm đếm', completed: false, order: 2, createdAt: now },
        { id: nanoid(), title: 'Đóng gói và ghi chú vận chuyển', completed: false, order: 3, createdAt: now },
        { id: nanoid(), title: 'Xuất kho nguồn', completed: false, order: 4, createdAt: now },
        { id: nanoid(), title: 'Vận chuyển đến kho đích', completed: false, order: 5, createdAt: now },
        { id: nanoid(), title: 'Nhận hàng và kiểm đếm tại kho đích', completed: false, order: 6, createdAt: now },
        { id: nanoid(), title: 'Nhập kho đích và hoàn tất', completed: false, order: 7, createdAt: now },
      ],
    },
    {
      systemId: nanoid(),
      id: nanoid(),
      name: 'inventory-checks',
      label: 'Quy trình Kiểm kho',
      description: 'Các bước thực hiện kiểm kê hàng tồn kho',
      isDefault: true,
      createdAt: now,
      updatedAt: now,
      subtasks: [
        { id: nanoid(), title: 'Lên kế hoạch kiểm kho (thời gian, phạm vi)', completed: false, order: 0, createdAt: now },
        { id: nanoid(), title: 'In danh sách hàng hóa cần kiểm', completed: false, order: 1, createdAt: now },
        { id: nanoid(), title: 'Phân công nhân sự kiểm kê', completed: false, order: 2, createdAt: now },
        { id: nanoid(), title: 'Thực hiện kiểm đếm thực tế', completed: false, order: 3, createdAt: now },
        { id: nanoid(), title: 'Ghi nhận số lượng thực tế', completed: false, order: 4, createdAt: now },
        { id: nanoid(), title: 'Đối chiếu với số liệu hệ thống', completed: false, order: 5, createdAt: now },
        { id: nanoid(), title: 'Xác định và giải trình chênh lệch', completed: false, order: 6, createdAt: now },
        { id: nanoid(), title: 'Duyệt và cập nhật tồn kho', completed: false, order: 7, createdAt: now },
      ],
    },
  ]
}

// Parse templates from API response
function parseTemplates(data: any[]): WorkflowTemplate[] {
  return data.map((t: any) => ({
    ...t,
    systemId: t.systemId || t.id,
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt),
    subtasks: t.subtasks.map((s: any) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      completedAt: s.completedAt ? new Date(s.completedAt) : undefined,
    })),
  }))
}

// In-memory cache for templates (shared across components)
let templatesCache: WorkflowTemplate[] | null = null
let cachePromise: Promise<WorkflowTemplate[]> | null = null

/**
 * Get workflow templates from database
 * This function can be called outside of React components
 */
export async function fetchWorkflowTemplates(): Promise<WorkflowTemplate[]> {
  // Return cached if available
  if (templatesCache) {
    return templatesCache
  }

  // Prevent multiple simultaneous fetches
  if (cachePromise) {
    return cachePromise
  }

  cachePromise = (async () => {
    try {
      const res = await fetch('/api/workflow-templates')
      if (res.ok) {
        const json = await res.json()
        if (json.data && json.data.length > 0) {
          templatesCache = parseTemplates(json.data)
          return templatesCache
        }
      }
    } catch (error) {
      console.error('Failed to fetch workflow templates from API:', error)
    }

    // Return default templates if API fails
    templatesCache = getDefaultTemplates()
    return templatesCache
  })()

  const result = await cachePromise
  cachePromise = null
  return result
}

/**
 * Get workflow template subtasks for a specific workflow type
 * Returns fresh copies with new IDs and reset completed status
 */
export async function getWorkflowTemplateSubtasks(workflowName: string): Promise<Subtask[]> {
  const templates = await fetchWorkflowTemplates()
  
  // Find default template for this workflow
  const template = templates.find(t => t.name === workflowName && t.isDefault)
  
  if (!template) {
    // Fallback: get first template for this workflow
    const fallback = templates.find(t => t.name === workflowName)
    if (!fallback) return []
    
    return fallback.subtasks.map(s => ({
      ...s,
      id: nanoid(),
      completed: false,
      completedAt: undefined,
    }))
  }
  
  // Deep clone and reset completed status
  return template.subtasks.map(s => ({
    ...s,
    id: nanoid(),
    completed: false,
    completedAt: undefined,
  }))
}

/**
 * Get all workflow templates for a specific workflow type
 */
export async function getWorkflowTemplatesByType(workflowName: string): Promise<WorkflowTemplate[]> {
  const templates = await fetchWorkflowTemplates()
  return templates.filter(t => t.name === workflowName)
}

/**
 * Clear templates cache (call after saving templates)
 */
export function clearWorkflowTemplatesCache() {
  templatesCache = null
  cachePromise = null
}

/**
 * Hook to use workflow templates in React components
 */
export function useWorkflowTemplates() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isSavingRef = useRef(false)

  // Load templates on mount
  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const data = await fetchWorkflowTemplates()
        if (mounted) {
          setTemplates(data)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load templates')
          // Use default templates on error
          setTemplates(getDefaultTemplates())
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  // Save templates to database
  const saveTemplates = useCallback(async (newTemplates: WorkflowTemplate[]) => {
    if (isSavingRef.current) return

    isSavingRef.current = true
    setTemplates(newTemplates)

    try {
      const res = await fetch('/api/workflow-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templates: newTemplates }),
      })

      if (!res.ok) {
        throw new Error('Failed to save templates')
      }

      // Clear cache so next fetch gets fresh data
      clearWorkflowTemplatesCache()
      templatesCache = newTemplates

      setError(null)
    } catch (err) {
      console.error('Error saving templates:', err)
      setError('Failed to save templates')
    } finally {
      isSavingRef.current = false
    }
  }, [])

  return {
    templates,
    setTemplates: saveTemplates,
    isLoading,
    error,
  }
}

/**
 * Synchronous getter for workflow templates (uses cache)
 * Returns empty array if not yet loaded - use async version for guaranteed data
 */
export function getWorkflowTemplatesSync(): WorkflowTemplate[] {
  if (templatesCache) {
    return templatesCache
  }
  
  // Return default templates if cache not loaded
  
  return getDefaultTemplates()
}

/**
 * Synchronous getter for single workflow template subtasks (uses cache)
 */
export function getWorkflowTemplateSync(workflowName: string): Subtask[] {
  const templates = getWorkflowTemplatesSync()
  const template = templates.find(t => t.name === workflowName && t.isDefault)
  
  if (!template) {
    const fallback = templates.find(t => t.name === workflowName)
    if (!fallback) return []
    
    return fallback.subtasks.map(s => ({
      ...s,
      id: nanoid(),
      completed: false,
      completedAt: undefined,
    }))
  }
  
  return template.subtasks.map(s => ({
    ...s,
    id: nanoid(),
    completed: false,
    completedAt: undefined,
  }))
}

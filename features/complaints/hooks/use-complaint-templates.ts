/**
 * Hook để quản lý complaint templates
 * Sử dụng database (user preferences) làm source of truth
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'

const API_BASE = '/api/user-preferences'
const STORAGE_KEY = 'complaints-templates'
const SAVE_DEBOUNCE_DELAY = 1000

// Response template interface
export interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  order: number;
}

// Default templates
const DEFAULT_TEMPLATES: ResponseTemplate[] = [
  {
    id: '1',
    name: 'Xin lỗi - Lỗi sản phẩm',
    content: 'Kính chào Anh/Chị,\n\nChúng tôi xin chân thành xin lỗi về sản phẩm bị lỗi mà Anh/Chị đã nhận được. Đây là sự cố đáng tiếc và chúng tôi hiểu sự bất tiện mà điều này gây ra.\n\nChúng tôi đang xử lý khiếu nại của Anh/Chị và sẽ sớm có phương án giải quyết hợp lý nhất.\n\nTrân trọng,',
    category: 'product-defect',
    order: 1,
  },
  {
    id: '2',
    name: 'Xin lỗi - Giao hàng chậm',
    content: 'Kính chào Anh/Chị,\n\nChúng tôi xin lỗi vì đơn hàng của Anh/Chị đã bị giao chậm hơn so với dự kiến. Chúng tôi đã liên hệ với đơn vị vận chuyển để làm rõ nguyên nhân.\n\nChúng tôi sẽ có phương án bù trừ hợp lý cho sự chậm trễ này.\n\nTrân trọng,',
    category: 'shipping-delay',
    order: 2,
  },
  {
    id: '3',
    name: 'Xác nhận đang xử lý',
    content: 'Kính chào Anh/Chị,\n\nChúng tôi đã nhận được khiếu nại của Anh/Chị và đang tiến hành xác minh thông tin.\n\nChúng tôi sẽ phản hồi lại trong thời gian sớm nhất. Xin Anh/Chị vui lòng theo dõi.\n\nTrân trọng,',
    category: 'general',
    order: 3,
  },
];

/**
 * Hook để quản lý complaint response templates
 * 
 * @returns [templates, setTemplates, isLoading]
 */
export function useComplaintTemplates(): [
  ResponseTemplate[],
  (templates: ResponseTemplate[]) => void,
  boolean
] {
  const { user } = useAuth()
  const [templates, setTemplatesState] = useState<ResponseTemplate[]>(DEFAULT_TEMPLATES)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>('')

  // Load from database
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        if (user?.systemId) {
          const res = await fetch(
            `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(STORAGE_KEY)}`
          )
          
          if (res.ok) {
            const data = await res.json()
            if (data && data.value && Array.isArray(data.value)) {
              setTemplatesState(data.value)
              lastSavedRef.current = JSON.stringify(data.value)
            }
          }
        }
      } catch (error) {
        console.error('Error loading complaint templates:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTemplates()
  }, [user?.systemId])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Update templates - save to database with debounce
  const setTemplates = useCallback(
    (newTemplates: ResponseTemplate[]) => {
      setTemplatesState(newTemplates)

      // Save to database if user logged in (with debounce)
      if (user?.systemId) {
        const newValueStr = JSON.stringify(newTemplates)
        
        // Skip if value hasn't changed
        if (newValueStr === lastSavedRef.current) {
          return
        }

        // Clear existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
        }

        // Debounce save
        saveTimeoutRef.current = setTimeout(() => {
          lastSavedRef.current = newValueStr
          fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.systemId,
              key: STORAGE_KEY,
              value: newTemplates,
              category: 'templates',
            }),
          }).catch(error => {
            console.error('Error saving complaint templates:', error)
          })
        }, SAVE_DEBOUNCE_DELAY)
      }
    },
    [user?.systemId]
  )

  return [templates, setTemplates, isLoading]
}

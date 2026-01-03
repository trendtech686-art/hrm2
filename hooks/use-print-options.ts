/**
 * Hook để quản lý print options
 * Sử dụng database (user preferences) làm source of truth
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'
import type { PaperSize } from '@/features/settings/printer/types'

const API_BASE = '/api/user-preferences'
const SAVE_DEBOUNCE_DELAY = 500

// ==================== Print Options (Full) ====================

export interface PrintOptionsDefaults {
  branchSystemId: string;
  paperSize: PaperSize;
  printOrder: boolean;
  printDelivery: boolean;
  printPacking: boolean;
  printShippingLabel: boolean;
}

const PRINT_OPTIONS_KEY = 'print-options-default'

const DEFAULT_PRINT_OPTIONS: PrintOptionsDefaults = {
  branchSystemId: '',
  paperSize: 'A4',
  printOrder: true,
  printDelivery: false,
  printPacking: false,
  printShippingLabel: false,
}

/**
 * Hook để quản lý print options cho order print dialog
 */
export function usePrintOptions(): [
  PrintOptionsDefaults,
  (options: PrintOptionsDefaults) => void,
  boolean
] {
  const { user } = useAuth()
  const [options, setOptionsState] = useState<PrintOptionsDefaults>(DEFAULT_PRINT_OPTIONS)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>('')

  // Load from database
  useEffect(() => {
    const loadOptions = async () => {
      try {
        if (user?.systemId) {
          const res = await fetch(
            `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(PRINT_OPTIONS_KEY)}`
          )
          
          if (res.ok) {
            const data = await res.json()
            if (data && data.value) {
              setOptionsState({ ...DEFAULT_PRINT_OPTIONS, ...data.value })
              lastSavedRef.current = JSON.stringify(data.value)
            }
          }
        }
      } catch (error) {
        console.error('Error loading print options:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOptions()
  }, [user?.systemId])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Update options - save to database with debounce
  const setOptions = useCallback(
    (newOptions: PrintOptionsDefaults) => {
      setOptionsState(newOptions)

      if (user?.systemId) {
        const newValueStr = JSON.stringify(newOptions)
        
        if (newValueStr === lastSavedRef.current) {
          return
        }

        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
        }

        saveTimeoutRef.current = setTimeout(() => {
          lastSavedRef.current = newValueStr
          fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.systemId,
              key: PRINT_OPTIONS_KEY,
              value: newOptions,
              category: 'ui',
            }),
          }).catch(error => {
            console.error('Error saving print options:', error)
          })
        }, SAVE_DEBOUNCE_DELAY)
      }
    },
    [user?.systemId]
  )

  return [options, setOptions, isLoading]
}

// ==================== Simple Print Options ====================

export interface SimplePrintOptionsDefaults {
  branchSystemId: string;
  paperSize: PaperSize;
}

const SIMPLE_PRINT_OPTIONS_KEY = 'simple-print-options-default'

const DEFAULT_SIMPLE_PRINT_OPTIONS: SimplePrintOptionsDefaults = {
  branchSystemId: '',
  paperSize: 'A4',
}

/**
 * Hook để quản lý simple print options
 */
export function useSimplePrintOptions(): [
  SimplePrintOptionsDefaults,
  (options: SimplePrintOptionsDefaults) => void,
  boolean
] {
  const { user } = useAuth()
  const [options, setOptionsState] = useState<SimplePrintOptionsDefaults>(DEFAULT_SIMPLE_PRINT_OPTIONS)
  const [isLoading, setIsLoading] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>('')

  // Load from database
  useEffect(() => {
    const loadOptions = async () => {
      try {
        if (user?.systemId) {
          const res = await fetch(
            `${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(SIMPLE_PRINT_OPTIONS_KEY)}`
          )
          
          if (res.ok) {
            const data = await res.json()
            if (data && data.value) {
              setOptionsState({ ...DEFAULT_SIMPLE_PRINT_OPTIONS, ...data.value })
              lastSavedRef.current = JSON.stringify(data.value)
            }
          }
        }
      } catch (error) {
        console.error('Error loading simple print options:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOptions()
  }, [user?.systemId])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Update options - save to database with debounce
  const setOptions = useCallback(
    (newOptions: SimplePrintOptionsDefaults) => {
      setOptionsState(newOptions)

      if (user?.systemId) {
        const newValueStr = JSON.stringify(newOptions)
        
        if (newValueStr === lastSavedRef.current) {
          return
        }

        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
        }

        saveTimeoutRef.current = setTimeout(() => {
          lastSavedRef.current = newValueStr
          fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.systemId,
              key: SIMPLE_PRINT_OPTIONS_KEY,
              value: newOptions,
              category: 'ui',
            }),
          }).catch(error => {
            console.error('Error saving simple print options:', error)
          })
        }, SAVE_DEBOUNCE_DELAY)
      }
    },
    [user?.systemId]
  )

  return [options, setOptions, isLoading]
}

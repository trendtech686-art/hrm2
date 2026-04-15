'use client'

import { useState, useCallback } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { sanitizeHtml } from '@/lib/sanitize'

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  isLoading?: boolean
  searchTime?: number
  className?: string
  autoFocus?: boolean
}

/**
 * Unified Search Input Component
 * 
 * Features:
 * - Clear button
 * - Loading indicator
 * - Search time display
 * - Keyboard shortcuts (Escape to clear)
 */
export function SearchInput({
  placeholder = 'Tìm kiếm...',
  value: controlledValue,
  onChange,
  onSearch,
  isLoading = false,
  searchTime,
  className,
  autoFocus = false,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState('')
  
  const value = controlledValue !== undefined ? controlledValue : internalValue
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }, [controlledValue, onChange])
  
  const handleClear = useCallback(() => {
    if (controlledValue === undefined) {
      setInternalValue('')
    }
    onChange?.('')
  }, [controlledValue, onChange])
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear()
    } else if (e.key === 'Enter') {
      onSearch?.(value)
    }
  }, [handleClear, onSearch, value])
  
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="pl-9 pr-20"
      />
      
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {/* Search time indicator */}
        {searchTime !== undefined && value.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {searchTime}ms
          </span>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
        
        {/* Clear button */}
        {value.length > 0 && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-muted rounded"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Highlighted text component for search results
 */
export function HighlightedText({ 
  html, 
  fallback 
}: { 
  html?: string
  fallback: string 
}) {
  if (!html) return <span>{fallback}</span>
  
  return (
    <span 
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
      className="[&>mark]:bg-yellow-200 [&>mark]:text-yellow-900 [&>mark]:px-0.5 [&>mark]:rounded"
    />
  )
}

/**
 * OptimizedImage - Wrapper component for next/image with fallback
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Features:
 * - Sử dụng next/image để optimize images
 * - Fallback về <img> nếu src không hợp lệ
 * - Support cho external URLs và local uploads
 * - Handle loading states
 * ═══════════════════════════════════════════════════════════════════════════════
 */

'use client'

import Image from 'next/image'
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface OptimizedImageProps {
  src: string | null | undefined
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  containerClassName?: string
  priority?: boolean
  quality?: number
  sizes?: string
  onClick?: () => void
  onLoad?: () => void
  onError?: () => void
  fallback?: React.ReactNode
  unoptimized?: boolean
}

/**
 * Check if URL is valid for next/image optimization
 */
function isOptimizableUrl(src: string): boolean {
  // Local uploads are optimizable
  if (src.startsWith('/uploads/') || src.startsWith('/api/')) {
    return true
  }
  
  // Data URLs should not be optimized
  if (src.startsWith('data:')) {
    return false
  }
  
  // Blob URLs should not be optimized
  if (src.startsWith('blob:')) {
    return false
  }
  
  // External URLs need to be configured in next.config.ts
  // For now, allow localhost
  try {
    const url = new URL(src)
    if (url.hostname === 'localhost') {
      return true
    }
  } catch {
    // Invalid URL, use native img
    return false
  }
  
  // For other external URLs, use unoptimized or native img
  return false
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  containerClassName,
  priority = false,
  quality = 75,
  sizes,
  onClick,
  onLoad,
  onError,
  fallback,
  unoptimized,
}: OptimizedImageProps) {
  const [error, setError] = React.useState(false)
  const [_loading, setLoading] = React.useState(true)

  // Reset error state when src changes
  React.useEffect(() => {
    setError(false)
    setLoading(true)
  }, [src])

  // No src provided
  if (!src) {
    return fallback ? <>{fallback}</> : null
  }

  // Error occurred, show fallback
  if (error) {
    return fallback ? <>{fallback}</> : null
  }

  const handleError = () => {
    setError(true)
    onError?.()
  }

  const handleLoad = () => {
    setLoading(false)
    onLoad?.()
  }

  // Check if we should use next/image optimization
  const shouldOptimize = !unoptimized && isOptimizableUrl(src)

  // Use native img for non-optimizable URLs
  if (!shouldOptimize) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onClick={onClick}
        onLoad={handleLoad}
        onError={handleError}
        style={fill ? { objectFit: 'cover', width: '100%', height: '100%' } : undefined}
      />
    )
  }

  // Use next/image for optimizable URLs
  if (fill) {
    return (
      <div className={cn('relative', containerClassName)}>
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          priority={priority}
          quality={quality}
          sizes={sizes || '100vw'}
          onClick={onClick}
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 100}
      height={height || 100}
      className={className}
      priority={priority}
      quality={quality}
      sizes={sizes}
      onClick={onClick}
      onLoad={handleLoad}
      onError={handleError}
    />
  )
}

/**
 * ProductThumbnail - Specialized component for product images
 * 
 * Usage:
 * <ProductThumbnail 
 *   src={imageUrl} 
 *   alt={productName}
 *   size="md"
 *   onClick={() => onPreview(imageUrl, productName)}
 * />
 */
export interface ProductThumbnailProps {
  src: string | null | undefined
  alt: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  fallback?: React.ReactNode
  showHoverEffect?: boolean
}

const sizeMap = {
  xs: { container: 'w-8 h-8', pixels: 32 },
  sm: { container: 'w-10 h-10', pixels: 40 },
  md: { container: 'w-12 h-12', pixels: 48 },
  lg: { container: 'w-16 h-16', pixels: 64 },
}

export function ProductThumbnail({
  src,
  alt,
  size = 'md',
  className,
  onClick,
  fallback,
  showHoverEffect = true,
}: ProductThumbnailProps) {
  const { container, pixels } = sizeMap[size]
  
  return (
    <div
      className={cn(
        container,
        'rounded border overflow-hidden bg-muted',
        onClick && 'cursor-pointer',
        showHoverEffect && onClick && 'group/thumbnail',
        className
      )}
      onClick={onClick}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={pixels}
        height={pixels}
        className={cn(
          'w-full h-full object-cover',
          showHoverEffect && onClick && 'transition-all group-hover/thumbnail:brightness-75'
        )}
        fallback={fallback}
      />
    </div>
  )
}

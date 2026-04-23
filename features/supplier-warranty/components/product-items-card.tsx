'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mobileBleedCardClass } from '@/components/layout/page-section'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LazyImage } from '@/components/ui/lazy-image'
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog'
import { cn } from '@/lib/utils'
import { Package, Eye } from 'lucide-react'
import { useProductsByIds } from '@/features/products/hooks/use-products'
import type { SupplierWarrantyItem } from '../types'

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const formatNumber = (value: number) => new Intl.NumberFormat('vi-VN').format(value)

function getResultBadge(result: string | null) {
  if (!result) return null
  const lower = result.toLowerCase()
  if (lower.includes('bảo hành') || lower.includes('sửa')) return 'bg-green-100 text-green-800'
  if (lower.includes('trả') || lower.includes('hoàn')) return 'bg-orange-100 text-orange-800'
  if (lower.includes('đổi') || lower.includes('thay')) return 'bg-blue-100 text-blue-800'
  if (lower.includes('từ chối') || lower.includes('hủy')) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

interface ProductItemsCardProps {
  items: SupplierWarrantyItem[]
  status: string
}

export function ProductItemsCard({ items, status }: ProductItemsCardProps) {
  const showConfirmColumns = ['CONFIRMED', 'COMPLETED'].includes(status)

  // Image preview state
  const [previewState, setPreviewState] = React.useState({ open: false, images: [''], title: '' })
  const handleImagePreview = React.useCallback((imageUrl: string, title: string) => {
    setPreviewState({ open: true, images: [imageUrl], title })
  }, [])

  // Fetch product images from catalog
  const productSystemIds = React.useMemo(
    () => items.map(p => p.productSystemId).filter(Boolean) as string[],
    [items]
  )
  const { productsMap } = useProductsByIds(productSystemIds)

  const getProductImage = React.useCallback((item: SupplierWarrantyItem) => {
    if (item.productImage) return item.productImage
    const catalogProduct = item.productSystemId ? productsMap.get(item.productSystemId) : undefined
    if (!catalogProduct) return null
    return catalogProduct.thumbnailImage || (catalogProduct as Record<string, unknown>).imageUrl as string || catalogProduct.galleryImages?.[0] || catalogProduct.images?.[0] || null
  }, [productsMap])

  // Mobile Card
  const MobileProductCard = ({ item }: { item: SupplierWarrantyItem }) => {
    const image = getProductImage(item)
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-3">
            {/* Header: Image + Name + Result badge */}
            <div className="flex gap-3">
              {image ? (
                <div
                  className="group/thumbnail shrink-0 w-14 h-14 rounded-md overflow-hidden border border-muted cursor-pointer relative"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleImagePreview(image, item.productName)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleImagePreview(image, item.productName) }}
                >
                  <LazyImage src={image} alt={item.productName} className="w-full h-full object-cover transition-all group-hover/thumbnail:brightness-75" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumbnail:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4 text-white drop-shadow-md" />
                  </div>
                </div>
              ) : (
                <div className="shrink-0 w-14 h-14 rounded-md bg-muted flex items-center justify-center">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-snug">{item.productName}</p>
                {item.productSystemId ? (
                  <Link href={`/products/${item.productSystemId}`} className="text-xs text-primary hover:underline block mt-0.5">
                    {item.productId}
                  </Link>
                ) : (
                  <span className="text-xs text-muted-foreground block mt-0.5">{item.productId}</span>
                )}
              </div>
              {showConfirmColumns && item.warrantyResult && (
                <Badge className={cn(getResultBadge(item.warrantyResult), 'text-xs px-2 py-0.5 h-fit')}>
                  {item.warrantyResult}
                </Badge>
              )}
            </div>

            <Separator />

            {/* Quantities */}
            <div className={cn('grid gap-3', showConfirmColumns ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2')}>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">SL gửi</p>
                <p className="font-semibold text-sm">{item.sentQuantity}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Đơn giá</p>
                <p className="font-semibold text-sm">{formatNumber(item.unitPrice)} đ</p>
              </div>
              {showConfirmColumns && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">SL bảo hành</p>
                    <p className="font-semibold text-sm text-green-600">{item.approvedQuantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">SL trả lại</p>
                    <p className="font-semibold text-sm text-orange-600">{item.returnedQuantity}</p>
                  </div>
                </>
              )}
            </div>

            {/* Note */}
            {item.itemNote && (
              <>
                <Separator />
                <p className="text-xs text-muted-foreground leading-snug">{item.itemNote}</p>
              </>
            )}

            {/* Cost */}
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Thành tiền:</span>
              <span className="font-bold text-sm">{formatNumber(item.sentQuantity * item.unitPrice)} đ</span>
            </div>
            {showConfirmColumns && item.warrantyCost > 0 && (
              <div className="flex justify-between items-center bg-primary/5 -mx-3 -mb-3 px-3 py-2 sm:-mx-4 sm:-mb-4 sm:px-4">
                <span className="text-xs font-medium text-primary">Chi phí BH:</span>
                <span className="font-bold text-sm text-primary">{formatNumber(item.warrantyCost)} đ</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={mobileBleedCardClass}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Danh sách sản phẩm ({items.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0 md:p-6 md:pt-0">
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm">Chưa có sản phẩm nào</div>
        ) : (
          <>
            {/* Mobile View - Card Layout */}
            <div className="block lg:hidden space-y-3 p-4 md:p-0">
              {items.map((item) => (
                <MobileProductCard key={item.systemId} item={item} />
              ))}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">STT</TableHead>
                    <TableHead className="min-w-50">Sản phẩm</TableHead>
                    <TableHead className="w-20 text-center">SL gửi</TableHead>
                    <TableHead className="w-32 text-right">Đơn giá</TableHead>
                    {showConfirmColumns && (
                      <>
                        <TableHead className="w-20 text-center">SL BH</TableHead>
                        <TableHead className="w-20 text-center">SL trả</TableHead>
                        <TableHead className="w-32 text-right">Chi BH</TableHead>
                        <TableHead className="w-32">Kết quả</TableHead>
                      </>
                    )}
                    <TableHead className="min-w-36">Ghi chú</TableHead>
                    <TableHead className="w-32 text-right">Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => {
                    const image = getProductImage(item)
                    return (
                      <TableRow key={item.systemId}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-start gap-2">
                            {image ? (
                              <div
                                className="group/thumbnail shrink-0 w-10 h-10 rounded-md overflow-hidden border border-muted cursor-pointer relative"
                                role="button"
                                tabIndex={0}
                                onClick={(e) => { e.stopPropagation(); handleImagePreview(image, item.productName) }}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleImagePreview(image, item.productName) }}
                              >
                                <LazyImage src={image} alt={item.productName} className="w-full h-full object-cover transition-all group-hover/thumbnail:brightness-75" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumbnail:opacity-100 transition-opacity">
                                  <Eye className="w-3.5 h-3.5 text-white drop-shadow-md" />
                                </div>
                              </div>
                            ) : (
                              <div className="shrink-0 w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                                <Package className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <div className="space-y-0.5 min-w-0">
                              <p className="font-medium leading-snug">{item.productName}</p>
                              {item.productSystemId ? (
                                <Link href={`/products/${item.productSystemId}`} className="text-xs text-primary hover:underline">
                                  {item.productId}
                                </Link>
                              ) : (
                                <span className="text-xs text-muted-foreground">{item.productId}</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.sentQuantity}</TableCell>
                        <TableCell className="text-right">{formatNumber(item.unitPrice)}</TableCell>
                        {showConfirmColumns && (
                          <>
                            <TableCell className="text-center font-medium text-green-600">{item.approvedQuantity}</TableCell>
                            <TableCell className="text-center font-medium text-orange-600">{item.returnedQuantity}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(item.warrantyCost)}</TableCell>
                            <TableCell>
                              {item.warrantyResult ? (
                                <Badge className={cn(getResultBadge(item.warrantyResult), 'text-xs px-2 py-0.5')}>
                                  {item.warrantyResult}
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          </>
                        )}
                        <TableCell>
                          {item.itemNote ? (
                            <p className="text-xs text-muted-foreground leading-snug">{item.itemNote}</p>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatNumber(item.sentQuantity * item.unitPrice)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>

      {/* Image Preview Dialog */}
      <ImagePreviewDialog
        images={previewState.images}
        open={previewState.open}
        onOpenChange={(open) => setPreviewState(prev => ({ ...prev, open }))}
        title={previewState.title}
      />
    </Card>
  )
}

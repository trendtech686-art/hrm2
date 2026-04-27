'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mobileBleedCardClass } from '@/components/layout/page-section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePageHeader } from '@/contexts/page-header-context'
import { useSupplierWarrantyMutations, useSupplierWarranty } from './hooks/use-supplier-warranty'
import { createSupplierWarrantySchema, type CreateSupplierWarrantyInput } from './validation'
import { SupplierSelectionCard } from '@/features/purchase-orders/components/supplier-selection-card'
import { UnifiedProductSearch } from '@/components/shared/unified-product-search'
import { BarcodeScannerButton } from '@/components/shared/barcode-scanner-button'
import { ProductSelectionDialog } from '@/features/shared/product-selection-dialog'
import { useSupplierFinder } from '@/features/suppliers/hooks/use-all-suppliers'
import { CurrencyInput } from '@/components/ui/currency-input'
import { useSupplierStats } from '@/features/suppliers/hooks/use-supplier-stats'
import { useAllBranches, useDefaultBranch } from '@/features/settings/branches/hooks/use-all-branches'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Save, Loader2, PackageOpen, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { asSystemId } from '@/lib/id-types'
import { WarrantyShippingCard, type WarrantyShippingCardRef } from './components/warranty-shipping-card'
import type { DeliveryMethod } from '@/lib/types/prisma-extended'
import type { SupplierWarranty } from './types'
import type { Product } from '@/features/products/types'

interface SupplierWarrantyFormPageProps {
  systemId?: string // If provided, edit mode
}

export function SupplierWarrantyFormPage({ systemId }: SupplierWarrantyFormPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditMode = !!systemId
  const copyFromId = searchParams.get('copy')
  const { create, update } = useSupplierWarrantyMutations()
  const { data: existingData } = useSupplierWarranty(systemId || '')
  const { data: copyFromData } = useSupplierWarranty(copyFromId || '')

  const [isProductSelectionOpen, setIsProductSelectionOpen] = React.useState(false)
  const { findById } = useSupplierFinder()
  const shippingCardRef = React.useRef<WarrantyShippingCardRef>(null)

  const form = useForm<CreateSupplierWarrantyInput>({
    resolver: zodResolver(createSupplierWarrantySchema),
    defaultValues: {
      supplierSystemId: '',
      supplierName: '',
      reason: '',
      notes: '',
      deliveryMethod: 'deliver-later',
      items: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  // Supplier stats for address display
  const watchedSupplierId = form.watch('supplierSystemId')
  const { data: supplierStats } = useSupplierStats(watchedSupplierId || '')

  // Branch list + default
  const { data: branches } = useAllBranches()
  const { defaultBranch } = useDefaultBranch()

  // Set default branch on mount (only for create mode)
  React.useEffect(() => {
    if (!isEditMode && !copyFromId && defaultBranch && !form.getValues('branchSystemId')) {
      form.setValue('branchSystemId', defaultBranch.systemId)
      form.setValue('branchName', defaultBranch.name)
    }
  }, [isEditMode, copyFromId, defaultBranch, form])

  // Populate form on edit mode
  React.useEffect(() => {
    const source = isEditMode ? existingData : copyFromData
    if (!source) return
    form.reset({
      supplierSystemId: source.supplierSystemId,
      supplierName: source.supplierName,
      branchSystemId: source.branchSystemId || undefined,
      branchName: source.branchName || undefined,
      reason: source.reason || '',
      notes: source.notes || '',
      assignedToSystemId: source.assignedToSystemId || undefined,
      assignedToName: source.assignedToName || undefined,
      deliveryMethod: source.deliveryMethod || 'deliver-later',
      items: source.items.map(item => ({
        productSystemId: item.productSystemId || '',
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        sentQuantity: item.sentQuantity,
        unitPrice: item.unitPrice,
        itemNote: item.itemNote || undefined,
      })),
    })
  }, [isEditMode, existingData, copyFromData, form])

  // Guard to prevent double submission (ref for immediate sync check)
  const isSubmittingRef = React.useRef(false)

  // Submit handler — defined before headerActions to avoid missing dep
  const onSubmit = React.useCallback(async (data: CreateSupplierWarrantyInput) => {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true

    try {
    // Validate shipping selection when shipping-partner is chosen (like order form)
    if (data.deliveryMethod === 'shipping-partner') {
      const isValid = shippingCardRef.current?.validate()
      if (!isValid) { isSubmittingRef.current = false; return }

      // Create GHTK shipment → get tracking code
      const result = await shippingCardRef.current?.createShipment()
      if (!result) { isSubmittingRef.current = false; return } // createShipment already showed toast
      data = { ...data, trackingNumber: result.trackingCode }
    }

    if (isEditMode && systemId) {
      update.mutate({ systemId, data }, {
        onSuccess: () => {
          toast.success('Cập nhật phiếu BH NCC thành công')
          router.push(`/supplier-warranties/${systemId}`)
        },
        onError: (err) => { toast.error(err.message); isSubmittingRef.current = false },
      })
    } else {
      create.mutate(data, {
        onSuccess: (result) => {
          toast.success('Tạo phiếu BH NCC thành công', {
            description: data.trackingNumber ? `Mã vận đơn: ${data.trackingNumber}` : undefined,
          })
          const newId = (result as SupplierWarranty)?.systemId
          router.push(newId ? `/supplier-warranties/${newId}` : '/supplier-warranties')
        },
        onError: (err) => { toast.error(err.message); isSubmittingRef.current = false },
      })
    }
    } catch {
      isSubmittingRef.current = false
    }
  }, [isEditMode, systemId, create, update, router])

  const isSubmitting = create.isPending || update.isPending

  // Page header with actions (memoized like other modules)
  const headerActions = React.useMemo(() => [
    <Button key="back" variant="outline" size="sm" onClick={() => router.push('/supplier-warranties')}>
      <ArrowLeft className="mr-1.5 h-4 w-4" />
      Quay lại
    </Button>,
    <Button key="submit" size="sm" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
      {isSubmitting ? (
        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
      ) : (
        <Save className="mr-1.5 h-4 w-4" />
      )}
      {isEditMode ? 'Cập nhật' : 'Tạo phiếu'}
    </Button>,
  ], [router, form, onSubmit, isEditMode, isSubmitting])

  usePageHeader({
    title: isEditMode ? `Sửa phiếu BH NCC` : 'Tạo phiếu BH NCC',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'BH Nhà cung cấp', href: '/supplier-warranties', isCurrent: false },
      { label: isEditMode ? 'Sửa' : 'Tạo mới', href: '#', isCurrent: true },
    ],
    actions: headerActions,
    showBackButton: false,
  })

  // Handle supplier selection from SupplierSelectionCard
  const handleSupplierChange = React.useCallback((supplierId: string | null) => {
    if (!supplierId) {
      form.setValue('supplierSystemId', '')
      form.setValue('supplierName', '')
      return
    }
    const supplier = findById(asSystemId(supplierId))
    form.setValue('supplierSystemId', supplierId)
    form.setValue('supplierName', supplier?.name || '')
  }, [form, findById])

  // Exclude product IDs already in the list
  const excludeProductIds = React.useMemo(() => {
    return new Set(fields.map(f => f.productSystemId).filter(Boolean))
  }, [fields])

  // Handle single product select from UnifiedProductSearch
  const handleSelectProduct = React.useCallback((product: Product) => {
    const existingIds = form.getValues('items').map(i => i.productSystemId)
    if (existingIds.includes(product.systemId)) {
      toast.error('Sản phẩm đã có trong danh sách')
      return
    }
    append({
      productSystemId: product.systemId,
      productId: product.id,
      productName: product.name,
      productImage: product.thumbnailImage || null,
      sentQuantity: 1,
      unitPrice: product.lastPurchasePrice || 0,
    })
  }, [form, append])

  // Handle multiple product select from ProductSelectionDialog
  const handleSelectProducts = React.useCallback((products: Product[], quantities?: Record<string, number>) => {
    const existingIds = new Set(form.getValues('items').map(i => i.productSystemId))
    for (const product of products) {
      if (existingIds.has(product.systemId)) continue
      append({
        productSystemId: product.systemId,
        productId: product.id,
        productName: product.name,
        productImage: product.thumbnailImage || null,
        sentQuantity: quantities?.[product.systemId] || 1,
        unitPrice: product.lastPurchasePrice || 0,
      })
    }
  }, [form, append])

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Supplier + Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SupplierSelectionCard
              value={form.watch('supplierSystemId') ? asSystemId(form.watch('supplierSystemId')) : undefined}
              onChange={handleSupplierChange}
            />
            {form.formState.errors.supplierSystemId && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.supplierSystemId.message}</p>
            )}
          </div>

          <Card className={mobileBleedCardClass}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Thông tin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Chi nhánh <span className="text-destructive">*</span></Label>
                <Select
                  value={form.watch('branchSystemId') || ''}
                  onValueChange={(val) => {
                    const branch = branches.find(b => b.systemId === val)
                    form.setValue('branchSystemId', val)
                    form.setValue('branchName', branch?.name || '')
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chi nhánh" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(b => (
                      <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.branchSystemId && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.branchSystemId.message}</p>
                )}
              </div>
              <div>
                <Label>Lý do bảo hành <span className="text-destructive">*</span></Label>
                <Textarea {...form.register('reason')} placeholder="Nhập lý do gửi bảo hành..." rows={2} />
                {form.formState.errors.reason && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.reason.message}</p>
                )}
              </div>
              <div>
                <Label>Ghi chú</Label>
                <Textarea {...form.register('notes')} placeholder="Ghi chú thêm..." rows={2} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products — giống warranty-products-section pattern */}
        <Card className={mobileBleedCardClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base">Danh sách sản phẩm bảo hành</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product search + Chọn nhanh */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <UnifiedProductSearch
                  onSelectProduct={handleSelectProduct}
                  excludeProductIds={excludeProductIds}
                  placeholder="Thêm sản phẩm bảo hành (F3)"
                  searchPlaceholder="Tìm kiếm theo tên, mã SKU, barcode..."
                  showPurchasePrice={true}
                  allowCreateNew={false}
                />
              </div>
              <BarcodeScannerButton
                onDetect={async (code) => {
                  try {
                    const res = await fetch(`/api/search/products?q=${encodeURIComponent(code)}&limit=5&offset=0`)
                    if (!res.ok) throw new Error('search failed')
                    const json = await res.json() as { data: Product[] }
                    const match = json.data?.[0]
                    if (!match) {
                      toast.error(`Không tìm thấy sản phẩm cho mã "${code}"`)
                      return
                    }
                    handleSelectProduct(match)
                    toast.success(`Đã thêm: ${match.name}`)
                  } catch {
                    toast.error('Không thể tra cứu mã vạch. Thử lại.')
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsProductSelectionOpen(true)}
              >
                Chọn nhanh
              </Button>
            </div>

            {form.formState.errors.items && typeof form.formState.errors.items === 'object' && 'message' in form.formState.errors.items && (
              <p className="text-sm text-destructive">{form.formState.errors.items.message as string}</p>
            )}

            {/* Products table */}
            {fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                <PackageOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">Chưa có sản phẩm nào</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Sử dụng ô tìm kiếm bên trên để thêm sản phẩm
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">STT</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="w-28 text-center">SL gửi BH</TableHead>
                      <TableHead className="w-44 text-right">Giá nhập</TableHead>
                      <TableHead className="w-36 text-right">Thành tiền</TableHead>
                      <TableHead className="w-40">Ghi chú</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const qty = form.watch(`items.${index}.sentQuantity`) || 0
                      const price = form.watch(`items.${index}.unitPrice`) || 0
                      const total = qty * price

                      return (
                        <TableRow key={field.id}>
                          <TableCell className="text-center text-muted-foreground align-top pt-4">{index + 1}</TableCell>
                          <TableCell className="align-top pt-3">
                            <div className="flex items-start gap-3">
                              {form.watch(`items.${index}.productImage`) ? (
                                <div className="w-12 h-12 shrink-0 rounded-md overflow-hidden border border-muted">
                                  <Image
                                    src={form.watch(`items.${index}.productImage`) || ''}
                                    alt=""
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 shrink-0 bg-muted rounded-md flex items-center justify-center">
                                  <PackageOpen className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                              <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="font-medium text-sm truncate">{field.productName}</span>
                                <Link
                                  href={`/products/${field.productSystemId}`}
                                  className="text-xs text-muted-foreground hover:text-primary hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  SKU: {field.productId}
                                </Link>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="align-top pt-3">
                            <Input
                              type="number"
                              min={1}
                              className="h-8 text-center"
                              {...form.register(`items.${index}.sentQuantity`, { valueAsNumber: true })}
                            />
                          </TableCell>
                          <TableCell className="text-right align-top pt-3">
                            <CurrencyInput
                              className="h-8"
                              value={price}
                              onChange={(v) => form.setValue(`items.${index}.unitPrice`, v)}
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium text-sm align-top pt-4">
                            {new Intl.NumberFormat('vi-VN').format(total)} đ
                          </TableCell>
                          <TableCell className="align-top pt-3">
                            <Input
                              className="h-8"
                              placeholder="Ghi chú"
                              {...form.register(`items.${index}.itemNote`)}
                            />
                          </TableCell>
                          <TableCell className="align-top pt-3">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card giao hàng — reuse DeliveryMethodCard từ orders */}
        <WarrantyShippingCard
          ref={shippingCardRef}
          deliveryMethod={(form.watch('deliveryMethod') || 'deliver-later') as DeliveryMethod}
          onMethodChange={(method) => form.setValue('deliveryMethod', method)}
          supplierName={form.watch('supplierName')}
          supplierPhone={supplierStats?.supplier?.phone}
          supplierAddress={supplierStats?.supplier?.address}
          supplierAddressData={supplierStats?.supplier?.addressData as Record<string, unknown> | null}
          branchSystemId={form.watch('branchSystemId')}
          items={form.watch('items')?.map(i => ({ sentQuantity: i.sentQuantity, unitPrice: i.unitPrice })) || []}
        />

        {/* Submit — bottom bar for desktop */}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push('/supplier-warranties')}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-4 w-4" />
                {isEditMode ? 'Cập nhật' : 'Tạo phiếu'}
              </>
            )}
          </Button>
        </div>

        {/* Mobile sticky submit */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex gap-3 md:hidden z-50">
          <Button type="button" variant="outline" className="flex-1" onClick={() => router.push('/supplier-warranties')}>
            Hủy
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo phiếu')}
          </Button>
        </div>

        {/* Product selection dialog (Chọn nhanh) */}
        <ProductSelectionDialog
          isOpen={isProductSelectionOpen}
          onOpenChange={setIsProductSelectionOpen}
          onSelect={handleSelectProducts}
          showPurchasePrice={true}
        />
      </form>
    </FormProvider>
  )
}

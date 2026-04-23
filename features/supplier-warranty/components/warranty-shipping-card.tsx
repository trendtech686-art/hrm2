/**
 * WarrantyShippingCard
 * Shipping card for supplier warranty — reuses DeliveryMethodCard from orders.
 * Adapts supplier address → delivery address, branch → pickup address.
 */

'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mobileBleedCardClass } from '@/components/layout/page-section'
import { DeliveryMethodCard } from '@/features/orders/components/shipping/delivery-method-card'
import { AddressFormDialog } from '@/features/customers/components/address-form-dialog'
import { useBranchFinder } from '@/features/settings/branches/hooks/use-all-branches'
import { loadShippingConfigAsync, getDefaultAccount } from '@/lib/utils/shipping-config-migration'
import { getGHTKCredentials } from '@/lib/utils/get-shipping-credentials'
import { GHTKService, type GHTKCreateOrderParams } from '@/features/settings/shipping/integrations/ghtk-service'
import { asSystemId } from '@/lib/id-types'
import { logError } from '@/lib/logger'
import { Truck, AlertTriangle } from 'lucide-react'
import type { CustomerAddress } from '@/lib/types/prisma-extended'
import type {
  DeliveryMethod,
  ShippingCalculationRequest,
  OrderShippingService as ShippingService,
  ShippingAddressInfo as ShippingAddress,
  PackageInfo,
  SelectedShippingConfig,
} from '@/lib/types/prisma-extended'

// Structured address from supplier's addressData JSON
interface SupplierAddressData {
  street?: string
  ward?: string
  wardId?: string
  province?: string
  provinceId?: string
  district?: string
  districtId?: number
}

export interface WarrantyShippingCardRef {
  /** Create GHTK shipment using current selected service + address. Returns tracking code + fee or null on failure. */
  createShipment: () => Promise<{ trackingCode: string; shippingFee: number } | null>
  /** Validate shipping selection — returns true if valid, false + toast if invalid. */
  validate: () => boolean
}

interface WarrantyShippingCardProps {
  deliveryMethod: DeliveryMethod
  onMethodChange: (method: DeliveryMethod) => void
  supplierName?: string
  supplierPhone?: string
  supplierAddress?: string
  supplierAddressData?: SupplierAddressData | null
  branchSystemId?: string
  warrantyId?: string
  items?: Array<{ name?: string; sentQuantity: number; unitPrice: number }>
  onShippingServiceSelect?: (service: ShippingService | null) => void
  disabled?: boolean
}

export const WarrantyShippingCard = React.forwardRef<WarrantyShippingCardRef, WarrantyShippingCardProps>(function WarrantyShippingCardInner({
  deliveryMethod,
  onMethodChange,
  supplierName,
  supplierPhone,
  supplierAddress,
  supplierAddressData,
  branchSystemId,
  items = [],
  warrantyId,
  onShippingServiceSelect,
  disabled,
}, ref) {
  const { findById: findBranchById } = useBranchFinder()

  // Selected shipping service (GHTK result)
  const [selectedService, setSelectedService] = React.useState<ShippingService | null>(null)
  const [serviceOptions, setServiceOptions] = React.useState<Partial<SelectedShippingConfig['options']>>({})

  // Address dialog state
  const [isAddressDialogOpen, setIsAddressDialogOpen] = React.useState(false)

  // Build supplier address as "customer address" for DeliveryMethodCard (editable)
  const [customerAddress, setCustomerAddress] = React.useState<ShippingAddress | undefined>(undefined)

  // Initialize customerAddress from supplier data
  // Set dummy IDs (1) when names exist — GHTK API uses string names, not IDs (same as orders)
  React.useEffect(() => {
    if (!supplierAddress && !supplierAddressData) return
    const addr = supplierAddressData
    const province = addr?.province || ''
    const district = addr?.district || ''
    // When addressData has street, use it. Otherwise extract first part from text address
    // to avoid duplication in DeliveryMethodCard's formatAddress ([address, ward, district, province])
    const street = addr?.street
      || (supplierAddress ? supplierAddress.split(',')[0]?.trim() : '')
      || ''
    setCustomerAddress({
      name: supplierName || '',
      phone: supplierPhone || '',
      address: street,
      province,
      provinceId: addr?.provinceId ? Number(addr.provinceId) : (province ? 1 : 0),
      district,
      districtId: addr?.districtId || (district ? 1 : 0),
      ward: addr?.ward || '',
    })
  }, [supplierName, supplierPhone, supplierAddress, supplierAddressData])

  // Build pickup address from branch + GHTK partner config
  const [pickupAddress, setPickupAddress] = React.useState<ShippingAddress | undefined>(undefined)

  React.useEffect(() => {
    let cancelled = false
    // Load shipping config to find GHTK pickup address
    loadShippingConfigAsync().then(config => {
      if (cancelled) return
      const defaultAccount = getDefaultAccount(config, 'GHTK')
      if (!defaultAccount || !defaultAccount.pickupAddresses?.length) {
        // No GHTK account or no pickup addresses configured at all
        return
      }

      let pickupAddr = null as typeof defaultAccount.pickupAddresses[0] | null

      // If branchSystemId provided, try to match specific branch
      if (branchSystemId) {
        const branch = findBranchById(asSystemId(branchSystemId))

        // Match by sapoBranchId (systemId)
        pickupAddr = defaultAccount.pickupAddresses.find(p => p.sapoBranchId === branchSystemId) || null
        // Fallback: match by hrmBranchId
        if (!pickupAddr) {
          pickupAddr = defaultAccount.pickupAddresses.find(p => p.hrmBranchId === branchSystemId) || null
        }
        // Fallback: match by branch.id (legacy)
        if (!pickupAddr && branch?.id) {
          pickupAddr = defaultAccount.pickupAddresses.find(p => p.sapoBranchId === String(branch.id)) || null
        }
        // Fallback: match by branch name
        if (!pickupAddr && branch?.name) {
          pickupAddr = defaultAccount.pickupAddresses.find(p => p.sapoBranchName === branch.name || p.hrmBranchName === branch.name) || null
        }
      }

      // Final fallback: use default pickup address or first active one
      if (!pickupAddr) {
        pickupAddr = defaultAccount.pickupAddresses.find(p => p.isDefault && p.active)
          || defaultAccount.pickupAddresses.find(p => p.active)
          || defaultAccount.pickupAddresses[0]
          || null
      }

      if (pickupAddr && !cancelled) {
        setPickupAddress({
          name: pickupAddr.partnerWarehouseName,
          phone: pickupAddr.partnerWarehouseTel || '',
          address: pickupAddr.partnerWarehouseAddress,
          province: pickupAddr.partnerWarehouseProvince,
          provinceId: 1, // Placeholder — GHTK uses province name string
          district: pickupAddr.partnerWarehouseDistrict,
          districtId: 1, // Placeholder — GHTK uses district name string
          ward: pickupAddr.partnerWarehouseWard || '',
        })
      }
    })
    return () => { cancelled = true }
  }, [branchSystemId, findBranchById])

  // Calculate weight from items (default 500g per item if no weight data)
  const totalWeight = React.useMemo(() => {
    const totalQty = items.reduce((sum, i) => sum + i.sentQuantity, 0)
    return Math.max(totalQty * 500, 500) // 500g per item default
  }, [items])

  // Package info
  const packageInfo = React.useMemo((): PackageInfo => ({
    weight: totalWeight,
    weightUnit: 'gram',
    length: 20,
    width: 15,
    height: 10,
    codAmount: 0, // Warranty = no COD
    insuranceValue: items.reduce((sum, i) => sum + i.sentQuantity * i.unitPrice, 0),
  }), [totalWeight, items])

  // Build shipping request for GHTK fee calculation
  // Guard: check province names (GHTK uses strings). District optional for 2-level addresses.
  const shippingRequest = React.useMemo((): ShippingCalculationRequest | null => {
    if (!pickupAddress || !customerAddress) return null
    if (!pickupAddress.province || !customerAddress.province) return null
    if (deliveryMethod !== 'shipping-partner') return null

    return {
      fromProvinceId: pickupAddress.provinceId,
      fromDistrictId: pickupAddress.districtId,
      fromWardCode: pickupAddress.ward || '',
      fromAddress: pickupAddress.address,
      fromProvince: pickupAddress.province,
      fromDistrict: pickupAddress.district,
      toProvinceId: customerAddress.provinceId,
      toDistrictId: customerAddress.districtId,
      toWard: customerAddress.ward || '',
      toAddress: customerAddress.address,
      toProvince: customerAddress.province,
      toDistrict: customerAddress.district,
      weight: totalWeight,
      codAmount: 0,
      insuranceValue: packageInfo.insuranceValue,
      options: {
        transport: 'road',
        ...serviceOptions,
      },
    }
  }, [pickupAddress, customerAddress, deliveryMethod, totalWeight, packageInfo.insuranceValue, serviceOptions])

  // Handle service selection
  const handleServiceSelect = React.useCallback((service: ShippingService | null) => {
    setSelectedService(service)
    onShippingServiceSelect?.(service)
  }, [onShippingServiceSelect])

  // Handle package info change
  const handlePackageInfoChange = React.useCallback((_info: Partial<PackageInfo>) => {
    // For warranty, we don't need to update form — just let DeliveryMethodCard handle internally
  }, [])

  // Handle service config change
  const handleServiceConfigChange = React.useCallback((config: Partial<SelectedShippingConfig['options']>) => {
    setServiceOptions(prev => ({ ...prev, ...config }))
  }, [])

  // Handle address change — open dialog
  const handleChangeAddress = React.useCallback(() => {
    setIsAddressDialogOpen(true)
  }, [])

  // Build editingAddress for AddressFormDialog from current customerAddress
  const editingAddress = React.useMemo((): CustomerAddress | null => {
    if (!customerAddress) return null
    return {
      id: 'warranty-supplier',
      label: 'Địa chỉ nhà cung cấp',
      street: customerAddress.address || '',
      ward: customerAddress.ward || '',
      wardId: '',
      district: customerAddress.district || '',
      districtId: customerAddress.districtId || 0,
      province: customerAddress.province || '',
      provinceId: String(customerAddress.provinceId || ''),
      contactName: customerAddress.name || '',
      contactPhone: customerAddress.phone || '',
      inputLevel: '2-level',
      autoFilled: false,
      isDefaultShipping: false,
      isDefaultBilling: false,
    }
  }, [customerAddress])

  // Handle save from address dialog
  // address field = street only (DeliveryMethodCard's formatAddress appends ward/district/province)
  const handleSaveAddress = React.useCallback((address: Omit<CustomerAddress, 'id'>) => {
    const province = address.province || ''
    const district = address.district || ''
    setCustomerAddress({
      name: address.contactName || customerAddress?.name || '',
      phone: address.contactPhone || customerAddress?.phone || '',
      address: address.street || '',
      province,
      provinceId: address.provinceId ? Number(address.provinceId) : (province ? 1 : 0),
      district,
      districtId: address.districtId || (district ? 1 : 0),
      ward: address.ward || '',
    })
    setIsAddressDialogOpen(false)
  }, [customerAddress?.name, customerAddress?.phone])

  // ── Expose createShipment + validate to parent via ref ──
  React.useImperativeHandle(ref, () => ({
    validate: (): boolean => {
      if (deliveryMethod !== 'shipping-partner') return true
      if (!selectedService) {
        toast.error('Thiếu thông tin vận chuyển', { description: 'Vui lòng chọn dịch vụ vận chuyển (VD: GHTK)' })
        return false
      }
      if (!customerAddress?.province) {
        toast.error('Thiếu thông tin vận chuyển', { description: 'Vui lòng cập nhật địa chỉ giao hàng' })
        return false
      }
      return true
    },
    createShipment: async (): Promise<{ trackingCode: string; shippingFee: number } | null> => {
      if (deliveryMethod !== 'shipping-partner') return null
      if (!selectedService) {
        toast.error('Thiếu thông tin', { description: 'Vui lòng chọn dịch vụ vận chuyển' })
        return null
      }
      if (!customerAddress?.province) {
        toast.error('Thiếu thông tin', { description: 'Vui lòng cập nhật địa chỉ giao hàng' })
        return null
      }
      if (!customerAddress.ward) {
        toast.error('Thiếu thông tin', { description: 'Vui lòng kiểm tra phường/xã người nhận' })
        return null
      }

      try {
        const { apiToken, partnerCode } = getGHTKCredentials()

        // Build GHTK create order params
        const now = new Date()
        const yy = String(now.getFullYear()).slice(-2)
        const mm = String(now.getMonth() + 1).padStart(2, '0')
        const dd = String(now.getDate()).padStart(2, '0')
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let rnd = ''
        for (let i = 0; i < 5; i++) rnd += chars.charAt(Math.floor(Math.random() * chars.length))
        const orderId = `BH${yy}${mm}${dd}${rnd}`

        // GHTK: gửi 1 sản phẩm chung "Hàng bảo hành" thay vì toàn bộ danh sách
        const products = [{
          name: 'Hàng bảo hành',
          weight: 0.5,
          quantity: 1,
          price: packageInfo.insuranceValue || 0,
          productCode: 'WARRANTY',
        }]

        const ghtkParams: GHTKCreateOrderParams = {
          orderId: warrantyId ? `${warrantyId}_${orderId}` : orderId,
          // Pickup
          pickName: pickupAddress?.name || 'Cửa hàng',
          pickAddress: pickupAddress?.address || '',
          pickTel: pickupAddress?.phone || '',
          pickProvince: pickupAddress?.province || '',
          pickDistrict: pickupAddress?.district || '',
          pickWard: pickupAddress?.ward || '',
          // Customer (supplier)
          customerName: customerAddress.name || supplierName || '',
          customerTel: customerAddress.phone || '',
          customerAddress: customerAddress.address || '',
          customerProvince: customerAddress.province,
          customerDistrict: customerAddress.district || '',
          customerWard: customerAddress.ward,
          customerHamlet: 'Khác',
          // Products
          products,
          // Payment: warranty = no COD, value = insurance
          pickMoney: 0,
          value: packageInfo.insuranceValue || 0,
          isFreeship: 1, // Shop trả phí
          // Config
          note: '',
          transport: (serviceOptions?.transport as 'road' | 'fly') || 'road',
          weightOption: 'gram',
          totalWeight: totalWeight,
          height: 10,
          width: 15,
          length: 20,
          // Pickup address ID from config form
          ...(serviceOptions?.pickAddressId && { pickAddressId: serviceOptions.pickAddressId as string }),
          ...(serviceOptions?.pickWorkShift && { pickWorkShift: serviceOptions.pickWorkShift as 1 | 2 }),
          ...(serviceOptions?.deliverWorkShift && { deliverWorkShift: serviceOptions.deliverWorkShift as 1 | 2 }),
        }

        toast.info('Đang tạo đơn trên GHTK...', { duration: 2000 })
        const ghtkService = new GHTKService(apiToken, partnerCode)
        const result = await ghtkService.createOrder(ghtkParams)

        if (result.success && result.order) {
          return { trackingCode: result.order.label, shippingFee: selectedService?.fee || 0 }
        }
        throw new Error(result.message || 'Không thể tạo đơn vận chuyển')
      } catch (error) {
        logError('[WarrantyShipping] Create GHTK shipment error', error)
        const msg = error instanceof Error ? error.message : 'Vui lòng thử lại'
        toast.error('Lỗi tạo đơn vận chuyển', { description: msg, duration: 5000 })
        return null
      }
    },
  }), [deliveryMethod, selectedService, customerAddress, pickupAddress, supplierName, warrantyId, packageInfo.insuranceValue, totalWeight, serviceOptions])

  return (
    <Card className={mobileBleedCardClass}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Truck className="h-4 w-4" />
          Giao hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Warning when address data is incomplete — only require province (2-level is valid) */}
        {deliveryMethod === 'shipping-partner' && customerAddress && !customerAddress.province && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p className="text-sm">
              Địa chỉ giao hàng thiếu thông tin tỉnh/thành phố. Nhấn <span className="font-medium">"Thay đổi"</span> để cập nhật.
            </p>
          </div>
        )}

        {/* Delivery method tabs — reuse from orders */}
        <DeliveryMethodCard
          selectedMethod={deliveryMethod}
          onMethodChange={onMethodChange}
          shippingRequest={shippingRequest}
          customerAddress={customerAddress}
          pickupAddress={pickupAddress}
          packageInfo={packageInfo}
          selectedService={selectedService}
          onServiceSelect={handleServiceSelect}
          onPackageInfoChange={handlePackageInfoChange}
          onServiceConfigChange={handleServiceConfigChange}
          onChangeDeliveryAddress={handleChangeAddress}
          disabled={disabled}
        />
      </CardContent>

      {/* Address editing dialog */}
      <AddressFormDialog
        isOpen={isAddressDialogOpen}
        onOpenChange={setIsAddressDialogOpen}
        onSave={handleSaveAddress}
        editingAddress={editingAddress}
        hideDefaultSwitches
        title="Sửa địa chỉ giao hàng"
        description="Cập nhật địa chỉ giao hàng cho phiếu bảo hành"
      />
    </Card>
  )
})

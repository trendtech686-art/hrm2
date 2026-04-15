'use client'

import * as React from 'react'
import { Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CurrencyInput } from '@/components/ui/currency-input'
import type { PricingPolicy, Tax } from '@/lib/types/prisma-extended'

interface PriceCalculatorDialogProps {
  costPrice: number
  salesPolicies: PricingPolicy[]
  taxes: Tax[]
  onApply: (prices: Record<string, number>) => void
}

/** Round up to nearest 1000 (like Excel ROUNDUP(value, -3)) */
function roundUpTo1000(value: number): number {
  return Math.ceil(value / 1000) * 1000
}

type PriceMapping = {
  label: string
  key: string
  value: number
  policyId: string
}

export function PriceCalculatorDialog({
  costPrice,
  salesPolicies,
  taxes,
  onApply,
}: PriceCalculatorDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [localCostPrice, setLocalCostPrice] = React.useState(costPrice)

  // Default: find default sale tax
  const defaultTax = React.useMemo(
    () => taxes.find((t) => t.isDefaultSale) ?? taxes[0],
    [taxes]
  )

  const [taxSystemId, setTaxSystemId] = React.useState<string>(defaultTax?.systemId ?? '')
  const [margin1, setMargin1] = React.useState(5)
  const [margin2, setMargin2] = React.useState(10)
  const [retailMarkup, setRetailMarkup] = React.useState(1.5)

  // Reset when dialog opens
  React.useEffect(() => {
    if (open) {
      setLocalCostPrice(costPrice)
      if (defaultTax) setTaxSystemId(defaultTax.systemId)
    }
  }, [open, costPrice, defaultTax])

  const selectedTax = React.useMemo(
    () => taxes.find((t) => t.systemId === taxSystemId),
    [taxes, taxSystemId]
  )

  const vatRate = selectedTax?.rate ?? 0
  const vatMultiplier = 1 + vatRate / 100

  // Raw (unrounded) intermediate prices — giữ nguyên để tính VAT chính xác như Excel
  const rawMargin1 = localCostPrice + localCostPrice * (margin1 / 100)
  const rawMargin2 = localCostPrice + localCostPrice * (margin2 / 100)

  // Giá chưa VAT: ROUNDUP(giá_vốn × (1 + %LN), 1000)
  const priceMargin1NoVat = roundUpTo1000(rawMargin1)
  const priceMargin2NoVat = roundUpTo1000(rawMargin2)
  // Giá có VAT: ROUNDUP(giá_vốn × (1 + %LN) × VAT, 1000) — tính từ giá GỐC, không phải giá đã tròn
  const priceMargin1WithVat = roundUpTo1000(rawMargin1 * vatMultiplier)
  const priceMargin2WithVat = roundUpTo1000(rawMargin2 * vatMultiplier)
  // Giá bán lẻ web: ROUNDUP(Giá_LN2_có_VAT × (1 + %markup), 1000) — theo Excel: =ROUNDUP(M+M*1.5%;-3)
  const retailPrice = roundUpTo1000(priceMargin2WithVat + priceMargin2WithVat * (retailMarkup / 100))

  // Mapping from calculated prices to pricing policies
  const [mappings, setMappings] = React.useState<PriceMapping[]>([])

  // Initialize mappings when policies change or dialog opens
  React.useEffect(() => {
    if (!open) return
    const calcPrices = [
      { label: `Giá ${margin1}% chưa VAT`, key: 'margin1_noVat', value: priceMargin1NoVat },
      { label: `Giá ${margin2}% chưa VAT`, key: 'margin2_noVat', value: priceMargin2NoVat },
      { label: `Giá ${margin1}% có VAT`, key: 'margin1_withVat', value: priceMargin1WithVat },
      { label: `Giá ${margin2}% có VAT`, key: 'margin2_withVat', value: priceMargin2WithVat },
      { label: 'Giá bán lẻ đăng web', key: 'retail', value: retailPrice },
    ]
    setMappings((prev) => {
      // Preserve existing policyId selections
      return calcPrices.map((cp) => {
        const existing = prev.find((p) => p.key === cp.key)
        return { ...cp, policyId: existing?.policyId ?? '' }
      })
    })
  }, [
    open,
    margin1,
    margin2,
    priceMargin1NoVat,
    priceMargin2NoVat,
    priceMargin1WithVat,
    priceMargin2WithVat,
    retailPrice,
  ])

  const handleApply = () => {
    const prices: Record<string, number> = {}
    for (const m of mappings) {
      if (m.policyId && m.policyId !== '__none__') {
        prices[m.policyId] = m.value
      }
    }
    if (Object.keys(prices).length === 0) return
    onApply(prices)
    setOpen(false)
  }

  const formatVND = (n: number) =>
    new Intl.NumberFormat('vi-VN').format(n)

  const hasMappedPrices = mappings.some((m) => m.policyId && m.policyId !== '__none__')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-1.5">
          <Calculator className="h-3.5 w-3.5" />
          Tính giá
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tính giá bán từ giá vốn</DialogTitle>
          <DialogDescription>
            Tính toán giá bán dựa trên giá vốn, % lợi nhuận và thuế VAT
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Giá vốn */}
          <div>
            <Label className="text-sm font-medium">Giá vốn</Label>
            <CurrencyInput
              className="mt-1 h-9"
              value={localCostPrice}
              onChange={(val) => setLocalCostPrice(val ?? 0)}
              placeholder="0"
            />
          </div>

          {/* Row: VAT + Retail markup */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium">Thuế VAT</Label>
              <Select value={taxSystemId} onValueChange={setTaxSystemId}>
                <SelectTrigger className="mt-1 h-9">
                  <SelectValue placeholder="Chọn VAT" />
                </SelectTrigger>
                <SelectContent>
                  {taxes.map((tax) => (
                    <SelectItem key={tax.systemId} value={tax.systemId}>
                      {tax.name} ({tax.rate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">% Markup bán lẻ web</Label>
              <div className="mt-1 flex items-center gap-1.5">
                <Input
                  type="number"
                  className="h-9"
                  value={retailMarkup}
                  onChange={(e) => setRetailMarkup(Number(e.target.value) || 0)}
                  step={0.1}
                  min={0}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          {/* Row: Margin 1 + Margin 2 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium">% Lợi nhuận 1</Label>
              <div className="mt-1 flex items-center gap-1.5">
                <Input
                  type="number"
                  className="h-9"
                  value={margin1}
                  onChange={(e) => setMargin1(Number(e.target.value) || 0)}
                  step={1}
                  min={0}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">% Lợi nhuận 2</Label>
              <div className="mt-1 flex items-center gap-1.5">
                <Input
                  type="number"
                  className="h-9"
                  value={margin2}
                  onChange={(e) => setMargin2(Number(e.target.value) || 0)}
                  step={1}
                  min={0}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          {/* Calculated Prices Table */}
          <div className="rounded-lg border">
            <div className="bg-muted/50 px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Bảng giá tính toán
            </div>
            <div className="divide-y">
              {mappings.map((m) => (
                <div
                  key={m.key}
                  className="flex items-center gap-3 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{m.label}</div>
                    <div className="text-base font-semibold text-primary">
                      {formatVND(m.value)} ₫
                    </div>
                  </div>
                  <div className="w-44 shrink-0">
                    <Select
                      value={m.policyId}
                      onValueChange={(val) => {
                        setMappings((prev) =>
                          prev.map((p) =>
                            p.key === m.key ? { ...p, policyId: val } : p
                          )
                        )
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="→ Áp dụng cho..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">
                          <span className="text-muted-foreground">Không áp dụng</span>
                        </SelectItem>
                        {salesPolicies.map((policy) => (
                          <SelectItem
                            key={policy.systemId}
                            value={policy.systemId}
                          >
                            {policy.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formula hint */}
          <div className="rounded-md bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            <strong>Công thức:</strong> Giá chưa VAT = ROUNDUP(Giá vốn × (1 + %LN), 1000) · 
            Giá có VAT = ROUNDUP(Giá vốn × (1 + %LN) × (1 + %VAT), 1000) · 
            Giá bán lẻ = ROUNDUP(Giá LN2 có VAT × (1 + {retailMarkup}%), 1000)
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button type="button" onClick={handleApply} disabled={!hasMappedPrices}>
            Áp dụng giá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import * as React from "react";
import { asBusinessId } from "@/lib/id-types";
import { useProductStore } from "../store.ts";
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Label } from "../../../components/ui/label.tsx";
import { CurrencyInput } from "../../../components/ui/currency-input.tsx";

interface QuickAddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (productId: string) => void;
}

export function QuickAddProductDialog({
  open,
  onOpenChange,
  onSuccess,
}: QuickAddProductDialogProps) {
  const { add } = useProductStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    name: "",
    sku: "",
    costPrice: "",
    basePrice: "",
    importQuantity: "",
    category: "",
    unit: "Cái",
    productType: "regular" as "regular" | "serial-imei",
  });

  // Validation errors
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Auto-focus first input when dialog opens
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (open) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [open]);

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        sku: "",
        costPrice: "",
        basePrice: "",
        importQuantity: "",
        category: "",
        unit: "Cái",
        productType: "regular",
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm là bắt buộc";
    }

    if (formData.costPrice && isNaN(Number(formData.costPrice))) {
      newErrors.costPrice = "Giá nhập phải là số";
    }

    if (formData.costPrice && Number(formData.costPrice) < 0) {
      newErrors.costPrice = "Giá nhập không thể âm";
    }

    if (formData.basePrice && isNaN(Number(formData.basePrice))) {
      newErrors.basePrice = "Giá bán lẻ phải là số";
    }

    if (formData.basePrice && Number(formData.basePrice) < 0) {
      newErrors.basePrice = "Giá bán lẻ không thể âm";
    }

    if (formData.importQuantity && isNaN(Number(formData.importQuantity))) {
      newErrors.importQuantity = "Số lượng nhập phải là số";
    }

    if (formData.importQuantity && Number(formData.importQuantity) < 0) {
      newErrors.importQuantity = "Số lượng nhập không thể âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const rawId = formData.sku.trim().toUpperCase();
      const newProduct = {
        id: asBusinessId(rawId),
        name: formData.name.trim(),
        unit: formData.unit,
        costPrice: formData.costPrice ? Number(formData.costPrice) : 0,
        prices: {}, // Will be populated with default pricing policy
        category: formData.category.trim() || undefined,
        type: "physical" as const,
        status: "active" as const,
        isStockTracked: formData.productType === "regular",
        inventoryByBranch: {},
        committedByBranch: {},
        inTransitByBranch: {},
      };

      const addedProduct = add(newProduct);

      toast.success(`Đã thêm sản phẩm "${newProduct.name}"`);

      onOpenChange(false);
      
      // Call success callback with new product systemId
      if (onSuccess && addedProduct) {
        onSuccess(addedProduct.systemId);
      }
    } catch (error) {
      toast.error('Không thể thêm sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm nhanh sản phẩm</DialogTitle>
          <DialogDescription>
            Nhập thông tin sản phẩm mới. Các trường có dấu * là bắt buộc.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên sản phẩm */}
          <div className="space-y-2">
            <Label htmlFor="product-name">
              Tên sản phẩm <span className="text-destructive">*</span>
            </Label>
            <Input
              id="product-name"
              ref={nameInputRef}
              placeholder="Nhập tên sản phẩm"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-body-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Mã sản phẩm/SKU */}
          <div className="space-y-2">
            <Label htmlFor="product-sku">Mã sản phẩm/SKU</Label>
            <Input
              id="product-sku"
              placeholder="Nhập tay hoặc để trống để tự động"
              value={formData.sku}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, sku: e.target.value }))
              }
            />
          </div>

          {/* Row 1: Giá nhập + Giá bán lẻ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-cost">Giá nhập</Label>
              <CurrencyInput
                id="product-cost"
                value={formData.costPrice ? Number(formData.costPrice) : 0}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, costPrice: value.toString() }))
                }
                placeholder="0"
                className={errors.costPrice ? "border-destructive" : ""}
              />
              {errors.costPrice && (
                <p className="text-body-sm text-destructive">{errors.costPrice}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-base-price">Giá bán lẻ</Label>
              <CurrencyInput
                id="product-base-price"
                value={formData.basePrice ? Number(formData.basePrice) : 0}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, basePrice: value.toString() }))
                }
                placeholder="0"
                className={errors.basePrice ? "border-destructive" : ""}
              />
              {errors.basePrice && (
                <p className="text-body-sm text-destructive">{errors.basePrice}</p>
              )}
            </div>
          </div>

          {/* Row 2: Số lượng nhập + Loại sản phẩm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-quantity">Số lượng nhập</Label>
              <Input
                id="product-quantity"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={formData.importQuantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    importQuantity: e.target.value,
                  }))
                }
                className={errors.importQuantity ? "border-destructive" : ""}
              />
              {errors.importQuantity && (
                <p className="text-body-sm text-destructive">{errors.importQuantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-category">Loại sản phẩm</Label>
              <Input
                id="product-category"
                placeholder="Nhập loại sản phẩm"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Đơn vị tính */}
          <div className="space-y-2">
            <Label htmlFor="product-unit">Đơn vị tính</Label>
            <Input
              id="product-unit"
              placeholder="Cái, Hộp, Thùng..."
              value={formData.unit}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, unit: e.target.value }))
              }
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Thoát
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang thêm..." : "Thêm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

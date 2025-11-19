import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { X, Upload, AlertCircle } from "lucide-react";
import { asSystemId, type SystemId } from "@/lib/id-types";

// Types & Store
import type { ComplaintType } from "../types.ts";
import { complaintTypeLabels } from "../types.ts";
import { useComplaintStore } from "../store.ts";
import { useOrderStore } from "../../orders/store.ts";
import { useCustomerStore } from "../../customers/store.ts";
import { useBranchStore } from "../../settings/branches/store.ts";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { Label } from "../../../components/ui/label.tsx";
import { Textarea } from "../../../components/ui/textarea.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { useAuth } from "../../../contexts/auth-context.tsx";

// =============================================
// FORM VALUES INTERFACE
// =============================================

interface CreateComplaintFormValues {
  orderSystemId: string; // ⭐ Dùng systemId
  type: ComplaintType;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  images: string[]; // Image URLs
}

// =============================================
// PROPS INTERFACE
// =============================================

interface CreateComplaintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefilledOrderSystemId?: string; // ⭐ Dùng systemId thay vì orderCode
  onSuccess?: (complaintId: SystemId) => void;
}

// =============================================
// MODAL COMPONENT
// =============================================

export function CreateComplaintModal({
  open,
  onOpenChange,
  prefilledOrderSystemId,
  onSuccess,
}: CreateComplaintModalProps) {
  const { addComplaint } = useComplaintStore();
  const { data: orders } = useOrderStore();
  const { data: customers } = useCustomerStore();
  const { data: branches } = useBranchStore();
  const { employee } = useAuth();

  // Current user
  const currentUser = employee 
    ? { systemId: employee.systemId, name: employee.fullName }
    : { systemId: asSystemId('SYSTEM'), name: 'Guest User' };

  // Form
  const form = useForm<CreateComplaintFormValues>({
    defaultValues: {
      orderSystemId: prefilledOrderSystemId || "",
      type: "wrong-product",
      description: "",
      priority: "medium",
      images: [],
    },
  });

  const { control, handleSubmit, watch, setValue, reset } = form;
  const selectedOrderSystemId = watch("orderSystemId");
  const selectedType = watch("type");
  const images = watch("images");

  // Find selected order & customer
  const selectedOrder = React.useMemo(() => {
    return orders.find((o) => o.systemId === selectedOrderSystemId); // ⭐ Dùng systemId
  }, [orders, selectedOrderSystemId]);

  const selectedCustomer = React.useMemo(() => {
    if (!selectedOrder) return null;
    return customers.find((c) => c.systemId === selectedOrder.customerSystemId); // ⭐ Dùng customerSystemId
  }, [customers, selectedOrder]);

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      reset({
        orderSystemId: prefilledOrderSystemId || "",
        type: "wrong-product",
        description: "",
        priority: "medium",
        images: [],
      });
    }
  }, [open, prefilledOrderSystemId, reset]);

  // =============================================
  // HANDLERS
  // =============================================

  const handleAddImage = () => {
    // TODO: Implement file upload
    const fakeUrl = `https://via.placeholder.com/300?text=Image${images.length + 1}`;
    setValue("images", [...images, fakeUrl]);
  };

  const handleRemoveImage = (index: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index)
    );
  };

  const onSubmit = (data: CreateComplaintFormValues) => {
    if (!selectedOrder || !selectedCustomer) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    if (!data.orderSystemId) {
      toast.error("Vui lòng chọn đơn hàng cần xử lý");
      return;
    }

    // Convert images to ComplaintImage format
    const complaintImages = data.images.map((url, index) => ({
      id: asSystemId(`customer-image-${Date.now()}-${index}`),
      url,
      uploadedBy: currentUser.systemId,
      uploadedAt: new Date(),
      description: "Hình ảnh từ khách hàng",
      type: "initial" as const,
    }));

    const branchSystemId = selectedOrder?.branchSystemId ?? branches[0]?.systemId;
    if (!branchSystemId) {
      toast.error("Không xác định được chi nhánh xử lý");
      return;
    }

    // Create complaint
    const complaintId = addComplaint({
      orderSystemId: asSystemId(data.orderSystemId), // ⭐ Lưu systemId
      orderCode: selectedOrder.id, // ⭐ Optional display code
      orderValue: selectedOrder.total,
      customerSystemId: selectedCustomer.systemId, // ⭐ Lưu systemId
      customerId: selectedCustomer.id, // ⭐ Optional display code
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      type: data.type,
      description: data.description,
      images: complaintImages,
      status: "pending",
      verification: "pending-verification",
      createdBy: currentUser.systemId,
      priority: data.priority,
      branchSystemId,
      tags: [],
    } as any);

    toast.success("Đã tạo khiếu nại thành công");
    onOpenChange(false);
    onSuccess?.(complaintId);
  };

  // =============================================
  // RENDER
  // =============================================

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo khiếu nại mới</DialogTitle>
          <DialogDescription>
            Tạo phiếu khiếu nại cho đơn hàng có vấn đề từ khách hàng
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Order Selection */}
          <div className="space-y-2">
            <Label htmlFor="orderSystemId">
              Đơn hàng <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="orderSystemId"
              control={control}
              rules={{ required: "Vui lòng chọn đơn hàng" }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!!prefilledOrderSystemId}
                >
                  <SelectTrigger id="orderSystemId">
                    <SelectValue placeholder="Chọn đơn hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order) => (
                      <SelectItem key={order.systemId} value={order.systemId}>
                        #{order.id} -{" "}
                        {customers.find((c) => c.systemId === order.customerSystemId)?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {selectedCustomer && (
              <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                📞 {selectedCustomer.phone}
              </div>
            )}
          </div>

          {/* Complaint Type */}
          <div className="space-y-2">
            <Label htmlFor="type">
              Loại khiếu nại <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="type"
              control={control}
              rules={{ required: "Vui lòng chọn loại khiếu nại" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wrong-product">
                      {complaintTypeLabels["wrong-product"]}
                    </SelectItem>
                    <SelectItem value="missing-items">
                      {complaintTypeLabels["missing-items"]}
                    </SelectItem>
                    <SelectItem value="wrong-packaging">
                      {complaintTypeLabels["wrong-packaging"]}
                    </SelectItem>
                    <SelectItem value="warehouse-defect">
                      {complaintTypeLabels["warehouse-defect"]}
                    </SelectItem>
                    <SelectItem value="product-condition">
                      {complaintTypeLabels["product-condition"]}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Mức độ ưu tiên</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="urgent">⚡ Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Mô tả chi tiết <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Vui lòng nhập mô tả" }}
              render={({ field }) => (
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết vấn đề: thiếu bao nhiêu sản phẩm, sản phẩm nào bị sai, tình trạng hàng như thế nào..."
                  rows={4}
                  {...field}
                />
              )}
            />
          </div>

          {/* Images Upload */}
          <div className="space-y-2">
            <Label>Hình ảnh từ khách hàng</Label>
            <div className="flex gap-2 flex-wrap">
              {images.map((url, index) => (
                <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-24 h-24"
                onClick={handleAddImage}
              >
                <Upload className="h-6 w-6" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Upload hình ảnh khách hàng cung cấp qua Zalo, tin nhắn...
            </p>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded flex gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              Sau khi tạo, bạn có thể giao việc cho nhân viên kho để kiểm tra và xử lý khiếu nại.
            </div>
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button type="button" variant="outline" className="h-9" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" className="h-9">Tạo khiếu nại</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

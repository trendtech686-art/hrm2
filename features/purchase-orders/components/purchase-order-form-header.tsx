import * as React from "react";
import { Button } from "../../../components/ui/button.tsx";

interface PurchaseOrderFormHeaderProps {
  title?: string;
  onSave?: () => void;
  onSaveAndReceive?: () => void;
  onExit?: () => void;
  isSaving?: boolean;
}

export function PurchaseOrderFormHeader({
  title = "Tạo đơn mua hàng mới",
  onSave,
  onSaveAndReceive,
  onExit,
  isSaving = false,
}: PurchaseOrderFormHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4 border-b">
      {/* Title */}
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onExit}
          disabled={isSaving}
          size="sm"
          className="h-9"
        >
          Thoát
        </Button>
        <Button
          variant="outline"
          onClick={onSave}
          disabled={isSaving}
          size="sm"
          className="h-9"
        >
          {isSaving ? "Đang lưu..." : "Tạo & chưa nhập"}
        </Button>
        <Button
          onClick={onSaveAndReceive}
          disabled={isSaving}
          size="sm"
          className="h-9"
        >
          {isSaving ? "Đang lưu..." : "Tạo & nhập hàng"}
        </Button>
      </div>
    </div>
  );
}

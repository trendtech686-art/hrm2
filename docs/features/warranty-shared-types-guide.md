# Warranty Shared Types Guide

## Mục tiêu
Chuẩn hóa các props dùng chung cho dialog/card bảo hành để tránh khai báo trùng lặp và giúp IDE hint tốt hơn. File trung tâm: `features/warranty/types.ts` (barrel) với hai nhánh con:

- `features/warranty/types/ui.ts`: UI-facing types (`WarrantyCustomerInfo`, `WarrantyBranchContext`, `WarrantyVoucherDialogBaseProps`).
- `features/warranty/types/store.ts`: Interface `WarrantyStore` cho toàn bộ Zustand store.

## Các type chính
| Type | Nguồn | Dùng cho | Ghi chú |
| --- | --- | --- | --- |
| `WarrantyCustomerInfo` | `types.ts` (re-export) | Card/dialog nhận thông tin KH | Cho phép truyền full `Customer` hoặc snapshot để form update vẫn hợp lệ. |
| `WarrantyBranchContext` | `types.ts` | Dialog cần branch info | Giữ `branchSystemId`/`branchName` đồng nhất. |
| `WarrantyVoucherDialogBaseProps` | `types.ts` | Payment/receipt dialog | Bao gồm `warrantyId`, `warrantySystemId`, `customer`, `linkedOrderId`, `defaultAmount`, branch context. |
| `WarrantyStore` | `types.ts` | Store consumer | Thay vì import sâu `types/store.ts`, chỉ cần từ barrel.

## Cách dùng
```ts
import type { WarrantyVoucherDialogBaseProps } from '@/features/warranty/types';

interface WarrantyReturnDialogProps extends WarrantyVoucherDialogBaseProps {
  reasonOptions: string[];
}
```

## Checklist adopt
1. ✅ `WarrantyPaymentVoucherDialog`, `WarrantyReceiptVoucherDialog`, `WarrantyProcessingCard`, `store/index` đã dùng barrel.
2. ⏱️ Kiểm tra các dialog/card còn lại trong `features/warranty/components/dialogs/` để tận dụng `WarrantyBranchContext` nếu đang truyền tay.
3. ⏱️ Update docs/README (todo #2) để nhắc dev mới import type từ `features/warranty/types` thay vì đường dẫn sâu.

## Best practices
- Khi thêm type mới, khai báo ở `types/ui.ts` hoặc `types/store.ts`, sau đó re-export từ `types.ts`.
- Ưu tiên `export type { Foo }` để không kéo runtime code.
- Với form values: dùng union `(Customer | WarrantyCustomerInfo) | null` để giữ compatibility với `CustomerSelector` lẫn snapshot edit mode.

## Liên quan
- `docs/archive/WARRANTY-SETTLEMENT-SUMMARY.md`: mô tả flow tạo phiếu chi/thu (type mới phục vụ dialog trong flow này).
- `features/warranty/components/dialogs/*`: điểm tiêu thụ chính.

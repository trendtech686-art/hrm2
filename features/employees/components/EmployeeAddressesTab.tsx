import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import type { EmployeeFormValues } from "../employee-form";
import type { EmployeeAddress } from "../types";
import type { CustomerAddress } from "../../customers/types";

// Helper type for local form state for addresses
export type AddressParts = {
  label: string;
  street: string;
  province: string;
  provinceId: string;
  district: string;
  districtId: number;
  ward: string;
  wardId: string;
  contactName: string;
  contactPhone: string;
  notes: string;
  inputLevel: '2-level' | '3-level';
};

/**
 * Parse EmployeeAddress thành AddressParts cho form
 */
export const parseAddress = (addr: EmployeeAddress | null | undefined): AddressParts => {
  if (!addr) {
    return {
      label: '',
      street: '',
      province: '',
      provinceId: '',
      district: '',
      districtId: 0,
      ward: '',
      wardId: '',
      contactName: '',
      contactPhone: '',
      notes: '',
      inputLevel: '2-level',
    };
  }

  return {
    label: '',
    street: addr.street,
    province: addr.province,
    provinceId: addr.provinceId,
    district: addr.district,
    districtId: addr.districtId,
    ward: addr.ward,
    wardId: addr.wardId,
    contactName: '',
    contactPhone: '',
    notes: '',
    inputLevel: addr.inputLevel,
  };
};

export const toEmployeeAddress = (parts: AddressParts): EmployeeAddress => ({
  street: parts.street,
  province: parts.province,
  provinceId: parts.provinceId,
  district: parts.district,
  districtId: parts.districtId,
  ward: parts.ward,
  wardId: parts.wardId,
  inputLevel: parts.inputLevel,
});

interface AddressDisplayProps {
  address: AddressParts;
  title: string;
  description: string;
  onEdit: () => void;
}

function AddressDisplay({ address, title, description, onEdit }: AddressDisplayProps) {
  const hasAddress = address.street || address.ward || address.province;

  return (
    <section className="border rounded-lg p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-base font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onEdit}>
          Chỉnh sửa địa chỉ
        </Button>
      </div>
      {hasAddress ? (
        <dl className="grid gap-2 text-sm">
          {address.province && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">Tỉnh/Thành phố</span>
              <span className="font-medium">{address.province}</span>
            </div>
          )}
          {address.inputLevel === '3-level' ? (
            <>
              {address.district && (
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Quận/Huyện</span>
                  <span className="font-medium">{address.district}</span>
                </div>
              )}
              {address.ward && (
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Phường/Xã</span>
                  <span className="font-medium">{address.ward}</span>
                </div>
              )}
            </>
          ) : (
            address.ward && (
              <div className="flex flex-col">
                <span className="text-muted-foreground">Phường/Xã</span>
                <span className="font-medium">{address.ward}</span>
              </div>
            )
          )}
          {address.street && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">Số nhà, đường</span>
              <span className="font-medium">{address.street}</span>
            </div>
          )}
        </dl>
      ) : (
        <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          Chưa có địa chỉ. Nhấn "Chỉnh sửa địa chỉ" để nhập nhanh bằng form chuẩn 2 cấp / 3 cấp.
        </div>
      )}
    </section>
  );
}

interface EmployeeAddressesTabProps {
  permanentAddress: AddressParts;
  temporaryAddress: AddressParts;
  onEditPermanent: () => void;
  onEditTemporary: () => void;
}

export function EmployeeAddressesTab({ 
  permanentAddress, 
  temporaryAddress, 
  onEditPermanent, 
  onEditTemporary 
}: EmployeeAddressesTabProps) {
  return (
    <div className="mt-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Địa chỉ nhân viên</h3>
        <p className="text-sm text-muted-foreground">
          Tách riêng phần địa chỉ để dễ so sánh giữa nơi thường trú và tạm trú, tương tự trải nghiệm quản lý khách hàng.
        </p>
      </div>
      <div className="space-y-6">
        <AddressDisplay
          address={permanentAddress}
          title="Địa chỉ thường trú"
          description="Thông tin trên sổ hộ khẩu hoặc cư trú lâu dài."
          onEdit={onEditPermanent}
        />
        <AddressDisplay
          address={temporaryAddress}
          title="Địa chỉ tạm trú"
          description="Nơi nhân viên đang sinh sống hiện tại (có thể khác thường trú)."
          onEdit={onEditTemporary}
        />
      </div>
    </div>
  );
}

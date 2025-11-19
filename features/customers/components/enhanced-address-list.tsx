/**
 * Enhanced Address List Component
 * 
 * Hiển thị danh sách địa chỉ của khách hàng
 * Có nút chuyển đổi địa chỉ 2 cấp → 3 cấp (nếu cần)
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddressConversionDialog } from './address-conversion-dialog';
import type { EnhancedCustomerAddress } from '../types/enhanced-address';
import {
  formatAddress2Level,
  formatAddress3Level,
  toShippingApiFormat,
  validateShippingAddress,
} from '../utils/enhanced-address-helper';
import {
  MapPin,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Truck,
  FileText,
  Home,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type EnhancedAddressListProps = {
  addresses: EnhancedCustomerAddress[];
  onEdit?: (address: EnhancedCustomerAddress) => void;
  onDelete?: (addressId: string) => void;
  onSetDefault?: (addressId: string) => void;
  onConvert?: (updatedAddress: EnhancedCustomerAddress) => void; // ← NEW: Convert 2→3
  showShippingInfo?: boolean;
};

export function EnhancedAddressList({
  addresses,
  onEdit,
  onDelete,
  onSetDefault,
  onConvert,
  showShippingInfo = false,
}: EnhancedAddressListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [conversionDialogOpen, setConversionDialogOpen] = useState<string | null>(null); // addressId đang convert

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (addresses.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Chưa có địa chỉ nào</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => {
        const validation = validateShippingAddress(address);
        const isExpanded = expandedId === address.id;

        return (
          <Card key={address.id} className={address.isDefault ? 'border-primary' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{address.label}</CardTitle>
                    {address.isDefault && (
                      <Badge variant="default">Mặc định</Badge>
                    )}
                    {address.isShipping && (
                      <Badge variant="outline" className="gap-1">
                        <Truck className="h-3 w-3" />
                        Giao hàng
                      </Badge>
                    )}
                    {address.isBilling && (
                      <Badge variant="outline" className="gap-1">
                        <FileText className="h-3 w-3" />
                        Xuất HĐ
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    <Badge variant="secondary" className="text-xs">
                      {address.inputLevel === '2-level' ? '2 cấp' : '3 cấp'}
                    </Badge>
                    {address.autoFilled && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Tự động điền District
                      </Badge>
                    )}
                    {address.convertedAt && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Đã chuyển đổi
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Address Display */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <Home className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">{address.street}</div>
                    <div className="text-muted-foreground">
                      {address.inputLevel === '2-level'
                        ? formatAddress2Level(address)
                        : formatAddress3Level(address)}
                    </div>
                  </div>
                </div>

                {address.contactName && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{address.contactName}</span>
                  </div>
                )}

                {address.contactPhone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{address.contactPhone}</span>
                  </div>
                )}
              </div>

              {/* Validation Status */}
              {!validation.valid && (
                <Alert variant="destructive" className="text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-1">Địa chỉ chưa đầy đủ cho vận chuyển:</div>
                    <ul className="list-disc list-inside">
                      {validation.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Show Shipping Info */}
              {showShippingInfo && validation.valid && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <Truck className="h-4 w-4 mr-2" />
                      Xem thông tin vận chuyển
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Thông tin cho API vận chuyển</DialogTitle>
                      <DialogDescription>
                        Dữ liệu sẽ được gửi đến các đối tác vận chuyển (GHN, GHTK, VTP, J&T)
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-muted-foreground">Tỉnh/TP</div>
                          <div>{address.province}</div>
                          <div className="text-xs text-muted-foreground">ID: {address.provinceId}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Quận/Huyện</div>
                          <div>{address.district}</div>
                          <div className="text-xs text-muted-foreground">ID: {address.districtId}</div>
                        </div>
                        <div>
                          <div className="font-medium text-muted-foreground">Phường/Xã</div>
                          <div>{address.ward}</div>
                          <div className="text-xs text-muted-foreground">Code: {address.wardId}</div>
                        </div>
                      </div>
                      <div className="border-t pt-3">
                        <div className="font-medium text-sm mb-2">API Format (JSON):</div>
                        <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                          {JSON.stringify(toShippingApiFormat(address), null, 2)}
                        </pre>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 flex-wrap">
                {/* Nút chuyển đổi cho địa chỉ 2 cấp */}
                {address.inputLevel === '2-level' && !address.districtId && onConvert && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => setConversionDialogOpen(address.id)}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Chuyển đổi sang 3 cấp
                    </Button>
                    <AddressConversionDialog
                      address={address}
                      onSuccess={(updatedAddress) => {
                        onConvert(updatedAddress);
                        setConversionDialogOpen(null);
                      }}
                      open={conversionDialogOpen === address.id}
                      onOpenChange={(open) => setConversionDialogOpen(open ? address.id : null)}
                    />
                  </>
                )}
                
                {!address.isDefault && onSetDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSetDefault(address.id)}
                  >
                    Đặt làm mặc định
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(address)}
                  >
                    Sửa
                  </Button>
                )}
                {onDelete && !address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(address.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Xóa
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

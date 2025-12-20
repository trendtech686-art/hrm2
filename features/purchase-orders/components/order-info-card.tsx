import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Calendar } from "../../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Button } from "../../../components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "../../../lib/utils";
import { useBranchStore } from "../../settings/branches/store";
import { EmployeeCombobox } from "./employee-combobox";

interface OrderInfoCardProps {
  branchSystemId: string;
  employeeSystemId: string;
  reference?: string | undefined;
  orderId?: string | undefined;
  deliveryDate?: Date | undefined;
  onBranchChange: (branchSystemId: string) => void;
  onEmployeeChange: (employeeSystemId: string) => void;
  onReferenceChange: (reference: string) => void;
  onOrderIdChange: (orderId: string) => void;
  onDeliveryDateChange: (date?: Date) => void;
}

export function OrderInfoCard({
  branchSystemId,
  employeeSystemId,
  reference,
  orderId,
  deliveryDate,
  onBranchChange,
  onEmployeeChange,
  onReferenceChange,
  onOrderIdChange,
  onDeliveryDateChange,
}: OrderInfoCardProps) {
  const { data: branches } = useBranchStore();
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    onDeliveryDateChange(date);
    setIsCalendarOpen(false); // Close popover after selection
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-base">Thông tin đơn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 overflow-y-auto">
        {/* Mã đơn */}
        <div className="space-y-2">
          <Label htmlFor="order-id" className="text-body-xs">Mã đơn</Label>
          <Input
            id="order-id"
            placeholder="Tự động tạo nếu bỏ trống"
            value={orderId || ""}
            onChange={(e) => onOrderIdChange(e.target.value)}
            className="text-body-sm"
          />
        </div>

        {/* Chi nhánh */}
        <div className="space-y-2">
          <Label htmlFor="branch" className="text-body-xs">Chi nhánh</Label>
          <Select value={branchSystemId} onValueChange={onBranchChange}>
            <SelectTrigger id="branch" className="text-body-sm">
              <SelectValue placeholder="Chọn chi nhánh" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.systemId} value={branch.systemId}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nhân viên */}
        <div className="space-y-2">
          <Label htmlFor="employee" className="text-body-xs">Nhân viên</Label>
          <EmployeeCombobox
            value={employeeSystemId}
            onValueChange={onEmployeeChange}
            placeholder="Chọn nhân viên"
          />
        </div>

        {/* Ngày hẹn giao */}
        <div className="space-y-2">
          <Label className="text-body-xs">Ngày hẹn giao</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal text-body-sm",
                  !deliveryDate && "text-muted-foreground"
                )}
                size="sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deliveryDate ? (
                  format(deliveryDate, "dd/MM/yyyy", { locale: vi })
                ) : (
                  <span>Chọn ngày</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deliveryDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}

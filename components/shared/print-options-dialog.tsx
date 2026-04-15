import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Checkbox } from "../ui/checkbox"
import { useAllBranches } from "../../features/settings/branches/hooks/use-all-branches"
import type { PaperSize, PrintOrientation } from "../../features/settings/printer/types"
import { LABEL_SIZES, isLabelSize } from "../../features/settings/printer/types"
import type { SystemId } from "../../lib/id-types"
import { cn } from "../../lib/utils"
import { CircleHelp } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { usePrintOptions, type PrintOptionsDefaults as _PrintOptionsDefaults } from "../../hooks/use-print-options"

// Loại mẫu in cho đơn hàng - dùng checkbox để chọn nhiều
export type OrderPrintTemplateType = 'order' | 'delivery' | 'both';

export interface PrintOptionsResult {
  branchSystemId: SystemId | null;
  templateType: OrderPrintTemplateType;
  paperSize: PaperSize;
  orientation?: PrintOrientation;
  saveAsDefault?: boolean;
  // Thêm các loại in riêng lẻ
  printOrder?: boolean;
  printDelivery?: boolean;
  printPacking?: boolean;
  printShippingLabel?: boolean;
  printProductLabel?: boolean;
}

interface PrintOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (options: PrintOptionsResult) => void;
  selectedCount: number;
  title?: string;
  initialTemplateType?: OrderPrintTemplateType;
}

const _PRINT_TYPE_OPTIONS: { id: string; label: string; tooltip?: string }[] = [
  { id: 'order', label: 'Đơn hàng' },
  { id: 'delivery', label: 'Phiếu giao hàng', tooltip: 'Yêu cầu đơn hàng đã có đóng gói' },
  { id: 'packing', label: 'Phiếu đóng gói', tooltip: 'Yêu cầu đơn hàng đã có đóng gói' },
  { id: 'shippingLabel', label: 'Nhãn giao hàng', tooltip: 'Yêu cầu đơn hàng đã xác nhận đóng gói' },
];

const PAPER_SIZE_OPTIONS: { value: PaperSize; label: string }[] = [
  { value: 'A4', label: 'A4' },
  { value: 'A5', label: 'A5' },
  { value: 'A6', label: 'A6' },
  { value: 'K80', label: 'K80' },
  { value: 'K57', label: 'K57' },
];

export function PrintOptionsDialog({
  open,
  onOpenChange,
  onConfirm,
  selectedCount: _selectedCount,
  title = "Chọn thông tin bạn muốn in",
  initialTemplateType,
}: PrintOptionsDialogProps) {
  const { data: branches } = useAllBranches();
  const [savedOptions, setSavedOptions] = usePrintOptions();
  const activeBranches = React.useMemo(
    () => branches.filter(b => b.name),
    [branches]
  );

  // Find default branch
  const defaultBranch = React.useMemo(
    () => activeBranches.find(b => b.isDefault),
    [activeBranches]
  );

  // State for form
  const [branchSystemId, setBranchSystemId] = React.useState<string>('');
  const [paperSize, setPaperSize] = React.useState<PaperSize>('A4');
  const [orientation, setOrientation] = React.useState<PrintOrientation>('portrait');
  const [customWidth, setCustomWidth] = React.useState('');
  const [customHeight, setCustomHeight] = React.useState('');
  const [isCustom, setIsCustom] = React.useState(false);
  const [saveAsDefault, setSaveAsDefault] = React.useState(false);

  const isStandardSize = !isLabelSize(paperSize) && !isCustom;
  const supportsOrientation = ['A4', 'A5', 'A6'].includes(paperSize);
  
  // Checkbox states for print types
  const [printOrder, setPrintOrder] = React.useState(true);
  const [printDelivery, setPrintDelivery] = React.useState(false);
  const [printPacking, setPrintPacking] = React.useState(false);
  const [printShippingLabel, setPrintShippingLabel] = React.useState(false);
  const [printProductLabel, setPrintProductLabel] = React.useState(false);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      if (savedOptions.branchSystemId) {
        setBranchSystemId(savedOptions.branchSystemId);
        setPaperSize(savedOptions.paperSize);
        setPrintOrder(savedOptions.printOrder);
        setPrintDelivery(savedOptions.printDelivery);
        setPrintPacking(savedOptions.printPacking);
        setPrintShippingLabel(savedOptions.printShippingLabel);
        setPrintProductLabel(savedOptions.printProductLabel ?? false);
      } else {
        setBranchSystemId(defaultBranch?.systemId ?? activeBranches[0]?.systemId ?? '');
        setPaperSize('A4');
        // Set initial based on initialTemplateType
        if (initialTemplateType === 'delivery') {
          setPrintOrder(false);
          setPrintDelivery(true);
        } else if (initialTemplateType === 'both') {
          setPrintOrder(true);
          setPrintDelivery(true);
        } else {
          setPrintOrder(true);
          setPrintDelivery(false);
        }
        setPrintPacking(false);
        setPrintShippingLabel(false);
        setPrintProductLabel(false);
      }
      setSaveAsDefault(false);
      setOrientation('portrait');
      setIsCustom(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultBranch, activeBranches, initialTemplateType]);

  const handleConfirm = () => {
    // Validate at least one type selected
    if (!printOrder && !printDelivery && !printPacking && !printShippingLabel && !printProductLabel) {
      return;
    }

    let finalSize = paperSize;
    if (isCustom && customWidth && customHeight) {
      const w = parseInt(customWidth);
      const h = parseInt(customHeight);
      if (w > 0 && h > 0) {
        finalSize = `${w}x${h}`;
      }
    }

    // Save as default if checked
    if (saveAsDefault) {
      setSavedOptions({
        branchSystemId,
        paperSize: finalSize,
        printOrder,
        printDelivery,
        printPacking,
        printShippingLabel,
        printProductLabel,
      });
    }

    // Determine templateType for backward compatibility
    let templateType: OrderPrintTemplateType = 'order';
    if (printOrder && printDelivery) {
      templateType = 'both';
    } else if (printDelivery) {
      templateType = 'delivery';
    }

    onConfirm({
      branchSystemId: (branchSystemId || null) as SystemId | null,
      templateType,
      paperSize: finalSize,
      orientation: supportsOrientation ? orientation : undefined,
      saveAsDefault,
      printOrder,
      printDelivery,
      printPacking,
      printShippingLabel,
      printProductLabel,
    });
    onOpenChange(false);
  };

  // Get branch display name
  const selectedBranchName = React.useMemo(() => {
    if (!branchSystemId) return 'Chi nhánh mặc định';
    const branch = activeBranches.find(b => b.systemId === branchSystemId);
    return branch?.name ?? 'Chi nhánh mặc định';
  }, [branchSystemId, activeBranches]);

  // Check if any print type is selected
  const hasSelection = printOrder || printDelivery || printPacking || printShippingLabel || printProductLabel;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Chi nhánh */}
          <div className="flex items-center gap-4">
            <Label className="min-w-40 text-right text-muted-foreground">
              Chọn mẫu in tại chi nhánh
            </Label>
            <Select value={branchSystemId} onValueChange={setBranchSystemId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Chi nhánh mặc định">
                  {selectedBranchName}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {activeBranches.map(branch => (
                  <SelectItem key={branch.systemId} value={branch.systemId}>
                    {branch.name} {branch.isDefault ? '(mặc định)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loại phiếu in - Checkboxes */}
          <div className="space-y-3">
            <Label className="text-muted-foreground">Chọn loại phiếu in</Label>
            <div className="grid grid-cols-2 gap-3">
              {/* Đơn hàng */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="print-order"
                  checked={printOrder}
                  onCheckedChange={(checked) => setPrintOrder(checked === true)}
                />
                <Label htmlFor="print-order" className="cursor-pointer">
                  Đơn hàng
                </Label>
              </div>

              {/* Phiếu giao hàng */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="print-delivery"
                  checked={printDelivery}
                  onCheckedChange={(checked) => setPrintDelivery(checked === true)}
                />
                <Label htmlFor="print-delivery" className="cursor-pointer flex items-center gap-1">
                  Phiếu giao hàng
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CircleHelp className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Yêu cầu đơn hàng đã có đóng gói</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
              </div>

              {/* Phiếu đóng gói */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="print-packing"
                  checked={printPacking}
                  onCheckedChange={(checked) => setPrintPacking(checked === true)}
                />
                <Label htmlFor="print-packing" className="cursor-pointer flex items-center gap-1">
                  Phiếu đóng gói
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CircleHelp className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Yêu cầu đơn hàng đã có đóng gói</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
              </div>

              {/* Nhãn giao hàng */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="print-shipping-label"
                  checked={printShippingLabel}
                  onCheckedChange={(checked) => setPrintShippingLabel(checked === true)}
                />
                <Label htmlFor="print-shipping-label" className="cursor-pointer flex items-center gap-1">
                  Nhãn giao hàng
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CircleHelp className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Yêu cầu đơn hàng đã xác nhận đóng gói</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
              </div>

              {/* Tem phụ sản phẩm */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="print-product-label"
                  checked={printProductLabel}
                  onCheckedChange={(checked) => setPrintProductLabel(checked === true)}
                />
                <Label htmlFor="print-product-label" className="cursor-pointer flex items-center gap-1">
                  Tem phụ
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CircleHelp className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>In tem phụ cho tất cả sản phẩm trong đơn hàng</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
              </div>
            </div>
          </div>

          {/* Khổ giấy - Standard sizes */}
          <div className="space-y-3">
            <Label className="text-muted-foreground">Khổ giấy</Label>
            <div className="flex flex-wrap gap-2">
              {PAPER_SIZE_OPTIONS.map(option => (
                <Button
                  key={option.value}
                  type="button"
                  variant={paperSize === option.value && !isCustom ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "min-w-17.5",
                    paperSize === option.value && !isCustom && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => { setPaperSize(option.value); setIsCustom(false); }}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Hướng in - chỉ hiện cho A4/A5/A6 */}
          {supportsOrientation && isStandardSize && (
            <div className="space-y-3">
              <Label className="text-muted-foreground">Hướng in</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={orientation === 'portrait' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOrientation('portrait')}
                >
                  Dọc
                </Button>
                <Button
                  type="button"
                  variant={orientation === 'landscape' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setOrientation('landscape')}
                >
                  Ngang
                </Button>
              </div>
            </div>
          )}

          {/* Khổ tem nhãn - chỉ hiện khi có chọn in tem phụ */}
          {printProductLabel && (
            <div className="space-y-3">
              <Label className="text-muted-foreground">Khổ tem nhãn</Label>
              <div className="flex items-center gap-2">
                <Select
                  value={isLabelSize(paperSize) && !isCustom ? paperSize : ''}
                  onValueChange={(v) => { setPaperSize(v); setIsCustom(false); }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Chọn khổ tem nhãn" />
                  </SelectTrigger>
                  <SelectContent>
                    {LABEL_SIZES.map(group => (
                      <SelectGroup key={group.label}>
                        <SelectLabel>{group.label}</SelectLabel>
                        {group.sizes.map(s => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}mm
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant={isCustom ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsCustom(true)}
                >
                  Tùy chỉnh
                </Button>
              </div>
              {/* Custom size inputs */}
              {isCustom && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={10}
                    max={300}
                    placeholder="Rộng"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                    className="w-24"
                  />
                  <span className="text-muted-foreground">×</span>
                  <Input
                    type="number"
                    min={10}
                    max={300}
                    placeholder="Cao"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">mm</span>
                </div>
              )}
            </div>
          )}

          {/* Save as default checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="save-default"
              checked={saveAsDefault}
              onCheckedChange={(checked) => setSaveAsDefault(checked === true)}
            />
            <Label 
              htmlFor="save-default" 
              className="text-sm cursor-pointer text-muted-foreground"
            >
              Đặt làm mặc định cho chức năng in tùy chọn
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Thoát
          </Button>
          <Button onClick={handleConfirm} disabled={!hasSelection}>
            In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

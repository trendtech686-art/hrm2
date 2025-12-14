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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Checkbox } from "../ui/checkbox"
import { useBranchStore } from "../../features/settings/branches/store"
import type { PaperSize } from "../../features/settings/printer/types"
import type { SystemId } from "../../lib/id-types"
import { cn } from "../../lib/utils"
import { CircleHelp } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

// Loại mẫu in cho đơn hàng - dùng checkbox để chọn nhiều
export type OrderPrintTemplateType = 'order' | 'delivery' | 'both';

export interface PrintOptionsResult {
  branchSystemId: SystemId | null;
  templateType: OrderPrintTemplateType;
  paperSize: PaperSize;
  saveAsDefault?: boolean;
  // Thêm các loại in riêng lẻ
  printOrder?: boolean;
  printDelivery?: boolean;
  printPacking?: boolean;
  printShippingLabel?: boolean;
}

interface PrintOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (options: PrintOptionsResult) => void;
  selectedCount: number;
  title?: string;
  initialTemplateType?: OrderPrintTemplateType;
}

const PRINT_TYPE_OPTIONS: { id: string; label: string; tooltip?: string }[] = [
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

// Local storage key for default settings
const PRINT_OPTIONS_STORAGE_KEY = 'print-options-default';

interface SavedPrintOptions {
  branchSystemId: string;
  paperSize: PaperSize;
  printOrder: boolean;
  printDelivery: boolean;
  printPacking: boolean;
  printShippingLabel: boolean;
}

function loadDefaultOptions(): SavedPrintOptions | null {
  try {
    const saved = localStorage.getItem(PRINT_OPTIONS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function saveDefaultOptions(options: SavedPrintOptions) {
  try {
    localStorage.setItem(PRINT_OPTIONS_STORAGE_KEY, JSON.stringify(options));
  } catch (e) {
    // ignore
  }
}

export function PrintOptionsDialog({
  open,
  onOpenChange,
  onConfirm,
  selectedCount,
  title = "Chọn thông tin bạn muốn in",
  initialTemplateType,
}: PrintOptionsDialogProps) {
  const { data: branches } = useBranchStore();
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
  const [saveAsDefault, setSaveAsDefault] = React.useState(false);
  
  // Checkbox states for print types
  const [printOrder, setPrintOrder] = React.useState(true);
  const [printDelivery, setPrintDelivery] = React.useState(false);
  const [printPacking, setPrintPacking] = React.useState(false);
  const [printShippingLabel, setPrintShippingLabel] = React.useState(false);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      const savedOptions = loadDefaultOptions();
      
      if (savedOptions) {
        setBranchSystemId(savedOptions.branchSystemId);
        setPaperSize(savedOptions.paperSize);
        setPrintOrder(savedOptions.printOrder);
        setPrintDelivery(savedOptions.printDelivery);
        setPrintPacking(savedOptions.printPacking);
        setPrintShippingLabel(savedOptions.printShippingLabel);
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
      }
      setSaveAsDefault(false);
    }
  }, [open, defaultBranch, activeBranches, initialTemplateType]);

  const handleConfirm = () => {
    // Validate at least one type selected
    if (!printOrder && !printDelivery && !printPacking && !printShippingLabel) {
      return;
    }

    // Save as default if checked
    if (saveAsDefault) {
      saveDefaultOptions({
        branchSystemId,
        paperSize,
        printOrder,
        printDelivery,
        printPacking,
        printShippingLabel,
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
      paperSize,
      saveAsDefault,
      printOrder,
      printDelivery,
      printPacking,
      printShippingLabel,
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
  const hasSelection = printOrder || printDelivery || printPacking || printShippingLabel;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Chi nhánh */}
          <div className="flex items-center gap-4">
            <Label className="min-w-[160px] text-right text-muted-foreground">
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
            </div>
          </div>

          {/* Khổ giấy - Button group */}
          <div className="space-y-3">
            <Label className="text-muted-foreground">Chọn mẫu in phiếu</Label>
            <div className="flex flex-wrap gap-2">
              {PAPER_SIZE_OPTIONS.map(option => (
                <Button
                  key={option.value}
                  type="button"
                  variant={paperSize === option.value ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "min-w-[70px]",
                    paperSize === option.value && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => setPaperSize(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

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

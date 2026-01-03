import * as React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "../../lib/utils";
import { useBranchStore } from "../../features/settings/branches/store";
import { useSimplePrintOptions } from "../../hooks/use-print-options";

// Paper size options matching the order print dialog
const PAPER_SIZE_OPTIONS = [
  { label: 'A4', value: 'A4' },
  { label: 'A5', value: 'A5' },
  { label: 'A6', value: 'A6' },
  { label: 'K80', value: 'K80' },
  { label: 'K57', value: 'K57' },
] as const;

export type PaperSize = typeof PAPER_SIZE_OPTIONS[number]['value'];

export interface SimplePrintOptionsResult {
  branchSystemId: string;
  paperSize: PaperSize;
}

interface SimplePrintOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (options: SimplePrintOptionsResult) => void;
  selectedCount: number;
  title?: string;
}

export function SimplePrintOptionsDialog({
  open,
  onOpenChange,
  onConfirm,
  selectedCount,
  title = 'Tùy chọn in',
}: SimplePrintOptionsDialogProps) {
  const { data: branches } = useBranchStore();
  const activeBranches = branches;
  const [savedDefaults, setSavedDefaults] = useSimplePrintOptions();

  // Find default branch
  const defaultBranch = activeBranches.find(b => b.isDefault)?.systemId ?? activeBranches[0]?.systemId ?? '';
  
  const [branchSystemId, setBranchSystemId] = React.useState<string>(
    savedDefaults.branchSystemId || defaultBranch
  );
  const [paperSize, setPaperSize] = React.useState<PaperSize>(
    savedDefaults.paperSize || 'A4'
  );
  const [saveAsDefault, setSaveAsDefault] = React.useState(false);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setBranchSystemId(savedDefaults.branchSystemId || defaultBranch);
      setPaperSize(savedDefaults.paperSize || 'A4');
      setSaveAsDefault(false);
    }
  }, [open, defaultBranch, savedDefaults]);

  const handleConfirm = () => {
    const options: SimplePrintOptionsResult = {
      branchSystemId,
      paperSize,
    };

    if (saveAsDefault) {
      setSavedDefaults(options);
    }

    onConfirm(options);
    onOpenChange(false);
  };

  // Get branch display name
  const selectedBranchName = React.useMemo(() => {
    if (!branchSystemId) return 'Chi nhánh mặc định';
    const branch = activeBranches.find(b => b.systemId === branchSystemId);
    return branch?.name ?? 'Chi nhánh mặc định';
  }, [branchSystemId, activeBranches]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {title}
            {selectedCount > 1 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({selectedCount} phiếu)
              </span>
            )}
          </DialogTitle>
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
          <Button onClick={handleConfirm}>
            In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

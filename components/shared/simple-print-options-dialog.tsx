import * as React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { useAllBranches } from "../../features/settings/branches/hooks/use-all-branches";
import { useSimplePrintOptions } from "../../hooks/use-print-options";

// Standard paper size options
const STANDARD_SIZES = [
  { label: 'A4', value: 'A4' },
  { label: 'A5', value: 'A5' },
  { label: 'A6', value: 'A6' },
  { label: 'K80', value: 'K80' },
  { label: 'K57', value: 'K57' },
] as const;

// Use shared PaperSize from printer types
import type { PaperSize, PrintOrientation } from '../../features/settings/printer/types';
import { LABEL_SIZES, isLabelSize } from '../../features/settings/printer/types';
export type { PaperSize };

export interface SimplePrintOptionsResult {
  branchSystemId: string;
  paperSize: PaperSize;
  orientation?: PrintOrientation;
}

interface SimplePrintOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (options: SimplePrintOptionsResult) => void;
  selectedCount: number;
  title?: string;
  /** Show label size picker (default: true) */
  showLabelSizes?: boolean;
}

export function SimplePrintOptionsDialog({
  open,
  onOpenChange,
  onConfirm,
  selectedCount,
  title = 'Tùy chọn in',
  showLabelSizes = true,
}: SimplePrintOptionsDialogProps) {
  // ⚡ OPTIMIZED: Only fetch when dialog is open
  const { data: branches } = useAllBranches({ enabled: open });
  const activeBranches = branches;
  const [savedDefaults, setSavedDefaults] = useSimplePrintOptions({ enabled: open });

  // Find default branch
  const defaultBranch = activeBranches.find(b => b.isDefault)?.systemId ?? activeBranches[0]?.systemId ?? '';
  
  const [branchSystemId, setBranchSystemId] = React.useState<string>(
    savedDefaults.branchSystemId || defaultBranch
  );
  const [paperSize, setPaperSize] = React.useState<PaperSize>(
    savedDefaults.paperSize || 'A4'
  );
  const [orientation, setOrientation] = React.useState<PrintOrientation>('portrait');
  const [customWidth, setCustomWidth] = React.useState('');
  const [customHeight, setCustomHeight] = React.useState('');
  const [isCustom, setIsCustom] = React.useState(false);
  const [saveAsDefault, setSaveAsDefault] = React.useState(false);

  const isStandardSize = !isLabelSize(paperSize) && !isCustom;
  const supportsOrientation = ['A4', 'A5', 'A6'].includes(paperSize);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      const savedSize = savedDefaults.paperSize || 'A4';
      setBranchSystemId(savedDefaults.branchSystemId || defaultBranch);
      setPaperSize(savedSize);
      setIsCustom(false);
      setOrientation('portrait');
      setSaveAsDefault(false);
    }
  }, [open, defaultBranch, savedDefaults]);

  const handleConfirm = () => {
    let finalSize = paperSize;
    if (isCustom && customWidth && customHeight) {
      const w = parseInt(customWidth);
      const h = parseInt(customHeight);
      if (w > 0 && h > 0) {
        finalSize = `${w}x${h}`;
      }
    }

    const options: SimplePrintOptionsResult = {
      branchSystemId,
      paperSize: finalSize,
      orientation: supportsOrientation ? orientation : undefined,
    };

    if (saveAsDefault) {
      setSavedDefaults({ branchSystemId, paperSize: finalSize });
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
      <DialogContent className="sm:max-w-120">
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

          {/* Khổ giấy - Standard sizes */}
          <div className="space-y-3">
            <Label className="text-muted-foreground">Khổ giấy</Label>
            <div className="flex flex-wrap gap-2">
              {STANDARD_SIZES.map(option => (
                <Button
                  key={option.value}
                  type="button"
                  variant={paperSize === option.value && !isCustom ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "min-w-15",
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

          {/* Khổ tem nhãn */}
          {showLabelSizes && (
            <div className="space-y-3">
              <Label className="text-muted-foreground">Tem nhãn</Label>
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
          <Button onClick={handleConfirm}>
            In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

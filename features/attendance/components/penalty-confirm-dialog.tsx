import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table.tsx';
import { ScrollArea } from '../../../components/ui/scroll-area.tsx';
import { Checkbox } from '../../../components/ui/checkbox.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { AlertTriangle, AlertCircle, CheckCircle2, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils.ts';
import { formatCurrency } from '../../employees/shared-columns.tsx';
import type { PenaltyPreviewItem } from '../penalty-sync-service.ts';
import type { Penalty } from '../../settings/penalties/types.ts';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

interface PenaltyConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  penalties: PenaltyPreviewItem[];
  onConfirm: (selectedPenalties: Omit<Penalty, 'systemId'>[]) => void;
  onSkip: () => void;
}

export function PenaltyConfirmDialog({
  isOpen,
  onOpenChange,
  penalties,
  onConfirm,
  onSkip,
}: PenaltyConfirmDialogProps) {
  // Selection state - mặc định chọn tất cả không trùng
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => {
    return new Set(
      penalties
        .filter(p => !p.isDuplicate)
        .map(p => p.previewId)
    );
  });

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState<number>(10);

  // Reset selection và pagination khi penalties thay đổi
  React.useEffect(() => {
    setSelectedIds(new Set(
      penalties
        .filter(p => !p.isDuplicate)
        .map(p => p.previewId)
    ));
    setCurrentPage(1);
  }, [penalties]);

  const nonDuplicatePenalties = penalties.filter(p => !p.isDuplicate);
  const duplicatePenalties = penalties.filter(p => p.isDuplicate);
  
  // Tổng tiền của các phiếu đã chọn
  const totalAmount = penalties
    .filter(p => selectedIds.has(p.previewId))
    .reduce((sum, p) => sum + p.amount, 0);

  // Pagination calculations
  const totalPages = Math.ceil(penalties.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPenalties = penalties.slice(startIndex, endIndex);

  const handleToggle = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(nonDuplicatePenalties.map(p => p.previewId)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Chọn/bỏ chọn tất cả trong trang hiện tại
  const handleSelectAllInPage = (checked: boolean) => {
    const pageNonDuplicates = paginatedPenalties.filter(p => !p.isDuplicate);
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (checked) {
        pageNonDuplicates.forEach(p => next.add(p.previewId));
      } else {
        pageNonDuplicates.forEach(p => next.delete(p.previewId));
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const selected = penalties
      .filter(p => selectedIds.has(p.previewId))
      .map(({ isDuplicate, violation, previewId, ...penalty }) => penalty);
    onConfirm(selected);
    onOpenChange(false);
  };

  const handleSkip = () => {
    onSkip();
    onOpenChange(false);
  };

  // Check if all in current page are selected
  const pageNonDuplicates = paginatedPenalties.filter(p => !p.isDuplicate);
  const allInPageSelected = pageNonDuplicates.length > 0 && 
    pageNonDuplicates.every(p => selectedIds.has(p.previewId));
  const someInPageSelected = pageNonDuplicates.some(p => selectedIds.has(p.previewId));

  if (penalties.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Xác nhận tạo phiếu phạt
          </DialogTitle>
          <DialogDescription>
            Hệ thống phát hiện {penalties.length} vi phạm chấm công. Vui lòng xác nhận các phiếu phạt muốn tạo.
          </DialogDescription>
        </DialogHeader>

        {/* Summary */}
        <div className="flex gap-4 py-3 px-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm">
              <span className="font-medium">{nonDuplicatePenalties.length}</span> phiếu mới
            </span>
          </div>
          {duplicatePenalties.length > 0 && (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span className="text-sm">
                <span className="font-medium">{duplicatePenalties.length}</span> đã tồn tại
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">Tổng tiền phạt:</span>
            <span className="font-semibold text-destructive">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Table with fixed height ScrollArea */}
        <ScrollArea className="h-[400px] border rounded-lg">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={allInPageSelected}
                    onCheckedChange={handleSelectAllInPage}
                    aria-label="Chọn tất cả trong trang"
                    disabled={pageNonDuplicates.length === 0}
                    className={cn(someInPageSelected && !allInPageSelected && "data-[state=checked]:bg-primary/50")}
                  />
                </TableHead>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Vi phạm</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Chi tiết</TableHead>
                <TableHead className="text-right">Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPenalties.map((penalty) => {
                const isSelected = selectedIds.has(penalty.previewId);
                const violation = penalty.violation;
                
                return (
                  <TableRow 
                    key={penalty.previewId}
                    className={cn(
                      penalty.isDuplicate && "opacity-50 bg-muted/30"
                    )}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggle(penalty.previewId)}
                        disabled={penalty.isDuplicate}
                        aria-label={`Chọn phiếu phạt ${penalty.employeeName}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{penalty.employeeName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={violation.type === 'late' ? 'destructive' : 'warning'}>
                        {violation.type === 'late' ? 'Đi trễ' : 'Về sớm'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{violation.date}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {violation.type === 'late' 
                          ? `Vào ${violation.checkIn} (trễ ${violation.minutesLate} phút)`
                          : `Ra ${violation.checkOut} (sớm ${violation.minutesEarly} phút)`
                        }
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-destructive">
                      {formatCurrency(penalty.amount)}
                    </TableCell>
                    <TableCell>
                      {penalty.isDuplicate ? (
                        <Badge variant="outline" className="text-amber-600 border-amber-300">
                          Đã tồn tại
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          Mới
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Pagination */}
        {penalties.length > PAGE_SIZE_OPTIONS[0] && (
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Hiển thị</span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>/ {penalties.length} vi phạm</span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-2">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Select all toggle */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Checkbox
            id="selectAllPenalties"
            checked={selectedIds.size === nonDuplicatePenalties.length && nonDuplicatePenalties.length > 0}
            onCheckedChange={handleSelectAll}
            disabled={nonDuplicatePenalties.length === 0}
          />
          <label htmlFor="selectAllPenalties" className="text-sm cursor-pointer">
            Chọn tất cả {nonDuplicatePenalties.length} phiếu mới
          </label>
          <span className="text-sm text-muted-foreground ml-auto">
            Đã chọn: <span className="font-medium">{selectedIds.size}</span> phiếu
          </span>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleSkip}>
            Bỏ qua
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={selectedIds.size === 0}
          >
            Tạo {selectedIds.size} phiếu phạt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

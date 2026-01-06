'use client'

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { useEmployeeSearcher } from '@/features/employees/hooks/use-all-employees';
import { asSystemId, type SystemId } from '@/lib/id-types';

interface PackerSelectionDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (packerId?: SystemId) => void;
    existingPackerSystemId?: SystemId;
}

export function PackerSelectionDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    existingPackerSystemId,
}: PackerSelectionDialogProps) {
  const { searchEmployees } = useEmployeeSearcher();
  const [selectedEmployee, setSelectedEmployee] = React.useState<ComboboxOption | null>(null);

    const handleSubmit = () => {
        onSubmit(selectedEmployee ? asSystemId(selectedEmployee.value) : undefined);
    onOpenChange(false);
  };

  // Preload existing packer if set in order
  React.useEffect(() => {
      if (isOpen && existingPackerSystemId) {
          // Find employee and set as selected
          searchEmployees('', 0, 100).then(result => {
              const existing = result.items.find(e => e.value === existingPackerSystemId);
              if (existing) {
                  setSelectedEmployee(existing);
              }
          });
      } else if (isOpen) {
          setSelectedEmployee(null);
      }
  }, [isOpen, existingPackerSystemId, searchEmployees]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chọn nhân viên đóng gói</DialogTitle>
          <DialogDescription>
            Chỉ định một nhân viên để thực hiện đóng gói cho đơn hàng này. Bạn có thể bỏ qua để yêu cầu chung.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <Combobox
            value={selectedEmployee}
            onChange={setSelectedEmployee}
            onSearch={async (query: string, page: number) => {
              const result = await searchEmployees(query, page, 100);
              return { items: result.items, hasNextPage: result.hasNextPage };
            }}
            placeholder="Tìm nhân viên..."
            searchPlaceholder="Tìm kiếm..."
            emptyPlaceholder="Không tìm thấy nhân viên."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Yêu cầu đóng gói</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

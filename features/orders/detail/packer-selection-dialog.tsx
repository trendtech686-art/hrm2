'use client'

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { useMeiliEmployeeSearch } from '@/hooks/use-meilisearch';
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
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedEmployee, setSelectedEmployee] = React.useState<ComboboxOption | null>(null);
  
  const { data: searchResult, isLoading } = useMeiliEmployeeSearch({
    query: searchQuery,
    limit: 100,
    enabled: isOpen,
  });

  const handleSubmit = () => {
      onSubmit(selectedEmployee ? asSystemId(selectedEmployee.value) : undefined);
      onOpenChange(false);
  };

  // Preload existing packer if set in order
  React.useEffect(() => {
      if (isOpen && existingPackerSystemId) {
          // Find employee in search results and set as selected
          const existing = searchResult?.data.find(e => e.systemId === existingPackerSystemId);
          if (existing) {
              setSelectedEmployee({
                  value: existing.systemId,
                  label: existing.fullName,
              });
          }
      } else if (isOpen) {
          setSelectedEmployee(null);
      }
  }, [isOpen, existingPackerSystemId, searchResult]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent mobileFullScreen>
        <DialogHeader>
          <DialogTitle>Chọn nhân viên đóng gói</DialogTitle>
          <DialogDescription>
            Chỉ định một nhân viên để thực hiện đóng gói cho đơn hàng này.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <Combobox
            value={selectedEmployee}
            onChange={setSelectedEmployee}
            onSearch={setSearchQuery}
            isLoading={isLoading}
            placeholder="Tìm nhân viên..."
            searchPlaceholder="Tìm kiếm..."
            emptyPlaceholder={isLoading ? "Đang tải..." : "Không tìm thấy nhân viên."}
            options={searchResult?.data.map(e => ({
              value: e.systemId,
              label: e.fullName,
            })) || []}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedEmployee}>Yêu cầu đóng gói</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

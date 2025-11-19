import * as React from "react";
import { Plus } from "lucide-react";
import { useSupplierStore } from "../../suppliers/store.ts";
import { VirtualizedCombobox, type ComboboxOption } from "../../../components/ui/virtualized-combobox.tsx";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar.tsx";
import { QuickAddSupplierDialog } from "../../suppliers/components/quick-add-supplier-dialog.tsx";
import { asSystemId, type SystemId } from "@/lib/id-types";

interface SupplierComboboxProps {
  value?: SystemId; // supplier systemId
  onValueChange: (supplierId: SystemId | null) => void;
  placeholder?: string;
  className?: string;
}

const ADD_NEW_VALUE = "__ADD_NEW__";

export function SupplierCombobox({
  value,
  onValueChange,
  placeholder = "Chọn nhà cung cấp...",
  className,
}: SupplierComboboxProps) {
  const { data: suppliers, getActive } = useSupplierStore();
  const [showAddDialog, setShowAddDialog] = React.useState(false);

  // Only show active suppliers
  const activeSuppliers = React.useMemo(() => getActive(), [suppliers]);

  // Find selected supplier
  const selectedSupplier = React.useMemo(
    () => activeSuppliers.find((s) => (value ? s.systemId === value : false)),
    [activeSuppliers, value]
  );

  // Convert to ComboboxOption format with "Add new" button at top
  const options: ComboboxOption[] = React.useMemo(() => {
    const addNewOption: ComboboxOption = {
      value: ADD_NEW_VALUE,
      label: "Thêm mới nhà cung cấp",
      subtitle: "",
    };

    const supplierOptions: ComboboxOption[] = activeSuppliers.map((s) => ({
      value: s.systemId,
      label: s.name,
      subtitle: `${s.id}${s.phone ? ' • ' + s.phone : ''}`,
    }));

    return [addNewOption, ...supplierOptions];
  }, [activeSuppliers]);

  // Selected value in ComboboxOption format
  const selectedValue: ComboboxOption | null = selectedSupplier
    ? {
        value: selectedSupplier.systemId,
        label: selectedSupplier.name,
        subtitle: `${selectedSupplier.id}${selectedSupplier.phone ? ' • ' + selectedSupplier.phone : ''}`,
      }
    : null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleChange = (option: ComboboxOption | null) => {
    console.log('SupplierCombobox - handleChange called:', option);
    if (option?.value === ADD_NEW_VALUE) {
      setShowAddDialog(true);
    } else {
      console.log('SupplierCombobox - calling onValueChange with:', option?.value || "");
      onValueChange(option?.value ? asSystemId(option.value) : null);
    }
  };

  const handleAddSuccess = (supplierId: string) => {
    console.log('SupplierCombobox - handleAddSuccess:', supplierId);
    onValueChange(asSystemId(supplierId));
  };

  return (
    <>
      <VirtualizedCombobox
        value={selectedValue}
        onChange={handleChange}
        options={options}
        placeholder={placeholder}
        searchPlaceholder="Tìm kiếm nhà cung cấp..."
        emptyPlaceholder="Không tìm thấy nhà cung cấp"
        estimatedItemHeight={56}
        renderOption={(option, isSelected) => {
          // Special render for "Add new" button
          if (option.value === ADD_NEW_VALUE) {
            return (
              <div className="flex items-center gap-2 text-primary">
                <Plus className="h-4 w-4" />
                <span className="font-medium">{option.label}</span>
              </div>
            );
          }

          // Normal supplier render
          return (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="text-xs">
                  {getInitials(option.label)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-medium text-sm truncate">{option.label}</span>
                {option.subtitle && (
                  <span className="text-xs text-muted-foreground truncate">
                    {option.subtitle}
                  </span>
                )}
              </div>
              {isSelected && (
                <svg className="h-4 w-4 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          );
        }}
      />

      <QuickAddSupplierDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={handleAddSuccess}
      />
    </>
  );
}

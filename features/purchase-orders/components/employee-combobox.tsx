import * as React from "react";
import { useEmployeeStore } from "../../employees/store";
import { VirtualizedCombobox, type ComboboxOption } from "../../../components/ui/virtualized-combobox";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

interface EmployeeComboboxProps {
  value?: string; // employee systemId
  onValueChange: (employeeId: string) => void;
  placeholder?: string;
  className?: string;
}

export function EmployeeCombobox({
  value,
  onValueChange,
  placeholder = "Chọn nhân viên...",
  className,
}: EmployeeComboboxProps) {
  const { data: employees, getActive } = useEmployeeStore();

  // Only show active employees
  const activeEmployees = React.useMemo(() => getActive(), [employees]);

  // Find selected employee
  const selectedEmployee = React.useMemo(
    () => activeEmployees.find((e) => e.systemId === value),
    [activeEmployees, value]
  );

  // Convert to ComboboxOption format
  const options: ComboboxOption[] = React.useMemo(() => {
    return activeEmployees.map((e) => ({
      value: e.systemId,
      label: e.fullName,
      subtitle: `${e.id}${e.phone ? ' • ' + e.phone : ''}`,
    }));
  }, [activeEmployees]);

  // Selected value in ComboboxOption format
  const selectedValue: ComboboxOption | null = selectedEmployee
    ? {
        value: selectedEmployee.systemId,
        label: selectedEmployee.fullName,
        subtitle: `${selectedEmployee.id}${selectedEmployee.phone ? ' • ' + selectedEmployee.phone : ''}`,
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
    onValueChange(option?.value || "");
  };

  return (
    <VirtualizedCombobox
      value={selectedValue}
      onChange={handleChange}
      options={options}
      placeholder={placeholder}
      searchPlaceholder="Tìm nhân viên..."
      emptyPlaceholder="Không tìm thấy nhân viên"
      estimatedItemHeight={56}
      renderOption={(option, isSelected) => (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="text-body-xs">
              {getInitials(option.label)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-medium text-body-sm truncate">{option.label}</span>
            {option.subtitle && (
              <span className="text-body-xs text-muted-foreground truncate">
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
      )}
    />
  );
}


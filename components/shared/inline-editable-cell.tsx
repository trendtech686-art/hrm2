import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Pencil } from 'lucide-react';

interface InlineEditableCellProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  inputClassName?: string;
  renderDisplay?: (value: string, onEdit: () => void) => React.ReactNode;
}

export function InlineEditableCell({
  value,
  onSave,
  className,
  inputClassName,
  renderDisplay,
}: InlineEditableCellProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  React.useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-1 ${className || ''}`} onClick={(e) => e.stopPropagation()}>
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={inputClassName || 'h-8 text-sm min-w-[120px]'}
        />
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleSave}>
          <Check className="h-4 w-4 text-green-600" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCancel}>
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    );
  }

  if (renderDisplay) {
    return <>{renderDisplay(value, handleEdit)}</>;
  }

  return (
    <div 
      className={`flex items-center gap-2 group cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 -my-1 ${className || ''}`}
      onClick={(e) => {
        e.stopPropagation();
        handleEdit();
      }}
    >
      <span className="truncate">{value || '-'}</span>
      <Pencil className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground" />
    </div>
  );
}

interface InlineEditableNumberCellProps {
  value: number;
  onSave: (newValue: number) => void;
  className?: string;
  inputClassName?: string;
  renderDisplay?: (value: number, onEdit: () => void) => React.ReactNode;
  formatDisplay?: (value: number) => string;
}

export function InlineEditableNumberCell({
  value,
  onSave,
  className,
  inputClassName,
  renderDisplay,
  formatDisplay,
}: InlineEditableNumberCellProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(String(value));
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  React.useEffect(() => {
    setEditValue(String(value));
  }, [value]);

  const handleSave = () => {
    const newValue = parseInt(editValue, 10);
    if (!isNaN(newValue) && newValue !== value) {
      onSave(newValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditValue(String(value));
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className={className} onClick={(e) => e.stopPropagation()}>
        <Input
          ref={inputRef}
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={inputClassName || "h-8 w-24 text-right text-sm"}
        />
      </div>
    );
  }

  if (renderDisplay) {
    return <>{renderDisplay(value, handleEdit)}</>;
  }

  const displayValue = formatDisplay ? formatDisplay(value) : value.toLocaleString('vi-VN');

  return (
    <div
      className={`flex items-center justify-end cursor-pointer hover:bg-muted/50 rounded px-2 py-1 -mx-2 -my-1 group ${className || ''}`}
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      <span className="text-sm">{displayValue}</span>
      <Pencil className="h-3.5 w-3.5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground" />
    </div>
  );
}

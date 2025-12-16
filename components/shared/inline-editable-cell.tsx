import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
          className={inputClassName || 'h-7 text-sm w-40'}
        />
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={handleSave}>
          <Check className="h-3 w-3 text-green-600" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={handleCancel}>
          <X className="h-3 w-3 text-red-600" />
        </Button>
      </div>
    );
  }

  if (renderDisplay) {
    return <>{renderDisplay(value, handleEdit)}</>;
  }

  return (
    <div className={`flex items-center gap-2 group ${className || ''}`}>
      <span className="truncate">{value}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          handleEdit();
        }}
      >
        <Pencil className="h-3 w-3" />
      </Button>
    </div>
  );
}

interface InlineEditableNumberCellProps {
  value: number;
  onSave: (newValue: number) => void;
  className?: string;
  inputClassName?: string;
  renderDisplay?: (value: number, onEdit: () => void) => React.ReactNode;
}

export function InlineEditableNumberCell({
  value,
  onSave,
  className,
  inputClassName,
  renderDisplay,
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
          className={inputClassName || "h-7 w-16 text-center text-sm"}
        />
      </div>
    );
  }

  if (renderDisplay) {
    return <>{renderDisplay(value, handleEdit)}</>;
  }

  return (
    <div
      className={`flex items-center justify-center cursor-pointer ${className || ''}`}
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      <Badge variant="outline" className="font-mono text-xs hover:bg-muted">
        {value}
      </Badge>
    </div>
  );
}

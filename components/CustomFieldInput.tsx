import { useState } from 'react';
import type { CustomFieldDefinition, CustomFieldValue } from '../features/tasks/custom-fields-types';
import { validateFieldValue, formatFieldValue } from '../features/tasks/custom-fields-types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CustomFieldInputProps {
  field: CustomFieldDefinition;
  value?: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export function CustomFieldInput({ field, value, onChange, error, disabled }: CustomFieldInputProps) {
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(error);

  const handleBlur = () => {
    setTouched(true);
    if (field.required || value) {
      const validation = validateFieldValue(field, value);
      setLocalError(validation.valid ? undefined : validation.error);
    }
  };

  const handleChange = (newValue: any) => {
    onChange(newValue);
    if (touched) {
      const validation = validateFieldValue(field, newValue);
      setLocalError(validation.valid ? undefined : validation.error);
    }
  };

  const renderInput = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'phone':
        return (
          <Input
            type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : field.type === 'phone' ? 'tel' : 'text'}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            className={cn(localError && 'border-red-500')}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            className={cn(localError && 'border-red-500')}
            rows={4}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value ?? ''}
            onChange={(e) => handleChange(e.target.value ? parseFloat(e.target.value) : null)}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step || 1}
            className={cn(localError && 'border-red-500')}
          />
        );

      case 'currency':
        return (
          <div className="relative">
            <Input
              type="number"
              value={value ?? ''}
              onChange={(e) => handleChange(e.target.value ? parseFloat(e.target.value) : null)}
              onBlur={handleBlur}
              disabled={disabled}
              placeholder={field.placeholder || '0'}
              min={field.min || 0}
              max={field.max}
              step={field.step || 1000}
              className={cn('pl-12', localError && 'border-red-500')}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              VND
            </span>
          </div>
        );

      case 'percentage':
        return (
          <div className="relative">
            <Input
              type="number"
              value={value ?? ''}
              onChange={(e) => handleChange(e.target.value ? parseFloat(e.target.value) : null)}
              onBlur={handleBlur}
              disabled={disabled}
              placeholder={field.placeholder || '0'}
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 1}
              className={cn('pr-8', localError && 'border-red-500')}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              %
            </span>
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            disabled={disabled}
            className={cn(localError && 'border-red-500')}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              checked={!!value}
              onCheckedChange={handleChange}
              disabled={disabled}
              id={`field-${field.systemId}`}
            />
            <Label
              htmlFor={`field-${field.systemId}`}
              className="text-sm font-normal cursor-pointer"
            >
              {field.placeholder || 'Bật'}
            </Label>
          </div>
        );

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={handleChange}
            disabled={disabled ?? false}
          >
            <SelectTrigger className={cn(localError && 'border-red-500')}>
              <SelectValue placeholder={field.placeholder || 'Chọn...'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.color && (
                    <Badge
                      variant="outline"
                      className="mr-2"
                      style={{ backgroundColor: option.color + '20', borderColor: option.color }}
                    >
                      {option.label}
                    </Badge>
                  )}
                  {!option.color && option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {selectedValues.map((val: string) => {
                const option = field.options?.find((o) => o.value === val);
                if (!option) return null;
                return (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="cursor-pointer"
                    style={option.color ? { backgroundColor: option.color + '20', borderColor: option.color } : {}}
                    onClick={() => {
                      if (!disabled) {
                        handleChange(selectedValues.filter((v) => v !== val));
                      }
                    }}
                  >
                    {option.label}
                    <span className="ml-1">×</span>
                  </Badge>
                );
              })}
            </div>
            <Select
              value=""
              onValueChange={(val) => {
                if (!selectedValues.includes(val)) {
                  handleChange([...selectedValues, val]);
                }
              }}
              disabled={disabled ?? false}
            >
              <SelectTrigger className={cn(localError && 'border-red-500')}>
                <SelectValue placeholder={field.placeholder || 'Chọn thêm...'} />
              </SelectTrigger>
              <SelectContent>
                {field.options
                  ?.filter((opt) => !selectedValues.includes(opt.value))
                  .map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.color && (
                        <Badge
                          variant="outline"
                          className="mr-2"
                          style={{ backgroundColor: option.color + '20', borderColor: option.color }}
                        >
                          {option.label}
                        </Badge>
                      )}
                      {!option.color && option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return <Input value={value || ''} onChange={(e) => handleChange(e.target.value)} disabled />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {field.name}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {field.helpText && (
          <span className="text-xs text-muted-foreground">{field.helpText}</span>
        )}
      </div>
      {renderInput()}
      {localError && (
        <p className="text-xs text-red-500">{localError}</p>
      )}
      {field.description && !localError && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}
    </div>
  );
}

// Display component for readonly view
interface CustomFieldDisplayProps {
  field: CustomFieldDefinition;
  value?: any;
}

export function CustomFieldDisplay({ field, value }: CustomFieldDisplayProps) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const formattedValue = formatFieldValue(field, value);

  if (field.type === 'checkbox') {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium text-muted-foreground">{field.name}</span>
        <Checkbox checked={!!value} disabled />
      </div>
    );
  }

  if (field.type === 'multiselect' && Array.isArray(value)) {
    return (
      <div className="py-2">
        <span className="text-sm font-medium text-muted-foreground block mb-2">{field.name}</span>
        <div className="flex flex-wrap gap-2">
          {value.map((val) => {
            const option = field.options?.find((o) => o.value === val);
            return (
              <Badge
                key={val}
                variant="secondary"
                style={option?.color ? { backgroundColor: option.color + '20', borderColor: option.color } : {}}
              >
                {option?.label || val}
              </Badge>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-muted-foreground">{field.name}</span>
      <span className="text-sm">{formattedValue}</span>
    </div>
  );
}

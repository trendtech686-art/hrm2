import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type OrderFormValues = {
  tags?: string[];
  [key: string]: any;
};

type OrderTagsProps = {
  disabled?: boolean;
};

export function OrderTags({ disabled = false }: OrderTagsProps) {
  const { control, setValue } = useFormContext<OrderFormValues>();
  const [inputValue, setInputValue] = useState('');
  
  // ✅ PHASE 2: Convert watch to useWatch
  const tags = useWatch({ control, name: 'tags' }) || [];

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      // Tránh trùng lặp
      if (!tags.includes(newTag)) {
        setValue('tags', [...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setValue('tags', tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tags</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Nhập tag và nhấn Enter để thêm"
          disabled={disabled}
          className="h-9"
        />
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="gap-1 pr-1"
              >
                {tag}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

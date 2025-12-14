import * as React from "react";
import { cn } from "../../../lib/utils.ts";
import { Check } from "lucide-react";

interface FilterItem {
  value: string;
  label: string;
}

interface FilterListBoxProps {
  title: string;
  items: FilterItem[];
  activeValue: string;
  onValueChange: (value: string) => void;
}

export function FilterListBox({ title, items, activeValue, onValueChange }: FilterListBoxProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="px-4 py-2 bg-muted/50 border-b">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="divide-y max-h-[200px] overflow-y-auto">
        {items.map(({ value, label }) => {
          const isActive = activeValue === value;
          
          return (
            <div
              key={value}
              onClick={() => onValueChange(value)}
              className={cn(
                "flex items-center justify-between px-4 py-2 cursor-pointer transition-all hover:bg-accent/50",
                isActive && "bg-accent"
              )}
            >
              <span className="text-sm">{label}</span>
              {isActive && <Check className="h-4 w-4 text-primary" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

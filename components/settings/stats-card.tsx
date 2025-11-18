/**
 * Stats Card Component
 * 
 * Reusable statistics card for displaying metrics with icon
 * Used in: ID Counter Settings, Dashboard, Analytics pages
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon,
  variant = 'default'
}: StatsCardProps) {
  const variantClasses = {
    default: '',
    primary: 'border-blue-200 dark:border-blue-800',
    success: 'border-green-200 dark:border-green-800',
    warning: 'border-yellow-200 dark:border-yellow-800',
    destructive: 'border-red-200 dark:border-red-800',
  };

  return (
    <Card className={variantClasses[variant]}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

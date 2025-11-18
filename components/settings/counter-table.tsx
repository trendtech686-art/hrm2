/**
 * Counter Table Component
 * 
 * Displays entity ID counters with health status and actions
 * Used in: ID Counter Settings Page
 */

import * as React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Eye } from 'lucide-react';
import type { EntityIDConfig } from '../../lib/id-config';

export interface CounterTableRow {
  entityType: string;
  config: EntityIDConfig;
  currentCounter: number;
  totalItems: number;
  nextId: string;
  nextSystemId?: string;
  lastCreated?: string;
  health: 'good' | 'warning' | 'error';
}

interface CounterTableProps {
  data: CounterTableRow[];
  onViewDetails?: (row: CounterTableRow) => void;
}

export function CounterTable({ data, onViewDetails }: CounterTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Entity</TableHead>
            <TableHead>
              <div className="flex flex-col">
                <span className="font-semibold">SystemId Prefix</span>
                <span className="text-[10px] text-muted-foreground font-normal">(English - Query)</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex flex-col">
                <span className="font-semibold">Business ID Prefix</span>
                <span className="text-[10px] text-muted-foreground font-normal">(Tiếng Việt - Display)</span>
              </div>
            </TableHead>
            <TableHead className="text-right">Counter</TableHead>
            <TableHead className="text-right">Items</TableHead>
            <TableHead>
              <div className="flex flex-col">
                <span className="font-semibold">Next SystemId</span>
                <span className="text-[10px] text-muted-foreground font-normal">(Query key)</span>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex flex-col">
                <span className="font-semibold">Next Business ID</span>
                <span className="text-[10px] text-muted-foreground font-normal">(Display)</span>
              </div>
            </TableHead>
            <TableHead>Last Created</TableHead>
            <TableHead>Health</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                Không tìm thấy dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.entityType}>
                <TableCell className="font-medium">{row.config.displayName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {row.config.systemIdPrefix}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono">
                    {row.config.prefix}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">{row.currentCounter}</TableCell>
                <TableCell className="text-right">{row.totalItems}</TableCell>
                <TableCell>
                  <code className="text-sm bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-1 rounded border border-blue-200 dark:border-blue-800">
                    {row.nextSystemId || `${row.config.systemIdPrefix}${String(row.currentCounter + 1).padStart(row.config.digitCount, '0')}`}
                  </code>
                </TableCell>
                <TableCell>
                  <code className="text-sm bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-2 py-1 rounded border border-green-200 dark:border-green-800">
                    {row.nextId}
                  </code>
                </TableCell>
                <TableCell>
                  {row.lastCreated ? (
                    <code className="text-xs text-muted-foreground">{row.lastCreated}</code>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {row.health === 'good' && (
                    <Badge variant="default" className="text-xs">OK</Badge>
                  )}
                  {row.health === 'warning' && (
                    <Badge variant="secondary" className="text-xs">Warning</Badge>
                  )}
                  {row.health === 'error' && (
                    <Badge variant="destructive" className="text-xs">Error</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {onViewDetails && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onViewDetails(row)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

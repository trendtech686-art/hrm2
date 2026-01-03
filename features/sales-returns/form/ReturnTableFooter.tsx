'use client';

import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { TableFooter, TableRow, TableCell } from '@/components/ui/table';

import { formatCurrency, type FormValues } from './types';

export const ReturnTableFooter = () => {
  const { control } = useFormContext<FormValues>();
  const watchedReturnItemsRaw = useWatch({ control, name: 'items' });

  // Memoize to prevent new array reference on each render
  const watchedReturnItems = React.useMemo(
    () => watchedReturnItemsRaw || [],
    [watchedReturnItemsRaw]
  );

  const totalReturnValue = React.useMemo(
    () =>
      watchedReturnItems.reduce(
        (sum, item) => sum + (item.returnQuantity || 0) * (item.unitPrice || 0),
        0
      ),
    [watchedReturnItems]
  );

  const totalReturnQuantity = React.useMemo(
    () =>
      watchedReturnItems.reduce(
        (sum, item) => sum + (item.returnQuantity || 0),
        0
      ),
    [watchedReturnItems]
  );

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={2}>
          Số lượng trả ({totalReturnQuantity} sản phẩm)
        </TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell className="text-right font-semibold">
          Cần hoàn tiền trả hàng
        </TableCell>
        <TableCell className="text-right font-bold">
          {formatCurrency(totalReturnValue)}
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
    </TableFooter>
  );
};

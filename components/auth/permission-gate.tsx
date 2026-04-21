'use client';

/**
 * <PermissionGate> — Hiển thị UI theo permission.
 *
 * Dùng trong client components để ẩn/hiện nội dung theo quyền của user.
 * Sử dụng `useAuth()` nên bảo đảm đồng bộ với server-side (custom permissions
 * từ JWT / RoleSetting DB).
 *
 * @example
 * ```tsx
 * <PermissionGate permission="edit_orders">
 *   <Button>Sửa đơn</Button>
 * </PermissionGate>
 *
 * <PermissionGate anyOf={['edit_orders', 'cancel_orders']} fallback={<Disabled />}>
 *   <ActionMenu />
 * </PermissionGate>
 *
 * <PermissionGate allOf={['view_payroll', 'approve_payroll']}>
 *   <ApproveButton />
 * </PermissionGate>
 * ```
 */

import * as React from 'react';
import type { Permission } from '@/features/employees/permissions';
import { useAuth } from '@/contexts/auth-context';

type PermissionGateProps = {
  /** Nội dung hiển thị khi user có đủ quyền. */
  children: React.ReactNode;
  /** Nội dung thay thế khi user không có quyền. Mặc định: không render gì. */
  fallback?: React.ReactNode;
  /** Admin luôn vượt qua check. Mặc định: true. */
  allowAdmin?: boolean;
} & (
  | { permission: Permission; anyOf?: never; allOf?: never }
  | { permission?: never; anyOf: Permission[]; allOf?: never }
  | { permission?: never; anyOf?: never; allOf: Permission[] }
);

export function PermissionGate(props: PermissionGateProps) {
  const { children, fallback = null, allowAdmin = true } = props;
  const { can, canAll, canAny, isAdmin, isLoading } = useAuth();

  if (isLoading) return null;
  if (allowAdmin && isAdmin) return <>{children}</>;

  let allowed = false;
  if ('permission' in props && props.permission) {
    allowed = can(props.permission);
  } else if ('allOf' in props && props.allOf) {
    allowed = canAll(props.allOf);
  } else if ('anyOf' in props && props.anyOf) {
    allowed = canAny(props.anyOf);
  }

  return <>{allowed ? children : fallback}</>;
}

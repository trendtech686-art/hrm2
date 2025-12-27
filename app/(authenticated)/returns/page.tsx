'use client';

import { redirect } from 'next/navigation';

/**
 * /returns redirects to /sales-returns by default
 * Available return types:
 * - /sales-returns - Đổi trả hàng bán (khách hàng trả lại)
 * - /purchase-returns - Trả hàng nhập (trả lại nhà cung cấp)
 */
export default function ReturnsPage() {
  redirect('/sales-returns');
}

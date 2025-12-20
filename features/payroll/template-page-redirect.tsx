'use client'

import * as React from 'react';
import { Navigate } from '@/lib/next-compat';
import { ROUTES } from '../../lib/router';

/**
 * PayrollTemplatePage đã được chuyển vào Cài đặt → Nhân viên → Mẫu bảng lương
 * Component này redirect về trang settings với tab templates
 */
export function PayrollTemplatePage() {
  // Redirect về /settings/employees với state để mở tab templates
  React.useEffect(() => {
    // Save flag để employee settings page biết cần mở tab nào
    sessionStorage.setItem('employee-settings-active-tab', 'templates');
  }, []);

  return <Navigate to={ROUTES.SETTINGS.EMPLOYEES} replace />;
}

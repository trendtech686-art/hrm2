'use client'

import * as React from 'react';
import { redirect } from 'next/navigation';
import { ROUTES } from '../../lib/router';

/**
 * PayrollTemplatePage đã được chuyển vào Cài đặt → Nhân viên → Mẫu bảng lương
 * Component này redirect về trang settings với tab templates
 */
export function PayrollTemplatePage() {
  // Save flag để employee settings page biết cần mở tab nào
  React.useEffect(() => {
    sessionStorage.setItem('employee-settings-active-tab', 'templates');
    redirect(ROUTES.SETTINGS.EMPLOYEES);
  }, []);

  return null;
}

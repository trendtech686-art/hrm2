/**
 * Warranty Notification Service
 * Sends email notifications for warranty events
 *
 * Events:
 * - Warranty created and assigned
 * - Warranty assigned to someone
 * - Warranty status changed (PROCESSING, COMPLETED, CANCELLED)
 * - Warranty overdue
 */

import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { logError } from '@/lib/logger';
import { getWarrantyNotificationSettings, areEmailNotificationsEnabled } from '@/lib/notifications';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ============================================================================
// Helpers
// ============================================================================

async function getEmployeeEmail(employeeSystemId: string): Promise<string | null> {
  try {
    const employee = await prisma.employee.findUnique({
      where: { systemId: employeeSystemId },
      select: { workEmail: true, personalEmail: true },
    });
    return employee?.workEmail || employee?.personalEmail || null;
  } catch {
    return null;
  }
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return 'Chưa xác định';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(date));
}

function warrantyUrl(systemId: string): string {
  return `${APP_URL}/warranty/${systemId}`;
}

function warrantyStatusLabel(status: string): string {
  const map: Record<string, string> = {
    RECEIVED: 'Đã tiếp nhận',
    PROCESSING: 'Đang xử lý',
    COMPLETED: 'Đã xử lý',
    RETURNED: 'Đã trả hàng',
    CANCELLED: 'Đã hủy',
  };
  return map[status] || status;
}

// ============================================================================
// Email Template
// ============================================================================

function baseTemplate(content: string): string {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      ${content}
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">
        Đây là email tự động từ hệ thống quản lý bảo hành. Vui lòng không trả lời email này.
      </p>
    </div>
  `;
}

// ============================================================================
// Notification Functions
// ============================================================================

/**
 * Notify when a warranty ticket is created and assigned
 */
export async function notifyWarrantyCreated(warranty: {
  systemId: string;
  title: string;
  id: string;
  assigneeId: string | null;
  creatorName?: string | null;
}) {
  if (!warranty.assigneeId) return;

  if (!(await areEmailNotificationsEnabled())) return;
  const settings = await getWarrantyNotificationSettings();
  if (!settings.emailOnCreate) return;

  const email = await getEmployeeEmail(warranty.assigneeId);
  if (!email) return;

  try {
    await sendEmail({
      to: email,
      subject: `[Bảo hành mới] ${warranty.title}`,
      html: baseTemplate(`
        <h2 style="color: #0891b2;">🔧 Phiếu bảo hành mới</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Mã phiếu:</td><td style="padding: 8px 0; font-weight: 600;">${warranty.id}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Tiêu đề:</td><td style="padding: 8px 0; font-weight: 600;">${warranty.title}</td></tr>
          ${warranty.creatorName ? `<tr><td style="padding: 8px 0; color: #6b7280;">Tạo bởi:</td><td style="padding: 8px 0;">${warranty.creatorName}</td></tr>` : ''}
        </table>
        <div style="margin-top: 20px;">
          <a href="${warrantyUrl(warranty.systemId)}" style="background: #0891b2; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Xem chi tiết
          </a>
        </div>
      `),
    });
  } catch (error) {
    logError('Failed to send warranty created notification', error);
  }
}

/**
 * Notify when warranty is assigned to a new person
 */
export async function notifyWarrantyAssigned(warranty: {
  systemId: string;
  title: string;
  id: string;
  assigneeId: string;
  assignerName?: string | null;
}) {
  if (!(await areEmailNotificationsEnabled())) return;
  const settings = await getWarrantyNotificationSettings();
  if (!settings.emailOnAssign) return;

  const email = await getEmployeeEmail(warranty.assigneeId);
  if (!email) return;

  try {
    await sendEmail({
      to: email,
      subject: `[Bảo hành] Bạn được giao phiếu ${warranty.id}`,
      html: baseTemplate(`
        <h2 style="color: #0891b2;">🔧 Bạn được giao phiếu bảo hành</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Mã phiếu:</td><td style="padding: 8px 0; font-weight: 600;">${warranty.id}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Tiêu đề:</td><td style="padding: 8px 0; font-weight: 600;">${warranty.title}</td></tr>
          ${warranty.assignerName ? `<tr><td style="padding: 8px 0; color: #6b7280;">Giao bởi:</td><td style="padding: 8px 0;">${warranty.assignerName}</td></tr>` : ''}
        </table>
        <div style="margin-top: 20px;">
          <a href="${warrantyUrl(warranty.systemId)}" style="background: #0891b2; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Xem chi tiết
          </a>
        </div>
      `),
    });
  } catch (error) {
    logError('Failed to send warranty assigned notification', error);
  }
}

/**
 * Notify when warranty status changes
 * Maps status to email toggle:
 * - PROCESSING → emailOnInspected
 * - COMPLETED/RETURNED → emailOnApproved
 * - CANCELLED → emailOnRejected
 */
export async function notifyWarrantyStatusChanged(warranty: {
  systemId: string;
  title: string;
  id: string;
  assigneeId: string | null;
  creatorId: string | null;
  status: string;
  oldStatus: string;
}) {
  if (!(await areEmailNotificationsEnabled())) return;
  const settings = await getWarrantyNotificationSettings();

  // Map status to the correct email toggle
  const statusToggle: Record<string, keyof typeof settings> = {
    PROCESSING: 'emailOnInspected',
    COMPLETED: 'emailOnApproved',
    RETURNED: 'emailOnApproved',
    CANCELLED: 'emailOnRejected',
  };

  const toggle = statusToggle[warranty.status];
  if (toggle && !settings[toggle]) return;

  // Notify assignee and creator (deduplicated)
  const recipients = new Set<string>();
  if (warranty.assigneeId) recipients.add(warranty.assigneeId);
  if (warranty.creatorId) recipients.add(warranty.creatorId);

  for (const recipientId of recipients) {
    const email = await getEmployeeEmail(recipientId);
    if (!email) continue;

    try {
      await sendEmail({
        to: email,
        subject: `[Bảo hành] ${warranty.id} — ${warrantyStatusLabel(warranty.status)}`,
        html: baseTemplate(`
          <h2 style="color: #7c3aed;">🔄 Cập nhật trạng thái bảo hành</h2>
          <p><strong>${warranty.title}</strong> (${warranty.id})</p>
          <p>Trạng thái: <span style="text-decoration: line-through; color: #9ca3af;">${warrantyStatusLabel(warranty.oldStatus)}</span> → <strong style="color: #059669;">${warrantyStatusLabel(warranty.status)}</strong></p>
          <div style="margin-top: 20px;">
            <a href="${warrantyUrl(warranty.systemId)}" style="background: #0891b2; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
              Xem chi tiết
            </a>
          </div>
        `),
      });
    } catch (error) {
      logError('Failed to send warranty status change notification', error);
    }
  }
}

/**
 * Notify about warranty approaching deadline or overdue
 */
export async function notifyWarrantyOverdue(warranty: {
  systemId: string;
  title: string;
  id: string;
  assigneeId: string | null;
  dueDate: Date;
  daysLeft: number;
}) {
  if (!warranty.assigneeId) return;

  if (!(await areEmailNotificationsEnabled())) return;
  const settings = await getWarrantyNotificationSettings();
  if (!settings.emailOnOverdue) return;

  const email = await getEmployeeEmail(warranty.assigneeId);
  if (!email) return;

  const urgencyColor = warranty.daysLeft <= 0 ? '#dc2626' : '#f59e0b';
  const urgencyText = warranty.daysLeft <= 0
    ? 'ĐÃ QUÁ HẠN'
    : warranty.daysLeft === 1
      ? 'Còn 1 ngày'
      : `Còn ${warranty.daysLeft} ngày`;

  try {
    await sendEmail({
      to: email,
      subject: `[Bảo hành] ${warranty.id} — ${urgencyText}`,
      html: baseTemplate(`
        <h2 style="color: ${urgencyColor};">⏰ Cảnh báo hạn bảo hành</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Mã phiếu:</td><td style="padding: 8px 0; font-weight: 600;">${warranty.id}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Tiêu đề:</td><td style="padding: 8px 0;">${warranty.title}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Hạn xử lý:</td><td style="padding: 8px 0;">${formatDate(warranty.dueDate)}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Tình trạng:</td><td style="padding: 8px 0; font-weight: 600; color: ${urgencyColor};">${urgencyText}</td></tr>
        </table>
        <div style="margin-top: 20px;">
          <a href="${warrantyUrl(warranty.systemId)}" style="background: ${urgencyColor}; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Xem chi tiết
          </a>
        </div>
      `),
    });
  } catch (error) {
    logError('Failed to send warranty overdue notification', error);
  }
}

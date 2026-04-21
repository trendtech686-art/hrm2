/**
 * Complaint Notification Service
 * Sends email notifications for complaint events
 *
 * Events:
 * - Complaint created and assigned
 * - Complaint assigned to someone
 * - Complaint status changed (IN_PROGRESS, RESOLVED, CLOSED)
 * - Complaint overdue
 */

import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { logError } from '@/lib/logger';
import { getComplaintNotificationSettings, areEmailNotificationsEnabled } from '@/lib/notifications';

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

function complaintUrl(systemId: string): string {
  return `${APP_URL}/complaint-tracking/${systemId}`;
}

function complaintStatusLabel(status: string): string {
  const map: Record<string, string> = {
    OPEN: 'Mở',
    IN_PROGRESS: 'Đang xử lý',
    RESOLVED: 'Đã giải quyết',
    CLOSED: 'Đóng',
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
        Đây là email tự động từ hệ thống quản lý khiếu nại. Vui lòng không trả lời email này.
      </p>
    </div>
  `;
}

// ============================================================================
// Notification Functions
// ============================================================================

/**
 * Notify when a complaint is created and assigned
 */
export async function notifyComplaintCreated(complaint: {
  systemId: string;
  title: string;
  id: string;
  assigneeId: string | null;
  creatorName?: string | null;
}) {
  if (!complaint.assigneeId) return;

  if (!(await areEmailNotificationsEnabled())) return;
  const settings = await getComplaintNotificationSettings();
  if (!settings.emailOnCreate) return;

  const email = await getEmployeeEmail(complaint.assigneeId);
  if (!email) return;

  try {
    await sendEmail({
      to: email,
      subject: `[Khiếu nại mới] ${complaint.title}`,
      html: baseTemplate(`
        <h2 style="color: #dc2626;">📢 Khiếu nại mới</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Mã khiếu nại:</td><td style="padding: 8px 0; font-weight: 600;">${complaint.id}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Tiêu đề:</td><td style="padding: 8px 0; font-weight: 600;">${complaint.title}</td></tr>
          ${complaint.creatorName ? `<tr><td style="padding: 8px 0; color: #6b7280;">Tạo bởi:</td><td style="padding: 8px 0;">${complaint.creatorName}</td></tr>` : ''}
        </table>
        <div style="margin-top: 20px;">
          <a href="${complaintUrl(complaint.systemId)}" style="background: #dc2626; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Xem chi tiết
          </a>
        </div>
      `),
    });
  } catch (error) {
    logError('Failed to send complaint created notification', error);
  }
}

/**
 * Notify when complaint is assigned to a new person
 */
export async function notifyComplaintAssigned(complaint: {
  systemId: string;
  title: string;
  id: string;
  assigneeId: string;
  assignerName?: string | null;
}) {
  if (!(await areEmailNotificationsEnabled())) return;
  const settings = await getComplaintNotificationSettings();
  if (!settings.emailOnAssign) return;

  const email = await getEmployeeEmail(complaint.assigneeId);
  if (!email) return;

  try {
    await sendEmail({
      to: email,
      subject: `[Khiếu nại] Bạn được giao xử lý ${complaint.id}`,
      html: baseTemplate(`
        <h2 style="color: #dc2626;">📢 Bạn được giao khiếu nại</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Mã khiếu nại:</td><td style="padding: 8px 0; font-weight: 600;">${complaint.id}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Tiêu đề:</td><td style="padding: 8px 0; font-weight: 600;">${complaint.title}</td></tr>
          ${complaint.assignerName ? `<tr><td style="padding: 8px 0; color: #6b7280;">Giao bởi:</td><td style="padding: 8px 0;">${complaint.assignerName}</td></tr>` : ''}
        </table>
        <div style="margin-top: 20px;">
          <a href="${complaintUrl(complaint.systemId)}" style="background: #dc2626; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Xem chi tiết
          </a>
        </div>
      `),
    });
  } catch (error) {
    logError('Failed to send complaint assigned notification', error);
  }
}

/**
 * Notify when complaint status changes
 * Maps status to email toggle:
 * - IN_PROGRESS → emailOnVerified
 * - RESOLVED → emailOnResolved
 */
export async function notifyComplaintStatusChanged(complaint: {
  systemId: string;
  title: string;
  id: string;
  assigneeId: string | null;
  creatorId: string | null;
  status: string;
  oldStatus: string;
}) {
  if (!(await areEmailNotificationsEnabled())) return;
  const settings = await getComplaintNotificationSettings();

  // Map status to the correct email toggle
  const statusToggle: Record<string, keyof typeof settings> = {
    IN_PROGRESS: 'emailOnVerified',
    RESOLVED: 'emailOnResolved',
  };

  const toggle = statusToggle[complaint.status];
  if (toggle && !settings[toggle]) return;

  // Notify assignee and creator (deduplicated)
  const recipients = new Set<string>();
  if (complaint.assigneeId) recipients.add(complaint.assigneeId);
  if (complaint.creatorId) recipients.add(complaint.creatorId);

  for (const recipientId of recipients) {
    const email = await getEmployeeEmail(recipientId);
    if (!email) continue;

    try {
      await sendEmail({
        to: email,
        subject: `[Khiếu nại] ${complaint.id} — ${complaintStatusLabel(complaint.status)}`,
        html: baseTemplate(`
          <h2 style="color: #7c3aed;">🔄 Cập nhật trạng thái khiếu nại</h2>
          <p><strong>${complaint.title}</strong> (${complaint.id})</p>
          <p>Trạng thái: <span style="text-decoration: line-through; color: #9ca3af;">${complaintStatusLabel(complaint.oldStatus)}</span> → <strong style="color: #059669;">${complaintStatusLabel(complaint.status)}</strong></p>
          <div style="margin-top: 20px;">
            <a href="${complaintUrl(complaint.systemId)}" style="background: #dc2626; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
              Xem chi tiết
            </a>
          </div>
        `),
      });
    } catch (error) {
      logError('Failed to send complaint status change notification', error);
    }
  }
}

/**
 * Notify about complaint approaching deadline or overdue
 */
export async function notifyComplaintOverdue(complaint: {
  systemId: string;
  title: string;
  id: string;
  assigneeId: string | null;
  dueDate: Date;
  daysLeft: number;
}) {
  if (!complaint.assigneeId) return;

  if (!(await areEmailNotificationsEnabled())) return;
  const settings = await getComplaintNotificationSettings();
  if (!settings.emailOnOverdue) return;

  const email = await getEmployeeEmail(complaint.assigneeId);
  if (!email) return;

  const urgencyColor = complaint.daysLeft <= 0 ? '#dc2626' : '#f59e0b';
  const urgencyText = complaint.daysLeft <= 0
    ? 'ĐÃ QUÁ HẠN'
    : complaint.daysLeft === 1
      ? 'Còn 1 ngày'
      : `Còn ${complaint.daysLeft} ngày`;

  try {
    await sendEmail({
      to: email,
      subject: `[Khiếu nại] ${complaint.id} — ${urgencyText}`,
      html: baseTemplate(`
        <h2 style="color: ${urgencyColor};">⏰ Cảnh báo hạn khiếu nại</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Mã khiếu nại:</td><td style="padding: 8px 0; font-weight: 600;">${complaint.id}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Tiêu đề:</td><td style="padding: 8px 0;">${complaint.title}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Hạn xử lý:</td><td style="padding: 8px 0;">${formatDate(complaint.dueDate)}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Tình trạng:</td><td style="padding: 8px 0; font-weight: 600; color: ${urgencyColor};">${urgencyText}</td></tr>
        </table>
        <div style="margin-top: 20px;">
          <a href="${complaintUrl(complaint.systemId)}" style="background: ${urgencyColor}; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Xem chi tiết
          </a>
        </div>
      `),
    });
  } catch (error) {
    logError('Failed to send complaint overdue notification', error);
  }
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return 'Chưa xác định';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(date));
}

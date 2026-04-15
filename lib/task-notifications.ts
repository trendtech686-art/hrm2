/**
 * Task Notification Service
 * Sends email notifications for task events
 * 
 * Events:
 * - Task assigned to someone
 * - Task approaching deadline (3 days, 1 day)
 * - Task overdue
 * - Task completed
 * - Task status changed
 */

import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { logError } from '@/lib/logger';
import { getTaskNotificationSettings } from '@/lib/notifications';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ============================================================================
// Helpers
// ============================================================================

async function getEmployeeEmail(employeeSystemId: string): Promise<string | null> {
  try {
    const employee = await prisma.employee.findUnique({
      where: { systemId: employeeSystemId },
      select: { workEmail: true, personalEmail: true, fullName: true },
    });
    return employee?.workEmail || employee?.personalEmail || null;
  } catch {
    return null;
  }
}

async function getEmployeeName(employeeSystemId: string): Promise<string> {
  try {
    const employee = await prisma.employee.findUnique({
      where: { systemId: employeeSystemId },
      select: { fullName: true },
    });
    return employee?.fullName || employeeSystemId;
  } catch {
    return employeeSystemId;
  }
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return 'Chưa xác định';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(date));
}

function priorityLabel(priority: string): string {
  const map: Record<string, string> = {
    LOW: 'Thấp', MEDIUM: 'Trung bình', HIGH: 'Cao', URGENT: 'Khẩn cấp',
  };
  return map[priority] || priority;
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    TODO: 'Chưa bắt đầu', IN_PROGRESS: 'Đang thực hiện',
    REVIEW: 'Chờ duyệt', DONE: 'Hoàn thành', CANCELLED: 'Đã hủy',
  };
  return map[status] || status;
}

function taskUrl(taskSystemId: string): string {
  return `${APP_URL}/tasks/${taskSystemId}`;
}

// ============================================================================
// Email Templates
// ============================================================================

function baseTemplate(content: string): string {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      ${content}
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">
        Đây là email tự động từ hệ thống quản lý công việc. Vui lòng không trả lời email này.
      </p>
    </div>
  `;
}

// ============================================================================
// Notification Functions
// ============================================================================

/**
 * Notify when a task is created (to assignee + creator's manager)
 */
export async function notifyTaskCreated(task: {
  systemId: string;
  title: string;
  assigneeId: string | null;
  creatorId: string;
  priority: string;
  dueDate: Date | null;
}) {
  const settings = await getTaskNotificationSettings();
  if (!settings.emailOnCreate) return;

  // Notify assignee if different from creator
  if (task.assigneeId && task.assigneeId !== task.creatorId) {
    const email = await getEmployeeEmail(task.assigneeId);
    if (email) {
      const creatorName = await getEmployeeName(task.creatorId);
      try {
        await sendEmail({
          to: email,
          subject: `[Công việc mới] ${task.title}`,
          html: baseTemplate(`
            <h2 style="color: #1e40af;">📋 Công việc mới được tạo</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280;">Tiêu đề:</td><td style="padding: 8px 0; font-weight: 600;">${task.title}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Người tạo:</td><td style="padding: 8px 0;">${creatorName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Độ ưu tiên:</td><td style="padding: 8px 0;">${priorityLabel(task.priority)}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Hạn hoàn thành:</td><td style="padding: 8px 0;">${formatDate(task.dueDate)}</td></tr>
            </table>
            <div style="margin-top: 20px;">
              <a href="${taskUrl(task.systemId)}" style="background: #2563eb; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
                Xem chi tiết
              </a>
            </div>
          `),
        });
      } catch (error) {
        logError('Failed to send task created notification', error);
      }
    }
  }
}

/**
 * Notify when a task needs approval (REVIEW status)
 */
export async function notifyTaskApprovalPending(task: {
  systemId: string;
  title: string;
  assigneeId: string | null;
  creatorId: string;
}) {
  const settings = await getTaskNotificationSettings();
  if (!settings.emailOnApprovalPending) return;

  // Notify the creator (task owner) that assignee submitted for review
  if (!task.creatorId || task.creatorId === 'SYSTEM') return;

  const email = await getEmployeeEmail(task.creatorId);
  if (!email) return;

  const assigneeName = task.assigneeId ? await getEmployeeName(task.assigneeId) : 'Không rõ';

  try {
    await sendEmail({
      to: email,
      subject: `[Chờ duyệt] ${task.title}`,
      html: baseTemplate(`
        <h2 style="color: #d97706;">🔍 Công việc cần duyệt</h2>
        <p><strong>${task.title}</strong> đã được ${assigneeName} gửi để duyệt.</p>
        <div style="margin-top: 20px;">
          <a href="${taskUrl(task.systemId)}" style="background: #d97706; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Duyệt ngay
          </a>
        </div>
      `),
    });
  } catch (error) {
    logError('Failed to send task approval pending notification', error);
  }
}

/**
 * Notify when a task is assigned to someone
 */
export async function notifyTaskAssigned(task: {
  systemId: string;
  title: string;
  assigneeId: string | null;
  priority: string;
  dueDate: Date | null;
  assignerName?: string | null;
}) {
  if (!task.assigneeId) return;

  const settings = await getTaskNotificationSettings();
  if (!settings.emailOnAssign) return;

  const email = await getEmployeeEmail(task.assigneeId);
  if (!email) return;

  const assignerText = task.assignerName ? ` bởi ${task.assignerName}` : '';

  try {
    await sendEmail({
      to: email,
      subject: `[Công việc mới] ${task.title}`,
      html: baseTemplate(`
        <h2 style="color: #1e40af;">📋 Bạn được giao công việc mới</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Tiêu đề:</td><td style="padding: 8px 0; font-weight: 600;">${task.title}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Độ ưu tiên:</td><td style="padding: 8px 0;">${priorityLabel(task.priority)}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Hạn hoàn thành:</td><td style="padding: 8px 0;">${formatDate(task.dueDate)}</td></tr>
          ${assignerText ? `<tr><td style="padding: 8px 0; color: #6b7280;">Giao bởi:</td><td style="padding: 8px 0;">${task.assignerName}</td></tr>` : ''}
        </table>
        <div style="margin-top: 20px;">
          <a href="${taskUrl(task.systemId)}" style="background: #2563eb; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Xem chi tiết
          </a>
        </div>
      `),
    });
  } catch (error) {
    logError('Failed to send task assigned notification', error);
  }
}

/**
 * Notify when task status changes
 */
export async function notifyTaskStatusChanged(task: {
  systemId: string;
  title: string;
  assigneeId: string | null;
  creatorId: string;
  status: string;
  oldStatus: string;
}) {
  const settings = await getTaskNotificationSettings();

  // Check the right setting based on new status
  if (task.status === 'DONE' && !settings.emailOnComplete) return;

  // Notify both assignee and creator (deduplicated)
  const recipients = new Set<string>();
  if (task.assigneeId) recipients.add(task.assigneeId);
  if (task.creatorId && task.creatorId !== 'SYSTEM') recipients.add(task.creatorId);

  for (const recipientId of recipients) {
    const email = await getEmployeeEmail(recipientId);
    if (!email) continue;

    try {
      await sendEmail({
        to: email,
        subject: `[Cập nhật] ${task.title} - ${statusLabel(task.status)}`,
        html: baseTemplate(`
          <h2 style="color: #7c3aed;">🔄 Cập nhật trạng thái công việc</h2>
          <p><strong>${task.title}</strong></p>
          <p>Trạng thái: <span style="text-decoration: line-through; color: #9ca3af;">${statusLabel(task.oldStatus)}</span> → <strong style="color: #059669;">${statusLabel(task.status)}</strong></p>
          <div style="margin-top: 20px;">
            <a href="${taskUrl(task.systemId)}" style="background: #2563eb; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
              Xem chi tiết
            </a>
          </div>
        `),
      });
    } catch (error) {
      logError('Failed to send task status change notification', error);
    }
  }
}

/**
 * Notify when task is completed
 */
export async function notifyTaskCompleted(task: {
  systemId: string;
  title: string;
  assigneeId: string | null;
  creatorId: string;
}) {
  // Notify the creator that their assigned task is complete
  if (!task.creatorId || task.creatorId === 'SYSTEM') return;

  const settings = await getTaskNotificationSettings();
  if (!settings.emailOnComplete) return;

  const email = await getEmployeeEmail(task.creatorId);
  if (!email) return;

  const assigneeName = task.assigneeId ? await getEmployeeName(task.assigneeId) : 'Không rõ';

  try {
    await sendEmail({
      to: email,
      subject: `[Hoàn thành] ${task.title}`,
      html: baseTemplate(`
        <h2 style="color: #059669;">✅ Công việc đã hoàn thành</h2>
        <p><strong>${task.title}</strong> đã được hoàn thành bởi ${assigneeName}.</p>
        <div style="margin-top: 20px;">
          <a href="${taskUrl(task.systemId)}" style="background: #059669; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Xem chi tiết
          </a>
        </div>
      `),
    });
  } catch (error) {
    logError('Failed to send task completed notification', error);
  }
}

/**
 * Notify about approaching deadline
 */
export async function notifyTaskDeadlineApproaching(task: {
  systemId: string;
  title: string;
  assigneeId: string | null;
  dueDate: Date;
  daysLeft: number;
}) {
  if (!task.assigneeId) return;

  const settings = await getTaskNotificationSettings();
  if (!settings.emailOnOverdue) return;

  const email = await getEmployeeEmail(task.assigneeId);
  if (!email) return;

  const urgencyColor = task.daysLeft <= 1 ? '#dc2626' : '#f59e0b';
  const urgencyText = task.daysLeft <= 0
    ? 'ĐÃ QUÁ HẠN'
    : task.daysLeft === 1
      ? 'Còn 1 ngày'
      : `Còn ${task.daysLeft} ngày`;

  try {
    await sendEmail({
      to: email,
      subject: `[Nhắc nhở] ${task.title} - ${urgencyText}`,
      html: baseTemplate(`
        <h2 style="color: ${urgencyColor};">⏰ Nhắc nhở hạn công việc</h2>
        <p><strong>${task.title}</strong></p>
        <p>Hạn hoàn thành: <strong>${formatDate(task.dueDate)}</strong> (${urgencyText})</p>
        <div style="margin-top: 20px;">
          <a href="${taskUrl(task.systemId)}" style="background: ${urgencyColor}; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Xem công việc
          </a>
        </div>
      `),
    });
  } catch (error) {
    logError('Failed to send deadline notification', error);
  }
}

/**
 * Batch check for overdue and approaching-deadline tasks
 * Call this from a cron/scheduled endpoint
 */
export async function processTaskDeadlineNotifications() {
  const now = new Date();
  const oneDayFromNow = new Date(now);
  oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
  const threeDaysFromNow = new Date(now);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  try {
    // Find tasks with upcoming or passed deadlines that aren't done
    const tasks = await prisma.task.findMany({
      where: {
        isDeleted: false,
        status: { in: ['TODO', 'IN_PROGRESS', 'REVIEW'] },
        dueDate: { lte: threeDaysFromNow },
        assigneeId: { not: null },
      },
      select: {
        systemId: true,
        title: true,
        assigneeId: true,
        dueDate: true,
      },
    });

    let notified = 0;
    for (const task of tasks) {
      if (!task.dueDate || !task.assigneeId) continue;

      const diffMs = task.dueDate.getTime() - now.getTime();
      const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      // Only send for overdue, 1 day, or 3 days
      if (daysLeft <= 0 || daysLeft === 1 || daysLeft === 3) {
        await notifyTaskDeadlineApproaching({
          systemId: task.systemId,
          title: task.title,
          assigneeId: task.assigneeId,
          dueDate: task.dueDate,
          daysLeft,
        });
        notified++;
      }
    }

    return { checked: tasks.length, notified };
  } catch (error) {
    logError('Failed to process deadline notifications', error);
    return { checked: 0, notified: 0 };
  }
}

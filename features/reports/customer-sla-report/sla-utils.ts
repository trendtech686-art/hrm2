import type { Customer } from '../../customers/types';
import type { CustomerSlaSetting } from '../../settings/customers/types';
import type { 
  CustomerSlaAlert, 
  DebtAlert, 
  CustomerHealthAlert, 
  SlaAlertLevel,
  ReportSummary 
} from './types';
import { differenceInDays, parseISO, format } from 'date-fns';

/**
 * Tính toán alert level dựa trên số ngày còn lại và cấu hình SLA
 * - daysRemaining < 0 means overdue
 * - criticalDays = số ngày quá hạn để coi là nghiêm trọng
 * - warningDays = số ngày TRƯỚC target để bắt đầu cảnh báo
 */
export function calculateAlertLevel(
  daysRemaining: number, 
  slaSetting: CustomerSlaSetting
): SlaAlertLevel {
  if (daysRemaining < -slaSetting.criticalDays) return 'overdue'; // Quá hạn > criticalDays ngày
  if (daysRemaining < 0) return 'critical'; // Quá hạn nhưng chưa đến criticalDays
  if (daysRemaining <= slaSetting.warningDays) return 'warning'; // Còn <= warningDays ngày
  return 'normal';
}

/**
 * Lấy danh sách khách hàng cần follow-up (liên hệ định kỳ)
 */
export function getFollowUpAlerts(
  customers: Customer[],
  slaSettings: CustomerSlaSetting[]
): CustomerSlaAlert[] {
  // Simplified: only 1 SLA per type
  const followUpSla = slaSettings.find(s => s.slaType === 'follow-up' && s.isActive);
  
  if (!followUpSla) return [];

  const today = new Date();
  const alerts: CustomerSlaAlert[] = [];

  for (const customer of customers) {
    if (customer.isDeleted || customer.status === 'Ngừng Giao Dịch') continue;

    // Lấy ngày liên hệ cuối (dựa trên lastPurchaseDate hoặc updatedAt)
    const lastContactDate = customer.lastPurchaseDate 
      || customer.updatedAt 
      || customer.createdAt;
    
    if (!lastContactDate) continue;

    const lastContact = parseISO(lastContactDate);
    const daysSinceContact = differenceInDays(today, lastContact);
    const daysRemaining = followUpSla.targetDays - daysSinceContact;

    // Hiển thị alert khi còn <= warningDays ngày hoặc đã quá hạn
    if (daysRemaining <= followUpSla.warningDays) {
      alerts.push({
        systemId: customer.systemId,
        customer,
        slaType: 'follow-up',
        slaName: followUpSla.name,
        daysRemaining,
        alertLevel: calculateAlertLevel(daysRemaining, followUpSla),
        targetDate: format(
          new Date(lastContact.getTime() + followUpSla.targetDays * 24 * 60 * 60 * 1000),
          'yyyy-MM-dd'
        ),
        lastActivityDate: lastContactDate,
        ...(customer.accountManagerName ? { assignee: customer.accountManagerName } : {}),
      });
    }
  }

  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/**
 * Lấy danh sách khách hàng cần kích hoạt lại (không hoạt động lâu)
 */
export function getReEngagementAlerts(
  customers: Customer[],
  slaSettings: CustomerSlaSetting[]
): CustomerSlaAlert[] {
  // Simplified: only 1 SLA per type
  const reEngageSla = slaSettings.find(s => s.slaType === 're-engagement' && s.isActive);
  
  if (!reEngageSla) return [];

  const today = new Date();
  const alerts: CustomerSlaAlert[] = [];

  for (const customer of customers) {
    if (customer.isDeleted || customer.status === 'Ngừng Giao Dịch') continue;

    // Chỉ xét khách đã từng mua hàng
    if (!customer.lastPurchaseDate || !customer.totalOrders) continue;

    const lastPurchase = parseISO(customer.lastPurchaseDate);
    const daysSincePurchase = differenceInDays(today, lastPurchase);
    const daysRemaining = reEngageSla.targetDays - daysSincePurchase;

    // Hiển thị alert khi còn <= warningDays ngày hoặc đã quá hạn
    if (daysRemaining <= reEngageSla.warningDays) {
      alerts.push({
        systemId: customer.systemId,
        customer,
        slaType: 're-engagement',
        slaName: reEngageSla.name,
        daysRemaining,
        alertLevel: calculateAlertLevel(daysRemaining, reEngageSla),
        targetDate: format(
          new Date(lastPurchase.getTime() + reEngageSla.targetDays * 24 * 60 * 60 * 1000),
          'yyyy-MM-dd'
        ),
        lastActivityDate: customer.lastPurchaseDate,
        ...(customer.accountManagerName ? { assignee: customer.accountManagerName } : {}),
      });
    }
  }

  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/**
 * Lấy danh sách khách hàng có vấn đề công nợ
 */
export function getDebtAlerts(customers: Customer[]): DebtAlert[] {
  const alerts: DebtAlert[] = [];

  for (const customer of customers) {
    if (customer.isDeleted) continue;

    // Chỉ xét khách có công nợ
    const currentDebt = customer.currentDebt || 0;
    if (currentDebt <= 0) continue;

    // Tính số tiền quá hạn và ngày quá hạn
    let overdueAmount = 0;
    let maxDaysOverdue = 0;
    let oldestDueDate: string | undefined;

    if (customer.debtTransactions) {
      const today = new Date();
      for (const txn of customer.debtTransactions) {
        if (txn.isPaid) continue;
        
        const dueDate = parseISO(txn.dueDate);
        const daysOverdue = differenceInDays(today, dueDate);
        
        if (daysOverdue > 0) {
          overdueAmount += txn.remainingAmount || txn.amount;
          if (daysOverdue > maxDaysOverdue) {
            maxDaysOverdue = daysOverdue;
            oldestDueDate = txn.dueDate;
          }
        }
      }
    }

    // Lấy debtStatus từ customer hoặc tính toán
    const debtStatus = customer.debtStatus || 'Chưa đến hạn';

    // Chỉ hiển thị nếu có nợ quá hạn hoặc sắp đến hạn
    if (overdueAmount > 0 || debtStatus !== 'Chưa đến hạn') {
      alerts.push({
        systemId: customer.systemId,
        customer,
        totalDebt: currentDebt,
        overdueAmount,
        daysOverdue: maxDaysOverdue,
        debtStatus,
        ...(oldestDueDate ? { oldestDueDate } : {}),
      });
    }
  }

  return alerts.sort((a, b) => b.daysOverdue - a.daysOverdue);
}

/**
 * Lấy danh sách khách hàng có rủi ro churn cao
 */
export function getHealthAlerts(customers: Customer[]): CustomerHealthAlert[] {
  const today = new Date();
  const alerts: CustomerHealthAlert[] = [];

  for (const customer of customers) {
    if (customer.isDeleted || customer.status === 'Ngừng Giao Dịch') continue;

    const healthScore = customer.healthScore || 50;
    const churnRisk = customer.churnRisk || 'low';

    // Chỉ hiển thị nếu có rủi ro medium hoặc high, hoặc health score < 50
    if (churnRisk !== 'low' || healthScore < 50) {
      const daysSinceLastPurchase = customer.lastPurchaseDate
        ? differenceInDays(today, parseISO(customer.lastPurchaseDate))
        : 999;

      alerts.push({
        systemId: customer.systemId,
        customer,
        healthScore,
        churnRisk,
        ...(customer.segment ? { segment: customer.segment } : {}),
        daysSinceLastPurchase,
        totalOrders: customer.totalOrders || 0,
        totalSpent: customer.totalSpent || 0,
      });
    }
  }

  return alerts.sort((a, b) => a.healthScore - b.healthScore);
}

/**
 * Tính toán summary cho report
 */
export function calculateReportSummary(
  customers: Customer[],
  slaSettings: CustomerSlaSetting[]
): ReportSummary {
  const followUpAlerts = getFollowUpAlerts(customers, slaSettings);
  const reEngagementAlerts = getReEngagementAlerts(customers, slaSettings);
  const debtAlerts = getDebtAlerts(customers);
  const healthAlerts = getHealthAlerts(customers);

  const criticalCount = 
    followUpAlerts.filter(a => a.alertLevel === 'critical' || a.alertLevel === 'overdue').length +
    reEngagementAlerts.filter(a => a.alertLevel === 'critical' || a.alertLevel === 'overdue').length +
    debtAlerts.filter(a => a.daysOverdue > 15).length +
    healthAlerts.filter(a => a.churnRisk === 'high').length;

  return {
    totalCustomers: customers.filter(c => !c.isDeleted).length,
    followUpAlerts: followUpAlerts.length,
    reEngagementAlerts: reEngagementAlerts.length,
    debtAlerts: debtAlerts.length,
    healthAlerts: healthAlerts.length,
    criticalCount,
  };
}

/**
 * Format số ngày còn lại thành text
 */
export function formatDaysRemaining(days: number): string {
  if (days < 0) return `Quá ${Math.abs(days)} ngày`;
  if (days === 0) return 'Hôm nay';
  return `Còn ${days} ngày`;
}

/**
 * Get color class based on alert level
 */
export function getAlertLevelColor(level: SlaAlertLevel): string {
  switch (level) {
    case 'overdue': return 'text-red-600 bg-red-50';
    case 'critical': return 'text-orange-600 bg-orange-50';
    case 'warning': return 'text-yellow-600 bg-yellow-50';
    default: return 'text-green-600 bg-green-50';
  }
}

/**
 * Get badge variant based on alert level
 */
export function getAlertBadgeVariant(level: SlaAlertLevel): 'destructive' | 'warning' | 'default' | 'secondary' {
  switch (level) {
    case 'overdue': return 'destructive';
    case 'critical': return 'warning';
    case 'warning': return 'default';
    default: return 'secondary';
  }
}

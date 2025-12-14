import { differenceInDays, parseISO, formatISO } from 'date-fns';
import type { Customer } from '../types';
import type { CustomerSlaSetting, CustomerSlaType } from '../../settings/customers/types';
import type { CustomerSlaAlert, CustomerSlaIndex, CustomerHealthAlert, DebtAlert, ReportSummary } from './types';
import { calculateChurnRisk, calculateHealthScore } from '../intelligence-utils';

const MIN_DATE = '1970-01-01T00:00:00Z';

type AlertLevel = CustomerSlaAlert['alertLevel'];

function calculateAlertLevel(daysRemaining: number, slaSetting: CustomerSlaSetting): AlertLevel {
  // daysRemaining < 0 means overdue
  // criticalDays = số ngày quá hạn để coi là nghiêm trọng
  // warningDays = số ngày TRƯỚC target để bắt đầu cảnh báo
  
  if (daysRemaining < -slaSetting.criticalDays) return 'overdue'; // Quá hạn > criticalDays ngày
  if (daysRemaining < 0) return 'critical'; // Quá hạn nhưng chưa đến criticalDays
  if (daysRemaining <= slaSetting.warningDays) return 'warning'; // Còn <= warningDays ngày
  return 'normal';
}

function addDays(base: Date, days: number) {
  return new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
}

function resolveBaselineDate(customer: Customer, slaType: CustomerSlaType) {
  switch (slaType) {
    case 'follow-up':
      return customer.lastContactDate || customer.lastPurchaseDate || customer.updatedAt || customer.createdAt || MIN_DATE;
    case 're-engagement':
      return customer.lastPurchaseDate || customer.updatedAt || customer.createdAt || MIN_DATE;
    case 'debt-payment':
      return customer.oldestDebtDueDate || customer.updatedAt || customer.createdAt || MIN_DATE;
  }
}

function getAssignee(customer: Customer, slaType: CustomerSlaType) {
  if (customer.accountManagerName) return customer.accountManagerName;
  if (customer.accountManagerId) return customer.accountManagerId;
  if (slaType === 'debt-payment') return 'Kế toán công nợ';
  return 'Chưa phân công';
}

function getLastActivity(customer: Customer, slaType: CustomerSlaType) {
  if (slaType === 'debt-payment') {
    return customer.oldestDebtDueDate || customer.updatedAt || customer.createdAt || MIN_DATE;
  }
  if (slaType === 'follow-up') {
    return customer.lastContactDate || customer.lastPurchaseDate || customer.updatedAt || customer.createdAt || MIN_DATE;
  }
  return customer.lastPurchaseDate || customer.updatedAt || customer.createdAt || MIN_DATE;
}

function evaluateSla(customers: Customer[], slaSettings: CustomerSlaSetting[], slaType: CustomerSlaType) {
  const setting = slaSettings.find(s => s.slaType === slaType && s.isActive);
  if (!setting) return [] as CustomerSlaAlert[];

  const today = new Date();
  const alerts: CustomerSlaAlert[] = [];

  for (const customer of customers) {
    if (customer.isDeleted || customer.status === 'Ngừng Giao Dịch') continue;

    const baselineISO = resolveBaselineDate(customer, slaType);
    const baseline = parseISO(baselineISO);
    const daysSinceBaseline = differenceInDays(today, baseline);
    const daysRemaining = setting.targetDays - daysSinceBaseline;

    if (slaType === 're-engagement' && !customer.totalOrders) continue;
    if (slaType === 'debt-payment' && !customer.currentDebt) continue;

    // Hiển thị alert khi:
    // - Còn <= warningDays ngày (sắp đến hạn)
    // - Hoặc đã quá hạn (daysRemaining < 0)
    if (daysRemaining <= setting.warningDays) {
      alerts.push({
        systemId: customer.systemId,
        customer,
        slaType,
        slaName: setting.name,
        daysRemaining,
        alertLevel: calculateAlertLevel(daysRemaining, setting),
        targetDate: formatISO(addDays(baseline, setting.targetDays), { representation: 'date' }),
        lastActivityDate: baselineISO,
        assignee: getAssignee(customer, slaType),
      });
    }
  }

  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

function evaluateDebts(customers: Customer[]): DebtAlert[] {
  const alerts: DebtAlert[] = [];
  const today = new Date();

  for (const customer of customers) {
    if (customer.isDeleted) continue;
    const currentDebt = customer.currentDebt || 0;
    if (currentDebt <= 0) continue;

    let overdueAmount = 0;
    let maxDaysOverdue = 0;
    let oldestDueDate: string | undefined;

    if (customer.debtTransactions) {
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

    // ✅ Tính debtStatus realtime thay vì lấy từ dữ liệu cũ
    let debtStatus: NonNullable<Customer['debtStatus']>;
    if (maxDaysOverdue > 30) {
      debtStatus = 'Quá hạn > 30 ngày';
    } else if (maxDaysOverdue > 15) {
      debtStatus = 'Quá hạn 16-30 ngày';
    } else if (maxDaysOverdue > 7) {
      debtStatus = 'Quá hạn 8-15 ngày';
    } else if (maxDaysOverdue > 0) {
      debtStatus = 'Quá hạn 1-7 ngày';
    } else if (oldestDueDate) {
      const daysUntilDue = differenceInDays(parseISO(oldestDueDate), today);
      if (daysUntilDue <= 0) {
        debtStatus = 'Đến hạn hôm nay';
      } else if (daysUntilDue <= 3) {
        debtStatus = 'Sắp đến hạn';
      } else {
        debtStatus = 'Chưa đến hạn';
      }
    } else {
      debtStatus = customer.debtStatus || 'Chưa đến hạn';
    }
    
    // ✅ Chỉ hiển thị nếu thực sự có nợ quá hạn (overdueAmount > 0)
    if (overdueAmount > 0) {
      const debtAlert: DebtAlert = {
        systemId: customer.systemId,
        customer,
        totalDebt: currentDebt,
        overdueAmount,
        daysOverdue: maxDaysOverdue,
        debtStatus,
      };
      if (oldestDueDate !== undefined) {
        debtAlert.oldestDueDate = oldestDueDate;
      }
      alerts.push(debtAlert);
    }
  }

  return alerts.sort((a, b) => b.daysOverdue - a.daysOverdue);
}

function evaluateHealth(customers: Customer[]): CustomerHealthAlert[] {
  const today = new Date();
  const alerts: CustomerHealthAlert[] = [];

  for (const customer of customers) {
    if (customer.isDeleted || customer.status === 'Ngừng Giao Dịch') continue;

    // ✅ Tính realtime thay vì lấy từ dữ liệu cũ
    const healthScore = calculateHealthScore(customer);
    const churnRiskResult = calculateChurnRisk(customer);
    const churnRisk = churnRiskResult.risk;

    // Chỉ hiển thị nếu có rủi ro medium/high hoặc health score thấp
    if (churnRisk !== 'low' || healthScore < 50) {
      const daysSinceLastPurchase = customer.lastPurchaseDate
        ? differenceInDays(today, parseISO(customer.lastPurchaseDate))
        : 999;

      const healthAlert: CustomerHealthAlert = {
        systemId: customer.systemId,
        customer,
        healthScore,
        churnRisk,
        daysSinceLastPurchase,
        totalOrders: customer.totalOrders || 0,
        totalSpent: customer.totalSpent || 0,
      };
      if (customer.segment !== undefined) {
        healthAlert.segment = customer.segment;
      }
      alerts.push(healthAlert);
    }
  }

  return alerts.sort((a, b) => a.healthScore - b.healthScore);
}

export function buildSlaIndex(customers: Customer[], slaSettings: CustomerSlaSetting[]): CustomerSlaIndex {
  const followUpAlerts = evaluateSla(customers, slaSettings, 'follow-up');
  const reEngagementAlerts = evaluateSla(customers, slaSettings, 're-engagement');
  const debtAlerts = evaluateDebts(customers);
  const healthAlerts = evaluateHealth(customers);

  const entries: CustomerSlaIndex['entries'] = {};

  for (const alert of followUpAlerts) {
    entries[alert.systemId] = entries[alert.systemId] || { customer: alert.customer, alerts: [] };
    entries[alert.systemId].alerts.push(alert);
  }
  for (const alert of reEngagementAlerts) {
    entries[alert.systemId] = entries[alert.systemId] || { customer: alert.customer, alerts: [] };
    entries[alert.systemId].alerts.push(alert);
  }
  for (const alert of debtAlerts) {
    entries[alert.systemId] = entries[alert.systemId] || { customer: alert.customer, alerts: [] };
    entries[alert.systemId].debtAlert = alert;
  }
  for (const alert of healthAlerts) {
    entries[alert.systemId] = entries[alert.systemId] || { customer: alert.customer, alerts: [] };
    entries[alert.systemId].healthAlert = alert;
  }

  return {
    entries,
    followUpAlerts,
    reEngagementAlerts,
    debtAlerts,
    healthAlerts,
  };
}

export function summarizeIndex(index: CustomerSlaIndex): ReportSummary {
  // Count unique customers with critical alerts
  const criticalCustomerIds = new Set<string>();
  
  index.followUpAlerts
    .filter(a => a.alertLevel === 'critical' || a.alertLevel === 'overdue')
    .forEach(a => criticalCustomerIds.add(a.systemId));
  
  index.reEngagementAlerts
    .filter(a => a.alertLevel === 'critical' || a.alertLevel === 'overdue')
    .forEach(a => criticalCustomerIds.add(a.systemId));
  
  index.debtAlerts
    .filter(a => a.daysOverdue > 15)
    .forEach(a => criticalCustomerIds.add(a.systemId));
  
  index.healthAlerts
    .filter(a => a.churnRisk === 'high')
    .forEach(a => criticalCustomerIds.add(a.systemId));
  
  const criticalCount = criticalCustomerIds.size;
  const totalCustomers = Object.keys(index.entries).length;

  return {
    totalCustomers,
    followUpAlerts: index.followUpAlerts.length,
    reEngagementAlerts: index.reEngagementAlerts.length,
    debtAlerts: index.debtAlerts.length,
    healthAlerts: index.healthAlerts.length,
    criticalCount,
  };
}

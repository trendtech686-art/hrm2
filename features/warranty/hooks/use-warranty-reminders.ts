/**
 * Warranty Reminders Hook
 * Auto-scheduling and reminder management for warranty tickets
 * Pattern copied from Complaints system
 */

import { useState, useCallback } from 'react';
import { useWarrantyStore } from '../store';
import type { WarrantyTicket } from '../types';
import { notifyWarrantyReminder } from '../notification-utils';
import { useWarrantyReminderTemplates, DEFAULT_WARRANTY_REMINDER_TEMPLATES } from '../../../hooks/use-reminder-settings';

export interface ReminderTemplate {
  id: string;
  name: string;
  message: string;
  isDefault?: boolean;
}

// Re-export default templates for backward compatibility
export const DEFAULT_REMINDER_TEMPLATES = DEFAULT_WARRANTY_REMINDER_TEMPLATES;

export interface WarrantyReminder {
  id: string;
  ticketSystemId: string;
  ticketId: string;
  templateId: string;
  message: string;
  assignedTo: string; // Employee ID
  createdBy: string;
  createdAt: Date;
  status: 'pending' | 'sent' | 'dismissed';
  scheduledFor?: Date;
}

/**
 * Load reminder templates from hook (deprecated - use useWarrantyReminderTemplates directly)
 * @deprecated Use useWarrantyReminderTemplates hook instead
 */
export function loadReminderTemplates(): ReminderTemplate[] {
  // Returns default templates for backward compatibility
  // New code should use useWarrantyReminderTemplates hook
  return DEFAULT_REMINDER_TEMPLATES;
}

/**
 * Save custom reminder templates (deprecated - use useWarrantyReminderTemplates hook)
 * @deprecated Use useWarrantyReminderTemplates hook instead
 */
export function saveReminderTemplates(_templates: ReminderTemplate[]): void {
  console.warn('saveReminderTemplates is deprecated. Use useWarrantyReminderTemplates hook instead.');
}

/**
 * Format reminder message with ticket data
 */
export function formatReminderMessage(template: string, ticket: WarrantyTicket): string {
  return template
    .replace(/{ticketId}/g, ticket.id)
    .replace(/{customerName}/g, ticket.customerName)
    .replace(/{customerPhone}/g, ticket.customerPhone)
    .replace(/{trackingCode}/g, ticket.trackingCode || 'N/A');
}

/**
 * Hook for warranty reminders management
 */
export function useWarrantyReminders() {
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<WarrantyTicket | null>(null);
  const [templates] = useWarrantyReminderTemplates();

  /**
   * Open reminder modal for a ticket
   */
  const openReminderModal = useCallback((ticket: WarrantyTicket) => {
    setSelectedTicket(ticket);
    setIsReminderModalOpen(true);
  }, []);

  /**
   * Close reminder modal
   */
  const closeReminderModal = useCallback(() => {
    setIsReminderModalOpen(false);
    setSelectedTicket(null);
  }, []);

  /**
   * Send reminder for a ticket
   */
  const sendReminder = useCallback(async (
    ticket: WarrantyTicket,
    templateId: string,
    customMessage?: string,
    assignedTo?: string,
  ): Promise<boolean> => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      const message = customMessage || formatReminderMessage(template.message, ticket);

      const _reminder: WarrantyReminder = {
        id: `reminder_${Date.now()}`,
        ticketSystemId: ticket.systemId,
        ticketId: ticket.id,
        templateId,
        message,
        assignedTo: assignedTo || ticket.employeeSystemId || 'unassigned',
        createdBy: 'current_user', // TODO: Get from auth context
        createdAt: new Date(),
        status: 'sent',
      };

      // Store reminder in ticket history
      const { addHistory } = useWarrantyStore.getState();
      addHistory(ticket.systemId, 'Gửi nhắc nhở', 'current_user', message);

      // Send notification
      notifyWarrantyReminder(ticket.id, message);

      return true;
    } catch (error) {
      console.error('Failed to send reminder:', error);
      return false;
    }
  }, [templates]);

  /**
   * Schedule automatic reminder for overdue tickets
   */
  const scheduleAutoReminder = useCallback((ticket: WarrantyTicket): void => {
    // This would be called by a background job
    // For now, it's a placeholder for future implementation
    console.log('Auto reminder scheduled for:', ticket.id);
  }, []);

  /**
   * Get pending reminders for a ticket
   */
  const getTicketReminders = useCallback((_ticketSystemId: string): WarrantyReminder[] => {
    // TODO: Load from store or API
    return [];
  }, []);

  /**
   * Dismiss a reminder
   */
  const dismissReminder = useCallback((reminderId: string): void => {
    // TODO: Update reminder status
    console.log('Reminder dismissed:', reminderId);
  }, []);

  return {
    // Modal state
    isReminderModalOpen,
    openReminderModal,
    closeReminderModal,
    selectedTicket,

    // Templates
    templates,

    // Actions
    sendReminder,
    scheduleAutoReminder,
    getTicketReminders,
    dismissReminder,

    // Utils
    formatReminderMessage,
  };
}

/**
 * Warranty Processing Logic
 * Gom toàn bộ tính toán/payment state cho module warranty
 */

import type { WarrantyTicket } from '../../types';
import type { Payment } from '../../../payments/types';
import type { Receipt } from '../../../receipts/types';

// ============================================================
// TYPES
// ============================================================

export interface WarrantyProcessingState {
	ticket: WarrantyTicket | null;
	payments: Payment[];
	receipts: Receipt[];
	totalPayment: number;
	warrantyPayments: Payment[];
	warrantyReceipts: Receipt[];
	totalPaid: number;
	remainingAmount: number;
	hasTransactions: boolean;
	allTransactionsCancelled: boolean;
	shouldHideCard: boolean;
	canShowActionButtons: boolean;
	canShowPaymentButton: boolean;
	canShowReceiptButton: boolean;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getWarrantyPayments(payments: Payment[], warrantySystemId: string): Payment[] {
	return payments
		.filter(p => p.linkedWarrantySystemId === warrantySystemId && p.status !== 'cancelled')
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getWarrantyReceipts(receipts: Receipt[], warrantySystemId: string): Receipt[] {
	return receipts
		.filter(r => (r as any).linkedWarrantySystemId === warrantySystemId && r.status !== 'cancelled')
		.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function calculateTotalPaid(
	payments: Payment[],
	receipts: Receipt[],
): { totalPayments: number; totalReceipts: number } {
	const totalPayments = payments
		.filter(p => p.status !== 'cancelled')
		.reduce((sum, p) => sum + p.amount, 0);

	const totalReceipts = receipts
		.filter(r => r.status !== 'cancelled')
		.reduce((sum, r) => sum + r.amount, 0);

	return { totalPayments, totalReceipts };
}

export function hasAnyTransactions(payments: Payment[], receipts: Receipt[]): boolean {
	return payments.length > 0 || receipts.length > 0;
}

export function areAllTransactionsCancelled(payments: Payment[], receipts: Receipt[]): boolean {
	const allTransactions = [...payments, ...receipts];
	return allTransactions.length > 0 && allTransactions.every(t => t.status === 'cancelled');
}

// ============================================================
// MAIN LOGIC - ĐIỀU KIỆN HIỂN THỊ
// ============================================================

export function shouldHideCard(ticket: WarrantyTicket | null, hasTransactions: boolean): boolean {
	if (!ticket) return true;

	return !hasTransactions &&
		(ticket.status === 'incomplete' || ticket.status === 'pending' || !!ticket.cancelledAt);
}

export function canShowActionButtons(
	ticket: WarrantyTicket | null,
	totalPayment: number,
	remainingAmount: number,
	hasTransactions: boolean,
	allTransactionsCancelled: boolean,
): boolean {
	if (!ticket) return false;

	const notCancelled = !ticket.cancelledAt;
	const hasPaymentNeeded = totalPayment !== 0;
	const hasRemainingAmount = remainingAmount > 0;

	const isInProcessingStage =
		ticket.status === 'processed' ||
		ticket.status === 'returned' ||
		ticket.status === 'completed';

	const hasExistingTransactions = hasTransactions;

	return (
		notCancelled &&
		hasPaymentNeeded &&
		hasRemainingAmount &&
		(isInProcessingStage || hasExistingTransactions)
	);
}

export function canShowPaymentButton(canShowActions: boolean, totalPayment: number): boolean {
	return canShowActions && totalPayment > 0;
}

export function canShowReceiptButton(canShowActions: boolean, totalPayment: number): boolean {
	return canShowActions && totalPayment < 0;
}

// ============================================================
// ALL-IN-ONE CALCULATOR
// ============================================================

export function calculateWarrantyProcessingState(
	ticket: WarrantyTicket | null,
	payments: Payment[],
	receipts: Receipt[],
	totalPayment: number,
): WarrantyProcessingState {
	if (!ticket) {
		return {
			ticket: null,
			payments: [],
			receipts: [],
			totalPayment: 0,
			warrantyPayments: [],
			warrantyReceipts: [],
			totalPaid: 0,
			remainingAmount: 0,
			hasTransactions: false,
			allTransactionsCancelled: false,
			shouldHideCard: true,
			canShowActionButtons: false,
			canShowPaymentButton: false,
			canShowReceiptButton: false,
		};
	}

	const warrantyPayments = getWarrantyPayments(payments, ticket.systemId);
	const warrantyReceipts = getWarrantyReceipts(receipts, ticket.systemId);

	const { totalPayments, totalReceipts } = calculateTotalPaid(warrantyPayments, warrantyReceipts);

	let remainingAmount = 0;
	if (totalPayment > 0) {
		remainingAmount = totalPayment - totalPayments;
	} else if (totalPayment < 0) {
		remainingAmount = Math.abs(totalPayment) - totalReceipts;
	}

	const totalPaid = totalReceipts - totalPayments;
	const hasTransactions = hasAnyTransactions(warrantyPayments, warrantyReceipts);
	const allTransactionsCancelled = areAllTransactionsCancelled(warrantyPayments, warrantyReceipts);

	const hideCard = shouldHideCard(ticket, hasTransactions);
	const showActionButtons = canShowActionButtons(
		ticket,
		totalPayment,
		remainingAmount,
		hasTransactions,
		allTransactionsCancelled,
	);
	const showPaymentButton = canShowPaymentButton(showActionButtons, totalPayment);
	const showReceiptButton = canShowReceiptButton(showActionButtons, totalPayment);

	return {
		ticket,
		payments,
		receipts,
		totalPayment,
		warrantyPayments,
		warrantyReceipts,
		totalPaid,
		remainingAmount,
		hasTransactions,
		allTransactionsCancelled,
		shouldHideCard: hideCard,
		canShowActionButtons: showActionButtons,
		canShowPaymentButton: showPaymentButton,
		canShowReceiptButton: showReceiptButton,
	};
}

// ============================================================
// DEBUG HELPERS
// ============================================================

export function debugWarrantyProcessing(state: WarrantyProcessingState): void {
	console.group('[WARRANTY PROCESSING] Debug State');

	console.log('Input:', {
		ticketId: state.ticket?.id,
		ticketStatus: state.ticket?.status,
		cancelledAt: state.ticket?.cancelledAt,
		totalPayment: state.totalPayment,
	});

	console.log('Calculations:', {
		warrantyPayments: state.warrantyPayments.length,
		warrantyReceipts: state.warrantyReceipts.length,
		totalPaid: state.totalPaid,
		remainingAmount: state.remainingAmount,
		hasTransactions: state.hasTransactions,
		allCancelled: state.allTransactionsCancelled,
	});

	console.log('Display Flags:', {
		shouldHideCard: state.shouldHideCard,
		canShowActionButtons: state.canShowActionButtons,
		canShowPaymentButton: state.canShowPaymentButton,
		canShowReceiptButton: state.canShowReceiptButton,
	});

	console.groupEnd();
}
import type { WarrantyTicket } from './types.ts';
import { asSystemId, asBusinessId } from '../../lib/id-types.ts';
import { buildSeedAuditFields } from '@/lib/seed-audit';

/**
 * Initial Warranty Data
 * Empty array - data will be persisted in localStorage by createCrudStore
 * 
 * Example of properly typed warranty record:
 * {
 *   systemId: asSystemId('WARRANTY00000001'),
 *   id: asBusinessId('WR001'),
 *   branchSystemId: asSystemId('BRANCH00000001'),
 *   employeeSystemId: asSystemId('NV00000001'),
 *   customerSystemId: asSystemId('CUSTOMER00000001'),
 *   linkedOrderSystemId: asSystemId('ORDER00000123'),
 *   products: [
 *     {
 *       systemId: asSystemId('WARPROD00000001'),
 *       productSystemId: asSystemId('PRODUCT00000045'),
 *       sku: asBusinessId('SKU001'),
 *       ...
 *     }
 *   ],
 *   ...
 * }
 */
const seedCustomer = {
	systemId: asSystemId('CUST000001'),
	name: 'Công ty Cổ phần Bất động sản Hưng Thịnh',
	phone: '0901112233',
	address: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
};

const seedBranch = {
	systemId: asSystemId('BRANCH000003'),
	name: 'Chi nhánh Trung tâm',
};

const warrantyOwner = {
	systemId: asSystemId('EMP000002'),
	name: 'Trần Thị Bình',
};

export const warrantyInitialData: WarrantyTicket[] = [
	{
		systemId: asSystemId('WARRANTY000001'),
		id: asBusinessId('BH000001'),
		branchSystemId: seedBranch.systemId,
		branchName: seedBranch.name,
		employeeSystemId: warrantyOwner.systemId,
		employeeName: warrantyOwner.name,
		customerSystemId: seedCustomer.systemId,
		customerName: seedCustomer.name,
		customerPhone: seedCustomer.phone,
		customerAddress: seedCustomer.address,
		trackingCode: 'GHN-WAR-0001',
		publicTrackingCode: 'wh8ut4nz9p',
		shippingFee: 45000,
		referenceUrl: 'https://docs.google.com/spreadsheets/d/war-0001',
		linkedOrderSystemId: asSystemId('ORDER000001'),
		receivedImages: [
			'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=640&q=80',
		],
		products: [
			{
				systemId: asSystemId('WARPROD000001'),
				productSystemId: asSystemId('SP000001'),
				sku: asBusinessId('SP000001'),
				productName: 'Laptop Dell Inspiron 15',
				quantity: 1,
				unitPrice: 15000000,
				issueDescription: 'Máy tự tắt khi sử dụng hơn 30 phút',
				resolution: 'replace',
				deductionAmount: 0,
				productImages: [
					'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
				],
				notes: 'Cần sao lưu dữ liệu trước khi chuyển hãng',
			},
			{
				systemId: asSystemId('WARPROD000002'),
				productSystemId: asSystemId('SP000002'),
				sku: asBusinessId('SP000002'),
				productName: 'Chuột Logitech MX Master 3',
				quantity: 1,
				unitPrice: 2000000,
				issueDescription: 'Con lăn bị kẹt định kỳ',
				resolution: 'return',
				productImages: [
					'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=400&q=80',
				],
				notes: 'Đã vệ sinh nhưng lỗi tái diễn',
			},
		],
		processedImages: [
			'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=640&q=80',
		],
		status: 'processed',
		settlementStatus: 'pending',
		stockDeducted: false,
		processingStartedAt: '2025-11-13T01:30:00Z',
		processedAt: '2025-11-13T09:00:00Z',
		notes: 'Đợi xác nhận của khách về phương án đổi mới laptop.',
		summary: {
			totalProducts: 2,
			totalReplaced: 1,
			totalReturned: 1,
			totalDeduction: 0,
			totalOutOfStock: 0,
			totalSettlement: 0,
		},
		history: [
			{
				systemId: asSystemId('WARHIST000001'),
				action: 'create',
				actionLabel: 'Tạo phiếu bảo hành',
				performedBy: warrantyOwner.name,
				performedBySystemId: warrantyOwner.systemId,
				performedAt: '2025-11-12T09:00:00Z',
				note: 'Tiếp nhận phiếu bảo hành từ khách Hưng Thịnh.',
				linkedOrderSystemId: asSystemId('ORDER000001'),
			},
			{
				systemId: asSystemId('WARHIST000002'),
				action: 'update_status',
				actionLabel: 'Bắt đầu xử lý',
				performedBy: warrantyOwner.name,
				performedBySystemId: warrantyOwner.systemId,
				performedAt: '2025-11-13T01:30:00Z',
				note: 'Chuyển trạng thái sang Đang xử lý và gửi thiết bị sang ASUS.',
			},
			{
				systemId: asSystemId('WARHIST000003'),
				action: 'update_status',
				actionLabel: 'Hoàn tất xử lý',
				performedBy: warrantyOwner.name,
				performedBySystemId: warrantyOwner.systemId,
				performedAt: '2025-11-13T09:00:00Z',
				note: 'Laptop sẽ đổi máy mới, chuột vệ sinh và trả lại.',
			},
		],
		comments: [],
		subtasks: [],
		createdBy: warrantyOwner.name,
		createdBySystemId: warrantyOwner.systemId,
		createdAt: '2025-11-12T09:00:00Z',
		updatedAt: '2025-11-13T09:00:00Z',
		updatedBySystemId: warrantyOwner.systemId,
	},
	{
		systemId: asSystemId('WARRANTY000002'),
		id: asBusinessId('BH000002'),
		branchSystemId: seedBranch.systemId,
		branchName: seedBranch.name,
		employeeSystemId: warrantyOwner.systemId,
		employeeName: warrantyOwner.name,
		customerSystemId: seedCustomer.systemId,
		customerName: seedCustomer.name,
		customerPhone: seedCustomer.phone,
		customerAddress: seedCustomer.address,
		trackingCode: 'GHTK-WAR-0452',
		publicTrackingCode: 'r9bth1e6md',
		shippingFee: 30000,
		linkedOrderSystemId: asSystemId('ORDER000005'),
		receivedImages: [
			'https://images.unsplash.com/photo-1581291518823-11e99804a128?auto=format&fit=crop&w=640&q=80',
		],
		products: [
			{
				systemId: asSystemId('WARPROD000003'),
				productSystemId: asSystemId('SP000008'),
				sku: asBusinessId('SP000008'),
				productName: 'Bàn phím cơ Keychron K2',
				quantity: 1,
				unitPrice: 2500000,
				issueDescription: 'Phím space bị kẹt sau 1 tuần sử dụng',
				resolution: 'replace',
				productImages: [
					'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80',
				],
			},
			{
				systemId: asSystemId('WARPROD000004'),
				productSystemId: asSystemId('SP000010'),
				sku: asBusinessId('SP000010'),
				productName: 'Switch Gateron Yellow',
				quantity: 6,
				unitPrice: 5000,
				issueDescription: 'Một số switch không nhận tín hiệu sau khi lắp',
				resolution: 'deduct',
				deductionAmount: 60000,
				productImages: [],
				notes: 'Khách đề nghị hoàn tiền cho số switch lỗi',
			},
		],
		status: 'pending',
		settlementStatus: 'pending',
		stockDeducted: false,
		notes: 'Đang chờ kỹ thuật kiểm tra bàn phím.',
		summary: {
			totalProducts: 2,
			totalReplaced: 0,
			totalReturned: 0,
			totalDeduction: 60000,
			totalOutOfStock: 0,
			totalSettlement: 60000,
		},
		history: [
			{
				systemId: asSystemId('WARHIST000004'),
				action: 'create',
				actionLabel: 'Tạo phiếu bảo hành',
				performedBy: warrantyOwner.name,
				performedBySystemId: warrantyOwner.systemId,
				performedAt: '2025-11-18T03:00:00Z',
				note: 'Khách gửi bàn phím Keychron cần bảo hành.',
				linkedOrderSystemId: asSystemId('ORDER000005'),
			},
		],
		comments: [],
		subtasks: [],
		createdBy: warrantyOwner.name,
		createdBySystemId: warrantyOwner.systemId,
		createdAt: '2025-11-18T03:00:00Z',
		updatedAt: '2025-11-18T03:00:00Z',
		updatedBySystemId: warrantyOwner.systemId,
	},
];

// Template metadata snippet used when inserting new warranty tickets via seed scripts.
export const WARRANTY_SEED_AUDIT_TEMPLATE = buildSeedAuditFields({ createdAt: '2024-02-01T00:00:00Z' });

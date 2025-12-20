import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '../../lib/id-types';
import type { CostAdjustment, CostAdjustmentItem, CostAdjustmentType, CostAdjustmentStatus } from './types';
import { useProductStore } from '../products/store';
import type { Product } from '../products/types';

const PREFIX = 'DCGV'; // Điều chỉnh giá vốn
const SEED_AUTHOR = asSystemId('EMP000001');

// Helper function to create sample data
const createSampleData = (): CostAdjustment[] => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return [
    // Draft - chưa xác nhận
    {
      systemId: asSystemId('COST_ADJ000001'),
      id: asBusinessId('DCGV000001') as BusinessId,
      type: 'manual',
      status: 'draft',
      items: [
        {
          productSystemId: asSystemId('PRODUCT000001'),
          productId: 'SP000001',
          productName: 'Laptop Dell Inspiron 15',
          productImage: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=600&q=80',
          oldCostPrice: 12000000,
          newCostPrice: 12500000,
          adjustmentAmount: 500000,
          adjustmentPercent: 4.17,
          reason: 'Giá nhập tăng từ nhà cung cấp',
        },
        {
          productSystemId: asSystemId('PRODUCT000002'),
          productId: 'SP000002',
          productName: 'Chuột Logitech MX Master 3',
          productImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80',
          oldCostPrice: 1500000,
          newCostPrice: 1600000,
          adjustmentAmount: 100000,
          adjustmentPercent: 6.67,
          reason: 'Cập nhật theo giá thị trường',
        },
      ],
      note: 'Điều chỉnh giá vốn theo giá nhập mới từ NCC Dell',
      reason: 'Thay đổi giá từ nhà cung cấp',
      referenceCode: 'PN000015',
      createdDate: oneWeekAgo.toISOString(),
      createdBySystemId: SEED_AUTHOR,
      createdByName: 'Nguyễn Văn A',
      createdAt: oneWeekAgo.toISOString(),
      updatedAt: oneWeekAgo.toISOString(),
      createdBy: SEED_AUTHOR,
      updatedBy: SEED_AUTHOR,
    },
    // Draft - batch điều chỉnh nhiều sản phẩm
    {
      systemId: asSystemId('COST_ADJ000002'),
      id: asBusinessId('DCGV000002') as BusinessId,
      type: 'batch',
      status: 'draft',
      items: [
        {
          productSystemId: asSystemId('PRODUCT000003'),
          productId: 'SP000003',
          productName: 'Điện thoại iPhone 15 Pro',
          productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
          oldCostPrice: 25000000,
          newCostPrice: 24000000,
          adjustmentAmount: -1000000,
          adjustmentPercent: -4,
          reason: 'Giảm giá nhập từ Apple',
        },
        {
          productSystemId: asSystemId('PRODUCT000004'),
          productId: 'SP000004',
          productName: 'Tai nghe AirPods Pro',
          productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
          oldCostPrice: 5000000,
          newCostPrice: 4800000,
          adjustmentAmount: -200000,
          adjustmentPercent: -4,
          reason: 'Giảm giá theo chính sách mới',
        },
        {
          productSystemId: asSystemId('PRODUCT000005'),
          productId: 'SP000005',
          productName: 'Bàn phím cơ Keychron K8',
          productImage: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=600&q=80',
          oldCostPrice: 2000000,
          newCostPrice: 1900000,
          adjustmentAmount: -100000,
          adjustmentPercent: -5,
          reason: 'Điều chỉnh theo lô hàng mới',
        },
      ],
      note: 'Điều chỉnh hàng loạt theo chương trình giảm giá Q4/2024',
      reason: 'Chương trình khuyến mãi từ nhà cung cấp',
      createdDate: now.toISOString(),
      createdBySystemId: SEED_AUTHOR,
      createdByName: 'Nguyễn Văn A',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      createdBy: SEED_AUTHOR,
      updatedBy: SEED_AUTHOR,
    },
    // Confirmed - đã xác nhận
    {
      systemId: asSystemId('COST_ADJ000003'),
      id: asBusinessId('DCGV000003') as BusinessId,
      type: 'import',
      status: 'confirmed',
      items: [
        {
          productSystemId: asSystemId('PRODUCT000006'),
          productId: 'SP000006',
          productName: 'Màn hình LG UltraWide 34"',
          productImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
          oldCostPrice: 8000000,
          newCostPrice: 8500000,
          adjustmentAmount: 500000,
          adjustmentPercent: 6.25,
          reason: 'Cập nhật từ đơn nhập hàng',
        },
      ],
      note: 'Tự động điều chỉnh từ đơn nhập hàng PN000012',
      reason: 'Đơn nhập hàng mới',
      referenceCode: 'PN000012',
      createdDate: twoWeeksAgo.toISOString(),
      createdBySystemId: SEED_AUTHOR,
      createdByName: 'Nguyễn Văn A',
      confirmedDate: oneWeekAgo.toISOString(),
      confirmedBySystemId: asSystemId('EMP000002'),
      confirmedByName: 'Trần Thị B',
      createdAt: twoWeeksAgo.toISOString(),
      updatedAt: oneWeekAgo.toISOString(),
      createdBy: SEED_AUTHOR,
      updatedBy: asSystemId('EMP000002'),
    },
    // Confirmed - đã xác nhận (từ đơn nhập)
    {
      systemId: asSystemId('COST_ADJ000004'),
      id: asBusinessId('DCGV000004') as BusinessId,
      type: 'manual',
      status: 'confirmed',
      items: [
        {
          productSystemId: asSystemId('PRODUCT000007'),
          productId: 'SP000007',
          productName: 'SSD Samsung 1TB',
          productImage: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80',
          oldCostPrice: 2500000,
          newCostPrice: 2200000,
          adjustmentAmount: -300000,
          adjustmentPercent: -12,
          reason: 'Giá SSD giảm mạnh trên thị trường',
        },
        {
          productSystemId: asSystemId('PRODUCT000008'),
          productId: 'SP000008',
          productName: 'RAM Kingston 16GB DDR5',
          productImage: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80',
          oldCostPrice: 1800000,
          newCostPrice: 1500000,
          adjustmentAmount: -300000,
          adjustmentPercent: -16.67,
          reason: 'Giá RAM giảm',
        },
      ],
      note: 'Điều chỉnh giá theo biến động thị trường linh kiện',
      reason: 'Biến động thị trường',
      createdDate: threeWeeksAgo.toISOString(),
      createdBySystemId: asSystemId('EMP000003'),
      createdByName: 'Lê Văn C',
      confirmedDate: twoWeeksAgo.toISOString(),
      confirmedBySystemId: SEED_AUTHOR,
      confirmedByName: 'Nguyễn Văn A',
      createdAt: threeWeeksAgo.toISOString(),
      updatedAt: twoWeeksAgo.toISOString(),
      createdBy: asSystemId('EMP000003'),
      updatedBy: SEED_AUTHOR,
    },
    // Cancelled - đã hủy
    {
      systemId: asSystemId('COST_ADJ000005'),
      id: asBusinessId('DCGV000005') as BusinessId,
      type: 'manual',
      status: 'cancelled',
      items: [
        {
          productSystemId: asSystemId('PRODUCT000001'),
          productId: 'SP000001',
          productName: 'Laptop Dell Inspiron 15',
          productImage: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=600&q=80',
          oldCostPrice: 12000000,
          newCostPrice: 11000000,
          adjustmentAmount: -1000000,
          adjustmentPercent: -8.33,
          reason: 'Điều chỉnh sai',
        },
      ],
      note: 'Phiếu điều chỉnh bị hủy do nhập sai giá',
      reason: 'Sai thông tin giá',
      createdDate: oneMonthAgo.toISOString(),
      createdBySystemId: asSystemId('EMP000003'),
      createdByName: 'Lê Văn C',
      cancelledDate: threeWeeksAgo.toISOString(),
      cancelledBySystemId: SEED_AUTHOR,
      cancelledByName: 'Nguyễn Văn A',
      cancelReason: 'Nhập sai giá vốn mới, cần tạo phiếu mới',
      createdAt: oneMonthAgo.toISOString(),
      updatedAt: threeWeeksAgo.toISOString(),
      createdBy: asSystemId('EMP000003'),
      updatedBy: SEED_AUTHOR,
    },
    // Confirmed - đã xác nhận (cũ hơn)
    {
      systemId: asSystemId('COST_ADJ000006'),
      id: asBusinessId('DCGV000006') as BusinessId,
      type: 'batch',
      status: 'confirmed',
      items: [
        {
          productSystemId: asSystemId('PRODUCT000009'),
          productId: 'SP000009',
          productName: 'Webcam Logitech C920',
          productImage: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=600&q=80',
          oldCostPrice: 1200000,
          newCostPrice: 1350000,
          adjustmentAmount: 150000,
          adjustmentPercent: 12.5,
          reason: 'Tăng giá nhập',
        },
        {
          productSystemId: asSystemId('PRODUCT000010'),
          productId: 'SP000010',
          productName: 'Loa Bluetooth JBL Flip 6',
          productImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
          oldCostPrice: 2000000,
          newCostPrice: 2100000,
          adjustmentAmount: 100000,
          adjustmentPercent: 5,
          reason: 'Giá nhập tăng',
        },
      ],
      note: 'Điều chỉnh theo đợt kiểm kê cuối tháng',
      reason: 'Kiểm kê định kỳ',
      createdDate: oneMonthAgo.toISOString(),
      createdBySystemId: SEED_AUTHOR,
      createdByName: 'Nguyễn Văn A',
      confirmedDate: threeWeeksAgo.toISOString(),
      confirmedBySystemId: asSystemId('EMP000002'),
      confirmedByName: 'Trần Thị B',
      createdAt: oneMonthAgo.toISOString(),
      updatedAt: threeWeeksAgo.toISOString(),
      createdBy: SEED_AUTHOR,
      updatedBy: asSystemId('EMP000002'),
    },
  ];
};

const generateSystemIdFromCounter = (counter: number): SystemId => {
  return asSystemId(`COST_ADJ${String(counter + 1).padStart(6, '0')}`);
};

export interface CostAdjustmentStoreState {
  data: CostAdjustment[];
  counter: number;
  
  // CRUD
  getById: (systemId: SystemId) => CostAdjustment | undefined;
  getByBusinessId: (businessId: string) => CostAdjustment | undefined;
  
  // Create
  create: (
    items: Omit<CostAdjustmentItem, 'adjustmentAmount' | 'adjustmentPercent'>[],
    type: CostAdjustmentType,
    createdBySystemId: SystemId,
    createdByName: string,
    options?: {
      customId?: string;
      note?: string;
      reason?: string;
      referenceCode?: string;
      status?: CostAdjustmentStatus;
    }
  ) => CostAdjustment;
  
  // Actions
  confirm: (systemId: SystemId, confirmedBySystemId: SystemId, confirmedByName: string) => boolean;
  cancel: (systemId: SystemId, cancelledBySystemId: SystemId, cancelledByName: string, reason?: string) => boolean;
  
  // Queries
  getAll: () => CostAdjustment[];
  getByStatus: (status: CostAdjustmentStatus) => CostAdjustment[];
  
  // Helpers
  generateNextId: () => string;
  isBusinessIdExists: (businessId: string) => boolean;
}

export const useCostAdjustmentStore = create<CostAdjustmentStoreState>()(
  persist(
    (set, get) => ({
      data: createSampleData(),
      counter: 6, // Start from 6 since we have 6 sample records
      
      getById: (systemId) => get().data.find(item => item.systemId === systemId),
      
      getByBusinessId: (businessId) => get().data.find(item => item.id === businessId),
      
      generateNextId: () => {
        const existing = get().data;
        let maxNum = 0;
        existing.forEach(item => {
          const match = item.id.match(/^DCGV(\d+)$/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) maxNum = num;
          }
        });
        return `${PREFIX}${String(maxNum + 1).padStart(6, '0')}`;
      },
      
      isBusinessIdExists: (businessId) => {
        return get().data.some(item => item.id === businessId);
      },
      
      create: (items, type, createdBySystemId, createdByName, options) => {
        const currentCounter = get().counter;
        const systemId = generateSystemIdFromCounter(currentCounter);
        const businessId = options?.customId || get().generateNextId();
        
        // Calculate adjustment amounts
        const processedItems: CostAdjustmentItem[] = items.map(item => ({
          ...item,
          adjustmentAmount: item.newCostPrice - item.oldCostPrice,
          adjustmentPercent: item.oldCostPrice > 0 
            ? ((item.newCostPrice - item.oldCostPrice) / item.oldCostPrice) * 100 
            : 0,
        }));

        const optionalFields: Partial<CostAdjustment> = {};
        if (options?.note !== undefined) {
          optionalFields.note = options.note;
        }
        if (options?.reason !== undefined) {
          optionalFields.reason = options.reason;
        }
        if (options?.referenceCode !== undefined) {
          optionalFields.referenceCode = options.referenceCode;
        }
        
        const newAdjustment: CostAdjustment = {
          systemId,
          id: businessId as BusinessId,
          type,
          status: options?.status || 'draft',
          items: processedItems,
          createdDate: new Date().toISOString(),
          createdBySystemId,
          createdByName,
          // Audit fields
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: createdBySystemId,
          updatedBy: createdBySystemId,
          ...optionalFields,
        };
        
        set(state => ({
          data: [newAdjustment, ...state.data],
          counter: state.counter + 1,
        }));
        
        return newAdjustment;
      },
      
      confirm: (systemId, confirmedBySystemId, confirmedByName) => {
        const adjustment = get().getById(systemId);
        if (!adjustment || adjustment.status !== 'draft') return false;
        
        // Update product cost prices
        const productStore = useProductStore.getState();
        adjustment.items.forEach(item => {
          const existingProduct = productStore.findById(item.productSystemId);
          if (!existingProduct) return;
          productStore.update(item.productSystemId, {
            ...existingProduct,
            costPrice: item.newCostPrice,
          });
        });
        
        set(state => ({
          data: state.data.map(item => 
            item.systemId === systemId
              ? {
                  ...item,
                  status: 'confirmed' as CostAdjustmentStatus,
                  confirmedDate: new Date().toISOString(),
                  confirmedBySystemId,
                  confirmedByName,
                  updatedAt: new Date().toISOString(),
                  updatedBy: confirmedBySystemId,
                }
              : item
          ),
        }));
        
        return true;
      },
      
      cancel: (systemId, cancelledBySystemId, cancelledByName, reason) => {
        const adjustment = get().getById(systemId);
        if (!adjustment || adjustment.status !== 'draft') return false;
        
        set(state => ({
          data: state.data.map(item => 
            item.systemId === systemId
              ? {
                  ...item,
                  status: 'cancelled' as CostAdjustmentStatus,
                  cancelledDate: new Date().toISOString(),
                  cancelledBySystemId,
                  cancelledByName,
                  cancelReason: reason ?? '',
                  updatedAt: new Date().toISOString(),
                  updatedBy: cancelledBySystemId,
                }
              : item
          ),
        }));
        
        return true;
      },
      
      getAll: () => get().data.filter(item => item.status !== 'cancelled'),
      
      getByStatus: (status) => get().data.filter(item => item.status === status),
    }),
    {
      name: 'hrm-cost-adjustments',
      version: 1,
    }
  )
);

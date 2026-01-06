/**
 * Products Store - CRUD Slice
 * Overridden add/update with activity history tracking
 * 
 * @module features/products/store/crud-slice
 */

import type { Product } from '@/lib/types/prisma-extended';
import type { SystemId } from '../../../lib/id-types';
import {
    getCurrentUserInfo,
    createCreatedEntry,
    createUpdatedEntry,
    createStatusChangedEntry,
    appendHistoryEntry,
    type HistoryEntry
} from '../../../lib/activity-history-helper';
import { baseStore } from './base-store';

// ============================================
// CRUD OVERRIDES WITH ACTIVITY TRACKING
// ============================================

/**
 * Add product with activity history logging
 */
export const addProduct = (product: Omit<Product, 'systemId'>) => {
    const userInfo = getCurrentUserInfo();
    const newProduct = baseStore.getState().add(product);
    
    // Add activity history entry
    const historyEntry = createCreatedEntry(
        userInfo,
        `${userInfo.name} đã tạo sản phẩm ${newProduct.name} (${newProduct.id})`
    );
    baseStore.getState().update(newProduct.systemId, {
        ...newProduct,
        activityHistory: [historyEntry]
    });
    
    return newProduct;
};

/**
 * Update product with activity history logging
 */
export const updateProduct = (systemId: SystemId, updatedProduct: Product) => {
    const userInfo = getCurrentUserInfo();
    const existingProduct = baseStore.getState().data.find(p => p.systemId === systemId);
    const historyEntries: HistoryEntry[] = [];
    
    if (existingProduct) {
        // Track status changes
        if (existingProduct.status !== updatedProduct.status) {
            const statusLabels: Record<string, string> = {
                'active': 'Đang kinh doanh',
                'inactive': 'Ngừng kinh doanh',
                'discontinued': 'Ngừng sản xuất'
            };
            historyEntries.push(createStatusChangedEntry(
                userInfo,
                statusLabels[existingProduct.status || 'active'],
                statusLabels[updatedProduct.status || 'active'],
                `${userInfo.name} đã đổi trạng thái từ "${statusLabels[existingProduct.status || 'active']}" sang "${statusLabels[updatedProduct.status || 'active']}"`
            ));
        }
        
        // Track field changes
        const fieldsToTrack: Array<{ key: keyof Product; label: string }> = [
            { key: 'name', label: 'Tên sản phẩm' },
            { key: 'id', label: 'Mã SKU' },
            { key: 'description', label: 'Mô tả' },
            { key: 'shortDescription', label: 'Mô tả ngắn' },
            { key: 'type', label: 'Loại sản phẩm' },
            { key: 'categorySystemId', label: 'Danh mục' },
            { key: 'brandSystemId', label: 'Thương hiệu' },
            { key: 'unit', label: 'Đơn vị tính' },
            { key: 'costPrice', label: 'Giá vốn' },
            { key: 'minPrice', label: 'Giá tối thiểu' },
            { key: 'barcode', label: 'Mã vạch' },
            { key: 'primarySupplierSystemId', label: 'Nhà cung cấp chính' },
            { key: 'warrantyPeriodMonths', label: 'Thời hạn bảo hành' },
            { key: 'reorderLevel', label: 'Mức đặt hàng lại' },
            { key: 'safetyStock', label: 'Tồn kho an toàn' },
            { key: 'maxStock', label: 'Tồn kho tối đa' },
        ];
        
        const changes: string[] = [];
        for (const field of fieldsToTrack) {
            const oldVal = existingProduct[field.key];
            const newVal = updatedProduct[field.key];
            if (oldVal !== newVal && !(oldVal === undefined && newVal === undefined)) {
                if (field.key === 'status') continue;
                const oldDisplay = oldVal !== undefined && oldVal !== null && oldVal !== '' ? String(oldVal) : '(trống)';
                const newDisplay = newVal !== undefined && newVal !== null && newVal !== '' ? String(newVal) : '(trống)';
                changes.push(`${field.label}: ${oldDisplay} → ${newDisplay}`);
            }
        }
        
        // Track price changes separately
        if (existingProduct.costPrice !== updatedProduct.costPrice) {
            changes.push(`Giá vốn: ${existingProduct.costPrice?.toLocaleString('vi-VN')} → ${updatedProduct.costPrice?.toLocaleString('vi-VN')}`);
        }
        
        if (changes.length > 0) {
            historyEntries.push(createUpdatedEntry(
                userInfo,
                `${userInfo.name} đã cập nhật: ${changes.join(', ')}`
            ));
        }
    }
    
    const productWithHistory = {
        ...updatedProduct,
        activityHistory: appendHistoryEntry(existingProduct?.activityHistory, ...historyEntries)
    };
    
    baseStore.getState().update(systemId, productWithHistory);
};

'use client'

import * as React from 'react';
import { useNavigate, useParams, Link } from '@/lib/next-compat';
import { useInventoryCheckStore } from './store';
import { useBranchStore } from '../settings/branches/store';
import { useProductStore } from '../products/store';
import { useProductTypeStore } from '../settings/inventory/product-type-store';
import { useAuth } from '../../contexts/auth-context';
import { usePageHeader } from '../../contexts/page-header-context';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { BulkProductSelectorDialog } from '../../components/shared/bulk-product-selector-dialog';
import { ProductSearchCombobox } from '../../components/shared/product-search-combobox';
import { ProductThumbnailCell } from '../../components/shared/read-only-products-table';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { Package, Trash2, AlertCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { asSystemId, asBusinessId } from '../../lib/id-types';
import { InventoryCheckWorkflowCard } from './components/inventory-check-workflow-card';
import type { Subtask } from '../../components/shared/subtask-list';
import type { InventoryCheck, InventoryCheckItem, DifferenceReason } from './types';
import type { Product } from '../products/types';

const DIFFERENCE_REASONS: { value: DifferenceReason; label: string }[] = [
  { value: 'other', label: 'Khác' },
  { value: 'damaged', label: 'Hư Hỏng' },
  { value: 'wear', label: 'Hao Mòn' },
  { value: 'return', label: 'Trả Hàng' },
  { value: 'transfer', label: 'Chuyển Hàng' },
  { value: 'production', label: 'Sản Xuất' },
];

export function InventoryCheckFormPage() {
  const navigate = useNavigate();
  const { systemId } = useParams<{ systemId: string }>();
  const isEditMode = !!systemId;
  
  const { add, update, findById, balanceCheck } = useInventoryCheckStore();
  const { data: branches } = useBranchStore();
  const { data: allProducts, findById: findProductById } = useProductStore();
  const { findById: findProductTypeById } = useProductTypeStore();
  const { employee: authEmployee } = useAuth();
  const currentUserSystemId = authEmployee?.systemId ?? 'SYSTEM';
  
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);

  const getProductTypeName = React.useCallback((productTypeSystemId: string) => {
    const productType = findProductTypeById(productTypeSystemId as any);
    return productType?.name || 'Hàng hóa';
  }, [findProductTypeById]);
  
  // Get current user name
  const [currentUserName, setCurrentUserName] = React.useState(() =>
    authEmployee?.fullName || authEmployee?.id || ''
  );
  
  // Store current check for edit mode
  const [currentCheck, setCurrentCheck] = React.useState<InventoryCheck | null>(null);
  
  // Load current user name
  React.useEffect(() => {
    if (isEditMode) return;
    if (authEmployee) {
      setCurrentUserName(authEmployee.fullName || authEmployee.id || '');
      return;
    }
    setCurrentUserName('Hệ thống');
  }, [authEmployee, isEditMode]);

  // Form state
  const [branchSystemId, setBranchSystemId] = React.useState('');
  const [customId, setCustomId] = React.useState('');
  const [note, setNote] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');
  const [items, setItems] = React.useState<InventoryCheckItem[]>([]);
  const [activeTab, setActiveTab] = React.useState('all');
  const [subtasks, setSubtasks] = React.useState<Subtask[]>([]);
  
  // Dialog states
  const [showProductSelector, setShowProductSelector] = React.useState(false);
  const [showBalanceConfirm, setShowBalanceConfirm] = React.useState(false);
  const [isBalancing, setIsBalancing] = React.useState(false);

  // Load existing data in edit mode
  React.useEffect(() => {
    if (isEditMode && systemId) {
      const existing = findById(asSystemId(systemId));
      if (existing) {
        // Store current check
        setCurrentCheck(existing);
        
        // Load all fields from existing check
        setBranchSystemId(existing.branchSystemId);
        setCustomId(existing.id);
        setNote(existing.note || '');
        setItems(existing.items || []);
        
        // Load employee name for edit mode (người tạo ban đầu)
        import('../employees/store').then(({ useEmployeeStore }) => {
          const employeeList = useEmployeeStore.getState().data;
          const creator = employeeList.find(emp => emp.systemId === existing.createdBy);
          if (creator) {
            setCurrentUserName(creator.fullName || creator.id);
          }
        });
      } else {
        toast.error('Không tìm thấy phiếu kiểm hàng');
        navigate('/inventory-checks');
      }
    } else if (!isEditMode) {
      // Auto-select default branch for new form
      const defaultBranch = branches.find(b => b.isDefault);
      if (defaultBranch) {
        setBranchSystemId(defaultBranch.systemId);
      }
    }
  }, [isEditMode, systemId, findById, navigate, branches]);

  // Get branch name
  const selectedBranch = React.useMemo(() => 
    branches.find(b => b.systemId === branchSystemId),
    [branches, branchSystemId]
  );

  // Get system quantity from product inventory
  const getSystemQuantity = (productSystemId: string): number => {
    const product = allProducts.find(p => p.systemId === productSystemId);
    if (!product) return 0;
    
    if (branchSystemId) {
      // If branch selected, get branch-specific inventory using systemId
      return product.inventoryByBranch?.[branchSystemId] || 0;
    }
    
    // If no branch selected, get TOTAL inventory across all branches
    const inventoryByBranch = product.inventoryByBranch || {};
    return Object.values(inventoryByBranch).reduce((sum, qty) => sum + qty, 0);
  };

  // Add products from selector
  const handleAddProducts = (products: Product[]) => {
    const newItems: InventoryCheckItem[] = products.map(p => ({
      productSystemId: p.systemId,
      productId: p.id,
      productName: p.name,
      unit: p.unit || 'Cái',
      systemQuantity: getSystemQuantity(p.systemId),
      actualQuantity: 0,
      difference: 0 - getSystemQuantity(p.systemId),
      reason: 'other', // ✅ Default reason
    }));

    setItems(prev => [...prev, ...newItems]);
    toast.success(`Đã thêm ${products.length} sản phẩm`);
  };

  // Add single product from search
  const handleAddProduct = (product: Product) => {
    // Check if already added
    if (items.some(item => item.productSystemId === product.systemId)) {
      toast.error('Sản phẩm đã được thêm vào danh sách');
      return;
    }

    const newItem: InventoryCheckItem = {
      productSystemId: product.systemId,
      productId: product.id,
      productName: product.name,
      unit: product.unit || 'Cái',
      systemQuantity: getSystemQuantity(product.systemId),
      actualQuantity: 0,
      difference: 0 - getSystemQuantity(product.systemId),
      reason: 'other', // ✅ Default reason
    };

    setItems(prev => [...prev, newItem]);
    toast.success(`Đã thêm ${product.name}`);
  };

  // Update actual quantity
  const handleUpdateActualQty = (index: number, value: string) => {
    const actualQty = parseInt(value) || 0;
    setItems(prev => {
      const updated = [...prev];
      const item = updated[index];
      item.actualQuantity = actualQty;
      item.difference = actualQty - item.systemQuantity;
      return updated;
    });
  };

  // Update reason
  const handleUpdateReason = (index: number, reason: DifferenceReason) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index].reason = reason;
      return updated;
    });
  };

  // Update note
  const handleUpdateItemNote = (index: number, note: string) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index].note = note;
      return updated;
    });
  };

  // Remove item
  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Filter items by tab
  const filteredItems = React.useMemo(() => {
    // In edit mode, always show all items
    if (isEditMode) return items;
    
    switch (activeTab) {
      case 'unchecked':
        return items.filter(item => item.actualQuantity === 0);
      case 'matched':
        return items.filter(item => item.difference === 0);
      case 'different':
        return items.filter(item => item.difference !== 0);
      default:
        return items;
    }
  }, [items, activeTab, isEditMode]);

  // Add tag
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  // Validation function
  const validateForm = React.useCallback(() => {
    const errors: string[] = [];
    
    if (!branchSystemId) {
      errors.push('Vui lòng chọn chi nhánh kiểm');
    }
    
    if (items.length === 0) {
      errors.push('Vui lòng thêm ít nhất 1 sản phẩm');
    }
    
    // Check items with difference but no reason
    const missingReason = items.filter(
      item => item.difference !== 0 && !item.reason
    );
    if (missingReason.length > 0) {
      errors.push(`Có ${missingReason.length} sản phẩm lệch chưa chọn lý do`);
    }
    
    // Warning for large differences
    const largeDiff = items.filter(item => Math.abs(item.difference) > 100);
    if (largeDiff.length > 0) {
      toast.warning(`Cảnh báo: Có ${largeDiff.length} sản phẩm lệch quá 100 đơn vị`, {
        description: largeDiff.slice(0, 3).map(item => 
          `${item.productName}: ${item.difference > 0 ? '+' : ''}${item.difference}`
        ).join(', ') + (largeDiff.length > 3 ? '...' : '')
      });
    }
    
    if (errors.length > 0) {
      toast.error('Vui lòng kiểm tra lại', {
        description: errors.join('\n')
      });
      return false;
    }
    
    return true;
  }, [branchSystemId, items]);

  // Save draft
  const handleSaveDraft = React.useCallback(() => {
    console.log('handleSaveDraft called:', { branchSystemId, itemsLength: items.length });
    
    if (!validateForm()) {
      return;
    }

    if (isEditMode && systemId) {
      const existing = findById(asSystemId(systemId));
      if (existing) {
        const updated: InventoryCheck = {
          ...existing,
          branchSystemId: asSystemId(branchSystemId),
          branchName: selectedBranch?.name || '',
          note,
          items,
        };
        update(asSystemId(systemId), updated);
        toast.success('Đã cập nhật phiếu kiểm hàng');
      }
    } else {
      const data: Omit<InventoryCheck, 'systemId'> = {
        id: asBusinessId(customId || ''),
        branchSystemId: asSystemId(branchSystemId),
        branchName: selectedBranch?.name || '',
        status: 'draft',
        createdBy: asSystemId(currentUserSystemId || 'SYSTEM'),
        createdAt: new Date().toISOString(),
        note,
        items,
      };
      add(data);
      toast.success('Đã tạo phiếu kiểm hàng');
    }

    navigate('/inventory-checks');
  }, [branchSystemId, items, isEditMode, systemId, findById, selectedBranch, note, update, customId, currentUserSystemId, add, navigate]);

  // Balance
  const handleBalance = React.useCallback(() => {
    console.log('=== handleBalance DEBUG ===');
    console.log('branchSystemId:', branchSystemId, 'type:', typeof branchSystemId, 'length:', branchSystemId?.length);
    console.log('items.length:', items.length);
    console.log('items:', items);
    console.log('=========================');
    
    if (!validateForm()) {
      return;
    }

    console.log('Opening balance confirm dialog');
    setShowBalanceConfirm(true);
  }, [items, branchSystemId, validateForm]);

  const confirmBalance = async () => {
    setIsBalancing(true);
    
    let checkSystemId: string;
    
    if (isEditMode && systemId) {
      const existing = findById(asSystemId(systemId));
      if (existing) {
        const updated: InventoryCheck = {
          ...existing,
          branchSystemId: asSystemId(branchSystemId),
          branchName: selectedBranch?.name || '',
          note,
          items,
        };
        update(asSystemId(systemId), updated);
        checkSystemId = systemId;
      } else {
        setIsBalancing(false);
        setShowBalanceConfirm(false);
        toast.error('Không tìm thấy phiếu kiểm hàng');
        return;
      }
    } else {
      const data: Omit<InventoryCheck, 'systemId'> = {
        id: asBusinessId(customId || ''),
        branchSystemId: asSystemId(branchSystemId),
        branchName: selectedBranch?.name || '',
        status: 'draft',
        createdBy: asSystemId(currentUserSystemId || 'SYSTEM'),
        createdAt: new Date().toISOString(),
        note,
        items,
      };
      const newCheck = add(data);
      checkSystemId = newCheck.systemId;
    }

    try {
      await balanceCheck(asSystemId(checkSystemId));
      toast.success('Đã cân bằng kho thành công');
      navigate(`/inventory-checks/${checkSystemId}`);
    } catch (error) {
      toast.error('Không thể cân bằng kho, vui lòng thử lại');
    } finally {
      setIsBalancing(false);
      setShowBalanceConfirm(false);
    }
  };

  // Store latest callbacks in refs to avoid stale closure
  const handleSaveDraftRef = React.useRef(handleSaveDraft);
  const handleBalanceRef = React.useRef(handleBalance);
  
  React.useEffect(() => {
    handleSaveDraftRef.current = handleSaveDraft;
    handleBalanceRef.current = handleBalance;
  }, [handleSaveDraft, handleBalance]);

  // Header actions - khác nhau giữa thêm và sửa
  const actions = React.useMemo(() => {
    if (isEditMode) {
      // Actions cho chế độ sửa
      return [
        <Button key="cancel" variant="outline" onClick={() => navigate('/inventory-checks')} className="h-9">
          Hủy
        </Button>,
        <Button key="save" onClick={() => handleSaveDraftRef.current()} className="h-9">
          Lưu thay đổi
        </Button>
      ];
    } else {
      // Actions cho chế độ thêm mới
      return [
        <Button key="cancel" variant="outline" onClick={() => navigate('/inventory-checks')} className="h-9">
          Hủy
        </Button>,
        <Button key="save" variant="outline" onClick={() => handleSaveDraftRef.current()} className="h-9">
          Tạo phiếu kiểm
        </Button>,
        <Button key="balance" onClick={() => handleBalanceRef.current()} className="h-9">
          Cân bằng kho
        </Button>
      ];
    }
  }, [isEditMode, navigate]);

  // Breadcrumb
  const breadcrumb = React.useMemo(() => [
    { label: 'Trang chủ', href: '/', isCurrent: false },
    { label: 'Kiểm hàng', href: '/inventory-checks', isCurrent: false },
    { label: isEditMode ? 'Chỉnh sửa' : 'Thêm mới', href: '', isCurrent: true }
  ], [isEditMode]);

  // Custom title cho edit mode
  const pageTitle = React.useMemo(() => {
    if (isEditMode && currentCheck) {
      return `Chỉnh sửa ${currentCheck.id}`;
    }
    return undefined; // Dùng title auto từ route
  }, [isEditMode, currentCheck]);

  usePageHeader({ 
    title: pageTitle,
    actions,
    breadcrumb
  });

  // Count stats
  const stats = React.useMemo(() => {
    const unchecked = items.filter(item => item.actualQuantity === 0).length;
    const matched = items.filter(item => item.difference === 0).length;
    const different = items.filter(item => item.difference !== 0).length;
    const checked = items.filter(item => item.actualQuantity > 0).length;
    const progress = items.length > 0 ? Math.round((checked / items.length) * 100) : 0;
    return { unchecked, matched, different, checked, progress };
  }, [items]);

  return (
    <div className="space-y-4">
      {/* Progress Bar - Only in create mode */}
      {!isEditMode && items.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-body-sm">
                <span className="font-medium">Tiến độ kiểm hàng</span>
                <span className="font-bold text-primary">{stats.progress}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-body-xs text-muted-foreground">
                <span>Đã kiểm: {stats.checked}/{items.length} sản phẩm</span>
                <span>Khớp: {stats.matched} • Lệch: {stats.different}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* Thông tin phiếu */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Thông tin phiếu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mã phiếu - Always show, disabled in edit mode */}
              <div className="space-y-2">
                <Label htmlFor="customId">Mã phiếu {!isEditMode && '(tùy chọn)'}</Label>
                <Input
                  id="customId"
                  placeholder={isEditMode ? '' : 'Để trống để tự động tạo'}
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value)}
                  disabled={isEditMode}
                  className={isEditMode ? 'bg-muted h-9' : 'h-9'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Chi nhánh kiểm *</Label>
                <Select 
                  value={branchSystemId} 
                  onValueChange={(value) => {
                    console.log('Branch selected:', value);
                    setBranchSystemId(value);
                  }}
                  disabled={isEditMode}
                >
                  <SelectTrigger id="branch" className={isEditMode ? 'bg-muted h-9' : 'h-9'}>
                    <SelectValue placeholder="Chọn chi nhánh" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.systemId} value={branch.systemId}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="employee">Nhân viên kiểm</Label>
                <Input
                  id="employee"
                  disabled
                  value={currentUserName || 'Đang tải...'}
                  className="bg-muted h-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thông tin bổ sung */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Thông tin bổ sung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea
                id="note"
                placeholder="VD: Kiểm hàng ngày 25/07/2022"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Nhập ký tự và ấn Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="h-9"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quy trình xử lý */}
        <div className="lg:col-span-3">
          <InventoryCheckWorkflowCard
            subtasks={subtasks}
            onSubtasksChange={setSubtasks}
            readonly={true}
          />
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm kiểm hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Add Products - Only in create mode */}
          {!isEditMode && (
            <div className="flex gap-2">
              <div className="flex-1">
                <ProductSearchCombobox
                  onSelect={handleAddProduct}
                  placeholder="Thêm sản phẩm (F3)"
                  excludeProductIds={items.map(i => i.productSystemId)}
                  branchSystemId={branchSystemId}
                  showStock={true}
                  showPrice={false}
                />
              </div>
              <Button 
                onClick={() => setShowProductSelector(true)}
                variant="outline"
                className="h-9"
              >
                Chọn nhiều
              </Button>
            </div>
          )}

          {/* Edit mode message */}
          {isEditMode && (
            <div className="bg-muted/50 border rounded-lg p-4 text-body-sm text-muted-foreground">
              Ở chế độ sửa, bạn chỉ có thể chỉnh sửa <strong>Ghi chú</strong> và <strong>Tags</strong>. Không thể thay đổi sản phẩm hoặc số lượng.
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border rounded-lg">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có sản phẩm nào</p>
              <p className="text-body-sm mt-1">Tìm kiếm hoặc chọn sản phẩm để thêm</p>
            </div>
          ) : (
            <>
              {/* Tabs for filtering - Only in create mode */}
              {!isEditMode && (
                <div className="flex gap-2 mb-4 border-b">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 text-body-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'all' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Tất cả ({items.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('unchecked')}
                    className={`px-4 py-2 text-body-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'unchecked' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Chưa kiểm ({stats.unchecked})
                  </button>
                  <button
                    onClick={() => setActiveTab('matched')}
                    className={`px-4 py-2 text-body-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'matched' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Khớp ({stats.matched})
                  </button>
                  <button
                    onClick={() => setActiveTab('different')}
                    className={`px-4 py-2 text-body-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'different' 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Lệch ({stats.different})
                  </button>
                </div>
              )}

              {/* Simple Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="border-b">
                        <th className="px-3 py-2 text-left text-body-sm font-medium">STT</th>
                        <th className="px-3 py-2 text-left text-body-sm font-medium w-16">Ảnh</th>
                        <th className="px-3 py-2 text-left text-body-sm font-medium">Sản phẩm</th>
                        <th className="px-3 py-2 text-left text-body-sm font-medium">Đơn vị</th>
                        <th className="px-3 py-2 text-right text-body-sm font-medium">Tồn hệ thống</th>
                        <th className="px-3 py-2 text-right text-body-sm font-medium">Tồn thực tế</th>
                        <th className="px-3 py-2 text-right text-body-sm font-medium">Lệch</th>
                        <th className="px-3 py-2 text-left text-body-sm font-medium">Lý do</th>
                        <th className="px-3 py-2 text-left text-body-sm font-medium">Ghi chú</th>
                        <th className="px-3 py-2 text-center text-body-sm font-medium">Xóa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="px-3 py-12 text-center text-muted-foreground">
                            Không có sản phẩm nào
                          </td>
                        </tr>
                      ) : (
                        filteredItems.map((item) => {
                          const originalIndex = items.findIndex(i => i.productSystemId === item.productSystemId);
                          const isNegative = item.difference < 0;
                          const isPositive = item.difference > 0;
                          const product = findProductById(item.productSystemId);
                          const productTypeName = product?.productTypeSystemId ? getProductTypeName(product.productTypeSystemId) : 'Hàng hóa';
                          
                          return (
                            <tr key={item.productSystemId} className="border-b hover:bg-muted/30">
                              <td className="px-3 py-2 text-body-sm">{originalIndex + 1}</td>
                              <td className="px-3 py-2">
                                <ProductThumbnailCell
                                  productSystemId={item.productSystemId}
                                  productName={item.productName}
                                  onPreview={(url: string, title: string) => setPreviewImage({ url, title })}
                                />
                              </td>
                              <td className="px-3 py-2">
                                <div>
                                  <button
                                    onClick={() => navigate(`/products/${item.productSystemId}`)}
                                    className="text-blue-600 hover:underline dark:text-blue-400 font-medium text-body-sm text-left"
                                  >
                                    {item.productName}
                                  </button>
                                  <div className="text-body-xs text-muted-foreground">{productTypeName} - {item.productId}</div>
                                </div>
                              </td>
                              <td className="px-3 py-2 text-body-sm">{item.unit}</td>
                              <td className="px-3 py-2 text-body-sm text-right font-medium">{item.systemQuantity}</td>
                              <td className="px-3 py-2">
                                <Input
                                  type="number"
                                  value={item.actualQuantity}
                                  onChange={(e) => handleUpdateActualQty(originalIndex, e.target.value)}
                                  className={`h-9 text-right w-24 ${isEditMode ? 'bg-muted' : ''}`}
                                  min="0"
                                  disabled={isEditMode}
                                />
                              </td>
                              <td className={`px-3 py-2 text-body-sm text-right font-semibold ${
                                isNegative ? 'text-red-600' : isPositive ? 'text-orange-600' : 'text-green-600'
                              }`}>
                                {item.difference > 0 ? '+' : ''}{item.difference}
                              </td>
                              <td className="px-3 py-2">
                                {item.difference !== 0 && (
                                  <select
                                    value={item.reason || 'other'}
                                    onChange={(e) => handleUpdateReason(originalIndex, e.target.value as DifferenceReason)}
                                    className={`w-full h-9 px-2 text-body-sm border rounded-md ${isEditMode ? 'bg-muted' : 'bg-background'}`}
                                    disabled={isEditMode}
                                  >
                                    {DIFFERENCE_REASONS.map(r => (
                                      <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                  </select>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  placeholder="Ghi chú..."
                                  value={item.note || ''}
                                  onChange={(e) => handleUpdateItemNote(originalIndex, e.target.value)}
                                  className="h-9 text-body-sm"
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                {!isEditMode && (
                                  <button
                                    onClick={() => handleRemoveItem(originalIndex)}
                                    className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-destructive/10 text-destructive transition-colors"
                                    title="Xóa sản phẩm"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Product Selector Dialog - Only in create mode */}
      {!isEditMode && (
        <BulkProductSelectorDialog
          open={showProductSelector}
          onOpenChange={setShowProductSelector}
          onConfirm={handleAddProducts}
          excludeProductIds={items.map(i => i.productSystemId)}
          branchSystemId={branchSystemId}
          title="Chọn sản phẩm kiểm hàng"
          description={`Chi nhánh: ${selectedBranch?.name || 'Chưa chọn'}`}
        />
      )}

      {/* Balance Confirmation Dialog */}
      <AlertDialog open={showBalanceConfirm} onOpenChange={setShowBalanceConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Xác nhận cân bằng kho
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <div>Cân bằng nhanh sẽ thay đổi thông số tồn chi nhánh trên hệ thống của những sản phẩm trong danh sách kiểm theo đúng số tồn thực tế trên phiếu kiểm.</div>
                <div className="font-medium">Bạn có chắc chắn muốn cân bằng kho không?</div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBalancing}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBalance} disabled={isBalancing}>
              {isBalancing ? 'Đang xử lý...' : 'Xác nhận'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Preview Dialog */}
      {previewImage && (
        <ImagePreviewDialog
          images={[previewImage.url]}
          open={!!previewImage}
          onOpenChange={(open) => !open && setPreviewImage(null)}
          title={previewImage.title}
        />
      )}
    </div>
  );
}

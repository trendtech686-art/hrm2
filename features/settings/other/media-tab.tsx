'use client';

import * as React from 'react';
import { Save, Upload, Shield, AlertTriangle, CheckCircle, FileText, HardDrive, FileCode, UserCog, FolderArchive, Layers, MessageSquare, Package, ImagePlus, FileX, ScrollText, Target, FileEdit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { SettingsActionButton } from '@/components/settings/SettingsActionButton';
import { toast } from 'sonner';
import type { TabContentProps } from './types';

interface LocalMediaSettings {
  maxFileSizeMB: number;
  imageMaxWidth: number;
  imageMaxHeight: number;
  imageQuality: number;
  thumbnailSize: number;
  enableWebpConversion: boolean;
  enableImageCompression: boolean;
  // Giới hạn số ảnh theo chức năng
  maxImagesProduct: number;
  // Employee document types
  maxImagesEmployeeLegal: number;
  maxImagesEmployeeWorkProcess: number;
  maxImagesEmployeeTermination: number;
  maxImagesEmployeeDecisions: number;
  maxImagesEmployeeKpi: number;
  maxImagesEmployeeRequests: number;
  // Other features
  maxImagesWarranty: number;
  maxImagesComplaint: number;
  maxImagesTask: number;
  maxImagesExpense: number;
  maxImagesAsset: number;
  maxImagesContract: number;
  maxImagesCustomer: number;
  maxImagesOrder: number;
  maxImagesCategory: number;
  maxImagesComment: number;
}

const LOCAL_DEFAULT_MEDIA_SETTINGS: LocalMediaSettings = {
  maxFileSizeMB: 10,
  imageMaxWidth: 1200,
  imageMaxHeight: 1200,
  imageQuality: 0.8,
  thumbnailSize: 200,
  enableWebpConversion: true,
  enableImageCompression: true,
  maxImagesProduct: 9,
  maxImagesEmployeeLegal: 10,
  maxImagesEmployeeWorkProcess: 10,
  maxImagesEmployeeTermination: 5,
  maxImagesEmployeeDecisions: 5,
  maxImagesEmployeeKpi: 5,
  maxImagesEmployeeRequests: 5,
  maxImagesWarranty: 5,
  maxImagesComplaint: 10,
  maxImagesTask: 5,
  maxImagesExpense: 5,
  maxImagesAsset: 5,
  maxImagesContract: 3,
  maxImagesCustomer: 5,
  maxImagesOrder: 5,
  maxImagesCategory: 1,
  maxImagesComment: 5,
};

const MEDIA_PREFERENCE_KEY = 'local-media-settings';

export function MediaTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const [settings, setSettings] = React.useState<LocalMediaSettings>(LOCAL_DEFAULT_MEDIA_SETTINGS);
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [_isLoading, setIsLoading] = React.useState(true);
  const originalSettings = React.useRef(JSON.stringify(settings));
  
  // Load from API on mount
  React.useEffect(() => {
    const loadFromAPI = async () => {
      try {
        const response = await fetch(`/api/user-preferences?category=system-settings&key=${MEDIA_PREFERENCE_KEY}`);
        if (response.ok) {
          const data = await response.json();
          if (data.value) {
            const loaded = { ...LOCAL_DEFAULT_MEDIA_SETTINGS, ...data.value };
            setSettings(loaded);
            originalSettings.current = JSON.stringify(loaded);
          }
        }
      } catch (error) {
        console.error('[MediaTabContent] Failed to load:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFromAPI();
  }, []);
  
  React.useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== originalSettings.current);
  }, [settings]);
  
  const handleChange = <K extends keyof LocalMediaSettings>(key: K, value: LocalMediaSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = React.useCallback(async () => {
    setIsSaving(true);
    try {
      await fetch('/api/user-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'system-settings',
          key: MEDIA_PREFERENCE_KEY,
          value: settings,
        }),
      });
      originalSettings.current = JSON.stringify(settings);
      toast.success('Đã lưu cài đặt tệp tin');
      setHasChanges(false);
    } catch (_error) {
      toast.error('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  }, [settings]);
  
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="save-media" onClick={handleSave} disabled={!hasChanges || isSaving}>
        <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </SettingsActionButton>,
    ]);
  }, [isActive, hasChanges, isSaving, handleSave, onRegisterActions]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Giới hạn tải lên
          </CardTitle>
          <CardDescription>Cấu hình kích thước và định dạng file cho phép</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="maxFileSize">Kích thước file tối đa</Label>
            <div className="flex items-center gap-2">
              <Slider id="maxFileSize" min={1} max={50} step={1} value={[settings.maxFileSizeMB]} onValueChange={([val]) => handleChange('maxFileSizeMB', val)} className="flex-1" />
              <Badge variant="secondary">{settings.maxFileSizeMB} MB</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Xử lý hình ảnh</CardTitle>
          <CardDescription>Cấu hình nén và tối ưu hóa ảnh tự động</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Bật nén ảnh tự động</Label>
              <p className="text-sm text-muted-foreground">Tự động giảm kích thước ảnh khi tải lên</p>
            </div>
            <Switch checked={settings.enableImageCompression} onCheckedChange={(val) => handleChange('enableImageCompression', val)} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Chuyển đổi sang WebP</Label>
              <p className="text-sm text-muted-foreground">Tự động chuyển ảnh sang định dạng WebP để tiết kiệm dung lượng</p>
            </div>
            <Switch checked={settings.enableWebpConversion} onCheckedChange={(val) => handleChange('enableWebpConversion', val)} />
          </div>
          
          {settings.enableImageCompression && (
            <>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Chiều rộng tối đa (px)</Label>
                  <Input type="number" min={100} max={4000} value={settings.imageMaxWidth} onChange={(e) => handleChange('imageMaxWidth', parseInt(e.target.value) || 1200)} />
                </div>
                <div className="space-y-2">
                  <Label>Chiều cao tối đa (px)</Label>
                  <Input type="number" min={100} max={4000} value={settings.imageMaxHeight} onChange={(e) => handleChange('imageMaxHeight', parseInt(e.target.value) || 1200)} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Chất lượng nén</Label>
                <div className="flex items-center gap-4">
                  <Slider min={0.1} max={1} step={0.1} value={[settings.imageQuality]} onValueChange={([val]) => handleChange('imageQuality', val)} className="flex-1" />
                  <Badge variant="secondary">{Math.round(settings.imageQuality * 100)}%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Chất lượng cao hơn = dung lượng file lớn hơn</p>
              </div>
              
              <div className="space-y-2 max-w-xs">
                <Label>Kích thước thumbnail (px)</Label>
                <Input type="number" min={50} max={500} value={settings.thumbnailSize} onChange={(e) => handleChange('thumbnailSize', parseInt(e.target.value) || 200)} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Giới hạn số ảnh theo chức năng */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5" />
            Giới hạn số ảnh theo chức năng
          </CardTitle>
          <CardDescription>Cấu hình số lượng ảnh tối đa cho từng module</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Sản phẩm
              </Label>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={20} value={settings.maxImagesProduct} onChange={(e) => handleChange('maxImagesProduct', parseInt(e.target.value) || 9)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Bảo hành
              </Label>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={15} value={settings.maxImagesWarranty} onChange={(e) => handleChange('maxImagesWarranty', parseInt(e.target.value) || 5)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Khiếu nại
              </Label>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={20} value={settings.maxImagesComplaint} onChange={(e) => handleChange('maxImagesComplaint', parseInt(e.target.value) || 10)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Công việc/Task
              </Label>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={15} value={settings.maxImagesTask} onChange={(e) => handleChange('maxImagesTask', parseInt(e.target.value) || 5)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Chi phí/Expense
              </Label>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={10} value={settings.maxImagesExpense} onChange={(e) => handleChange('maxImagesExpense', parseInt(e.target.value) || 5)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Tài sản
              </Label>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={10} value={settings.maxImagesAsset} onChange={(e) => handleChange('maxImagesAsset', parseInt(e.target.value) || 5)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                Hợp đồng
              </Label>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={10} value={settings.maxImagesContract} onChange={(e) => handleChange('maxImagesContract', parseInt(e.target.value) || 3)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Khách hàng
              </Label>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={10} value={settings.maxImagesCustomer} onChange={(e) => handleChange('maxImagesCustomer', parseInt(e.target.value) || 5)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FolderArchive className="h-4 w-4" />
                Đơn hàng
              </Label>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={10} value={settings.maxImagesOrder} onChange={(e) => handleChange('maxImagesOrder', parseInt(e.target.value) || 5)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Danh mục
              </Label>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={5} value={settings.maxImagesCategory} onChange={(e) => handleChange('maxImagesCategory', parseInt(e.target.value) || 1)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Bình luận
              </Label>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={10} value={settings.maxImagesComment} onChange={(e) => handleChange('maxImagesComment', parseInt(e.target.value) || 5)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Giới hạn này áp dụng cho mỗi bản ghi. Ví dụ: mỗi sản phẩm có thể có tối đa {settings.maxImagesProduct} ảnh.
          </p>
        </CardContent>
      </Card>

      {/* Giới hạn ảnh hồ sơ nhân viên */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Giới hạn ảnh hồ sơ nhân viên
          </CardTitle>
          <CardDescription>Cấu hình số lượng ảnh tối đa cho từng loại tài liệu nhân viên</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Giấy tờ pháp lý
              </Label>
              <p className="text-xs text-muted-foreground mb-1">CCCD, BHXH, Hộ khẩu, Giấy khai sinh...</p>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={20} value={settings.maxImagesEmployeeLegal} onChange={(e) => handleChange('maxImagesEmployeeLegal', parseInt(e.target.value) || 10)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                Hồ sơ công việc
              </Label>
              <p className="text-xs text-muted-foreground mb-1">HĐLĐ, Phụ lục HĐ, Thử việc...</p>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={20} value={settings.maxImagesEmployeeWorkProcess} onChange={(e) => handleChange('maxImagesEmployeeWorkProcess', parseInt(e.target.value) || 10)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileX className="h-4 w-4" />
                Hồ sơ nghỉ việc
              </Label>
              <p className="text-xs text-muted-foreground mb-1">Đơn xin nghỉ, Biên bản bàn giao...</p>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={15} value={settings.maxImagesEmployeeTermination} onChange={(e) => handleChange('maxImagesEmployeeTermination', parseInt(e.target.value) || 5)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ScrollText className="h-4 w-4" />
                Quyết định
              </Label>
              <p className="text-xs text-muted-foreground mb-1">Bổ nhiệm, Điều chuyển, Khen thưởng...</p>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={15} value={settings.maxImagesEmployeeDecisions} onChange={(e) => handleChange('maxImagesEmployeeDecisions', parseInt(e.target.value) || 5)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Đánh giá KPI
              </Label>
              <p className="text-xs text-muted-foreground mb-1">Bảng đánh giá, Xếp loại...</p>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={10} value={settings.maxImagesEmployeeKpi} onChange={(e) => handleChange('maxImagesEmployeeKpi', parseInt(e.target.value) || 5)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileEdit className="h-4 w-4" />
                Đơn từ
              </Label>
              <p className="text-xs text-muted-foreground mb-1">Nghỉ phép, Tạm ứng, Xin việc...</p>
              <div className="flex items-center gap-2">
                <Input type="number" min={1} max={10} value={settings.maxImagesEmployeeRequests} onChange={(e) => handleChange('maxImagesEmployeeRequests', parseInt(e.target.value) || 5)} />
                <span className="text-sm text-muted-foreground">ảnh</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import * as React from 'react';
import { Save, Clock, Monitor, Upload, Trash2, UserCog, Palette, Image } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SettingsActionButton } from '@/components/settings/SettingsActionButton';
import { useGeneralSettings, type GeneralSettings } from '@/hooks/use-system-settings';
import { toast } from 'sonner';
import type { TabContentProps } from './types';

export function GeneralTabContent({ isActive, onRegisterActions }: TabContentProps) {
  // Use server-side hook instead of localStorage
  const { settings, updateField, isSaving, saveImmediately, isLoading } = useGeneralSettings();
  
  const [hasChanges, setHasChanges] = React.useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = React.useState(false);
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const faviconInputRef = React.useRef<HTMLInputElement>(null);
  const originalSettings = React.useRef<string>('');
  const isInitialLoad = React.useRef(true);
  const updateFieldRef = React.useRef(updateField);
  const saveImmediatelyRef = React.useRef(saveImmediately);
  const settingsRef = React.useRef(settings);
  
  // Keep updateField ref current
  React.useEffect(() => {
    updateFieldRef.current = updateField;
  }, [updateField]);

  // Keep saveImmediately ref current
  React.useEffect(() => {
    saveImmediatelyRef.current = saveImmediately;
  }, [saveImmediately]);

  // Keep settings ref current
  React.useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);
  
  // Update original when loaded from API (only on initial load)
  React.useEffect(() => {
    if (!isLoading && isInitialLoad.current) {
      originalSettings.current = JSON.stringify(settings);
      isInitialLoad.current = false;
      setHasChanges(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);
  
  React.useEffect(() => {
    if (originalSettings.current) {
      setHasChanges(JSON.stringify(settings) !== originalSettings.current);
    }
  }, [settings]);
  
  const handleChange = React.useCallback(<K extends keyof GeneralSettings>(key: K, value: GeneralSettings[K]) => {
    updateFieldRef.current(key, value);
  }, []);
  
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
  
  const handleBrandingUpload = async (file: File, type: 'logo' | 'favicon') => {
    const setUploading = type === 'logo' ? setIsUploadingLogo : setIsUploadingFavicon;
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await fetch(`${serverUrl}/api/branding/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        const urlKey = type === 'logo' ? 'logoUrl' : 'faviconUrl';
        handleChange(urlKey, `${serverUrl}${result.file.url}`);
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Upload thất bại');
      }
    } catch (error) {
      console.error('Branding upload error:', error);
      toast.error('Không thể kết nối server để upload');
    } finally {
      setUploading(false);
    }
  };
  
  const handleBrandingDelete = async (type: 'logo' | 'favicon') => {
    try {
      const response = await fetch(`${serverUrl}/api/branding/${type}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        const urlKey = type === 'logo' ? 'logoUrl' : 'faviconUrl';
        handleChange(urlKey, '');
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Xóa thất bại');
      }
    } catch (error) {
      console.error('Branding delete error:', error);
      toast.error('Không thể kết nối server');
    }
  };
  
  const handleSave = React.useCallback(async () => {
    const success = await saveImmediatelyRef.current();
    if (success) {
      originalSettings.current = JSON.stringify(settingsRef.current);
      toast.success('Đã lưu cài đặt chung');
      setHasChanges(false);
    } else {
      toast.error('Có lỗi xảy ra khi lưu cài đặt');
    }
  }, []);
  
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="save-general" onClick={handleSave} disabled={!hasChanges || isSaving}>
        <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </SettingsActionButton>,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, hasChanges, isSaving, handleSave]);

  return (
    <div className="space-y-6">
      {/* Vai trò mặc định */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Cài đặt người dùng mới
          </CardTitle>
          <CardDescription>Thiết lập mặc định khi tạo nhân viên mới</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="defaultRole">Vai trò mặc định</Label>
            <Select value={settings.defaultRole} onValueChange={(val) => handleChange('defaultRole', val)}>
              <SelectTrigger id="defaultRole"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Nhân viên</SelectItem>
                <SelectItem value="manager">Quản lý</SelectItem>
                <SelectItem value="hr">Nhân sự</SelectItem>
                <SelectItem value="accountant">Kế toán</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Vai trò sẽ được gán tự động khi tạo nhân viên mới</p>
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Nhận diện thương hiệu
          </CardTitle>
          <CardDescription>Logo và favicon của hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hidden file inputs */}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleBrandingUpload(file, 'logo');
              e.target.value = '';
            }}
          />
          <input
            ref={faviconInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/x-icon,image/vnd.microsoft.icon"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleBrandingUpload(file, 'favicon');
              e.target.value = '';
            }}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div className="space-y-3">
              <Label>Logo công ty</Label>
              <div className="flex items-start gap-4">
                <div className="w-32 h-16 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
                  {settings.logoUrl ? (
                    <OptimizedImage src={settings.logoUrl} alt="Logo" width={128} height={64} className="max-w-full max-h-full object-contain" unoptimized />
                  ) : (
                    <Image className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      disabled={isUploadingLogo}
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {isUploadingLogo ? 'Đang tải...' : 'Tải lên'}
                    </Button>
                    {settings.logoUrl && (
                      <Button variant="outline" size="sm" onClick={() => handleBrandingDelete('logo')}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Kích thước đề xuất: 200x50px (PNG/JPG/WEBP)</p>
                </div>
              </div>
            </div>
            
            {/* Favicon Upload */}
            <div className="space-y-3">
              <Label>Favicon</Label>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
                  {settings.faviconUrl ? (
                    <OptimizedImage src={settings.faviconUrl} alt="Favicon" width={64} height={64} className="max-w-full max-h-full object-contain" unoptimized />
                  ) : (
                    <Image className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      disabled={isUploadingFavicon}
                      onClick={() => faviconInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {isUploadingFavicon ? 'Đang tải...' : 'Tải lên'}
                    </Button>
                    {settings.faviconUrl && (
                      <Button variant="outline" size="sm" onClick={() => handleBrandingDelete('favicon')}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Kích thước: 32x32px hoặc 64x64px (ICO/PNG)</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Định dạng hệ thống */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Định dạng hệ thống
          </CardTitle>
          <CardDescription>Múi giờ, định dạng ngày tháng và tiền tệ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Múi giờ</Label>
              <Select value={settings.timezone} onValueChange={(val) => handleChange('timezone', val)}>
                <SelectTrigger id="timezone"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</SelectItem>
                  <SelectItem value="Asia/Bangkok">Thái Lan (UTC+7)</SelectItem>
                  <SelectItem value="Asia/Singapore">Singapore (UTC+8)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Nhật Bản (UTC+9)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Quan trọng cho chấm công</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Định dạng ngày</Label>
              <Select value={settings.dateFormat} onValueChange={(val) => handleChange('dateFormat', val)}>
                <SelectTrigger id="dateFormat"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2025)</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2025)</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2025-12-31)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Đơn vị tiền tệ</Label>
              <Select value={settings.currency} onValueChange={(val) => handleChange('currency', val)}>
                <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="VND">VND - Việt Nam Đồng</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeFormat">Định dạng giờ</Label>
              <Select value={settings.timeFormat} onValueChange={(val) => handleChange('timeFormat', val)}>
                <SelectTrigger id="timeFormat"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 giờ (14:30)</SelectItem>
                  <SelectItem value="12h">12 giờ (2:30 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hiển thị & Ngôn ngữ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Hiển thị & Ngôn ngữ
          </CardTitle>
          <CardDescription>Cài đặt giao diện và ngôn ngữ hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">Ngôn ngữ</Label>
              <Select value={settings.language} onValueChange={(val) => handleChange('language', val)}>
                <SelectTrigger id="language"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                  <SelectItem value="en">🇬🇧 English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultPageSize">Số dòng/trang</Label>
              <Select value={settings.defaultPageSize.toString()} onValueChange={(val) => handleChange('defaultPageSize', parseInt(val))}>
                <SelectTrigger id="defaultPageSize"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 dòng</SelectItem>
                  <SelectItem value="20">20 dòng</SelectItem>
                  <SelectItem value="50">50 dòng</SelectItem>
                  <SelectItem value="100">100 dòng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="thousandSeparator">Dấu nghìn</Label>
              <Select value={settings.thousandSeparator} onValueChange={(val) => handleChange('thousandSeparator', val)}>
                <SelectTrigger id="thousandSeparator"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value=".">Dấu chấm (1.000)</SelectItem>
                  <SelectItem value=",">Dấu phẩy (1,000)</SelectItem>
                  <SelectItem value=" ">Khoảng trắng (1 000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="decimalSeparator">Dấu thập phân</Label>
              <Select value={settings.decimalSeparator} onValueChange={(val) => handleChange('decimalSeparator', val)}>
                <SelectTrigger id="decimalSeparator"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value=",">Dấu phẩy (0,50)</SelectItem>
                  <SelectItem value=".">Dấu chấm (0.50)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Ví dụ: 1{settings.thousandSeparator}234{settings.thousandSeparator}567{settings.decimalSeparator}89 {settings.currency === 'VND' ? '₫' : settings.currency === 'USD' ? '$' : '€'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

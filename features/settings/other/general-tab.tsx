'use client';

import * as React from 'react';
import { Save, Clock, Monitor, Upload, Trash2, UserCog, Palette, ImageIcon, Shield, HardDrive, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { SettingsActionButton } from '@/components/settings/SettingsActionButton';
import { useGeneralSettings, type GeneralSettings } from '@/hooks/use-system-settings';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { TabContentProps } from './types';
import { logError } from '@/lib/logger'
import { invalidateBrandingCache } from '@/hooks/use-branding'

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
  
  const handleBrandingUpload = async (file: File, type: 'logo' | 'favicon') => {
    const setUploading = type === 'logo' ? setIsUploadingLogo : setIsUploadingFavicon;
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await fetch('/api/branding/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        const urlKey = type === 'logo' ? 'logoUrl' : 'faviconUrl';
        handleChange(urlKey, result.file.url);
        invalidateBrandingCache();
        toast.success(result.message);
      } else {
        toast.error(result.error || 'Upload thất bại');
      }
    } catch (error) {
      logError('Branding upload error', error);
      toast.error('Không thể upload file');
    } finally {
      setUploading(false);
    }
  };
  
  const handleBrandingDelete = async (type: 'logo' | 'favicon') => {
    try {
      const response = await fetch(`/api/branding/${type}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        const urlKey = type === 'logo' ? 'logoUrl' : 'faviconUrl';
        handleChange(urlKey, '');
        invalidateBrandingCache();
        toast.success(result.message || 'Xóa thành công');
      } else {
        toast.error(result.error || 'Xóa thất bại');
      }
    } catch (error) {
      logError('Branding delete error', error);
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
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
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
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
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
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
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

      {/* Bảo mật mật khẩu */}
      <PasswordRulesCard />

      {/* Xác thực OTP khi đăng nhập */}
      <OtpLoginCard />

      {/* Giới hạn kích thước file */}
      <FileSizeLimitsCard />
    </div>
  );
}

// ============================================================================
// Password Rules Card (reads/writes Setting table, group='security')
// ============================================================================

interface PasswordRules {
  minLength: number;
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

const DEFAULT_PASSWORD_RULES: PasswordRules = {
  minLength: 8,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
};

function PasswordRulesCard() {
  const queryClient = useQueryClient();
  const [localRules, setLocalRules] = React.useState<PasswordRules>(DEFAULT_PASSWORD_RULES);
  const [hasChanges, setHasChanges] = React.useState(false);

  const { data: rules } = useQuery({
    queryKey: ['settings', 'password-rules'],
    queryFn: async () => {
      const res = await fetch('/api/settings/password-rules');
      if (!res.ok) return DEFAULT_PASSWORD_RULES;
      return (await res.json()) as PasswordRules;
    },
    staleTime: 5 * 60 * 1000,
  });

  React.useEffect(() => {
    if (rules) {
      setLocalRules(rules);
      setHasChanges(false);
    }
  }, [rules]);

  const mutation = useMutation({
    mutationFn: async (data: PasswordRules) => {
      const res = await fetch('/api/settings/password-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Lỗi lưu cài đặt');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'password-rules'] });
      toast.success('Đã lưu quy tắc mật khẩu');
      setHasChanges(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateRule = <K extends keyof PasswordRules>(key: K, value: PasswordRules[K]) => {
    setLocalRules(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Quy tắc mật khẩu
            </CardTitle>
            <CardDescription>Yêu cầu bảo mật khi đổi mật khẩu</CardDescription>
          </div>
          {hasChanges && (
            <Button size="sm" onClick={() => mutation.mutate(localRules)} disabled={mutation.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {mutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Độ dài tối thiểu</Label>
            <Input
              type="number"
              min={6}
              max={32}
              value={localRules.minLength}
              onChange={(e) => updateRule('minLength', parseInt(e.target.value) || 6)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label className="cursor-pointer">Chữ in hoa (A-Z)</Label>
            <Switch checked={localRules.requireUppercase} onCheckedChange={(v) => updateRule('requireUppercase', v)} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label className="cursor-pointer">Chữ số (0-9)</Label>
            <Switch checked={localRules.requireNumbers} onCheckedChange={(v) => updateRule('requireNumbers', v)} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <Label className="cursor-pointer">Ký tự đặc biệt (!@#$)</Label>
            <Switch checked={localRules.requireSpecialChars} onCheckedChange={(v) => updateRule('requireSpecialChars', v)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// OTP Login Card (reads/writes Setting table, group='security', key='otp_login')
// ============================================================================

function OtpLoginCard() {
  const queryClient = useQueryClient();
  const [enabled, setEnabled] = React.useState(false);

  const { data } = useQuery({
    queryKey: ['settings', 'otp-login'],
    queryFn: async () => {
      const res = await fetch('/api/settings/otp-login');
      if (!res.ok) return { enabled: false };
      return (await res.json()) as { enabled: boolean };
    },
    staleTime: 5 * 60 * 1000,
  });

  React.useEffect(() => {
    if (data) setEnabled(data.enabled);
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (value: boolean) => {
      const res = await fetch('/api/settings/otp-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: value }),
      });
      if (!res.ok) throw new Error('Lỗi lưu cài đặt');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'otp-login'] });
      toast.success(enabled ? 'Đã bật xác thực OTP khi đăng nhập' : 'Đã tắt xác thực OTP khi đăng nhập');
    },
    onError: (err) => toast.error(err.message),
  });

  const handleToggle = (value: boolean) => {
    setEnabled(value);
    mutation.mutate(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Xác thực OTP khi đăng nhập
        </CardTitle>
        <CardDescription>Yêu cầu nhập mã OTP gửi qua email sau khi đăng nhập thành công</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div>
            <Label className="cursor-pointer">Bật xác thực OTP</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Sau khi nhập đúng email và mật khẩu, hệ thống sẽ gửi mã OTP 6 số qua email để xác nhận
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={mutation.isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// File Size Limits Card (reads/writes Setting table, group='media')
// ============================================================================

interface FileSizeLimits {
  imageMb: number;
  documentMb: number;
  generalMb: number;
}

const DEFAULT_FILE_SIZE_LIMITS: FileSizeLimits = {
  imageMb: 10,
  documentMb: 50,
  generalMb: 20,
};

function FileSizeLimitsCard() {
  const queryClient = useQueryClient();
  const [localLimits, setLocalLimits] = React.useState<FileSizeLimits>(DEFAULT_FILE_SIZE_LIMITS);
  const [hasChanges, setHasChanges] = React.useState(false);

  const { data: limits } = useQuery({
    queryKey: ['settings', 'file-size-limits'],
    queryFn: async () => {
      const res = await fetch('/api/settings/file-size-limits');
      if (!res.ok) return DEFAULT_FILE_SIZE_LIMITS;
      return (await res.json()) as FileSizeLimits;
    },
    staleTime: 5 * 60 * 1000,
  });

  React.useEffect(() => {
    if (limits) {
      setLocalLimits(limits);
      setHasChanges(false);
    }
  }, [limits]);

  const mutation = useMutation({
    mutationFn: async (data: FileSizeLimits) => {
      const res = await fetch('/api/settings/file-size-limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Lỗi lưu cài đặt');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'file-size-limits'] });
      toast.success('Đã lưu giới hạn kích thước file');
      setHasChanges(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateLimit = <K extends keyof FileSizeLimits>(key: K, value: FileSizeLimits[K]) => {
    setLocalLimits(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Giới hạn kích thước file
            </CardTitle>
            <CardDescription>Giới hạn dung lượng tối đa khi upload (áp dụng toàn hệ thống)</CardDescription>
          </div>
          {hasChanges && (
            <Button size="sm" onClick={() => mutation.mutate(localLimits)} disabled={mutation.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {mutation.isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Ảnh (MB)</Label>
            <Input
              type="number"
              min={1}
              max={100}
              value={localLimits.imageMb}
              onChange={(e) => updateLimit('imageMb', parseInt(e.target.value) || 1)}
            />
            <p className="text-xs text-muted-foreground">JPG, PNG, WebP, GIF...</p>
          </div>
          <div className="space-y-2">
            <Label>Tài liệu (MB)</Label>
            <Input
              type="number"
              min={1}
              max={200}
              value={localLimits.documentMb}
              onChange={(e) => updateLimit('documentMb', parseInt(e.target.value) || 1)}
            />
            <p className="text-xs text-muted-foreground">PDF, DOC, XLS, CSV...</p>
          </div>
          <div className="space-y-2">
            <Label>File khác (MB)</Label>
            <Input
              type="number"
              min={1}
              max={100}
              value={localLimits.generalMb}
              onChange={(e) => updateLimit('generalMb', parseInt(e.target.value) || 1)}
            />
            <p className="text-xs text-muted-foreground">Các loại file khác</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

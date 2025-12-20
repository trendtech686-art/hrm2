import * as React from 'react';
import { Save, Monitor, Globe, Bell, Shield, Upload, Plug, Gauge, Building, Clock, Mail, Palette, Image, FileText, Database, MessageSquare, Send, UserCog, CheckCircle, XCircle, AlertTriangle, Trash2, RefreshCw, HardDrive, Cpu, MemoryStick, Wifi, Server, Activity, Zap, Settings, Download, Cloud, FolderArchive, Code, History, GitBranch, Calendar, ExternalLink, Play, Pause, RotateCcw, Info, Terminal, Package, Layers, FileCode, ChevronRight, CircleDot, Smartphone, Key, QrCode, Eye, EyeOff, ImagePlus, Camera, Search, Plus, Pencil, Lock, ChevronLeft, ChevronsLeft, ChevronsRight, FileX, ScrollText, Target, FileEdit } from 'lucide-react';
import { useSettingsPageHeader } from './use-settings-page-header';
import { TabsContent } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Slider } from '../../components/ui/slider';
import { Progress } from '../../components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { SettingsVerticalTabs } from '../../components/settings/SettingsVerticalTabs';
import { SettingsActionButton } from '../../components/settings/SettingsActionButton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { TipTapEditor } from '../../components/ui/tiptap-editor';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { useTabActionRegistry, type RegisterTabActions } from './use-tab-action-registry';
import { useGlobalSettingsStore, useDefaultPageSize, usePageSizeOptions } from './global-settings-store';
import { useNotificationSettings } from '../../hooks/use-due-date-notifications';
import { formatDateForDisplay } from '@/lib/date-utils';
import { toast } from 'sonner';

type TabContentProps = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

// ═══════════════════════════════════════════════════════════════
// TAB: GENERAL SETTINGS (Chung)
// ═══════════════════════════════════════════════════════════════

interface GeneralSettings {
  // Thông tin doanh nghiệp
  companyName: string;
  companyAddress: string;
  taxCode: string;
  phoneNumber: string;
  website: string;
  email: string;
  legalRepresentative: string;
  adminEmail: string;
  defaultRole: string;
  // Branding
  logoUrl: string;
  faviconUrl: string;
  // Định dạng hệ thống
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  // Hiển thị
  defaultPageSize: number;
  thousandSeparator: string;
  decimalSeparator: string;
  // Ngôn ngữ
  language: string;
}

const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  companyName: '',
  companyAddress: '',
  taxCode: '',
  phoneNumber: '',
  website: '',
  email: '',
  legalRepresentative: '',
  adminEmail: '',
  defaultRole: 'employee',
  logoUrl: '',
  faviconUrl: '',
  timezone: 'Asia/Ho_Chi_Minh',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  currency: 'VND',
  defaultPageSize: 20,
  thousandSeparator: '.',
  decimalSeparator: ',',
  language: 'vi',
};

function GeneralTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const [settings, setSettings] = React.useState<GeneralSettings>(() => {
    try {
      const stored = localStorage.getItem('general-settings');
      if (stored) return { ...DEFAULT_GENERAL_SETTINGS, ...JSON.parse(stored) };
    } catch (e) { /* ignore */ }
    return DEFAULT_GENERAL_SETTINGS;
  });
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = React.useState(false);
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const faviconInputRef = React.useRef<HTMLInputElement>(null);
  const originalSettings = React.useRef(JSON.stringify(settings));
  
  React.useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== originalSettings.current);
  }, [settings]);
  
  const handleChange = <K extends keyof GeneralSettings>(key: K, value: GeneralSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
  
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
  
  const handleSave = React.useCallback(() => {
    setIsSaving(true);
    try {
      localStorage.setItem('general-settings', JSON.stringify(settings));
      originalSettings.current = JSON.stringify(settings);
      toast.success('Đã lưu cài đặt chung');
      setHasChanges(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  }, [settings]);
  
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="save-general" onClick={handleSave} disabled={!hasChanges || isSaving}>
        <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </SettingsActionButton>,
    ]);
  }, [isActive, hasChanges, isSaving, handleSave, onRegisterActions]);

  return (
    <div className="space-y-6">
      {/* Thông tin doanh nghiệp */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Thông tin doanh nghiệp
          </CardTitle>
          <CardDescription>Thông tin định danh cơ bản, hiển thị trên báo cáo và hợp đồng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Tên công ty <span className="text-destructive">*</span></Label>
              <Input id="companyName" value={settings.companyName} onChange={(e) => handleChange('companyName', e.target.value)} placeholder="VD: Công ty TNHH ABC" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxCode">Mã số thuế</Label>
              <Input id="taxCode" value={settings.taxCode} onChange={(e) => handleChange('taxCode', e.target.value)} placeholder="VD: 0123456789" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Địa chỉ</Label>
            <Input id="companyAddress" value={settings.companyAddress} onChange={(e) => handleChange('companyAddress', e.target.value)} placeholder="VD: 123 Nguyễn Văn A, Quận 1, TP.HCM" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input id="phoneNumber" value={settings.phoneNumber} onChange={(e) => handleChange('phoneNumber', e.target.value)} placeholder="VD: 028 1234 5678" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email liên hệ</Label>
              <Input id="email" type="email" value={settings.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="VD: info@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={settings.website} onChange={(e) => handleChange('website', e.target.value)} placeholder="VD: https://company.com" />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="legalRepresentative">Người đại diện pháp luật</Label>
              <Input id="legalRepresentative" value={settings.legalRepresentative} onChange={(e) => handleChange('legalRepresentative', e.target.value)} placeholder="VD: Nguyễn Văn A" />
              <p className="text-xs text-muted-foreground">Tên người ký mặc định trên hợp đồng/quyết định</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email quản trị (Admin)</Label>
              <Input id="adminEmail" type="email" value={settings.adminEmail} onChange={(e) => handleChange('adminEmail', e.target.value)} placeholder="VD: admin@company.com" />
              <p className="text-xs text-muted-foreground">Nhận thông báo lỗi hệ thống, báo cáo tổng hợp</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                    <img src={settings.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
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
                    <img src={settings.faviconUrl} alt="Favicon" className="max-w-full max-h-full object-contain" />
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

// ═══════════════════════════════════════════════════════════════
// TAB: SECURITY SETTINGS (Bảo mật)
// ═══════════════════════════════════════════════════════════════

interface SecuritySettings {
  minPasswordLength: number;
  requireUppercase: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  enableTwoFactor: boolean;
  twoFactorMethod: 'email' | 'app' | 'sms';
  enableOtpEmail: boolean;
  otpEmailExpireMinutes: number;
}

const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  minPasswordLength: 6,
  requireUppercase: false,
  requireNumber: false,
  requireSpecialChar: false,
  sessionTimeoutMinutes: 0, // 0 = no timeout
  maxLoginAttempts: 5,
  enableTwoFactor: false,
  twoFactorMethod: 'email',
  enableOtpEmail: false,
  otpEmailExpireMinutes: 5,
};

function SecurityTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const [settings, setSettings] = React.useState<SecuritySettings>(() => {
    try {
      const stored = localStorage.getItem('security-settings');
      if (stored) return { ...DEFAULT_SECURITY_SETTINGS, ...JSON.parse(stored) };
    } catch (e) { /* ignore */ }
    return DEFAULT_SECURITY_SETTINGS;
  });
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const originalSettings = React.useRef(JSON.stringify(settings));
  
  React.useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== originalSettings.current);
  }, [settings]);
  
  const handleChange = <K extends keyof SecuritySettings>(key: K, value: SecuritySettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = React.useCallback(() => {
    setIsSaving(true);
    try {
      localStorage.setItem('security-settings', JSON.stringify(settings));
      originalSettings.current = JSON.stringify(settings);
      toast.success('Đã lưu cài đặt bảo mật');
      setHasChanges(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  }, [settings]);
  
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="save-security" onClick={handleSave} disabled={!hasChanges || isSaving}>
        <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </SettingsActionButton>,
    ]);
  }, [isActive, hasChanges, isSaving, handleSave, onRegisterActions]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Quy tắc mật khẩu
          </CardTitle>
          <CardDescription>Cấu hình yêu cầu cho mật khẩu người dùng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="minPasswordLength">Độ dài tối thiểu</Label>
            <div className="flex items-center gap-2">
              <Slider id="minPasswordLength" min={4} max={20} step={1} value={[settings.minPasswordLength]} onValueChange={([val]) => handleChange('minPasswordLength', val)} className="flex-1" />
              <Badge variant="secondary">{settings.minPasswordLength} ký tự</Badge>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Yêu cầu chữ in hoa</Label>
              <p className="text-sm text-muted-foreground">Mật khẩu phải chứa ít nhất 1 chữ in hoa (A-Z)</p>
            </div>
            <Switch checked={settings.requireUppercase} onCheckedChange={(val) => handleChange('requireUppercase', val)} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Yêu cầu số</Label>
              <p className="text-sm text-muted-foreground">Mật khẩu phải chứa ít nhất 1 chữ số (0-9)</p>
            </div>
            <Switch checked={settings.requireNumber} onCheckedChange={(val) => handleChange('requireNumber', val)} />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Yêu cầu ký tự đặc biệt</Label>
              <p className="text-sm text-muted-foreground">Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (!@#$...)</p>
            </div>
            <Switch checked={settings.requireSpecialChar} onCheckedChange={(val) => handleChange('requireSpecialChar', val)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phiên đăng nhập</CardTitle>
          <CardDescription>Cấu hình bảo mật phiên làm việc</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Tự động đăng xuất sau (phút)</Label>
              <Input id="sessionTimeout" type="number" min={0} max={480} value={settings.sessionTimeoutMinutes} onChange={(e) => handleChange('sessionTimeoutMinutes', parseInt(e.target.value) || 0)} />
              <p className="text-xs text-muted-foreground">Đặt 0 để tắt tự động đăng xuất</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Số lần đăng nhập sai tối đa</Label>
              <Input id="maxLoginAttempts" type="number" min={1} max={10} value={settings.maxLoginAttempts} onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value) || 5)} />
              <p className="text-xs text-muted-foreground">Khóa tài khoản sau số lần này</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Xác thực 2 yếu tố (2FA)</Label>
              <p className="text-sm text-muted-foreground">Yêu cầu xác thực bổ sung khi đăng nhập</p>
            </div>
            <Switch checked={settings.enableTwoFactor} onCheckedChange={(val) => handleChange('enableTwoFactor', val)} />
          </div>

          {settings.enableTwoFactor && (
            <>
              <div className="ml-6 p-4 rounded-lg border bg-muted/30 space-y-4">
                <Label className="text-sm font-medium">Phương thức xác thực</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div 
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${settings.twoFactorMethod === 'email' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                    onClick={() => handleChange('twoFactorMethod', 'email')}
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">Email OTP</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Gửi mã OTP qua email</p>
                  </div>
                  <div 
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${settings.twoFactorMethod === 'app' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                    onClick={() => handleChange('twoFactorMethod', 'app')}
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span className="font-medium">Authenticator App</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Google/Microsoft Auth</p>
                  </div>
                  <div 
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${settings.twoFactorMethod === 'sms' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                    onClick={() => handleChange('twoFactorMethod', 'sms')}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="font-medium">SMS OTP</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Gửi mã qua tin nhắn</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">OTP qua Email khi đăng nhập</Label>
              <p className="text-sm text-muted-foreground">Gửi mã xác thực một lần qua email Gmail</p>
            </div>
            <Switch checked={settings.enableOtpEmail} onCheckedChange={(val) => handleChange('enableOtpEmail', val)} />
          </div>

          {settings.enableOtpEmail && (
            <div className="ml-6 p-4 rounded-lg border bg-muted/30 space-y-4">
              <div className="space-y-2 max-w-xs">
                <Label>Thời gian hết hạn OTP (phút)</Label>
                <Select 
                  value={String(settings.otpEmailExpireMinutes)} 
                  onValueChange={(val) => handleChange('otpEmailExpireMinutes', parseInt(val))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 phút</SelectItem>
                    <SelectItem value="5">5 phút</SelectItem>
                    <SelectItem value="10">10 phút</SelectItem>
                    <SelectItem value="15">15 phút</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium">Yêu cầu cấu hình SMTP</p>
                    <p className="text-xs mt-1">Đảm bảo đã cấu hình Email SMTP trong tab "Email SMTP" để gửi OTP</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB: MEDIA SETTINGS (Tệp tin)
// ═══════════════════════════════════════════════════════════════

interface MediaSettings {
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
  maxImagesEmployeeLegal: number;      // Giấy tờ pháp lý (CCCD, BHXH, Hộ khẩu...)
  maxImagesEmployeeWorkProcess: number; // Hồ sơ công việc (HDLD, HDTV...)
  maxImagesEmployeeTermination: number; // Hồ sơ nghỉ việc
  maxImagesEmployeeDecisions: number;   // Quyết định (Bổ nhiệm, Điều chuyển...)
  maxImagesEmployeeKpi: number;         // Đánh giá KPI
  maxImagesEmployeeRequests: number;    // Đơn từ (Nghỉ phép, Tạm ứng...)
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

const DEFAULT_MEDIA_SETTINGS: MediaSettings = {
  maxFileSizeMB: 10,
  imageMaxWidth: 1200,
  imageMaxHeight: 1200,
  imageQuality: 0.8,
  thumbnailSize: 200,
  enableWebpConversion: true,
  enableImageCompression: true,
  // Giới hạn số ảnh
  maxImagesProduct: 9,
  // Employee document types
  maxImagesEmployeeLegal: 10,       // CCCD 2 mặt, BHXH, Hộ khẩu, Giấy khai sinh...
  maxImagesEmployeeWorkProcess: 10, // HDLD, Phụ lục, HDTV...
  maxImagesEmployeeTermination: 5,  // Đơn xin nghỉ, Quyết định nghỉ, Biên bản...
  maxImagesEmployeeDecisions: 5,    // Quyết định bổ nhiệm, điều chuyển...
  maxImagesEmployeeKpi: 5,          // Bảng đánh giá KPI
  maxImagesEmployeeRequests: 5,     // Đơn nghỉ phép, tạm ứng...
  // Other features
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

function MediaTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const [settings, setSettings] = React.useState<MediaSettings>(() => {
    try {
      const stored = localStorage.getItem('media-settings');
      if (stored) return { ...DEFAULT_MEDIA_SETTINGS, ...JSON.parse(stored) };
    } catch (e) { /* ignore */ }
    return DEFAULT_MEDIA_SETTINGS;
  });
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const originalSettings = React.useRef(JSON.stringify(settings));
  
  React.useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== originalSettings.current);
  }, [settings]);
  
  const handleChange = <K extends keyof MediaSettings>(key: K, value: MediaSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = React.useCallback(() => {
    setIsSaving(true);
    try {
      localStorage.setItem('media-settings', JSON.stringify(settings));
      originalSettings.current = JSON.stringify(settings);
      toast.success('Đã lưu cài đặt tệp tin');
      setHasChanges(false);
    } catch (error) {
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

// ═══════════════════════════════════════════════════════════════
// TAB: INTEGRATION SETTINGS (Tích hợp)
// ═══════════════════════════════════════════════════════════════

interface IntegrationSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpFromEmail: string;
  smtpFromName: string;
  enableTLS: boolean;
}

const DEFAULT_INTEGRATION_SETTINGS: IntegrationSettings = {
  smtpHost: '',
  smtpPort: 587,
  smtpUser: '',
  smtpPassword: '',
  smtpFromEmail: '',
  smtpFromName: '',
  enableTLS: true,
};

function IntegrationTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const [settings, setSettings] = React.useState<IntegrationSettings>(() => {
    try {
      const stored = localStorage.getItem('integration-settings');
      if (stored) return { ...DEFAULT_INTEGRATION_SETTINGS, ...JSON.parse(stored) };
    } catch (e) { /* ignore */ }
    return DEFAULT_INTEGRATION_SETTINGS;
  });
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [showToken, setShowToken] = React.useState(false);
  const originalSettings = React.useRef(JSON.stringify(settings));
  
  React.useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== originalSettings.current);
  }, [settings]);
  
  const handleChange = <K extends keyof IntegrationSettings>(key: K, value: IntegrationSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = React.useCallback(() => {
    setIsSaving(true);
    try {
      localStorage.setItem('integration-settings', JSON.stringify(settings));
      originalSettings.current = JSON.stringify(settings);
      toast.success('Đã lưu cài đặt tích hợp');
      setHasChanges(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  }, [settings]);
  
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="save-integration" onClick={handleSave} disabled={!hasChanges || isSaving}>
        <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </SettingsActionButton>,
    ]);
  }, [isActive, hasChanges, isSaving, handleSave, onRegisterActions]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email SMTP
          </CardTitle>
          <CardDescription>Cấu hình máy chủ gửi email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input id="smtpHost" value={settings.smtpHost} onChange={(e) => handleChange('smtpHost', e.target.value)} placeholder="VD: smtp.gmail.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input id="smtpPort" type="number" value={settings.smtpPort} onChange={(e) => handleChange('smtpPort', parseInt(e.target.value) || 587)} placeholder="587" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpUser">Tên đăng nhập</Label>
              <Input id="smtpUser" value={settings.smtpUser} onChange={(e) => handleChange('smtpUser', e.target.value)} placeholder="your-email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">Mật khẩu</Label>
              <div className="flex gap-2">
                <Input id="smtpPassword" type={showToken ? 'text' : 'password'} value={settings.smtpPassword} onChange={(e) => handleChange('smtpPassword', e.target.value)} placeholder="Mật khẩu ứng dụng" className="flex-1" />
                <Button type="button" variant="outline" onClick={() => setShowToken(!showToken)}>
                  {showToken ? 'Ẩn' : 'Hiện'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Sử dụng App Password nếu dùng Gmail</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpFromEmail">Email người gửi</Label>
              <Input id="smtpFromEmail" type="email" value={settings.smtpFromEmail} onChange={(e) => handleChange('smtpFromEmail', e.target.value)} placeholder="noreply@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpFromName">Tên người gửi</Label>
              <Input id="smtpFromName" value={settings.smtpFromName} onChange={(e) => handleChange('smtpFromName', e.target.value)} placeholder="HRM System" />
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Bật TLS/SSL</Label>
              <p className="text-sm text-muted-foreground">Mã hóa kết nối đến máy chủ SMTP</p>
            </div>
            <Switch checked={settings.enableTLS} onCheckedChange={(val) => handleChange('enableTLS', val)} />
          </div>
        </CardContent>
      </Card>

      {/* Test email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Kiểm tra cấu hình
          </CardTitle>
          <CardDescription>Gửi email test để xác nhận cấu hình SMTP</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Email nhận test..." className="flex-1" />
            <Button variant="outline">
              <Send className="mr-2 h-4 w-4" />
              Gửi email test
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Đảm bảo đã lưu cấu hình trước khi gửi email test
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB: SYSTEM SETTINGS (Hệ thống) - Nâng cấp từ Performance
// ═══════════════════════════════════════════════════════════════

interface SystemRequirement {
  name: string;
  required: string;
  current: string;
  status: 'ok' | 'warning' | 'error';
  description?: string;
}

interface StorageInfo {
  used: number;
  total: number;
  percentage: number;
}

function SystemTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const [isChecking, setIsChecking] = React.useState(false);
  const [isCleaning, setIsCleaning] = React.useState(false);
  const [cleaningType, setCleaningType] = React.useState<string | null>(null);
  
  // System requirements check
  const [systemRequirements, setSystemRequirements] = React.useState<SystemRequirement[]>([
    { name: 'Trình duyệt', required: 'Chrome 90+, Firefox 88+, Safari 14+', current: '', status: 'ok' },
    { name: 'JavaScript', required: 'ES2020+', current: '', status: 'ok' },
    { name: 'LocalStorage', required: '5 MB', current: '', status: 'ok' },
    { name: 'Cookies', required: 'Enabled', current: '', status: 'ok' },
    { name: 'Kết nối mạng', required: 'Online', current: '', status: 'ok' },
  ]);

  // Storage info
  const [storageInfo, setStorageInfo] = React.useState<{
    localStorage: StorageInfo;
    sessionStorage: StorageInfo;
    cacheStorage: StorageInfo;
    images: { count: number; size: string };
  }>({
    localStorage: { used: 0, total: 5 * 1024 * 1024, percentage: 0 },
    sessionStorage: { used: 0, total: 5 * 1024 * 1024, percentage: 0 },
    cacheStorage: { used: 0, total: 50 * 1024 * 1024, percentage: 0 },
    images: { count: 0, size: '0 KB' },
  });

  // Database stats
  const [dbStats, setDbStats] = React.useState({
    totalRecords: 0,
    orphanedRecords: 0,
    duplicateRecords: 0,
    oldLogs: 0,
    tempData: 0,
  });

  // Check system on mount
  React.useEffect(() => {
    checkSystem();
    calculateStorage();
    // Simulate DB stats
    setDbStats({
      totalRecords: Math.floor(Math.random() * 10000) + 1000,
      orphanedRecords: Math.floor(Math.random() * 50),
      duplicateRecords: Math.floor(Math.random() * 20),
      oldLogs: Math.floor(Math.random() * 500) + 100,
      tempData: Math.floor(Math.random() * 100),
    });
  }, []);

  const checkSystem = () => {
    setIsChecking(true);
    
    // Detect browser
    const userAgent = navigator.userAgent;
    let browserInfo = 'Unknown';
    let browserStatus: 'ok' | 'warning' | 'error' = 'ok';
    
    if (userAgent.includes('Chrome')) {
      const version = userAgent.match(/Chrome\/(\d+)/)?.[1];
      browserInfo = `Chrome ${version}`;
      browserStatus = parseInt(version || '0') >= 90 ? 'ok' : 'warning';
    } else if (userAgent.includes('Firefox')) {
      const version = userAgent.match(/Firefox\/(\d+)/)?.[1];
      browserInfo = `Firefox ${version}`;
      browserStatus = parseInt(version || '0') >= 88 ? 'ok' : 'warning';
    } else if (userAgent.includes('Safari')) {
      browserInfo = 'Safari';
      browserStatus = 'ok';
    } else if (userAgent.includes('Edge')) {
      browserInfo = 'Edge';
      browserStatus = 'ok';
    }

    // Check localStorage
    let localStorageStatus: 'ok' | 'warning' | 'error' = 'ok';
    let localStorageInfo = 'Available';
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
    } catch (e) {
      localStorageStatus = 'error';
      localStorageInfo = 'Không khả dụng';
    }

    // Check cookies
    const cookiesEnabled = navigator.cookieEnabled;

    // Check network
    const isOnline = navigator.onLine;

    setSystemRequirements([
      { name: 'Trình duyệt', required: 'Chrome 90+, Firefox 88+, Safari 14+', current: browserInfo, status: browserStatus },
      { name: 'JavaScript', required: 'ES2020+', current: 'Enabled', status: 'ok' },
      { name: 'LocalStorage', required: '5 MB', current: localStorageInfo, status: localStorageStatus },
      { name: 'Cookies', required: 'Enabled', current: cookiesEnabled ? 'Enabled' : 'Disabled', status: cookiesEnabled ? 'ok' : 'error' },
      { name: 'Kết nối mạng', required: 'Online', current: isOnline ? 'Online' : 'Offline', status: isOnline ? 'ok' : 'error' },
    ]);

    setTimeout(() => setIsChecking(false), 500);
  };

  const calculateStorage = () => {
    // Calculate localStorage usage
    let localStorageUsed = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorageUsed += localStorage.getItem(key)?.length || 0;
      }
    }
    localStorageUsed *= 2; // UTF-16

    // Calculate sessionStorage usage
    let sessionStorageUsed = 0;
    for (let key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        sessionStorageUsed += sessionStorage.getItem(key)?.length || 0;
      }
    }
    sessionStorageUsed *= 2;

    setStorageInfo({
      localStorage: {
        used: localStorageUsed,
        total: 5 * 1024 * 1024,
        percentage: (localStorageUsed / (5 * 1024 * 1024)) * 100,
      },
      sessionStorage: {
        used: sessionStorageUsed,
        total: 5 * 1024 * 1024,
        percentage: (sessionStorageUsed / (5 * 1024 * 1024)) * 100,
      },
      cacheStorage: {
        used: Math.random() * 10 * 1024 * 1024,
        total: 50 * 1024 * 1024,
        percentage: Math.random() * 20,
      },
      images: {
        count: Math.floor(Math.random() * 500) + 50,
        size: `${(Math.random() * 100 + 10).toFixed(1)} MB`,
      },
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleClean = async (type: string) => {
    setIsCleaning(true);
    setCleaningType(type);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    switch (type) {
      case 'cache':
        // Clear cache-related localStorage items
        const cacheKeys = Object.keys(localStorage).filter(key => 
          key.includes('cache') || key.includes('query') || key.includes('temp')
        );
        cacheKeys.forEach(key => localStorage.removeItem(key));
        toast.success(`Đã xóa ${cacheKeys.length} mục cache`);
        break;
      case 'logs':
        setDbStats(prev => ({ ...prev, oldLogs: 0 }));
        toast.success('Đã xóa log cũ');
        break;
      case 'temp':
        sessionStorage.clear();
        setDbStats(prev => ({ ...prev, tempData: 0 }));
        toast.success('Đã xóa dữ liệu tạm');
        break;
      case 'orphaned':
        setDbStats(prev => ({ ...prev, orphanedRecords: 0 }));
        toast.success('Đã xóa dữ liệu mồ côi');
        break;
      case 'all':
        const keysToKeep = ['general-settings', 'security-settings', 'media-settings'];
        Object.keys(localStorage).forEach(key => {
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
          }
        });
        sessionStorage.clear();
        setDbStats({ totalRecords: dbStats.totalRecords, orphanedRecords: 0, duplicateRecords: 0, oldLogs: 0, tempData: 0 });
        toast.success('Đã dọn dẹp toàn bộ hệ thống');
        break;
    }
    
    calculateStorage();
    setIsCleaning(false);
    setCleaningType(null);
  };

  // Register header actions
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <Button key="check-system" variant="outline" onClick={checkSystem} disabled={isChecking}>
        <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
        {isChecking ? 'Đang kiểm tra...' : 'Kiểm tra lại'}
      </Button>,
    ]);
  }, [isActive, isChecking, onRegisterActions]);

  const getStatusIcon = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const allSystemOk = systemRequirements.every(r => r.status === 'ok');

  // Server & Environment info (simulated)
  const serverInfo = {
    nodeVersion: 'v20.10.0',
    npmVersion: '10.2.3',
    reactVersion: '18.2.0',
    viteVersion: '5.0.0',
    postgresVersion: '16.1',
    typescriptVersion: '5.3.3',
    tailwindVersion: '3.4.0',
    os: navigator.platform,
    memory: '16 GB',
    cpuCores: navigator.hardwareConcurrency || 4,
    uptime: '15 ngày 4 giờ 23 phút',
  };

  // Browser & Runtime info
  const browserInfo = React.useMemo(() => {
    const ua = navigator.userAgent;
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const viewportSize = `${window.innerWidth}x${window.innerHeight}`;
    const colorDepth = `${window.screen.colorDepth}-bit`;
    const language = navigator.language;
    const cookiesEnabled = navigator.cookieEnabled ? 'Có' : 'Không';
    const doNotTrack = navigator.doNotTrack === '1' ? 'Có' : 'Không';
    const online = navigator.onLine ? 'Online' : 'Offline';
    const deviceMemory = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'N/A';
    const connection = (navigator as any).connection;
    const networkType = connection?.effectiveType || 'N/A';
    
    return {
      userAgent: ua.length > 80 ? ua.substring(0, 80) + '...' : ua,
      screenRes,
      viewportSize,
      colorDepth,
      language,
      cookiesEnabled,
      doNotTrack,
      online,
      deviceMemory,
      networkType,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }, []);

  // API Endpoints info
  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
  const apiEndpoints = [
    { name: 'API Server', url: serverUrl + '/api', status: 'active' },
    { name: 'WebSocket', url: serverUrl.replace('http', 'ws') + '/ws', status: 'active' },
    { name: 'Upload Server', url: serverUrl + '/uploads', status: 'active' },
    { name: 'Branding API', url: serverUrl + '/api/branding', status: 'active' },
  ];

  // Environment Variables (safe to expose)
  const envInfo = React.useMemo(() => ({
    mode: import.meta.env.MODE || 'development',
    base: import.meta.env.BASE_URL || '/',
    serverUrl: import.meta.env.VITE_SERVER_URL || 'http://localhost:3001',
    serverPort: import.meta.env.VITE_SERVER_PORT || '3001',
    appName: import.meta.env.VITE_APP_NAME || 'HRM System',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
    buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
    isProd: import.meta.env.PROD,
    isDev: import.meta.env.DEV,
  }), []);

  // Feature Flags (for debugging)
  const featureFlags = React.useMemo(() => {
    const stored = localStorage.getItem('feature-flags');
    const defaults = {
      newDashboard: true,
      darkMode: true,
      notifications: true,
      analytics: true,
      multiLanguage: false,
      advancedFilters: true,
      exportPDF: true,
      webhooks: false,
      apiV2: false,
    };
    if (stored) {
      try {
        return { ...defaults, ...JSON.parse(stored) };
      } catch {
        return defaults;
      }
    }
    return defaults;
  }, []);

  // Installed packages info (for debugging)
  const installedPackages = [
    { name: '@tanstack/react-query', version: '5.17.0', category: 'Data Fetching' },
    { name: '@tanstack/react-table', version: '8.11.0', category: 'UI Components' },
    { name: 'react-router-dom', version: '6.21.0', category: 'Routing' },
    { name: 'zustand', version: '4.4.7', category: 'State Management' },
    { name: 'zod', version: '3.22.4', category: 'Validation' },
    { name: 'react-hook-form', version: '7.49.2', category: 'Forms' },
    { name: 'date-fns', version: '3.0.6', category: 'Date/Time' },
    { name: 'lucide-react', version: '0.303.0', category: 'Icons' },
    { name: 'recharts', version: '2.10.3', category: 'Charts' },
    { name: 'sonner', version: '1.3.1', category: 'Notifications' },
    { name: '@radix-ui/react-*', version: '1.x', category: 'UI Primitives' },
    { name: 'drizzle-orm', version: '0.29.1', category: 'Database ORM' },
    { name: 'hono', version: '3.11.0', category: 'Backend Framework' },
    { name: 'axios', version: '1.6.2', category: 'HTTP Client' },
    { name: 'multer', version: '1.4.5', category: 'File Upload' },
    { name: 'sharp', version: '0.33.0', category: 'Image Processing' },
  ];

  // Maintenance mode
  const [maintenanceMode, setMaintenanceMode] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Tình trạng hệ thống
          </CardTitle>
          <CardDescription>Tổng quan sức khỏe hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
            {allSystemOk ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500" />
                <div className="flex-1">
                  <p className="text-lg font-semibold text-green-600">Hệ thống hoạt động tốt</p>
                  <p className="text-sm text-muted-foreground">Tất cả các yêu cầu hệ thống đều đáp ứng</p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Uptime: {serverInfo.uptime}</p>
                  <p>CPU Cores: {serverInfo.cpuCores}</p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="h-12 w-12 text-yellow-500" />
                <div>
                  <p className="text-lg font-semibold text-yellow-600">Cần chú ý</p>
                  <p className="text-sm text-muted-foreground">Một số yêu cầu hệ thống chưa đáp ứng</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Server & Environment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Thông tin Server & Môi trường
          </CardTitle>
          <CardDescription>Chi tiết về cấu hình server và các phiên bản đang sử dụng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4 text-green-600" />
                <span className="text-xs text-muted-foreground">Node.js</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.nodeVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4 text-red-600" />
                <span className="text-xs text-muted-foreground">npm</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.npmVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Code className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">React</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.reactVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Code className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-muted-foreground">TypeScript</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.typescriptVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-muted-foreground">Vite</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.viteVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-cyan-500" />
                <span className="text-xs text-muted-foreground">Tailwind CSS</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.tailwindVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Database className="h-4 w-4 text-blue-700" />
                <span className="text-xs text-muted-foreground">PostgreSQL</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.postgresVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Server className="h-4 w-4 text-gray-600" />
                <span className="text-xs text-muted-foreground">Platform</span>
              </div>
              <p className="font-mono font-medium text-sm">{serverInfo.os}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="h-4 w-4 text-orange-600" />
                <span className="text-xs text-muted-foreground">CPU Cores</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.cpuCores}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-1">
                <MemoryStick className="h-4 w-4 text-cyan-600" />
                <span className="text-xs text-muted-foreground">Memory</span>
              </div>
              <p className="font-mono font-medium">{serverInfo.memory}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Browser & Runtime Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Thông tin trình duyệt & Runtime
          </CardTitle>
          <CardDescription>Thông tin môi trường chạy ứng dụng (debug info)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Độ phân giải màn hình</p>
              <p className="font-mono font-medium text-sm">{browserInfo.screenRes}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Viewport</p>
              <p className="font-mono font-medium text-sm">{browserInfo.viewportSize}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Độ sâu màu</p>
              <p className="font-mono font-medium text-sm">{browserInfo.colorDepth}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Ngôn ngữ</p>
              <p className="font-mono font-medium text-sm">{browserInfo.language}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Múi giờ</p>
              <p className="font-mono font-medium text-sm">{browserInfo.timezone}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Device Memory</p>
              <p className="font-mono font-medium text-sm">{browserInfo.deviceMemory}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Network Type</p>
              <p className="font-mono font-medium text-sm">{browserInfo.networkType}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Trạng thái</p>
              <Badge variant={browserInfo.online === 'Online' ? 'default' : 'destructive'} className="text-xs">
                {browserInfo.online}
              </Badge>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg border bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">User Agent</p>
            <code className="text-xs break-all">{browserInfo.userAgent}</code>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            API Endpoints
          </CardTitle>
          <CardDescription>Địa chỉ các dịch vụ API đang sử dụng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {apiEndpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${endpoint.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div>
                    <p className="font-medium text-sm">{endpoint.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{endpoint.url}</p>
                  </div>
                </div>
                <Badge variant={endpoint.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                  {endpoint.status === 'active' ? 'Hoạt động' : 'Lỗi'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Environment Variables
          </CardTitle>
          <CardDescription>Biến môi trường đang được sử dụng (an toàn để hiển thị)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Mode</p>
              <Badge variant={envInfo.mode === 'production' ? 'default' : 'secondary'}>
                {envInfo.mode}
              </Badge>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">App Name</p>
              <p className="font-medium text-sm">{envInfo.appName}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">App Version</p>
              <p className="font-mono font-medium text-sm">{envInfo.appVersion}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Server URL</p>
              <p className="font-mono text-xs break-all">{envInfo.serverUrl}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Server Port</p>
              <p className="font-mono font-medium text-sm">{envInfo.serverPort}</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Base URL</p>
              <p className="font-mono font-medium text-sm">{envInfo.base}</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg border bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">Build Time</p>
            <code className="text-xs">{envInfo.buildTime}</code>
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Feature Flags
          </CardTitle>
          <CardDescription>Trạng thái các tính năng trong hệ thống (chỉ đọc)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(featureFlags).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
                <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <Badge variant={value ? 'default' : 'outline'} className="text-xs">
                  {value ? 'ON' : 'OFF'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Installed Packages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Packages đã cài đặt ({installedPackages.length})
          </CardTitle>
          <CardDescription>Danh sách các thư viện và phiên bản đang sử dụng (debug info)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {installedPackages.map((pkg, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg border text-sm hover:bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs truncate">{pkg.name}</p>
                  <p className="text-xs text-muted-foreground">{pkg.category}</p>
                </div>
                <Badge variant="outline" className="text-xs ml-2 shrink-0">{pkg.version}</Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const packagesJson = JSON.stringify({
                  dependencies: Object.fromEntries(installedPackages.map(p => [p.name, p.version]))
                }, null, 2);
                navigator.clipboard.writeText(packagesJson);
                toast.success('Đã copy danh sách packages vào clipboard');
              }}
            >
              <Code className="mr-2 h-4 w-4" />
              Copy JSON
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const packagesText = installedPackages.map(p => `${p.name}@${p.version}`).join('\n');
                navigator.clipboard.writeText(packagesText);
                toast.success('Đã copy danh sách packages');
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Copy Text
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Requirements Check */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Kiểm tra cấu hình hệ thống
          </CardTitle>
          <CardDescription>Đảm bảo hệ thống đáp ứng các yêu cầu tối thiểu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemRequirements.map((req, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {getStatusIcon(req.status)}
                  <div>
                    <p className="font-medium">{req.name}</p>
                    <p className="text-xs text-muted-foreground">Yêu cầu: {req.required}</p>
                  </div>
                </div>
                <Badge variant={req.status === 'ok' ? 'default' : req.status === 'warning' ? 'secondary' : 'destructive'}>
                  {req.current}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Dung lượng lưu trữ
          </CardTitle>
          <CardDescription>Theo dõi và quản lý dung lượng sử dụng</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">LocalStorage</span>
                <span className="text-sm text-muted-foreground">
                  {formatBytes(storageInfo.localStorage.used)} / {formatBytes(storageInfo.localStorage.total)}
                </span>
              </div>
              <Progress value={storageInfo.localStorage.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{storageInfo.localStorage.percentage.toFixed(1)}% đã sử dụng</p>
            </div>
            
            <div className="p-4 rounded-lg border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">SessionStorage</span>
                <span className="text-sm text-muted-foreground">
                  {formatBytes(storageInfo.sessionStorage.used)} / {formatBytes(storageInfo.sessionStorage.total)}
                </span>
              </div>
              <Progress value={storageInfo.sessionStorage.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{storageInfo.sessionStorage.percentage.toFixed(1)}% đã sử dụng</p>
            </div>
            
            <div className="p-4 rounded-lg border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Cache Storage</span>
                <span className="text-sm text-muted-foreground">
                  {formatBytes(storageInfo.cacheStorage.used)} / {formatBytes(storageInfo.cacheStorage.total)}
                </span>
              </div>
              <Progress value={storageInfo.cacheStorage.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{storageInfo.cacheStorage.percentage.toFixed(1)}% đã sử dụng</p>
            </div>
            
            <div className="p-4 rounded-lg border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Hình ảnh</span>
                <span className="text-sm text-muted-foreground">{storageInfo.images.count} files</span>
              </div>
              <p className="text-2xl font-bold">{storageInfo.images.size}</p>
              <p className="text-xs text-muted-foreground">Tổng dung lượng ảnh đã upload</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Tối ưu dữ liệu
          </CardTitle>
          <CardDescription>Dọn dẹp và tối ưu hóa cơ sở dữ liệu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg border text-center">
              <p className="text-2xl font-bold text-primary">{dbStats.totalRecords.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Tổng bản ghi</p>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <p className="text-2xl font-bold text-yellow-600">{dbStats.orphanedRecords}</p>
              <p className="text-xs text-muted-foreground">Dữ liệu mồ côi</p>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <p className="text-2xl font-bold text-orange-600">{dbStats.oldLogs}</p>
              <p className="text-xs text-muted-foreground">Log cũ (30+ ngày)</p>
            </div>
            <div className="p-3 rounded-lg border text-center">
              <p className="text-2xl font-bold text-red-600">{dbStats.tempData}</p>
              <p className="text-xs text-muted-foreground">Dữ liệu tạm</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleClean('cache')} 
              disabled={isCleaning}
              className="justify-start"
            >
              {cleaningType === 'cache' ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
              Xóa cache
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleClean('logs')} 
              disabled={isCleaning || dbStats.oldLogs === 0}
              className="justify-start"
            >
              {cleaningType === 'logs' ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Xóa log cũ ({dbStats.oldLogs})
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleClean('temp')} 
              disabled={isCleaning || dbStats.tempData === 0}
              className="justify-start"
            >
              {cleaningType === 'temp' ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Xóa dữ liệu tạm ({dbStats.tempData})
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleClean('orphaned')} 
              disabled={isCleaning || dbStats.orphanedRecords === 0}
              className="justify-start"
            >
              {cleaningType === 'orphaned' ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
              Xóa dữ liệu mồ côi ({dbStats.orphanedRecords})
            </Button>
          </div>
          
          <Separator />
          
          <Button 
            variant="destructive" 
            onClick={() => handleClean('all')} 
            disabled={isCleaning}
            className="w-full"
          >
            {cleaningType === 'all' ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Dọn dẹp toàn bộ hệ thống
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Xóa tất cả cache, log cũ, dữ liệu tạm và dữ liệu mồ côi. Cài đặt hệ thống sẽ được giữ lại.
          </p>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Chế độ bảo trì
          </CardTitle>
          <CardDescription>Bật chế độ bảo trì khi cần nâng cấp hoặc sửa chữa hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="space-y-1">
              <p className="font-medium">Bật chế độ bảo trì</p>
              <p className="text-sm text-muted-foreground">
                Khi bật, người dùng sẽ không thể truy cập hệ thống (trừ admin)
              </p>
            </div>
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>
          
          {maintenanceMode && (
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">Chế độ bảo trì đang BẬT</p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Người dùng thông thường sẽ thấy trang thông báo bảo trì thay vì nội dung hệ thống.
                  </p>
                  <div className="space-y-2 pt-2">
                    <Label>Thông báo hiển thị cho người dùng</Label>
                    <Input 
                      placeholder="Hệ thống đang được bảo trì. Vui lòng quay lại sau..."
                      defaultValue="Hệ thống đang được bảo trì. Vui lòng quay lại sau..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Cài đặt hiệu suất
          </CardTitle>
          <CardDescription>Tinh chỉnh hiệu suất hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Lazy loading hình ảnh</p>
                <p className="text-xs text-muted-foreground">Chỉ tải ảnh khi cần thiết</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Prefetch trang tiếp theo</p>
                <p className="text-xs text-muted-foreground">Tải trước dữ liệu khi hover</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Nén dữ liệu truyền tải</p>
                <p className="text-xs text-muted-foreground">Giảm băng thông sử dụng</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Cache offline</p>
                <p className="text-xs text-muted-foreground">Hoạt động khi mất mạng</p>
              </div>
              <Switch />
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Thời gian cache (phút)</Label>
              <Select defaultValue="5">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 phút</SelectItem>
                  <SelectItem value="5">5 phút</SelectItem>
                  <SelectItem value="15">15 phút</SelectItem>
                  <SelectItem value="30">30 phút</SelectItem>
                  <SelectItem value="60">1 giờ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Số lần retry khi lỗi</Label>
              <Select defaultValue="3">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Không retry</SelectItem>
                  <SelectItem value="1">1 lần</SelectItem>
                  <SelectItem value="3">3 lần</SelectItem>
                  <SelectItem value="5">5 lần</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB: NOTIFICATION SETTINGS
// ═══════════════════════════════════════════════════════════════

function NotificationTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { getSettings, saveSettings, resetSettings } = useNotificationSettings();
  const [settings, setSettings] = React.useState(getSettings());
  const [hasChanges, setHasChanges] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasDesktopPermission, setHasDesktopPermission] = React.useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  React.useEffect(() => {
    const current = getSettings();
    const isDifferent = JSON.stringify(current) !== JSON.stringify(settings);
    setHasChanges(isDifferent);
  }, [settings, getSettings]);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleIntervalChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, checkInterval: value[0] }));
  };

  const handleSave = React.useCallback(() => {
    setIsSaving(true);
    try {
      saveSettings(settings);
      setHasChanges(false);
      toast.success('Đã lưu cài đặt thông báo');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  }, [settings, saveSettings]);

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasDesktopPermission(permission === 'granted');
      if (permission === 'granted') {
        toast.success('Đã cấp quyền thông báo desktop');
      } else {
        toast.error('Không được cấp quyền thông báo desktop');
      }
    }
  };

  // Register header actions
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton 
        key="save-notification"
        onClick={handleSave} 
        disabled={!hasChanges || isSaving}
      >
        <Save className="mr-2 h-4 w-4" /> 
        {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </SettingsActionButton>,
    ]);
  }, [isActive, hasChanges, isSaving, handleSave, onRegisterActions]);

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Cài đặt chung
          </CardTitle>
          <CardDescription>
            Bật/tắt và cấu hình thông báo nhắc nhở
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enabled" className="text-base font-medium">
                Bật thông báo
              </Label>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo về công việc sắp hết hạn
              </p>
            </div>
            <Switch
              id="enabled"
              checked={settings.enabled}
              onCheckedChange={() => handleToggle('enabled')}
            />
          </div>

          <Separator />

          {/* Check Interval */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="interval" className="text-base font-medium">
                Tần suất kiểm tra
              </Label>
              <Badge variant="secondary">{settings.checkInterval} phút</Badge>
            </div>
            <Slider
              id="interval"
              min={5}
              max={120}
              step={5}
              value={[settings.checkInterval]}
              onValueChange={handleIntervalChange}
              disabled={!settings.enabled}
            />
            <p className="text-sm text-muted-foreground">
              Hệ thống sẽ kiểm tra công việc hết hạn mỗi {settings.checkInterval} phút
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Loại thông báo</CardTitle>
          <CardDescription>
            Chọn các loại thông báo bạn muốn nhận
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="overdue" className="text-base font-medium">
                Công việc quá hạn
              </Label>
              <p className="text-sm text-muted-foreground">
                Thông báo quan trọng cho công việc đã quá hạn
              </p>
            </div>
            <Switch
              id="overdue"
              checked={settings.notifyOverdue}
              onCheckedChange={() => handleToggle('notifyOverdue')}
              disabled={!settings.enabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="today" className="text-base font-medium">
                Hết hạn hôm nay
              </Label>
              <p className="text-sm text-muted-foreground">
                Thông báo cho công việc hết hạn trong ngày
              </p>
            </div>
            <Switch
              id="today"
              checked={settings.notifyDueToday}
              onCheckedChange={() => handleToggle('notifyDueToday')}
              disabled={!settings.enabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="tomorrow" className="text-base font-medium">
                Hết hạn ngày mai
              </Label>
              <p className="text-sm text-muted-foreground">
                Thông báo trước 1 ngày
              </p>
            </div>
            <Switch
              id="tomorrow"
              checked={settings.notifyDueTomorrow}
              onCheckedChange={() => handleToggle('notifyDueTomorrow')}
              disabled={!settings.enabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="soon" className="text-base font-medium">
                Sắp hết hạn (3 ngày)
              </Label>
              <p className="text-sm text-muted-foreground">
                Thông báo trước 3 ngày
              </p>
            </div>
            <Switch
              id="soon"
              checked={settings.notifyDueSoon}
              onCheckedChange={() => handleToggle('notifyDueSoon')}
              disabled={!settings.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt nâng cao</CardTitle>
          <CardDescription>
            Tùy chọn hiển thị và âm thanh
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <Label htmlFor="desktop" className="text-base font-medium">
                Thông báo desktop
              </Label>
              <p className="text-sm text-muted-foreground">
                Hiển thị thông báo trên màn hình desktop
                {!hasDesktopPermission && ' (Cần cấp quyền)'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!hasDesktopPermission && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRequestPermission}
                >
                  Cấp quyền
                </Button>
              )}
              <Switch
                id="desktop"
                checked={settings.showDesktopNotification}
                onCheckedChange={() => handleToggle('showDesktopNotification')}
                disabled={!settings.enabled || !hasDesktopPermission}
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sound" className="text-base font-medium">
                Âm thanh thông báo
              </Label>
              <p className="text-sm text-muted-foreground">
                Phát âm thanh khi có thông báo mới
              </p>
            </div>
            <Switch
              id="sound"
              checked={settings.playSound}
              onCheckedChange={() => handleToggle('playSound')}
              disabled={!settings.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Kênh thông báo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Kênh gửi thông báo
          </CardTitle>
          <CardDescription>
            Bật/tắt các kênh gửi thông báo đến nhân viên
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Email</Label>
              <p className="text-sm text-muted-foreground">Gửi thông báo qua email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">SMS</Label>
              <p className="text-sm text-muted-foreground">Gửi tin nhắn SMS (cần cấu hình nhà cung cấp)</p>
            </div>
            <Switch disabled />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Push Notification</Label>
              <p className="text-sm text-muted-foreground">Thông báo đẩy trên app/web</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB: EMAIL TEMPLATES (Mẫu Email)
// ═══════════════════════════════════════════════════════════════

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  category: 'hr' | 'payroll' | 'system' | 'order' | 'warranty';
  trigger: string; // Trigger event/action
  enabled: boolean;
  isSystem?: boolean;
  lastModified?: Date;
  content?: string;
}

// Template variables grouped by category
const templateVariables = {
  employee: [
    { key: '{{name}}', label: 'Họ tên nhân viên' },
    { key: '{{email}}', label: 'Email nhân viên' },
    { key: '{{employee_id}}', label: 'Mã nhân viên' },
    { key: '{{department}}', label: 'Phòng ban' },
    { key: '{{position}}', label: 'Chức vụ' },
    { key: '{{phone}}', label: 'Số điện thoại' },
    { key: '{{join_date}}', label: 'Ngày vào làm' },
  ],
  company: [
    { key: '{{company}}', label: 'Tên công ty' },
    { key: '{{company_email}}', label: 'Email công ty' },
    { key: '{{company_phone}}', label: 'SĐT công ty' },
    { key: '{{company_address}}', label: 'Địa chỉ công ty' },
    { key: '{{company_logo}}', label: 'Logo công ty' },
  ],
  datetime: [
    { key: '{{date}}', label: 'Ngày hiện tại' },
    { key: '{{time}}', label: 'Giờ hiện tại' },
    { key: '{{month}}', label: 'Tháng' },
    { key: '{{year}}', label: 'Năm' },
    { key: '{{datetime}}', label: 'Ngày giờ đầy đủ' },
  ],
  order: [
    { key: '{{order_id}}', label: 'Mã đơn hàng' },
    { key: '{{order_total}}', label: 'Tổng tiền đơn' },
    { key: '{{order_status}}', label: 'Trạng thái đơn' },
    { key: '{{order_date}}', label: 'Ngày đặt hàng' },
    { key: '{{tracking_number}}', label: 'Mã vận đơn' },
  ],
  warranty: [
    { key: '{{warranty_id}}', label: 'Mã bảo hành' },
    { key: '{{product_name}}', label: 'Tên sản phẩm' },
    { key: '{{warranty_status}}', label: 'Trạng thái BH' },
    { key: '{{warranty_date}}', label: 'Ngày tiếp nhận' },
  ],
  security: [
    { key: '{{otp_code}}', label: 'Mã OTP' },
    { key: '{{reset_link}}', label: 'Link đặt lại MK' },
    { key: '{{login_time}}', label: 'Thời gian đăng nhập' },
    { key: '{{device_info}}', label: 'Thông tin thiết bị' },
    { key: '{{ip_address}}', label: 'Địa chỉ IP' },
  ],
  payroll: [
    { key: '{{salary}}', label: 'Lương cơ bản' },
    { key: '{{net_salary}}', label: 'Lương thực nhận' },
    { key: '{{bonus}}', label: 'Thưởng' },
    { key: '{{deduction}}', label: 'Khấu trừ' },
    { key: '{{payroll_month}}', label: 'Tháng lương' },
  ],
};

// Trigger options by category
const triggerOptions = {
  hr: [
    { value: 'employee_created', label: 'Khi tạo nhân viên mới' },
    { value: 'contract_expiring', label: 'Khi HĐ sắp hết hạn (30 ngày)' },
    { value: 'contract_expired', label: 'Khi HĐ đã hết hạn' },
    { value: 'leave_approved', label: 'Khi duyệt đơn nghỉ phép' },
    { value: 'leave_rejected', label: 'Khi từ chối đơn nghỉ phép' },
    { value: 'birthday', label: 'Khi đến ngày sinh nhật' },
    { value: 'work_anniversary', label: 'Khi đến ngày kỷ niệm' },
  ],
  payroll: [
    { value: 'payslip_ready', label: 'Khi có phiếu lương mới' },
    { value: 'advance_approved', label: 'Khi duyệt tạm ứng' },
    { value: 'advance_rejected', label: 'Khi từ chối tạm ứng' },
    { value: 'bonus_added', label: 'Khi thêm thưởng' },
  ],
  system: [
    { value: 'password_reset', label: 'Khi yêu cầu đặt lại MK' },
    { value: 'otp_login', label: 'Khi đăng nhập 2 lớp' },
    { value: 'unusual_login', label: 'Khi phát hiện đăng nhập lạ' },
    { value: 'account_locked', label: 'Khi tài khoản bị khóa' },
  ],
  order: [
    { value: 'order_created', label: 'Khi tạo đơn hàng' },
    { value: 'order_confirmed', label: 'Khi xác nhận đơn hàng' },
    { value: 'order_shipped', label: 'Khi giao hàng' },
    { value: 'order_delivered', label: 'Khi giao thành công' },
    { value: 'order_cancelled', label: 'Khi hủy đơn hàng' },
  ],
  warranty: [
    { value: 'warranty_received', label: 'Khi tiếp nhận bảo hành' },
    { value: 'warranty_processing', label: 'Khi đang xử lý' },
    { value: 'warranty_completed', label: 'Khi hoàn thành bảo hành' },
    { value: 'warranty_rejected', label: 'Khi từ chối bảo hành' },
  ],
};

function EmailTemplateTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const [hasChanges, setHasChanges] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [editingTemplate, setEditingTemplate] = React.useState<EmailTemplate | null>(null);
  
  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<'add' | 'edit' | 'view' | 'delete'>('add');
  const [selectedTemplate, setSelectedTemplate] = React.useState<EmailTemplate | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    subject: '',
    description: '',
    category: 'hr' as 'hr' | 'payroll' | 'system' | 'order' | 'warranty',
    trigger: '',
    content: '',
  });
  
  // Email templates data
  const [templates, setTemplates] = React.useState<EmailTemplate[]>([
    // HR Templates
    {
      id: '1',
      name: 'Chào mừng nhân viên mới',
      subject: 'Chào mừng {{name}} đến với {{company}}',
      description: 'Gửi khi tạo tài khoản nhân viên mới',
      category: 'hr',
      trigger: 'employee_created',
      enabled: true,
      lastModified: new Date(2025, 0, 15),
    },
    {
      id: '2',
      name: 'Cảnh báo hết hạn hợp đồng',
      subject: 'Thông báo: Hợp đồng của bạn sẽ hết hạn',
      description: 'Gửi trước 30 ngày khi hợp đồng sắp hết hạn',
      category: 'hr',
      trigger: 'contract_expiring',
      enabled: true,
      lastModified: new Date(2025, 0, 10),
    },
    {
      id: '3',
      name: 'Xác nhận nghỉ phép',
      subject: 'Đơn nghỉ phép của bạn đã được {{status}}',
      description: 'Gửi khi đơn nghỉ phép được duyệt hoặc từ chối',
      category: 'hr',
      trigger: 'leave_approved',
      enabled: true,
    },
    // Payroll Templates
    {
      id: '4',
      name: 'Thông báo phiếu lương',
      subject: 'Phiếu lương tháng {{month}}/{{year}}',
      description: 'Gửi khi có phiếu lương mới',
      category: 'payroll',
      trigger: 'payslip_ready',
      enabled: true,
      lastModified: new Date(2025, 0, 5),
    },
    {
      id: '5',
      name: 'Thông báo tạm ứng',
      subject: 'Xác nhận tạm ứng lương',
      description: 'Gửi khi yêu cầu tạm ứng được duyệt',
      category: 'payroll',
      trigger: 'advance_approved',
      enabled: false,
    },
    // System Templates
    {
      id: '6',
      name: 'Reset mật khẩu',
      subject: 'Đặt lại mật khẩu tài khoản',
      description: 'Gửi khi yêu cầu đặt lại mật khẩu',
      category: 'system',
      trigger: 'password_reset',
      enabled: true,
      isSystem: true,
    },
    {
      id: '7',
      name: 'Xác thực OTP',
      subject: 'Mã xác thực đăng nhập',
      description: 'Gửi mã OTP khi đăng nhập 2 lớp',
      category: 'system',
      trigger: 'otp_login',
      enabled: true,
      isSystem: true,
    },
    {
      id: '8',
      name: 'Thông báo đăng nhập bất thường',
      subject: 'Cảnh báo: Phát hiện đăng nhập bất thường',
      description: 'Gửi khi phát hiện đăng nhập từ thiết bị lạ',
      category: 'system',
      trigger: 'unusual_login',
      enabled: true,
      isSystem: true,
    },
    // Order Templates
    {
      id: '9',
      name: 'Xác nhận đơn hàng',
      subject: 'Đơn hàng #{{order_id}} đã được xác nhận',
      description: 'Gửi khi đơn hàng được tạo thành công',
      category: 'order',
      trigger: 'order_confirmed',
      enabled: true,
    },
    {
      id: '10',
      name: 'Cập nhật trạng thái đơn hàng',
      subject: 'Cập nhật đơn hàng #{{order_id}}',
      description: 'Gửi khi trạng thái đơn hàng thay đổi',
      category: 'order',
      trigger: 'order_shipped',
      enabled: true,
    },
    // Warranty Templates
    {
      id: '11',
      name: 'Xác nhận bảo hành',
      subject: 'Yêu cầu bảo hành #{{warranty_id}} đã được tiếp nhận',
      description: 'Gửi khi tiếp nhận yêu cầu bảo hành',
      category: 'warranty',
      trigger: 'warranty_received',
      enabled: true,
    },
    {
      id: '12',
      name: 'Hoàn thành bảo hành',
      subject: 'Bảo hành #{{warranty_id}} đã hoàn thành',
      description: 'Gửi khi hoàn thành sửa chữa/bảo hành',
      category: 'warranty',
      trigger: 'warranty_completed',
      enabled: true,
    },
  ]);

  const categories = [
    { value: 'all', label: 'Tất cả', count: templates.length },
    { value: 'hr', label: 'Nhân sự', count: templates.filter(t => t.category === 'hr').length },
    { value: 'payroll', label: 'Lương', count: templates.filter(t => t.category === 'payroll').length },
    { value: 'system', label: 'Hệ thống', count: templates.filter(t => t.category === 'system').length },
    { value: 'order', label: 'Đơn hàng', count: templates.filter(t => t.category === 'order').length },
    { value: 'warranty', label: 'Bảo hành', count: templates.filter(t => t.category === 'warranty').length },
  ];

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'hr': return 'default' as const;
      case 'payroll': return 'secondary' as const;
      case 'system': return 'outline' as const;
      case 'order': return 'default' as const;
      case 'warranty': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleTemplate = (templateId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, enabled: !t.enabled } : t
    ));
    setHasChanges(true);
  };

  // Dialog handlers
  const openAddDialog = () => {
    setDialogMode('add');
    setSelectedTemplate(null);
    setFormData({ name: '', subject: '', description: '', category: 'hr', trigger: '', content: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (template: EmailTemplate) => {
    setDialogMode(template.isSystem ? 'view' : 'edit');
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      description: template.description,
      category: template.category,
      trigger: template.trigger || '',
      content: template.content || '',
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (template: EmailTemplate) => {
    setDialogMode('delete');
    setSelectedTemplate(template);
    setIsDialogOpen(true);
  };

  // Get trigger label
  const getTriggerLabel = (category: string, trigger: string) => {
    const options = triggerOptions[category as keyof typeof triggerOptions] || [];
    return options.find(o => o.value === trigger)?.label || trigger;
  };

  const handleDialogSubmit = () => {
    if (dialogMode === 'add') {
      const newTemplate: EmailTemplate = {
        id: String(Date.now()),
        name: formData.name,
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        trigger: formData.trigger,
        content: formData.content,
        enabled: true,
        lastModified: new Date(),
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast.success('Đã thêm mẫu email mới');
    } else if (dialogMode === 'edit' && selectedTemplate) {
      setTemplates(prev => prev.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, name: formData.name, subject: formData.subject, description: formData.description, category: formData.category, trigger: formData.trigger, content: formData.content, lastModified: new Date() }
          : t
      ));
      toast.success('Đã cập nhật mẫu email');
    } else if (dialogMode === 'delete' && selectedTemplate) {
      setTemplates(prev => prev.filter(t => t.id !== selectedTemplate.id));
      toast.success('Đã xóa mẫu email');
    }
    setHasChanges(true);
    setIsDialogOpen(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success('Đã lưu cài đặt mẫu email');
    setHasChanges(false);
    setIsSaving(false);
  };

  // Register header actions
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <Button key="add-template" variant="outline" onClick={openAddDialog}>
        <Plus className="mr-2 h-4 w-4" />
        Thêm mẫu
      </Button>,
      <Button key="save" onClick={handleSave} disabled={!hasChanges || isSaving}>
        {isSaving ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Đang lưu...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Lưu thay đổi
          </>
        )}
      </Button>,
    ]);
  }, [isActive, hasChanges, isSaving, onRegisterActions]);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{templates.length}</p>
              <p className="text-xs text-muted-foreground">Tổng mẫu email</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{templates.filter(t => t.enabled).length}</p>
              <p className="text-xs text-muted-foreground">Đang hoạt động</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <XCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{templates.filter(t => !t.enabled).length}</p>
              <p className="text-xs text-muted-foreground">Đã tắt</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{templates.filter(t => t.isSystem).length}</p>
              <p className="text-xs text-muted-foreground">Mẫu hệ thống</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Danh sách mẫu Email
          </CardTitle>
          <CardDescription>
            Quản lý các mẫu email tự động gửi đến nhân viên, khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm mẫu email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label} ({cat.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Bật</TableHead>
                  <TableHead>Tên mẫu</TableHead>
                  <TableHead>Tiêu đề email</TableHead>
                  <TableHead className="w-28">Danh mục</TableHead>
                  <TableHead className="w-28">Loại</TableHead>
                  <TableHead className="w-32">Cập nhật</TableHead>
                  <TableHead className="w-24 text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <Mail className="h-12 w-12 mx-auto mb-3 opacity-50 text-muted-foreground" />
                      <p className="text-muted-foreground">Không tìm thấy mẫu email phù hợp</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTemplates.map((template) => (
                    <TableRow 
                      key={template.id}
                      className={!template.enabled ? 'opacity-60' : ''}
                    >
                      <TableCell>
                        <Switch
                          checked={template.enabled}
                          onCheckedChange={() => handleToggleTemplate(template.id)}
                          disabled={template.isSystem}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{template.description}</div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{template.subject}</code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getCategoryBadgeVariant(template.category)} className="text-xs">
                          {getCategoryLabel(template.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {template.isSystem ? (
                          <Badge variant="outline" className="text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Hệ thống
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Tùy chỉnh</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {template.lastModified 
                          ? formatDateForDisplay(template.lastModified) 
                          : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Xem trước"
                            onClick={() => openEditDialog(template)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title={template.isSystem ? 'Xem' : 'Chỉnh sửa'}
                            onClick={() => openEditDialog(template)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {!template.isSystem && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="Xóa"
                              onClick={() => openDeleteDialog(template)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Hiển thị {filteredTemplates.length} / {templates.length} mẫu email
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Email Template Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'add' && 'Thêm mẫu email mới'}
              {dialogMode === 'edit' && 'Chỉnh sửa mẫu email'}
              {dialogMode === 'view' && 'Chi tiết mẫu email'}
              {dialogMode === 'delete' && 'Xóa mẫu email'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'add' && 'Tạo mẫu email tự động mới cho hệ thống'}
              {dialogMode === 'edit' && 'Cập nhật thông tin mẫu email'}
              {dialogMode === 'view' && 'Xem chi tiết mẫu email hệ thống (không thể chỉnh sửa)'}
              {dialogMode === 'delete' && `Bạn có chắc muốn xóa mẫu "${selectedTemplate?.name}"?`}
            </DialogDescription>
          </DialogHeader>
          
          {dialogMode !== 'delete' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
              {/* Form fields - 2 columns */}
              <div className="lg:col-span-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Tên mẫu <span className="text-destructive">*</span></Label>
                  <Input
                    id="template-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="VD: Chào mừng nhân viên mới"
                    disabled={dialogMode === 'view'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-subject">Tiêu đề email <span className="text-destructive">*</span></Label>
                  <Input
                    id="template-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="VD: Chào mừng {{name}} đến với {{company}}"
                    disabled={dialogMode === 'view'}
                  />
                  <p className="text-xs text-muted-foreground">Sử dụng {'{{variable}}'} cho biến động</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-category">Danh mục <span className="text-destructive">*</span></Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(val: 'hr' | 'payroll' | 'system' | 'order' | 'warranty') => {
                        setFormData(prev => ({ ...prev, category: val, trigger: '' }));
                      }}
                      disabled={dialogMode === 'view'}
                    >
                      <SelectTrigger id="template-category"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">Nhân sự</SelectItem>
                        <SelectItem value="payroll">Lương</SelectItem>
                        <SelectItem value="order">Đơn hàng</SelectItem>
                        <SelectItem value="warranty">Bảo hành</SelectItem>
                        <SelectItem value="system">Hệ thống</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-trigger">Khi nào gửi <span className="text-destructive">*</span></Label>
                    <Select 
                      value={formData.trigger} 
                      onValueChange={(val) => setFormData(prev => ({ ...prev, trigger: val }))}
                      disabled={dialogMode === 'view'}
                    >
                      <SelectTrigger id="template-trigger"><SelectValue placeholder="Chọn sự kiện..." /></SelectTrigger>
                      <SelectContent>
                        {(triggerOptions[formData.category] || []).map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-description">Mô tả</Label>
                  <Input
                    id="template-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Mô tả ngắn về mẫu email này"
                    disabled={dialogMode === 'view'}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nội dung email</Label>
                  <TipTapEditor
                    content={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    placeholder="Nhập nội dung email tại đây..."
                    disabled={dialogMode === 'view'}
                    minHeight="250px"
                  />
                </div>
              </div>
              
              {/* Variables panel - 1 column */}
              <div className="space-y-4">
                <div className="sticky top-0">
                  <Label className="text-sm font-semibold">Biến mẫu có sẵn</Label>
                  <p className="text-xs text-muted-foreground mb-3">Click để copy, paste vào tiêu đề hoặc nội dung</p>
                  
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {/* Employee variables */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Nhân viên</p>
                      <div className="flex flex-wrap gap-1">
                        <TooltipProvider delayDuration={0}>
                          {templateVariables.employee.map(v => (
                            <Tooltip key={v.key}>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs font-mono px-2"
                                  onClick={() => {
                                    navigator.clipboard.writeText(v.key);
                                    toast.success(`Đã copy ${v.key}`);
                                  }}
                                >
                                  {v.key}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">{v.label}</TooltipContent>
                            </Tooltip>
                          ))}
                        </TooltipProvider>
                      </div>
                    </div>
                    
                    {/* Company variables */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Công ty</p>
                      <div className="flex flex-wrap gap-1">
                        <TooltipProvider delayDuration={0}>
                          {templateVariables.company.map(v => (
                            <Tooltip key={v.key}>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs font-mono px-2"
                                  onClick={() => {
                                    navigator.clipboard.writeText(v.key);
                                    toast.success(`Đã copy ${v.key}`);
                                  }}
                                >
                                  {v.key}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">{v.label}</TooltipContent>
                            </Tooltip>
                          ))}
                        </TooltipProvider>
                      </div>
                    </div>
                    
                    {/* Datetime variables */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Thời gian</p>
                      <div className="flex flex-wrap gap-1">
                        <TooltipProvider delayDuration={0}>
                          {templateVariables.datetime.map(v => (
                            <Tooltip key={v.key}>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs font-mono px-2"
                                  onClick={() => {
                                    navigator.clipboard.writeText(v.key);
                                    toast.success(`Đã copy ${v.key}`);
                                  }}
                                >
                                  {v.key}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">{v.label}</TooltipContent>
                            </Tooltip>
                          ))}
                        </TooltipProvider>
                      </div>
                    </div>
                    
                    {/* Category-specific variables */}
                    {formData.category === 'order' && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Đơn hàng</p>
                        <div className="flex flex-wrap gap-1">
                          <TooltipProvider delayDuration={0}>
                            {templateVariables.order.map(v => (
                              <Tooltip key={v.key}>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs font-mono px-2"
                                    onClick={() => {
                                      navigator.clipboard.writeText(v.key);
                                      toast.success(`Đã copy ${v.key}`);
                                    }}
                                  >
                                    {v.key}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">{v.label}</TooltipContent>
                              </Tooltip>
                            ))}
                          </TooltipProvider>
                        </div>
                      </div>
                    )}
                    
                    {formData.category === 'warranty' && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bảo hành</p>
                        <div className="flex flex-wrap gap-1">
                          <TooltipProvider delayDuration={0}>
                            {templateVariables.warranty.map(v => (
                              <Tooltip key={v.key}>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs font-mono px-2"
                                    onClick={() => {
                                      navigator.clipboard.writeText(v.key);
                                      toast.success(`Đã copy ${v.key}`);
                                    }}
                                  >
                                    {v.key}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">{v.label}</TooltipContent>
                              </Tooltip>
                            ))}
                          </TooltipProvider>
                        </div>
                      </div>
                    )}
                    
                    {formData.category === 'system' && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bảo mật</p>
                        <div className="flex flex-wrap gap-1">
                          <TooltipProvider delayDuration={0}>
                            {templateVariables.security.map(v => (
                              <Tooltip key={v.key}>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs font-mono px-2"
                                    onClick={() => {
                                      navigator.clipboard.writeText(v.key);
                                      toast.success(`Đã copy ${v.key}`);
                                    }}
                                  >
                                    {v.key}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">{v.label}</TooltipContent>
                              </Tooltip>
                            ))}
                          </TooltipProvider>
                        </div>
                      </div>
                    )}
                    
                    {formData.category === 'payroll' && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Lương</p>
                        <div className="flex flex-wrap gap-1">
                          <TooltipProvider delayDuration={0}>
                            {templateVariables.payroll.map(v => (
                              <Tooltip key={v.key}>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs font-mono px-2"
                                    onClick={() => {
                                      navigator.clipboard.writeText(v.key);
                                      toast.success(`Đã copy ${v.key}`);
                                    }}
                                  >
                                    {v.key}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">{v.label}</TooltipContent>
                              </Tooltip>
                            ))}
                          </TooltipProvider>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Hành động này không thể hoàn tác. Mẫu email sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {dialogMode === 'view' ? 'Đóng' : 'Hủy'}
            </Button>
            {dialogMode !== 'view' && (
              <Button 
                onClick={handleDialogSubmit}
                variant={dialogMode === 'delete' ? 'destructive' : 'default'}
                disabled={dialogMode !== 'delete' && (!formData.name || !formData.subject || !formData.trigger)}
              >
                {dialogMode === 'add' && 'Thêm mẫu'}
                {dialogMode === 'edit' && 'Lưu thay đổi'}
                {dialogMode === 'delete' && 'Xóa mẫu'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TAB: WEBSITE SETTINGS (Website)
// ═══════════════════════════════════════════════════════════════

interface Redirect301 {
  id: string;
  fromUrl: string;
  toUrl: string;
  isActive: boolean;
  hitCount: number;
  createdAt: string;
  updatedAt: string;
}

interface WebsiteSettings {
  // Domain
  primaryDomain: string;
  additionalDomains: string[];
  // SSL
  sslEnabled: boolean;
  forceHttps: boolean;
  sslCertExpiry: string;
  sslAutoRenew: boolean;
  // 404 Page
  custom404Enabled: boolean;
  custom404Title: string;
  custom404Content: string;
  custom404RedirectUrl: string;
  custom404RedirectDelay: number;
}

const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  primaryDomain: '',
  additionalDomains: [],
  sslEnabled: true,
  forceHttps: true,
  sslCertExpiry: '',
  sslAutoRenew: true,
  custom404Enabled: false,
  custom404Title: 'Trang không tồn tại',
  custom404Content: '<p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>',
  custom404RedirectUrl: '',
  custom404RedirectDelay: 5,
};

const SAMPLE_REDIRECTS: Redirect301[] = [
  { id: '1', fromUrl: '/old-page', toUrl: '/new-page', isActive: true, hitCount: 156, createdAt: '2024-12-01', updatedAt: '2024-12-15' },
  { id: '2', fromUrl: '/products/old-category', toUrl: '/san-pham/danh-muc-moi', isActive: true, hitCount: 89, createdAt: '2024-11-15', updatedAt: '2024-12-10' },
  { id: '3', fromUrl: '/about-us', toUrl: '/gioi-thieu', isActive: true, hitCount: 234, createdAt: '2024-10-20', updatedAt: '2024-11-05' },
  { id: '4', fromUrl: '/blog/old-post', toUrl: '/tin-tuc/bai-viet-moi', isActive: false, hitCount: 12, createdAt: '2024-09-10', updatedAt: '2024-09-10' },
];

function WebsiteTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const [settings, setSettings] = React.useState<WebsiteSettings>(() => {
    try {
      const stored = localStorage.getItem('website-settings');
      if (stored) return { ...DEFAULT_WEBSITE_SETTINGS, ...JSON.parse(stored) };
    } catch (e) { /* ignore */ }
    return DEFAULT_WEBSITE_SETTINGS;
  });
  
  const [redirects, setRedirects] = React.useState<Redirect301[]>(() => {
    try {
      const stored = localStorage.getItem('redirects-301');
      if (stored) return JSON.parse(stored);
    } catch (e) { /* ignore */ }
    return SAMPLE_REDIRECTS;
  });
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [newDomain, setNewDomain] = React.useState('');
  
  // Redirect search and filter
  const [redirectSearch, setRedirectSearch] = React.useState('');
  const [redirectFilter, setRedirectFilter] = React.useState<'all' | 'active' | 'inactive'>('all');
  const [redirectPage, setRedirectPage] = React.useState(1);
  const redirectsPerPage = 5;
  
  // Dialog states
  const [isRedirectDialogOpen, setIsRedirectDialogOpen] = React.useState(false);
  const [redirectDialogMode, setRedirectDialogMode] = React.useState<'add' | 'edit' | 'delete'>('add');
  const [selectedRedirect, setSelectedRedirect] = React.useState<Redirect301 | null>(null);
  const [redirectFormData, setRedirectFormData] = React.useState({ fromUrl: '', toUrl: '', isActive: true });
  
  const originalSettings = React.useRef(JSON.stringify(settings));
  const originalRedirects = React.useRef(JSON.stringify(redirects));
  
  React.useEffect(() => {
    const settingsChanged = JSON.stringify(settings) !== originalSettings.current;
    const redirectsChanged = JSON.stringify(redirects) !== originalRedirects.current;
    setHasChanges(settingsChanged || redirectsChanged);
  }, [settings, redirects]);
  
  const handleChange = <K extends keyof WebsiteSettings>(key: K, value: WebsiteSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleAddDomain = () => {
    if (newDomain && !settings.additionalDomains.includes(newDomain)) {
      handleChange('additionalDomains', [...settings.additionalDomains, newDomain]);
      setNewDomain('');
    }
  };
  
  const handleRemoveDomain = (domain: string) => {
    handleChange('additionalDomains', settings.additionalDomains.filter(d => d !== domain));
  };
  
  // Filtered redirects
  const filteredRedirects = React.useMemo(() => {
    let filtered = redirects;
    
    if (redirectSearch) {
      const searchLower = redirectSearch.toLowerCase();
      filtered = filtered.filter(r => 
        r.fromUrl.toLowerCase().includes(searchLower) || 
        r.toUrl.toLowerCase().includes(searchLower)
      );
    }
    
    if (redirectFilter !== 'all') {
      filtered = filtered.filter(r => 
        redirectFilter === 'active' ? r.isActive : !r.isActive
      );
    }
    
    return filtered;
  }, [redirects, redirectSearch, redirectFilter]);
  
  const totalPages = Math.ceil(filteredRedirects.length / redirectsPerPage);
  const paginatedRedirects = filteredRedirects.slice(
    (redirectPage - 1) * redirectsPerPage,
    redirectPage * redirectsPerPage
  );
  
  const openRedirectDialog = (mode: 'add' | 'edit' | 'delete', redirect?: Redirect301) => {
    setRedirectDialogMode(mode);
    setSelectedRedirect(redirect || null);
    if (redirect && mode === 'edit') {
      setRedirectFormData({ fromUrl: redirect.fromUrl, toUrl: redirect.toUrl, isActive: redirect.isActive });
    } else {
      setRedirectFormData({ fromUrl: '', toUrl: '', isActive: true });
    }
    setIsRedirectDialogOpen(true);
  };
  
  const handleRedirectDialogSubmit = () => {
    if (redirectDialogMode === 'add') {
      const newRedirect: Redirect301 = {
        id: Date.now().toString(),
        fromUrl: redirectFormData.fromUrl,
        toUrl: redirectFormData.toUrl,
        isActive: redirectFormData.isActive,
        hitCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setRedirects(prev => [...prev, newRedirect]);
      toast.success('Đã thêm chuyển hướng mới');
    } else if (redirectDialogMode === 'edit' && selectedRedirect) {
      setRedirects(prev => prev.map(r => 
        r.id === selectedRedirect.id 
          ? { ...r, ...redirectFormData, updatedAt: new Date().toISOString().split('T')[0] }
          : r
      ));
      toast.success('Đã cập nhật chuyển hướng');
    } else if (redirectDialogMode === 'delete' && selectedRedirect) {
      setRedirects(prev => prev.filter(r => r.id !== selectedRedirect.id));
      toast.success('Đã xóa chuyển hướng');
    }
    setIsRedirectDialogOpen(false);
  };
  
  const toggleRedirectActive = (id: string) => {
    setRedirects(prev => prev.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive, updatedAt: new Date().toISOString().split('T')[0] } : r
    ));
  };
  
  const handleSave = React.useCallback(async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.setItem('website-settings', JSON.stringify(settings));
      localStorage.setItem('redirects-301', JSON.stringify(redirects));
      originalSettings.current = JSON.stringify(settings);
      originalRedirects.current = JSON.stringify(redirects);
      setHasChanges(false);
      toast.success('Đã lưu cài đặt website');
    } catch (error) {
      toast.error('Lưu cài đặt thất bại');
    } finally {
      setIsSaving(false);
    }
  }, [settings, redirects]);
  
  React.useEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="save-website" onClick={handleSave} disabled={!hasChanges || isSaving}>
        <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
      </SettingsActionButton>,
    ]);
  }, [isActive, hasChanges, isSaving, handleSave, onRegisterActions]);
  
  return (
    <div className="space-y-6">
      {/* Domain Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4" />
            Cài đặt tên miền
          </CardTitle>
          <CardDescription>
            Quản lý tên miền chính và các tên miền phụ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryDomain">Tên miền chính</Label>
            <Input 
              id="primaryDomain"
              placeholder="example.com"
              value={settings.primaryDomain}
              onChange={(e) => handleChange('primaryDomain', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Tên miền chính của website, sử dụng cho SEO và các liên kết canonical
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <Label>Tên miền phụ</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="Thêm tên miền phụ..."
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
              />
              <Button onClick={handleAddDomain} disabled={!newDomain}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {settings.additionalDomains.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {settings.additionalDomains.map(domain => (
                  <Badge key={domain} variant="secondary" className="flex items-center gap-1">
                    {domain}
                    <button 
                      onClick={() => handleRemoveDomain(domain)}
                      className="ml-1 hover:text-destructive"
                    >
                      <XCircle className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Các tên miền phụ sẽ tự động chuyển hướng 301 về tên miền chính
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* SSL Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            Cài đặt SSL/HTTPS
          </CardTitle>
          <CardDescription>
            Bảo mật kết nối với chứng chỉ SSL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Kích hoạt SSL</Label>
              <p className="text-xs text-muted-foreground">Bật chứng chỉ SSL cho website</p>
            </div>
            <Switch 
              checked={settings.sslEnabled}
              onCheckedChange={(checked) => handleChange('sslEnabled', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Bắt buộc HTTPS</Label>
              <p className="text-xs text-muted-foreground">Tự động chuyển hướng HTTP sang HTTPS</p>
            </div>
            <Switch 
              checked={settings.forceHttps}
              onCheckedChange={(checked) => handleChange('forceHttps', checked)}
              disabled={!settings.sslEnabled}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tự động gia hạn</Label>
              <p className="text-xs text-muted-foreground">Tự động gia hạn chứng chỉ SSL khi sắp hết hạn</p>
            </div>
            <Switch 
              checked={settings.sslAutoRenew}
              onCheckedChange={(checked) => handleChange('sslAutoRenew', checked)}
              disabled={!settings.sslEnabled}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="sslCertExpiry">Ngày hết hạn chứng chỉ</Label>
            <div className="flex items-center gap-3">
              <Input 
                id="sslCertExpiry"
                type="date"
                value={settings.sslCertExpiry}
                onChange={(e) => handleChange('sslCertExpiry', e.target.value)}
                disabled={!settings.sslEnabled}
                className="max-w-[200px]"
              />
              {settings.sslEnabled && settings.sslCertExpiry && (
                <Badge variant={
                  new Date(settings.sslCertExpiry) < new Date() ? 'destructive' :
                  new Date(settings.sslCertExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'warning' :
                  'success'
                }>
                  {new Date(settings.sslCertExpiry) < new Date() ? 'Đã hết hạn' :
                   new Date(settings.sslCertExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'Sắp hết hạn' :
                   'Còn hiệu lực'}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 301 Redirects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ExternalLink className="h-4 w-4" />
            Chuyển hướng 301
          </CardTitle>
          <CardDescription>
            Quản lý các chuyển hướng URL vĩnh viễn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm URL..." 
                className="pl-8"
                value={redirectSearch}
                onChange={(e) => {
                  setRedirectSearch(e.target.value);
                  setRedirectPage(1);
                }}
              />
            </div>
            <Select 
              value={redirectFilter} 
              onValueChange={(v: 'all' | 'active' | 'inactive') => {
                setRedirectFilter(v);
                setRedirectPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Đã tắt</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => openRedirectDialog('add')}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm mới
            </Button>
          </div>
          
          {/* Redirects Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">URL gốc</TableHead>
                  <TableHead className="w-[35%]">URL đích</TableHead>
                  <TableHead className="text-center">Lượt truy cập</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRedirects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {redirectSearch || redirectFilter !== 'all' 
                        ? 'Không tìm thấy chuyển hướng phù hợp' 
                        : 'Chưa có chuyển hướng nào'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRedirects.map(redirect => (
                    <TableRow key={redirect.id}>
                      <TableCell className="font-mono text-sm truncate max-w-[200px]" title={redirect.fromUrl}>
                        {redirect.fromUrl}
                      </TableCell>
                      <TableCell className="font-mono text-sm truncate max-w-[200px]" title={redirect.toUrl}>
                        {redirect.toUrl}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{redirect.hitCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch 
                          checked={redirect.isActive}
                          onCheckedChange={() => toggleRedirectActive(redirect.id)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => openRedirectDialog('edit', redirect)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => openRedirectDialog('delete', redirect)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Hiển thị {(redirectPage - 1) * redirectsPerPage + 1} - {Math.min(redirectPage * redirectsPerPage, filteredRedirects.length)} / {filteredRedirects.length} chuyển hướng
              </p>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setRedirectPage(1)}
                  disabled={redirectPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setRedirectPage(p => p - 1)}
                  disabled={redirectPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2">
                  {redirectPage} / {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setRedirectPage(p => p + 1)}
                  disabled={redirectPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setRedirectPage(totalPages)}
                  disabled={redirectPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* 404 Page Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileX className="h-4 w-4" />
            Trang lỗi 404
          </CardTitle>
          <CardDescription>
            Tùy chỉnh trang hiển thị khi không tìm thấy nội dung
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Bật trang 404 tùy chỉnh</Label>
              <p className="text-xs text-muted-foreground">Sử dụng trang 404 tùy chỉnh thay vì mặc định</p>
            </div>
            <Switch 
              checked={settings.custom404Enabled}
              onCheckedChange={(checked) => handleChange('custom404Enabled', checked)}
            />
          </div>
          
          {settings.custom404Enabled && (
            <>
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="custom404Title">Tiêu đề trang</Label>
                <Input 
                  id="custom404Title"
                  value={settings.custom404Title}
                  onChange={(e) => handleChange('custom404Title', e.target.value)}
                  placeholder="Trang không tồn tại"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Nội dung trang</Label>
                <div className="min-h-[150px] border rounded-md">
                  <TipTapEditor 
                    content={settings.custom404Content}
                    onChange={(content) => handleChange('custom404Content', content)}
                    placeholder="Nhập nội dung hiển thị trên trang 404..."
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custom404RedirectUrl">URL chuyển hướng tự động</Label>
                  <Input 
                    id="custom404RedirectUrl"
                    value={settings.custom404RedirectUrl}
                    onChange={(e) => handleChange('custom404RedirectUrl', e.target.value)}
                    placeholder="/ (trang chủ)"
                  />
                  <p className="text-xs text-muted-foreground">
                    Để trống nếu không muốn tự động chuyển hướng
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom404RedirectDelay">Thời gian chờ (giây)</Label>
                  <Input 
                    id="custom404RedirectDelay"
                    type="number"
                    min={0}
                    max={60}
                    value={settings.custom404RedirectDelay}
                    onChange={(e) => handleChange('custom404RedirectDelay', parseInt(e.target.value) || 0)}
                    disabled={!settings.custom404RedirectUrl}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Redirect Dialog */}
      <Dialog open={isRedirectDialogOpen} onOpenChange={setIsRedirectDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {redirectDialogMode === 'add' && 'Thêm chuyển hướng mới'}
              {redirectDialogMode === 'edit' && 'Chỉnh sửa chuyển hướng'}
              {redirectDialogMode === 'delete' && 'Xóa chuyển hướng'}
            </DialogTitle>
            <DialogDescription>
              {redirectDialogMode === 'add' && 'Thêm một chuyển hướng 301 mới cho website'}
              {redirectDialogMode === 'edit' && 'Cập nhật thông tin chuyển hướng'}
              {redirectDialogMode === 'delete' && 'Bạn có chắc chắn muốn xóa chuyển hướng này?'}
            </DialogDescription>
          </DialogHeader>
          
          {redirectDialogMode !== 'delete' ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fromUrl">URL gốc <span className="text-destructive">*</span></Label>
                <Input 
                  id="fromUrl"
                  placeholder="/old-page"
                  value={redirectFormData.fromUrl}
                  onChange={(e) => setRedirectFormData(prev => ({ ...prev, fromUrl: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  URL cũ cần chuyển hướng (không bao gồm domain)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="toUrl">URL đích <span className="text-destructive">*</span></Label>
                <Input 
                  id="toUrl"
                  placeholder="/new-page hoặc https://example.com/page"
                  value={redirectFormData.toUrl}
                  onChange={(e) => setRedirectFormData(prev => ({ ...prev, toUrl: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  URL mới hoặc URL đầy đủ (bao gồm domain nếu chuyển hướng sang trang khác)
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Trạng thái hoạt động</Label>
                  <p className="text-xs text-muted-foreground">Bật/tắt chuyển hướng này</p>
                </div>
                <Switch 
                  checked={redirectFormData.isActive}
                  onCheckedChange={(checked) => setRedirectFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
            </div>
          ) : (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                Chuyển hướng từ <code className="bg-muted px-1 rounded">{selectedRedirect?.fromUrl}</code> sẽ bị xóa vĩnh viễn.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRedirectDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleRedirectDialogSubmit}
              variant={redirectDialogMode === 'delete' ? 'destructive' : 'default'}
              disabled={redirectDialogMode !== 'delete' && (!redirectFormData.fromUrl || !redirectFormData.toUrl)}
            >
              {redirectDialogMode === 'add' && 'Thêm'}
              {redirectDialogMode === 'edit' && 'Lưu'}
              {redirectDialogMode === 'delete' && 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export function OtherSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general');
  const { headerActions, registerActions } = useTabActionRegistry(activeTab);
  
  const registerGeneralActions = React.useMemo(() => registerActions('general'), [registerActions]);
  const registerNotificationActions = React.useMemo(() => registerActions('notifications'), [registerActions]);
  const registerSecurityActions = React.useMemo(() => registerActions('security'), [registerActions]);
  const registerMediaActions = React.useMemo(() => registerActions('media'), [registerActions]);
  const registerIntegrationActions = React.useMemo(() => registerActions('integration'), [registerActions]);
  const registerEmailTemplateActions = React.useMemo(() => registerActions('email-templates'), [registerActions]);
  const registerSystemActions = React.useMemo(() => registerActions('system'), [registerActions]);
  const registerWebsiteActions = React.useMemo(() => registerActions('website'), [registerActions]);

  useSettingsPageHeader({
    title: 'Cài đặt khác',
    actions: headerActions,
  });
  
  const tabs = React.useMemo(
    () => [
      { value: 'general', label: 'Chung' },
      { value: 'notifications', label: 'Thông báo' },
      { value: 'security', label: 'Bảo mật' },
      { value: 'media', label: 'Tệp tin' },
      { value: 'integration', label: 'Email SMTP' },
      { value: 'email-templates', label: 'Mẫu Email' },
      { value: 'website', label: 'Website' },
      { value: 'system', label: 'Hệ thống' },
    ],
    [],
  );

  return (
    <SettingsVerticalTabs value={activeTab} onValueChange={setActiveTab} tabs={tabs}>
      <TabsContent value="general" className="mt-0">
        <GeneralTabContent 
          isActive={activeTab === 'general'} 
          onRegisterActions={registerGeneralActions} 
        />
      </TabsContent>

      <TabsContent value="notifications" className="mt-0">
        <NotificationTabContent 
          isActive={activeTab === 'notifications'} 
          onRegisterActions={registerNotificationActions} 
        />
      </TabsContent>

      <TabsContent value="security" className="mt-0">
        <SecurityTabContent 
          isActive={activeTab === 'security'} 
          onRegisterActions={registerSecurityActions} 
        />
      </TabsContent>

      <TabsContent value="media" className="mt-0">
        <MediaTabContent 
          isActive={activeTab === 'media'} 
          onRegisterActions={registerMediaActions} 
        />
      </TabsContent>

      <TabsContent value="integration" className="mt-0">
        <IntegrationTabContent 
          isActive={activeTab === 'integration'} 
          onRegisterActions={registerIntegrationActions} 
        />
      </TabsContent>

      <TabsContent value="email-templates" className="mt-0">
        <EmailTemplateTabContent 
          isActive={activeTab === 'email-templates'} 
          onRegisterActions={registerEmailTemplateActions} 
        />
      </TabsContent>

      <TabsContent value="website" className="mt-0">
        <WebsiteTabContent 
          isActive={activeTab === 'website'} 
          onRegisterActions={registerWebsiteActions} 
        />
      </TabsContent>

      <TabsContent value="system" className="mt-0">
        <SystemTabContent 
          isActive={activeTab === 'system'} 
          onRegisterActions={registerSystemActions} 
        />
      </TabsContent>
    </SettingsVerticalTabs>
  );
}

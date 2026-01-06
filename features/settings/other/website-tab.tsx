'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  FileX,
  Globe,
  Pencil,
  Plus,
  Save,
  Search,
  Shield,
  Trash2,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TipTapEditor } from '@/components/ui/tiptap-editor';
import { SettingsActionButton } from '@/components/settings/SettingsActionButton';
import { toast } from 'sonner';
import type { TabContentProps } from './types';

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

const WEBSITE_SETTINGS_KEY = 'website-settings';
const REDIRECTS_KEY = 'redirects-301';

export function WebsiteTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const [settings, setSettings] = React.useState<WebsiteSettings>(DEFAULT_WEBSITE_SETTINGS);
  const [redirects, setRedirects] = React.useState<Redirect301[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [newDomain, setNewDomain] = React.useState('');
  
  // Load from API on mount
  React.useEffect(() => {
    const loadFromAPI = async () => {
      try {
        const [settingsRes, redirectsRes] = await Promise.all([
          fetch(`/api/user-preferences?category=system-settings&key=${WEBSITE_SETTINGS_KEY}`),
          fetch(`/api/user-preferences?category=system-settings&key=${REDIRECTS_KEY}`),
        ]);
        
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data.value) {
            setSettings(prev => ({ ...prev, ...data.value }));
          }
        }
        
        if (redirectsRes.ok) {
          const data = await redirectsRes.json();
          if (data.value && Array.isArray(data.value)) {
            setRedirects(data.value);
          }
        }
      } catch (error) {
        console.error('[WebsiteTabContent] Failed to load:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFromAPI();
  }, []);
  
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
  
  const originalSettings = React.useRef(JSON.stringify(DEFAULT_WEBSITE_SETTINGS));
  const originalRedirects = React.useRef<string>('[]');
  
  // Update originals when loaded from API
  React.useEffect(() => {
    if (!isLoading) {
      originalSettings.current = JSON.stringify(settings);
      originalRedirects.current = JSON.stringify(redirects);
    }
  }, [isLoading, settings, redirects]);
  
  React.useEffect(() => {
    if (isLoading) return;
    const settingsChanged = JSON.stringify(settings) !== originalSettings.current;
    const redirectsChanged = JSON.stringify(redirects) !== originalRedirects.current;
    setHasChanges(settingsChanged || redirectsChanged);
  }, [settings, redirects, isLoading]);
  
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
      // Save both settings and redirects to API
      await Promise.all([
        fetch('/api/user-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: 'system-settings',
            key: 'website-settings',
            value: settings
          })
        }),
        fetch('/api/user-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: 'system-settings',
            key: 'redirects-301',
            value: redirects
          })
        })
      ]);
      originalSettings.current = JSON.stringify(settings);
      originalRedirects.current = JSON.stringify(redirects);
      setHasChanges(false);
      toast.success('Đã lưu cài đặt website');
    } catch (_error) {
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
                  new Date(settings.sslCertExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'secondary' :
                  'default'
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

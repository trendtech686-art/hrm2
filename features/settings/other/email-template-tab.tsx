'use client';

import * as React from 'react';
import {
  CheckCircle,
  Eye,
  FileText,
  Lock,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TipTapEditor } from '@/components/ui/tiptap-editor';
import { formatDateForDisplay } from '@/lib/date-utils';
import { toast } from 'sonner';
import { generateSubEntityId } from '@/lib/id-utils';
import type { TabContentProps } from './types';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  category: 'hr' | 'payroll' | 'system' | 'order' | 'warranty';
  trigger: string;
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

export function EmailTemplateTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const [hasChanges, setHasChanges] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [_editingTemplate, _setEditingTemplate] = React.useState<EmailTemplate | null>(null);
  
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

  const handleDialogSubmit = () => {
    if (dialogMode === 'add') {
      const newTemplate: EmailTemplate = {
        id: generateSubEntityId('email-tpl'),
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
        <DialogContent className="sm:max-w-225 max-h-[90vh] overflow-y-auto">
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
                  
                  <div className="space-y-3 max-h-125 overflow-y-auto pr-2">
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
                                  className="h-7 text-xs px-2"
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
                                  className="h-7 text-xs px-2"
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
                                  className="h-7 text-xs px-2"
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
                                    className="h-7 text-xs px-2"
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
                                    className="h-7 text-xs px-2"
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
                                    className="h-7 text-xs px-2"
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
                                    className="h-7 text-xs px-2"
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

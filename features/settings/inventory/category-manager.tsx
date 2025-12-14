import * as React from 'react';
import { 
  ChevronRight, 
  Folder, 
  FolderOpen, 
  Plus, 
  Trash2, 
  Save,
  X,
  Search,
  Check,
  Copy,
  Globe
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Separator } from '../../../components/ui/separator';
import { VirtualizedCombobox, type ComboboxOption } from '../../../components/ui/virtualized-combobox';
import { TipTapEditor } from '../../../components/ui/tiptap-editor';
import { NewDocumentsUpload } from '../../../components/ui/new-documents-upload';
import { ExistingDocumentsViewer } from '../../../components/ui/existing-documents-viewer';
import { FileUploadAPI, type StagingFile } from '../../../lib/file-upload-api';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import type { ProductCategory, WebsiteSeoData } from './types';
import { asSystemId, asBusinessId, type SystemId } from '@/lib/id-types';
import { nanoid } from 'nanoid';

// =============================================================================
// TYPES
// =============================================================================

interface CategoryManagerProps {
  categories: ProductCategory[];
  onAdd: (data: CategoryFormValues) => void;
  onUpdate: (systemId: SystemId, data: Partial<CategoryFormValues>) => void;
  onDelete: (systemId: SystemId) => void;
  onMove: (systemId: SystemId, newParentId: SystemId | undefined, newSortOrder: number) => void;
  existingIds: string[];
}

// =============================================================================
// FORM SCHEMA
// =============================================================================

// Schema cho SEO của một website
const websiteSeoSchema = z.object({
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  slug: z.string().optional(),
}).optional();

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  slug: z.string().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  parentId: z.string().optional(),
  color: z.string().optional(),
  thumbnailImage: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
  // SEO cho từng website
  websiteSeo: z.object({
    pkgx: websiteSeoSchema,
    trendtech: websiteSeoSchema,
  }).optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;



// =============================================================================
// TREE NODE COMPONENT (Simplified - no drag and drop)
// =============================================================================

interface TreeNodeProps {
  category: ProductCategory;
  allCategories: ProductCategory[];
  selectedId: SystemId | null;
  onSelect: (category: ProductCategory) => void;
  onAddChild: (parentId: SystemId) => void;
  level: number;
  expandedIds: Set<SystemId>;
  onToggleExpand: (id: SystemId) => void;
  searchTerm: string;
}

function TreeNode({ 
  category, 
  allCategories, 
  selectedId, 
  onSelect, 
  onAddChild,
  level, 
  expandedIds,
  onToggleExpand,
  searchTerm,
}: TreeNodeProps) {
  const children = allCategories
    .filter(c => c.parentId === category.systemId)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  const hasChildren = children.length > 0;
  const isExpanded = expandedIds.has(category.systemId);
  const isSelected = selectedId === category.systemId;

  // Count products (mock - sau này sẽ tính thực)
  const productCount = 0;

  // Highlight search match
  const matchesSearch = searchTerm && category.name.toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <>
      <div className="relative">
        <div
          className={cn(
            'group flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer transition-all',
            'hover:bg-accent',
            isSelected && 'bg-primary/10 text-primary font-medium',
            matchesSearch && !isSelected && 'bg-yellow-50 dark:bg-yellow-900/20',
          )}
          onClick={() => onSelect(category)}
        >
          {/* Expand/Collapse */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(category.systemId);
            }}
            className={cn(
              'p-0.5 rounded hover:bg-muted transition-transform',
              !hasChildren && 'invisible'
            )}
          >
            <ChevronRight 
              className={cn(
                'h-3.5 w-3.5 text-muted-foreground transition-transform',
                isExpanded && 'rotate-90'
              )} 
            />
          </button>

          {/* Folder Icon */}
          {isExpanded && hasChildren ? (
            <FolderOpen className="h-4 w-4 text-amber-500 flex-shrink-0" />
          ) : (
            <Folder className="h-4 w-4 text-amber-500 flex-shrink-0" />
          )}

          {/* Name */}
          <span className="flex-1 truncate text-sm">
            {category.name}
          </span>

          {/* Product Count */}
          {productCount > 0 && (
            <span className="text-xs text-muted-foreground">
              ({productCount})
            </span>
          )}

          {/* Level Badge */}
          {level > 0 && (
            <Badge variant="outline" className="h-4 text-[10px] px-1">
              L{level + 1}
            </Badge>
          )}

          {/* Status */}
          {!category.isActive && (
            <Badge variant="secondary" className="h-4 text-[10px] px-1">
              Ẩn
            </Badge>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
            {/* Add Child Button - allow up to 5 levels (0-4) */}
            {level < 4 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddChild(category.systemId);
                }}
                title="Thêm danh mục con"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-4 pl-2 border-l border-border">
          {children.map((child) => (
            <TreeNode
              key={child.systemId}
              category={child}
              allCategories={allCategories}
              selectedId={selectedId}
              onSelect={onSelect}
              onAddChild={onAddChild}
              level={level + 1}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </>
  );
}

// =============================================================================
// CATEGORY DETAIL FORM
// =============================================================================

interface CategoryDetailFormProps {
  category: ProductCategory | null;
  isNew: boolean;
  parentCategory?: ProductCategory;
  allCategories: ProductCategory[];
  existingIds: string[];
  onSave: (data: CategoryFormValues) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

function CategoryDetailForm({
  category,
  isNew,
  parentCategory,
  allCategories,
  existingIds,
  onSave,
  onCancel,
  onDelete,
}: CategoryDetailFormProps) {
  const [activeTab, setActiveTab] = React.useState<'general' | 'seo-pkgx' | 'seo-trendtech'>('general');
  
  // Image upload state (thumbnail)
  const [thumbnailFiles, setThumbnailFiles] = React.useState<StagingFile[]>([]);
  const [thumbnailSessionId, setThumbnailSessionId] = React.useState<string | undefined>();
  
  // Editor image staging state (description)
  const [editorSessionId, setEditorSessionId] = React.useState<string | undefined>();
  const [editorStagingFiles, setEditorStagingFiles] = React.useState<StagingFile[]>([]);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      seoTitle: category?.seoTitle || '',
      metaDescription: category?.metaDescription || '',
      shortDescription: category?.shortDescription || '',
      longDescription: category?.longDescription || '',
      parentId: category?.parentId || parentCategory?.systemId || undefined,
      thumbnailImage: category?.thumbnailImage || '',
      sortOrder: category?.sortOrder || 0,
      isActive: category?.isActive !== undefined ? category.isActive : true,
      websiteSeo: {
        pkgx: category?.websiteSeo?.pkgx || {},
        trendtech: category?.websiteSeo?.trendtech || {},
      },
    },
  });

  // Reset form when category changes
  React.useEffect(() => {
    form.reset({
      name: category?.name || '',
      slug: category?.slug || '',
      seoTitle: category?.seoTitle || '',
      metaDescription: category?.metaDescription || '',
      shortDescription: category?.shortDescription || '',
      longDescription: category?.longDescription || '',
      parentId: category?.parentId || parentCategory?.systemId || undefined,
      thumbnailImage: category?.thumbnailImage || '',
      sortOrder: category?.sortOrder || 0,
      isActive: category?.isActive !== undefined ? category.isActive : true,
      websiteSeo: {
        pkgx: category?.websiteSeo?.pkgx || {},
        trendtech: category?.websiteSeo?.trendtech || {},
      },
    });
    // Reset image upload state
    setThumbnailFiles([]);
    setThumbnailSessionId(undefined);
    // Reset editor staging state
    setEditorSessionId(undefined);
    setEditorStagingFiles([]);
    setActiveTab('general');
  }, [category, parentCategory, form]);

  // Auto-generate slug
  const watchName = form.watch('name');
  React.useEffect(() => {
    if (watchName && isNew) {
      const slug = watchName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue('slug', slug);
    }
  }, [watchName, isNew, form]);

  const handleSubmit = async (data: CategoryFormValues) => {
    const categoryId = category?.systemId || `CAT_${nanoid(10)}`;
    
    // Confirm thumbnail staging files
    let thumbnailUrl = data.thumbnailImage;
    if (thumbnailFiles.length > 0 && thumbnailSessionId) {
      try {
        await FileUploadAPI.confirmStagingFiles(
          thumbnailSessionId,
          categoryId,
          'categories',
          'thumbnail',
          { name: data.name }
        );
        thumbnailUrl = thumbnailFiles[0]?.url || thumbnailUrl;
      } catch (error) {
        console.error('Error confirming thumbnail:', error);
      }
    }
    
    // Confirm editor staging files (images in description)
    if (editorStagingFiles.length > 0 && editorSessionId) {
      try {
        await FileUploadAPI.confirmStagingFiles(
          editorSessionId,
          categoryId,
          'categories',
          'content',
          { name: data.name }
        );
      } catch (error) {
        console.error('Error confirming editor images:', error);
      }
    }
    
    onSave({
      ...data,
      thumbnailImage: thumbnailUrl,
    });
  };

  // Build breadcrumb path
  const getBreadcrumb = () => {
    if (!category?.parentId && !parentCategory) return 'Danh mục gốc';
    
    const path: string[] = [];
    let currentParentId = category?.parentId || parentCategory?.systemId;
    
    while (currentParentId) {
      const parent = allCategories.find(c => c.systemId === currentParentId);
      if (parent) {
        path.unshift(parent.name);
        currentParentId = parent.parentId;
      } else {
        break;
      }
    }
    
    return path.length > 0 ? path.join(' → ') : 'Danh mục gốc';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div>
          <h3 className="font-semibold text-lg">
            {isNew ? 'Thêm danh mục mới' : `Chỉnh sửa: ${category?.name}`}
          </h3>
          <p className="text-sm text-muted-foreground">
            {getBreadcrumb()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && onDelete && (
            <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-1" />
              Xóa
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              // Reset form to original values
              form.reset();
              // Clear uploaded files
              setThumbnailFiles([]);
              setThumbnailSessionId(undefined);
              // If adding new, cancel the add mode
              if (isNew) {
                onCancel();
              }
            }}
          >
            <X className="h-4 w-4 mr-1" />
            {isNew ? 'Hủy' : 'Hoàn tác'}
          </Button>
          <Button size="sm" onClick={form.handleSubmit(handleSubmit)}>
            <Save className="h-4 w-4 mr-1" />
            {isNew ? 'Tạo mới' : 'Lưu'}
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <ScrollArea className="flex-1">
        <Form {...form}>
          <form className="p-4 space-y-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Thông tin</TabsTrigger>
                <TabsTrigger value="seo-pkgx" className="gap-1">
                  <Globe className="h-3 w-3" style={{ color: '#ef4444' }} />
                  SEO PKGX
                </TabsTrigger>
                <TabsTrigger value="seo-trendtech" className="gap-1">
                  <Globe className="h-3 w-3" style={{ color: '#3b82f6' }} />
                  SEO Trendtech
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-4">
                {/* Basic Info Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên danh mục <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="VD: Điện tử" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sortOrder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thứ tự</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="dien-tu" {...field} />
                          </FormControl>
                          <FormDescription>Tự động tạo từ tên danh mục</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parentId"
                      render={({ field }) => {
                        // Filter out current category and its descendants to prevent circular reference
                        const getDescendantIds = (parentId: string): string[] => {
                          const children = allCategories.filter(c => c.parentId === parentId);
                          return children.flatMap(c => [c.systemId, ...getDescendantIds(c.systemId)]);
                        };
                        const excludeIds = category?.systemId 
                          ? [category.systemId, ...getDescendantIds(category.systemId)]
                          : [];
                        const availableParents = allCategories.filter(
                          c => !excludeIds.includes(c.systemId) && c.isActive !== false
                        );

                        // Build hierarchy with level for indentation
                        const getCategoryLevel = (cat: typeof allCategories[0]): number => {
                          if (!cat.parentId) return 0;
                          const parent = allCategories.find(c => c.systemId === cat.parentId);
                          if (!parent) return 0;
                          return 1 + getCategoryLevel(parent);
                        };

                        // Sort categories by hierarchy (parents before children)
                        const sortedCategories = [...availableParents].sort((a, b) => {
                          const getPath = (cat: typeof allCategories[0]): string[] => {
                            if (!cat.parentId) return [cat.name];
                            const parent = allCategories.find(c => c.systemId === cat.parentId);
                            if (!parent) return [cat.name];
                            return [...getPath(parent), cat.name];
                          };
                          return getPath(a).join('/').localeCompare(getPath(b).join('/'));
                        });

                        // Build options with level metadata
                        const parentOptions: ComboboxOption[] = [
                          { value: '__root__', label: '— Không có (Danh mục gốc) —', metadata: { level: -1 } },
                          ...sortedCategories.map(cat => ({
                            value: cat.systemId,
                            label: cat.name,
                            metadata: { level: getCategoryLevel(cat) },
                          })),
                        ];

                        const selectedOption = field.value 
                          ? parentOptions.find(o => o.value === field.value) || null
                          : parentOptions[0]; // Default to root

                        return (
                          <FormItem>
                            <FormLabel>Danh mục cha</FormLabel>
                            <FormControl>
                              <VirtualizedCombobox
                                value={selectedOption}
                                onChange={(option) => {
                                  field.onChange(option?.value === '__root__' ? undefined : option?.value);
                                }}
                                options={parentOptions}
                                placeholder="Chọn danh mục cha"
                                searchPlaceholder="Tìm danh mục..."
                                emptyPlaceholder="Không tìm thấy danh mục"
                                estimatedItemHeight={36}
                                maxHeight={280}
                                renderOption={(option, isSelected) => (
                                  <div className="flex items-center flex-1 min-w-0">
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4 flex-shrink-0',
                                        isSelected ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    <span 
                                      className={cn(
                                        "truncate",
                                        option.metadata?.level === -1 && "text-muted-foreground"
                                      )}
                                      style={{ 
                                        paddingLeft: option.metadata?.level > 0 
                                          ? `${option.metadata.level * 16}px` 
                                          : undefined 
                                      }}
                                    >
                                      {option.metadata?.level > 0 && (
                                        <span className="text-muted-foreground mr-1">└</span>
                                      )}
                                      {option.label}
                                    </span>
                                  </div>
                                )}
                              />
                            </FormControl>
                            <FormDescription>
                              Chọn danh mục cha để tạo cấu trúc phân cấp
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Kích hoạt</FormLabel>
                            <FormDescription>
                              Danh mục sẽ hiển thị trong danh sách lựa chọn
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Thumbnail Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Ảnh đại diện</CardTitle>
                    <CardDescription>Ảnh hiển thị cho danh mục (tối đa 1 ảnh, 2MB)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Existing thumbnail */}
                    {category?.thumbnailImage && thumbnailFiles.length === 0 && (
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-lg border overflow-hidden">
                          <img 
                            src={category.thumbnailImage} 
                            alt="Thumbnail hiện tại" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Ảnh hiện tại. Upload ảnh mới để thay thế.
                        </div>
                      </div>
                    )}
                    
                    {/* Upload new thumbnail */}
                    <NewDocumentsUpload
                      accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                      maxFiles={1}
                      maxSize={2 * 1024 * 1024}
                      value={thumbnailFiles}
                      onChange={setThumbnailFiles}
                      sessionId={thumbnailSessionId}
                      onSessionChange={setThumbnailSessionId}
                      className="min-h-[120px]"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEO PKGX Tab */}
              <TabsContent value="seo-pkgx" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" style={{ color: '#ef4444' }} />
                      <CardTitle className="text-base">SEO cho PKGX</CardTitle>
                    </div>
                    <CardDescription>phukiengiaxuong.com.vn</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="websiteSeo.pkgx.seoTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu đề SEO</FormLabel>
                          <FormControl>
                            <Input placeholder="Tiêu đề cho PKGX" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormDescription>Title tag. Nên 50-60 ký tự.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="websiteSeo.pkgx.metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Mô tả SEO cho PKGX" {...field} value={field.value || ''} rows={2} />
                          </FormControl>
                          <FormDescription>Nên 150-160 ký tự.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="websiteSeo.pkgx.seoKeywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Từ khóa SEO</FormLabel>
                          <FormControl>
                            <Input placeholder="từ khóa 1, từ khóa 2" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="websiteSeo.pkgx.shortDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả ngắn</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Mô tả ngắn gọn 1-2 câu" {...field} value={field.value || ''} rows={2} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="websiteSeo.pkgx.longDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả chi tiết</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Mô tả đầy đủ (hỗ trợ HTML)" {...field} value={field.value || ''} rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEO Trendtech Tab */}
              <TabsContent value="seo-trendtech" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" style={{ color: '#3b82f6' }} />
                      <CardTitle className="text-base">SEO cho Trendtech</CardTitle>
                    </div>
                    <CardDescription>Coming soon</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="websiteSeo.trendtech.seoTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu đề SEO</FormLabel>
                          <FormControl>
                            <Input placeholder="Tiêu đề cho Trendtech" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormDescription>Title tag. Nên 50-60 ký tự.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="websiteSeo.trendtech.metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Mô tả SEO cho Trendtech" {...field} value={field.value || ''} rows={2} />
                          </FormControl>
                          <FormDescription>Nên 150-160 ký tự.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="websiteSeo.trendtech.seoKeywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Từ khóa SEO</FormLabel>
                          <FormControl>
                            <Input placeholder="từ khóa 1, từ khóa 2" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="websiteSeo.trendtech.shortDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả ngắn</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Mô tả ngắn gọn 1-2 câu" {...field} value={field.value || ''} rows={2} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="websiteSeo.trendtech.longDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả chi tiết</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Mô tả đầy đủ (hỗ trợ HTML)" {...field} value={field.value || ''} rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function CategoryManager({
  categories,
  onAdd,
  onUpdate,
  onDelete,
  onMove,
  existingIds,
}: CategoryManagerProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<ProductCategory | null>(null);
  const [isNewMode, setIsNewMode] = React.useState(false);
  const [newParentId, setNewParentId] = React.useState<SystemId | undefined>(undefined);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expandedIds, setExpandedIds] = React.useState<Set<SystemId>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const rootCategories = React.useMemo(
    () => categories.filter(c => !c.parentId).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [categories]
  );

  // Expand all on mount
  React.useEffect(() => {
    setExpandedIds(new Set(categories.map(c => c.systemId)));
  }, []);

  const handleToggleExpand = (id: SystemId) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedIds(new Set(categories.map(c => c.systemId)));
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const handleSelectCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    setIsNewMode(false);
    setNewParentId(undefined);
  };

  const handleAddRoot = () => {
    setSelectedCategory(null);
    setIsNewMode(true);
    setNewParentId(undefined);
  };

  const handleAddChild = (parentId: SystemId) => {
    setSelectedCategory(null);
    setIsNewMode(true);
    setNewParentId(parentId);
    // Expand parent
    setExpandedIds(prev => new Set([...prev, parentId]));
  };

  const handleSave = (data: CategoryFormValues) => {
    if (isNewMode) {
      onAdd({
        ...data,
        parentId: newParentId,
      });
      setIsNewMode(false);
      setNewParentId(undefined);
    } else if (selectedCategory) {
      onUpdate(selectedCategory.systemId, data);
    }
  };

  const handleCancel = () => {
    setIsNewMode(false);
    setNewParentId(undefined);
    if (!selectedCategory && categories.length > 0) {
      // Select first category if none selected
      setSelectedCategory(rootCategories[0] || null);
    }
  };

  const handleDeleteRequest = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      onDelete(selectedCategory.systemId);
      setSelectedCategory(null);
    }
    setDeleteDialogOpen(false);
  };

  const newParentCategory = newParentId ? categories.find(c => c.systemId === newParentId) : undefined;

  // Count categories
  const totalCount = categories.length;

  return (
    <>
      <div className="h-[calc(100vh-220px)] flex border rounded-lg overflow-hidden bg-background">
        {/* Left Panel - Tree */}
        <div className="w-80 border-r flex flex-col bg-muted/30">
          {/* Tree Header */}
          <div className="p-3 border-b space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                Danh mục ({totalCount})
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleExpandAll}>
                  Mở
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleCollapseAll}>
                  Đóng
                </Button>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
          </div>

          {/* Tree Content */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {rootCategories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Chưa có danh mục nào
                </div>
              ) : (
                rootCategories.map((category) => (
                  <TreeNode
                    key={category.systemId}
                    category={category}
                    allCategories={categories}
                    selectedId={selectedCategory?.systemId || null}
                    onSelect={handleSelectCategory}
                    onAddChild={handleAddChild}
                    level={0}
                    expandedIds={expandedIds}
                    onToggleExpand={handleToggleExpand}
                    searchTerm={searchTerm}
                  />
                ))
              )}
            </div>
          </ScrollArea>

          {/* Tree Footer */}
          <div className="p-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleAddRoot}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm danh mục gốc
            </Button>
          </div>
        </div>

        {/* Right Panel - Detail Form */}
        <div className="flex-1 flex flex-col">
          {selectedCategory || isNewMode ? (
            <CategoryDetailForm
              category={isNewMode ? null : selectedCategory}
              isNew={isNewMode}
              {...(newParentCategory ? { parentCategory: newParentCategory } : {})}
              allCategories={categories}
              existingIds={existingIds}
              onSave={handleSave}
              onCancel={handleCancel}
              {...(!isNewMode ? { onDelete: handleDeleteRequest } : {})}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Folder className="h-12 w-12 mx-auto opacity-30" />
                <p>Chọn danh mục để xem chi tiết</p>
                <p className="text-sm">hoặc</p>
                <Button variant="outline" size="sm" onClick={handleAddRoot}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm danh mục mới
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục "{selectedCategory?.name}"?
              {categories.filter(c => c.parentId === selectedCategory?.systemId).length > 0 && (
                <span className="block mt-2 text-destructive font-medium">
                  Danh mục này có danh mục con. Các danh mục con cũng sẽ bị xóa.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

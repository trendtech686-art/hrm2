import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import type { Product, MultiWebsiteSeo } from "./types.ts";
import { useProductStore } from "./store.ts";
import { usePricingPolicyStore } from '../settings/pricing/store.ts';
import { useUnitStore } from "../settings/units/store.ts";
import { useSupplierStore } from "../suppliers/store.ts";
import { useBranchStore } from "../settings/branches/store.ts";
import { useSlaSettingsStore } from "../settings/inventory/sla-settings-store.ts";
import { useProductLogisticsSettingsStore } from "../settings/inventory/logistics-settings-store.ts";
import { useStorageLocationStore } from "../settings/inventory/storage-location-store.ts";
import { useBrandStore } from "../settings/inventory/brand-store.ts";
import { useImporterStore } from "../settings/inventory/importer-store.ts";
import { useProductTypeStore } from "../settings/inventory/product-type-store.ts";
import { useProductCategoryStore } from "../settings/inventory/product-category-store.ts";
import { ImageUploadManager } from '../../components/ui/image-upload-manager.tsx';
import { useImageUpload } from '../../hooks/use-image-upload.ts';
import { toast } from 'sonner';
import { MIN_COMBO_ITEMS, MAX_COMBO_ITEMS } from './combo-utils.ts';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../../components/ui/form.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Textarea } from "../../components/ui/textarea.tsx";
import { TipTapEditor } from "../../components/ui/tiptap-editor.tsx";
import { CurrencyInput } from "../../components/ui/currency-input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs.tsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Combobox } from "../../components/ui/combobox.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { Switch } from "../../components/ui/switch.tsx";
import { PlusCircle, X, Info, Globe } from "lucide-react";
import { ComboSection } from './components/combo-section.tsx';
import { calculateComboCostPrice, calculateFinalComboPricesByPolicy } from './combo-utils.ts';
import type { SystemId } from '@/lib/id-types';
import { FileUploadAPI, type StagingFile } from '@/lib/file-upload-api.ts';

// ═══════════════════════════════════════════════════════════════
// VALIDATION HELPER
// ═══════════════════════════════════════════════════════════════
type ValidationError = { field: string; message: string };

function validateProductForm(values: ProductFormCompleteValues): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Required fields (id is optional - will be auto-generated if empty)
  if (!values.name?.trim()) {
    errors.push({ field: 'name', message: 'Tên sản phẩm là bắt buộc' });
  }
  if (!values.unit?.trim()) {
    errors.push({ field: 'unit', message: 'Đơn vị tính là bắt buộc' });
  }
  if (values.costPrice < 0) {
    errors.push({ field: 'costPrice', message: 'Giá vốn phải >= 0' });
  }
  
  // Combo validation
  if (values.type === 'combo') {
    if (!values.comboItems || values.comboItems.length < MIN_COMBO_ITEMS) {
      errors.push({ field: 'comboItems', message: `Combo phải có ít nhất ${MIN_COMBO_ITEMS} sản phẩm` });
    }
    if (values.comboItems && values.comboItems.length > MAX_COMBO_ITEMS) {
      errors.push({ field: 'comboItems', message: `Combo chỉ được tối đa ${MAX_COMBO_ITEMS} sản phẩm` });
    }
    if (values.comboPricingType === 'fixed' && (!values.comboDiscount || values.comboDiscount <= 0)) {
      errors.push({ field: 'comboDiscount', message: 'Vui lòng nhập giá combo' });
    }
    if (values.comboPricingType === 'sum_discount_percent' && values.comboDiscount !== undefined && values.comboDiscount > 100) {
      errors.push({ field: 'comboDiscount', message: 'Phần trăm giảm giá không được vượt quá 100%' });
    }
  }
  
  return errors;
}

// Form Values Type
export type ProductFormCompleteValues = Omit<Product, 'id' | 'systemId' | 'ktitle'> & {
  id: string;
  systemId?: SystemId;
  title?: string;
  _imageFiles?: Record<string, StagingFile[]>;
};

type ProductFormCompleteProps = {
  initialData: Product | null;
  onSubmit: (values: ProductFormCompleteValues) => void;
  onCancel: () => void;
  isEditMode?: boolean;
  defaultType?: Product['type'];
};

export function ProductFormComplete({ 
  initialData, 
  onSubmit, 
  onCancel,
  isEditMode = false,
  defaultType,
}: ProductFormCompleteProps) {
  const { data: products } = useProductStore();
  const { data: pricingPolicies } = usePricingPolicyStore();
  const { data: units } = useUnitStore();
  const { data: suppliers } = useSupplierStore();
  const { data: branches } = useBranchStore();
  const { settings: slaSettings } = useSlaSettingsStore();
  const { settings: logisticsSettings } = useProductLogisticsSettingsStore();
  const { getActive: getActiveStorageLocations } = useStorageLocationStore();
  const { getActive: getActiveBrands } = useBrandStore();
  const { getActive: getActiveImporters, getDefault: getDefaultImporter } = useImporterStore();
  const { getActive: getActiveProductTypes } = useProductTypeStore();
  const { data: productCategories } = useProductCategoryStore();

  // ═══════════════════════════════════════════════════════════════
  // IMAGE MANAGEMENT - Load existing images for edit mode
  // ═══════════════════════════════════════════════════════════════
  const [isLoadingImages, setIsLoadingImages] = React.useState(false);
  const [loadedThumbnails, setLoadedThumbnails] = React.useState<StagingFile[]>([]);
  const [loadedGallery, setLoadedGallery] = React.useState<StagingFile[]>([]);

  // Load images from server when editing
  React.useEffect(() => {
    if (initialData?.systemId && isEditMode) {
      setIsLoadingImages(true);
      
      FileUploadAPI.getProductFiles(initialData.systemId)
        .then((files) => {
          console.log('[ProductForm] Loaded files from server:', files);
          
          // Separate thumbnail and gallery files
          const thumbnails: StagingFile[] = [];
          const gallery: StagingFile[] = [];
          
          files.forEach(file => {
            const stagingFile: StagingFile = {
              id: file.id,
              sessionId: '', // No session for existing files
              name: file.name,
              originalName: file.originalName,
              slug: file.slug,
              filename: file.filename,
              size: file.size,
              type: file.type,
              url: file.url,
              status: 'permanent' as const,
              uploadedAt: file.uploadedAt,
              metadata: file.metadata
            };
            
            if (file.documentName === 'thumbnail') {
              thumbnails.push(stagingFile);
            } else if (file.documentName === 'gallery') {
              gallery.push(stagingFile);
            }
          });
          
          setLoadedThumbnails(thumbnails);
          setLoadedGallery(gallery);
          
          // Also set to staging files for the upload components
          if (thumbnails.length > 0) {
            setThumbnailStagingFiles(thumbnails);
          }
          if (gallery.length > 0) {
            setGalleryStagingFiles(gallery);
          }
        })
        .catch((error) => {
          console.error('[ProductForm] Failed to load images:', error);
        })
        .finally(() => {
          setIsLoadingImages(false);
        });
    }
  }, [initialData?.systemId, isEditMode]);

  // Image upload management - THUMBNAIL (single main image)
  const thumbnailUploadOptions = React.useMemo(
    () => ({
      entityType: 'product' as const,
    }),
    []
  );

  const {
    stagingFiles: thumbnailStagingFiles,
    sessionId: thumbnailSessionId,
    setStagingFiles: setThumbnailStagingFiles,
    setSessionId: setThumbnailSessionId,
    confirmImages: confirmThumbnailImages,
    hasImages: hasThumbnailImages,
  } = useImageUpload(thumbnailUploadOptions);

  // Image upload management - GALLERY (album images)
  const galleryUploadOptions = React.useMemo(
    () => ({
      entityType: 'product' as const,
    }),
    []
  );

  const {
    stagingFiles: galleryStagingFiles,
    sessionId: gallerySessionId,
    setStagingFiles: setGalleryStagingFiles,
    setSessionId: setGallerySessionId,
    confirmImages: confirmGalleryImages,
    hasImages: hasGalleryImages,
  } = useImageUpload(galleryUploadOptions);

  // Combined check for any images
  const hasImages = hasThumbnailImages || hasGalleryImages;

  // Combined confirm function
  const confirmImages = async (productId: string, values: Record<string, any>) => {
    const results = await Promise.all([
      hasThumbnailImages ? confirmThumbnailImages(productId, { ...values, documentName: 'thumbnail' }) : Promise.resolve(null),
      hasGalleryImages ? confirmGalleryImages(productId, { ...values, documentName: 'gallery' }) : Promise.resolve(null),
    ]);
    return results.flat().filter(Boolean);
  };
  
  const [tags, setTags] = React.useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = React.useState('');

  const salesPolicies = React.useMemo(
    () => pricingPolicies.filter(p => p.type === 'Bán hàng'),
    [pricingPolicies]
  );

  const unitOptions = React.useMemo(
    () => units.map(u => ({ value: u.name, label: u.name })),
    [units]
  );

  const supplierOptions = React.useMemo(
    () => suppliers.map(s => ({ value: s.systemId, label: s.name })),
    [suppliers]
  );

  const activeStorageLocations = React.useMemo(
    () => getActiveStorageLocations(),
    [getActiveStorageLocations]
  );

  const storageLocationOptions = React.useMemo(
    () => activeStorageLocations.map(loc => ({ value: loc.systemId, label: loc.name })),
    [activeStorageLocations]
  );

  const defaultStorageLocation = React.useMemo(
    () => activeStorageLocations.find(loc => loc.isDefault),
    [activeStorageLocations]
  );

  const activeBrands = React.useMemo(
    () => getActiveBrands(),
    [getActiveBrands]
  );

  const brandOptions = React.useMemo(
    () => activeBrands.map(b => ({ value: b.systemId, label: b.name })),
    [activeBrands]
  );

  const activeProductTypes = React.useMemo(
    () => getActiveProductTypes(),
    [getActiveProductTypes]
  );

  const productTypeOptions = React.useMemo(
    () => activeProductTypes.map(pt => ({ value: pt.systemId, label: pt.name })),
    [activeProductTypes]
  );

  const categoryOptions = React.useMemo(
    () => productCategories
      .filter(c => c.isActive !== false)
      .map(c => ({ value: c.systemId, label: c.path || c.name })),
    [productCategories]
  );

  const activeImporters = React.useMemo(
    () => getActiveImporters(),
    [getActiveImporters]
  );

  const importerOptions = React.useMemo(
    () => activeImporters.map(i => ({ value: i.systemId, label: i.name })),
    [activeImporters]
  );

  const defaultImporter = React.useMemo(
    () => getDefaultImporter(),
    [getDefaultImporter]
  );

  const defaultValues = React.useMemo<ProductFormCompleteValues>(() => {
    if (initialData) {
      return {
        ...initialData,
        systemId: initialData.systemId,
        id: initialData.id,
        title: initialData.ktitle ?? '',
        comboItems: initialData.comboItems ?? [],
        comboPricingType: initialData.comboPricingType ?? 'fixed',
        comboDiscount: initialData.comboDiscount ?? 0,
        websiteSeo: {
          pkgx: initialData.websiteSeo?.pkgx || {},
          trendtech: initialData.websiteSeo?.trendtech || {},
        },
      };
    }

    const isCombo = defaultType === 'combo';
    const logisticsPreset = isCombo
      ? logisticsSettings.comboDefaults
      : logisticsSettings.physicalDefaults;

    return {
      id: '',
      name: '',
      title: '',
      description: '',
      shortDescription: '',
      seoDescription: '',
      unit: 'Cái',
      type: defaultType ?? 'physical',
      status: 'active',
      costPrice: 0,
      prices: {},
      inventoryByBranch: {},
      committedByBranch: {},
      inTransitByBranch: {},
      isStockTracked: true,
      reorderLevel: slaSettings.defaultReorderLevel,
      safetyStock: slaSettings.defaultSafetyStock,
      maxStock: slaSettings.defaultMaxStock,
      weight: logisticsPreset.weight,
      weightUnit: logisticsPreset.weightUnit ?? 'g',
      dimensions: {
        length: logisticsPreset.length,
        width: logisticsPreset.width,
        height: logisticsPreset.height,
      },
      comboItems: [],
      comboPricingType: 'fixed',
      comboDiscount: 0,
      storageLocationSystemId: defaultStorageLocation?.systemId,
      // E-commerce defaults
      slug: '',
      isPublished: false,
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
      isOnSale: false,
      sortOrder: 0,
      publishedAt: '',
      videoLinks: undefined,
      // Website SEO defaults
      websiteSeo: {
        pkgx: {},
        trendtech: {},
      },
    };
  }, [initialData, defaultType, slaSettings, logisticsSettings, defaultStorageLocation]);

  const form = useForm<ProductFormCompleteValues>({
    defaultValues,
  });

  React.useEffect(() => {
    if (!initialData && defaultType) {
      form.setValue('type', defaultType);
    }
  }, [defaultType, initialData, form]);

  React.useEffect(() => {
    const inventoryFields: Array<{
      field: 'reorderLevel' | 'safetyStock' | 'maxStock';
      defaultValue?: number;
    }> = [
      {
        field: 'reorderLevel',
        ...(typeof slaSettings.defaultReorderLevel === 'number'
          ? { defaultValue: slaSettings.defaultReorderLevel }
          : {}),
      },
      {
        field: 'safetyStock',
        ...(typeof slaSettings.defaultSafetyStock === 'number'
          ? { defaultValue: slaSettings.defaultSafetyStock }
          : {}),
      },
      {
        field: 'maxStock',
        ...(typeof slaSettings.defaultMaxStock === 'number'
          ? { defaultValue: slaSettings.defaultMaxStock }
          : {}),
      },
    ];

    inventoryFields.forEach(({ field, defaultValue }) => {
      const currentValue = form.getValues(field);
      if ((currentValue === undefined || currentValue === null) && typeof defaultValue === 'number') {
        form.setValue(field, defaultValue);
      }
    });
  }, [form, slaSettings]);

  const productType = form.watch('type');
  const isComboProduct = productType === 'combo';

  // Update logistics defaults when product type changes (only for new products)
  React.useEffect(() => {
    if (initialData) return; // Don't update if editing existing product
    
    const logisticsPreset = isComboProduct 
      ? logisticsSettings.comboDefaults 
      : logisticsSettings.physicalDefaults;
    
    form.setValue('weight', logisticsPreset.weight);
    form.setValue('weightUnit', logisticsPreset.weightUnit ?? 'g');
    form.setValue('dimensions', {
      length: logisticsPreset.length,
      width: logisticsPreset.width,
      height: logisticsPreset.height,
    });
  }, [isComboProduct, initialData, logisticsSettings, form]);
  
  // Watch combo fields for auto-fill calculations
  const comboItems = useWatch({ control: form.control, name: 'comboItems' });
  const comboPricingType = useWatch({ control: form.control, name: 'comboPricingType' });
  const comboDiscount = useWatch({ control: form.control, name: 'comboDiscount' });
  
  // Get default pricing policy for combo price calculation
  const defaultPricingPolicy = React.useMemo(() => {
    return pricingPolicies.find(p => p.isDefault && p.type === 'Bán hàng');
  }, [pricingPolicies]);
  
  // Calculate combo prices
  const comboCalculations = React.useMemo(() => {
    if (!isComboProduct || !comboItems || comboItems.length === 0) {
      return { costPrice: 0, comboPrice: 0, totalOriginalPrice: 0 };
    }
    
    // Calculate cost price from combo items
    const costPrice = calculateComboCostPrice(
      comboItems.map(item => ({
        productSystemId: item.productSystemId as SystemId,
        quantity: item.quantity,
      })),
      products,
      defaultPricingPolicy?.systemId
        ? { fallbackPricingPolicyId: defaultPricingPolicy.systemId }
        : undefined
    );
    
    // Calculate total original price (sum of selling prices)
    let totalOriginalPrice = 0;
    for (const item of comboItems) {
      const product = products.find(p => p.systemId === item.productSystemId);
      if (product) {
        // Get unit price based on default policy or first available
        let unitPrice = 0;
        if (defaultPricingPolicy) {
          unitPrice = product.prices?.[defaultPricingPolicy.systemId] ?? 0;
        }
        if (unitPrice === 0) {
          const firstPrice = Object.values(product.prices || {}).find(
            (value): value is number => typeof value === 'number' && value > 0
          );
          unitPrice = firstPrice || product.suggestedRetailPrice || product.minPrice || 0;
        }
        totalOriginalPrice += unitPrice * item.quantity;
      }
    }
    
    // Calculate combo price based on pricing type
    let comboPrice = totalOriginalPrice;
    if (comboPricingType === 'fixed') {
      comboPrice = comboDiscount || 0;
    } else if (comboPricingType === 'sum_discount_percent') {
      comboPrice = Math.round(totalOriginalPrice * (1 - (comboDiscount || 0) / 100));
    } else if (comboPricingType === 'sum_discount_amount') {
      comboPrice = Math.max(0, totalOriginalPrice - (comboDiscount || 0));
    }
    
    return { costPrice, comboPrice, totalOriginalPrice };
  }, [isComboProduct, comboItems, comboPricingType, comboDiscount, products, defaultPricingPolicy]);

  const finalComboPricesByPolicy = React.useMemo(() => {
    if (!isComboProduct || !comboItems || comboItems.length === 0 || !comboPricingType) {
      return {} as Record<string, number>;
    }

    return calculateFinalComboPricesByPolicy(
      comboItems.map(item => ({
        productSystemId: item.productSystemId as SystemId,
        quantity: item.quantity,
      })),
      products,
      comboPricingType,
      comboDiscount || 0,
      defaultPricingPolicy?.systemId
    );
  }, [
    isComboProduct,
    comboItems,
    comboPricingType,
    comboDiscount,
    products,
    defaultPricingPolicy?.systemId,
  ]);
  
  // Auto-fill cost price when combo items change (but allow manual edit)
  const prevCostPriceRef = React.useRef<number>(0);
  React.useEffect(() => {
    if (!isComboProduct || !comboItems || comboItems.length === 0) return;
    
    // Only auto-fill cost price if it changed (from combo calculation)
    if (comboCalculations.costPrice > 0 && comboCalculations.costPrice !== prevCostPriceRef.current) {
      form.setValue('costPrice', comboCalculations.costPrice);
      prevCostPriceRef.current = comboCalculations.costPrice;
    }
  }, [isComboProduct, comboItems, comboCalculations.costPrice, form]);
  
  // Auto-fill comboDiscount with calculated combo price when pricing type is 'fixed'
  // For 'percent' and 'amount' pricing types, default to 0 (user enters manually)
  const prevTotalOriginalPriceRef = React.useRef<number>(0);
  const prevComboPricingTypeRef = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    if (!isComboProduct || !comboItems || comboItems.length === 0) return;
    
    // When pricing type changes, reset comboDiscount appropriately
    if (comboPricingType !== prevComboPricingTypeRef.current) {
      if (comboPricingType === 'fixed') {
        // For fixed price: set to totalOriginalPrice (no discount by default)
        form.setValue('comboDiscount', comboCalculations.totalOriginalPrice);
        prevTotalOriginalPriceRef.current = comboCalculations.totalOriginalPrice;
      } else {
        // For percent or amount: set to 0 (user enters discount manually)
        form.setValue('comboDiscount', 0);
      }
      prevComboPricingTypeRef.current = comboPricingType;
      return;
    }
    
    // Only auto-update for 'fixed' pricing type when items change
    if (comboPricingType === 'fixed' && comboCalculations.totalOriginalPrice > 0) {
      if (comboCalculations.totalOriginalPrice !== prevTotalOriginalPriceRef.current) {
        form.setValue('comboDiscount', comboCalculations.totalOriginalPrice);
        prevTotalOriginalPriceRef.current = comboCalculations.totalOriginalPrice;
      }
    }
  }, [isComboProduct, comboItems, comboPricingType, comboCalculations.totalOriginalPrice, form]);
  
  // Auto-fill selling prices for available policies when combo composition changes
  React.useEffect(() => {
    if (!isComboProduct || !comboItems || comboItems.length === 0) return;
    const entries = Object.entries(finalComboPricesByPolicy);
    if (entries.length === 0) return;

    entries.forEach(([policyId, price]) => {
      form.setValue(`prices.${policyId}`, price);
    });
  }, [isComboProduct, comboItems, finalComboPricesByPolicy, form]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFormSubmit = async (values: ProductFormCompleteValues) => {
    // Validate form
    const validationErrors = validateProductForm(values);
    
    if (validationErrors.length > 0) {
      // Show toast with first 3 errors
      toast.error('Vui lòng kiểm tra lại thông tin', {
        description: validationErrors.slice(0, 3).map(e => e.message).join('. '),
      });
      return;
    }
    
    // Build image files to pass to parent
    const imageFiles: Record<string, StagingFile[]> = {};
    
    if (thumbnailStagingFiles.length > 0 && thumbnailSessionId) {
      imageFiles['thumbnail'] = thumbnailStagingFiles.map(f => ({
        ...f,
        sessionId: thumbnailSessionId,
      }));
    }
    
    if (galleryStagingFiles.length > 0 && gallerySessionId) {
      imageFiles['gallery'] = galleryStagingFiles.map(f => ({
        ...f,
        sessionId: gallerySessionId,
      }));
    }
    
    console.log('[ProductForm] Submitting with imageFiles:', imageFiles);
    
    // Submit the form data with image files
    onSubmit({
      ...values,
      tags,
      _imageFiles: Object.keys(imageFiles).length > 0 ? imageFiles : undefined,
    });
  };

  return (
    <Form {...form}>
      <form 
        id="product-form-complete"
        onSubmit={form.handleSubmit(handleFormSubmit)} 
        className="space-y-6"
      >
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="basic">Cơ bản &amp; Giá bán</TabsTrigger>
            <TabsTrigger value="images">Hình ảnh</TabsTrigger>
            <TabsTrigger value="inventory">Kho</TabsTrigger>
            <TabsTrigger value="logistics">Vận chuyển</TabsTrigger>
            <TabsTrigger value="label">Tem phụ</TabsTrigger>
            <TabsTrigger value="seo-pkgx" className="gap-1">
              <Globe className="h-3 w-3" style={{ color: '#ef4444' }} />
              SEO PKGX
            </TabsTrigger>
            <TabsTrigger value="seo-trendtech" className="gap-1">
              <Globe className="h-3 w-3" style={{ color: '#3b82f6' }} />
              SEO Trendtech
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Basic Info */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            {/* Card 1: Thông tin cơ bản */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-h3">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mobile: Stack, Desktop: 3 columns */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã SKU *</FormLabel>
                        <FormControl>
                          <Input
                            className="h-9"
                            {...field}
                            placeholder="SP000001"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1 md:col-span-2">
                        <FormLabel>Tên sản phẩm *</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} placeholder="Nhập tên sản phẩm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loại *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={isComboProduct}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Chọn loại" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="physical">Hàng hóa</SelectItem>
                            <SelectItem value="service">Dịch vụ</SelectItem>
                            <SelectItem value="digital">Sản phẩm số</SelectItem>
                            <SelectItem value="combo">Combo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Đơn vị tính *</FormLabel>
                        <FormControl>
                          <Combobox
                            options={unitOptions}
                            value={unitOptions.find(opt => opt.value === field.value) || null}
                            onChange={option => field.onChange(option?.value)}
                            placeholder="Chọn đơn vị"
                            searchPlaceholder="Tìm kiếm..."
                            emptyPlaceholder="Không tìm thấy"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã vạch</FormLabel>
                        <FormControl>
                          <Input className="h-9" {...field} placeholder="Nhập mã vạch" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Đang kinh doanh</SelectItem>
                            <SelectItem value="inactive">Ngừng kinh doanh</SelectItem>
                            <SelectItem value="discontinued">Ngừng sản xuất</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="warrantyPeriodMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thời hạn bảo hành (tháng)</FormLabel>
                        <FormControl>
                          <Input
                            className="h-9"
                            type="number"
                            min={0}
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === '' ? undefined : parseInt(val, 10));
                            }}
                            placeholder="VD: 12"
                          />
                        </FormControl>
                        <FormDescription>
                          Để trống sẽ dùng giá trị mặc định từ cài đặt
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brandSystemId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thương hiệu</FormLabel>
                        <FormControl>
                          <Combobox
                            options={brandOptions}
                            value={brandOptions.find(opt => opt.value === field.value) || null}
                            onChange={option => field.onChange(option?.value)}
                            placeholder="Chọn thương hiệu"
                            searchPlaceholder="Tìm kiếm..."
                            emptyPlaceholder="Không tìm thấy"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="productTypeSystemId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loại sản phẩm</FormLabel>
                        <FormControl>
                          <Combobox
                            options={productTypeOptions}
                            value={productTypeOptions.find(opt => opt.value === field.value) || null}
                            onChange={option => field.onChange(option?.value)}
                            placeholder="Chọn loại sản phẩm"
                            searchPlaceholder="Tìm kiếm..."
                            emptyPlaceholder="Không tìm thấy"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categorySystemId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục</FormLabel>
                        <FormControl>
                          <Combobox
                            options={categoryOptions}
                            value={categoryOptions.find(opt => opt.value === field.value) || null}
                            onChange={option => field.onChange(option?.value)}
                            placeholder="Chọn danh mục"
                            searchPlaceholder="Tìm kiếm..."
                            emptyPlaceholder="Không tìm thấy"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thuế suất (%)</FormLabel>
                        <FormControl>
                          <Input
                            className="h-9"
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === '' ? undefined : parseFloat(val));
                            }}
                            placeholder="VD: 10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="launchedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày ra mắt</FormLabel>
                        <FormControl>
                          <Input
                            className="h-9"
                            type="date"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discontinuedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày ngừng KD</FormLabel>
                        <FormControl>
                          <Input
                            className="h-9"
                            type="date"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-body-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Tags
                  </label>
                  <div className="flex gap-2">
                    <Input
                      className="h-9"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Nhập tag và Enter"
                    />
                    <Button type="button" variant="outline" className="h-9" onClick={handleAddTag}>
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="sellerNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú nội bộ</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[80px]"
                          {...field}
                          value={field.value || ''}
                          placeholder="Ghi chú riêng cho người bán (không hiển thị cho khách hàng)..."
                        />
                      </FormControl>
                      <FormDescription>
                        Ghi chú nội bộ - chỉ nhân viên xem được, không hiển thị trên website
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Card: Cài đặt hiển thị website - moved from E-commerce tab */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-h3">Cài đặt hiển thị website</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Đăng web</FormLabel>
                          <FormDescription className="text-xs">
                            Hiển thị trên website
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Nổi bật</FormLabel>
                          <FormDescription className="text-xs">
                            Sản phẩm nổi bật
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isNewArrival"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Mới về</FormLabel>
                          <FormDescription className="text-xs">
                            Hàng mới về
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isBestSeller"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Bán chạy</FormLabel>
                          <FormDescription className="text-xs">
                            Sản phẩm bán chạy
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isOnSale"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Đang giảm giá</FormLabel>
                          <FormDescription className="text-xs">
                            Hiện badge Sale
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thứ tự hiển thị</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày đăng web</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ngày sản phẩm được đăng lên website
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Card 2: Thành phần Combo - CHỈ hiện khi là combo product */}
            {isComboProduct && (
              <ComboSection />
            )}

            {/* Card 3: Giá mua & Giá vốn */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-h3">Giá mua &amp; Giá vốn</CardTitle>
                  {isComboProduct && comboItems && comboItems.length > 0 && (
                    <Badge variant="secondary" className="text-body-xs">
                      <Info className="h-3 w-3 mr-1" />
                      Tự động tính từ combo
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá vốn *</FormLabel>
                        <FormControl>
                          <CurrencyInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="0"
                          />
                        </FormControl>
                        {isComboProduct && comboItems && comboItems.length > 0 && (
                          <FormDescription>
                            Tự động tính từ combo (có thể sửa)
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primarySupplierSystemId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhà cung cấp chính</FormLabel>
                        <FormControl>
                          <Combobox
                            options={supplierOptions}
                            value={supplierOptions.find(opt => opt.value === field.value) || null}
                            onChange={option => field.onChange(option?.value)}
                            placeholder="Chọn nhà cung cấp"
                            searchPlaceholder="Tìm kiếm..."
                            emptyPlaceholder="Không tìm thấy"
                            disabled={isComboProduct}
                          />
                        </FormControl>
                        {isComboProduct && (
                          <FormDescription>
                            Combo không có nhà cung cấp riêng
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!isComboProduct && (
                    <>
                      <FormField
                        control={form.control}
                        name="suggestedRetailPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giá bán lẻ đề xuất</FormLabel>
                            <FormControl>
                              <CurrencyInput
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastPurchasePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giá nhập gần nhất</FormLabel>
                            <FormControl>
                              <CurrencyInput
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="minPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giá tối thiểu</FormLabel>
                            <FormControl>
                              <CurrencyInput
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="0"
                              />
                            </FormControl>
                            <FormDescription>
                              Giá thấp nhất cho phép bán
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Bảng giá bán theo chính sách */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-h3">Bảng giá bán theo chính sách</CardTitle>
                  {isComboProduct && comboItems && comboItems.length > 0 && (
                    <Badge variant="secondary" className="text-body-xs">
                      <Info className="h-3 w-3 mr-1" />
                      Tự động từ giá combo
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isComboProduct && comboItems && comboItems.length > 0 && (
                  <p className="text-body-sm text-muted-foreground mb-4">
                    Giá bán được tự động tính từ giá combo. Bạn có thể điều chỉnh thủ công nếu cần.
                  </p>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {salesPolicies.map(policy => (
                    <FormField
                      key={policy.systemId}
                      control={form.control}
                      name={`prices.${policy.systemId}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {policy.name}
                            {policy.isDefault && (
                              <span className="text-body-xs text-muted-foreground ml-2">
                                (Mặc định)
                              </span>
                            )}
                          </FormLabel>
                          <FormControl>
                            <CurrencyInput
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                {salesPolicies.length === 0 && (
                  <p className="text-body-sm text-muted-foreground">
                    Chưa có chính sách giá bán. Vui lòng thêm trong Cài đặt.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Images */}
          <TabsContent value="images" className="space-y-4 mt-4">
            {/* Ảnh chính (thumbnail) - chỉ 1 ảnh */}
            <Card>
              <CardHeader>
                <CardTitle>Ảnh chính</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadManager
                  value={thumbnailStagingFiles}
                  onChange={setThumbnailStagingFiles}
                  {...(thumbnailSessionId ? { sessionId: thumbnailSessionId } : {})}
                  onSessionChange={(nextSessionId) => setThumbnailSessionId(nextSessionId)}
                  maxFiles={1}
                  maxSize={5 * 1024 * 1024}
                  maxTotalSize={5 * 1024 * 1024}
                  description="Tải lên ảnh đại diện chính của sản phẩm. Chỉ được phép 1 ảnh."
                />
              </CardContent>
            </Card>

            {/* Ảnh album (gallery) - nhiều ảnh */}
            <Card>
              <CardHeader>
                <CardTitle>Album ảnh</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploadManager
                  value={galleryStagingFiles}
                  onChange={setGalleryStagingFiles}
                  {...(gallerySessionId ? { sessionId: gallerySessionId } : {})}
                  onSessionChange={(nextSessionId) => setGallerySessionId(nextSessionId)}
                  maxFiles={19}
                  maxSize={5 * 1024 * 1024}
                  maxTotalSize={50 * 1024 * 1024}
                  description="Tải lên các hình ảnh phụ cho bộ sưu tập sản phẩm. Tối đa 19 ảnh."
                />
              </CardContent>
            </Card>

            {/* Video Links - moved from E-commerce tab */}
            <Card>
              <CardHeader>
                <CardTitle>Video Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="videoLinks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh sách Video</FormLabel>
                      <FormControl>
                        <Textarea
                          value={(field.value as string[] | undefined)?.join('\n') || ''}
                          onChange={(e) => {
                            const links = e.target.value.split('\n').filter(Boolean);
                            field.onChange(links.length > 0 ? links : undefined);
                          }}
                          placeholder="https://youtube.com/watch?v=xxx&#10;https://tiktok.com/@channel/video/xxx&#10;https://drive.google.com/file/d/xxx"
                          rows={5}
                        />
                      </FormControl>
                      <FormDescription>
                        Mỗi link trên một dòng. Hỗ trợ: YouTube, TikTok, Google Drive, Vimeo, Facebook
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Inventory */}
          <TabsContent value="inventory" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý kho</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isStockTracked"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value !== false}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Theo dõi tồn kho</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storageLocationSystemId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Điểm lưu kho</FormLabel>
                      <FormControl>
                        <Combobox
                          options={storageLocationOptions}
                          value={storageLocationOptions.find(opt => opt.value === field.value) || null}
                          onChange={option => field.onChange(option?.value)}
                          placeholder="Chọn điểm lưu kho"
                          searchPlaceholder="Tìm kiếm..."
                          emptyPlaceholder="Không tìm thấy"
                        />
                      </FormControl>
                      <FormDescription>
                        Vị trí lưu trữ sản phẩm trong kho
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="reorderLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mức đặt hàng lại</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormDescription>
                          Cảnh báo khi tồn kho xuống dưới mức này
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="safetyStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tồn kho an toàn</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormDescription>
                          Mức tồn dự phòng tối thiểu
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mức tồn tối đa</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormDescription>
                          Giới hạn tồn kho tối đa
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 5: Logistics */}
          <TabsContent value="logistics" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin vận chuyển</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Khối lượng</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weightUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Đơn vị khối lượng</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn đơn vị" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="g">g (gram)</SelectItem>
                            <SelectItem value="kg">kg (kilogram)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-body-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Kích thước (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="dimensions.length"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              placeholder="Dài"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dimensions.width"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              placeholder="Rộng"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dimensions.height"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              placeholder="Cao"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 5: Tem phụ (Product Label Info) */}
          <TabsContent value="label" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin tem phụ sản phẩm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="nameVat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên sản phẩm VAT</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[80px]"
                          {...field}
                          value={field.value ?? ''}
                          placeholder="Tên sản phẩm đầy đủ để in tem/hóa đơn VAT"
                        />
                      </FormControl>
                      <FormDescription>
                        Tên chi tiết hiển thị trên tem phụ và hóa đơn VAT
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xuất xứ / Địa chỉ sản xuất</FormLabel>
                      <FormControl>
                        <Input
                          className="h-9"
                          {...field}
                          value={field.value ?? ''}
                          placeholder="VD: Trung Quốc, Việt Nam, ..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="importerSystemId"
                  render={({ field }) => {
                    const selectedImporter = activeImporters.find(i => i.systemId === field.value);
                    return (
                      <FormItem>
                        <FormLabel>Đơn vị nhập khẩu</FormLabel>
                        <FormControl>
                          <Combobox
                            options={importerOptions}
                            value={importerOptions.find(opt => opt.value === field.value) || null}
                            onChange={option => {
                              field.onChange(option?.value);
                              // Auto-fill related fields when importer is selected
                              if (option?.value) {
                                const importer = activeImporters.find(i => i.systemId === option.value);
                                if (importer) {
                                  // Only auto-fill if fields are empty
                                  if (!form.getValues('origin') && importer.origin) {
                                    form.setValue('origin', importer.origin);
                                  }
                                  if (!form.getValues('usageGuide') && importer.usageGuide) {
                                    form.setValue('usageGuide', importer.usageGuide);
                                  }
                                  if (!form.getValues('importerName')) {
                                    form.setValue('importerName', importer.name);
                                  }
                                  if (!form.getValues('importerAddress') && importer.address) {
                                    form.setValue('importerAddress', importer.address);
                                  }
                                }
                              }
                            }}
                            placeholder="Chọn đơn vị nhập khẩu"
                            searchPlaceholder="Tìm kiếm..."
                            emptyPlaceholder="Không tìm thấy"
                          />
                        </FormControl>
                        {selectedImporter && (
                          <FormDescription>
                            {selectedImporter.address}
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="usageGuide"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hướng dẫn sử dụng</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[80px]"
                          {...field}
                          value={field.value ?? ''}
                          placeholder="VD: Bên trong bao bì SP"
                        />
                      </FormControl>
                      <FormDescription>
                        Để trống sẽ sử dụng hướng dẫn từ đơn vị nhập khẩu đã chọn
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="importerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên đơn vị (override)</FormLabel>
                        <FormControl>
                          <Input
                            className="h-9"
                            {...field}
                            value={field.value ?? ''}
                            placeholder="VD: CÔNG TY TNHH XNK ABC"
                          />
                        </FormControl>
                        <FormDescription>
                          Chỉ điền nếu muốn ghi đè tên đơn vị nhập khẩu
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="importerAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ (override)</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[80px]"
                            {...field}
                            value={field.value ?? ''}
                            placeholder="Địa chỉ đầy đủ của đơn vị nhập khẩu"
                          />
                        </FormControl>
                        <FormDescription>
                          Chỉ điền nếu muốn ghi đè địa chỉ nhập khẩu
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-1">Lưu ý:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Chọn đơn vị nhập khẩu từ danh sách để tự động điền thông tin</li>
                        <li>Các trường "override" chỉ dùng khi muốn ghi đè thông tin mặc định</li>
                        <li>Cài đặt đơn vị nhập khẩu tại: Cài đặt &gt; Kho hàng &gt; Đơn vị nhập khẩu</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 6: SEO PKGX */}
          <TabsContent value="seo-pkgx" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" style={{ color: '#ef4444' }} />
                  <CardTitle>SEO cho PKGX</CardTitle>
                </div>
                <CardDescription>phukiengiaxuong.com.vn - SEO riêng cho website này</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="pkgxSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug PKGX (URL)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="ao-so-mi-nam-oxford" />
                      </FormControl>
                      <FormDescription>
                        URL thân thiện SEO cho website PKGX. Để trống sẽ tự động tạo từ tên sản phẩm.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <TipTapEditor
                          content={field.value || ''}
                          onChange={field.onChange}
                          placeholder="Mô tả ngắn gọn 1-2 câu..."
                          minHeight="100px"
                        />
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
                        <TipTapEditor
                          content={field.value || ''}
                          onChange={field.onChange}
                          placeholder="Mô tả đầy đủ về sản phẩm..."
                          minHeight="250px"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 7: SEO Trendtech */}
          <TabsContent value="seo-trendtech" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" style={{ color: '#3b82f6' }} />
                  <CardTitle>SEO cho Trendtech</CardTitle>
                </div>
                <CardDescription>Coming soon - SEO riêng cho website này</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="trendtechSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug Trendtech (URL)</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="ao-so-mi-nam-oxford" />
                      </FormControl>
                      <FormDescription>
                        URL thân thiện SEO cho website Trendtech. Để trống sẽ tự động tạo từ tên sản phẩm.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <TipTapEditor
                          content={field.value || ''}
                          onChange={field.onChange}
                          placeholder="Mô tả ngắn gọn 1-2 câu..."
                          minHeight="100px"
                        />
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
                        <TipTapEditor
                          content={field.value || ''}
                          onChange={field.onChange}
                          placeholder="Mô tả đầy đủ về sản phẩm..."
                          minHeight="250px"
                        />
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
  );
}

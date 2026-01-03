import * as React from "react";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import type { Product } from "@/lib/types/prisma-extended";
import { useAllProducts } from "./hooks/use-all-products";
import { usePricingPolicyStore } from '../settings/pricing/store';
import { useUnitStore } from "../settings/units/store";
import { useSupplierStore } from "../suppliers/store";
import { useAllBranches } from "../settings/branches/hooks/use-all-branches";
import { useSlaSettingsStore } from "../settings/inventory/sla-settings-store";
import { useProductLogisticsSettingsStore } from "../settings/inventory/logistics-settings-store";
import { useStorageLocationStore } from "../settings/inventory/storage-location-store";
import { useBrandStore } from "../settings/inventory/brand-store";
import { useImporterStore } from "../settings/inventory/importer-store";
import { useProductTypeStore } from "../settings/inventory/product-type-store";
import { useProductCategoryStore } from "../settings/inventory/product-category-store";
import { useImageUpload } from '../../hooks/use-image-upload';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Globe } from "lucide-react";
import { MIN_COMBO_ITEMS, MAX_COMBO_ITEMS, calculateComboCostPrice, calculateFinalComboPricesByPolicy } from './combo-utils';
import type { SystemId } from '@/lib/id-types';
import { FileUploadAPI, type StagingFile } from '@/lib/file-upload-api';
import {
  BasicInfoTab,
  ImagesTab,
  InventoryTab,
  LogisticsTab,
  LabelTab,
  SeoDefaultTab,
  SeoPkgxTab,
  SeoTrendtechTab,
  validateProductForm,
  type ProductFormCompleteValues,
} from './product-form';

// Re-export for backward compatibility
export type { ProductFormCompleteValues };

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
  onCancel: _onCancel,
  isEditMode = false,
  defaultType,
}: ProductFormCompleteProps) {
  const { data: products } = useAllProducts();
  const { data: pricingPolicies } = usePricingPolicyStore();
  const { data: units } = useUnitStore();
  const { data: suppliers } = useSupplierStore();
  const { data: _branches } = useAllBranches();
  const { settings: slaSettings } = useSlaSettingsStore();
  const { settings: logisticsSettings } = useProductLogisticsSettingsStore();
  const { getActive: getActiveStorageLocations } = useStorageLocationStore();
  const { getActive: getActiveBrands } = useBrandStore();
  const { getActive: getActiveImporters, getDefault: getDefaultImporter } = useImporterStore();
  const { getActive: getActiveProductTypes } = useProductTypeStore();
  const { data: productCategories } = useProductCategoryStore();

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // IMAGE MANAGEMENT - Load existing images for edit mode
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  const [_isLoadingImages, setIsLoadingImages] = React.useState(false);
  const [_loadedThumbnails, setLoadedThumbnails] = React.useState<StagingFile[]>([]);
  const [_loadedGallery, setLoadedGallery] = React.useState<StagingFile[]>([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setThumbnailStagingFiles/setGalleryStagingFiles are stable setState from useImageUpload
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
  const _hasImages = hasThumbnailImages || hasGalleryImages;

  // Combined confirm function
  const _confirmImages = async (productId: string, values: Record<string, unknown>) => {
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

  const _activeImporters = React.useMemo(
    () => getActiveImporters(),
    [getActiveImporters]
  );

  const _importerOptions = React.useMemo(
    () => _activeImporters.map(i => ({ value: i.systemId, label: i.name })),
    [_activeImporters]
  );

  const _defaultImporter = React.useMemo(
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
        seoPkgx: initialData.seoPkgx || {},
        seoTrendtech: initialData.seoTrendtech || {},
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
      unit: 'CÃ¡i',
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
      seoPkgx: {},
      seoTrendtech: {},
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
          unitPrice = firstPrice || product.minPrice || 0;
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

  const handleFormSubmit = async (values: ProductFormCompleteValues) => {
    // Validate form
    const validationErrors = validateProductForm(values, MIN_COMBO_ITEMS, MAX_COMBO_ITEMS);
    
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
    <FormProvider {...form}>
      <form 
        id="product-form-complete"
        onSubmit={form.handleSubmit(handleFormSubmit)} 
        className="space-y-6"
      >
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="basic">CÆ¡ báº£n &amp; GiÃ¡ bÃ¡n</TabsTrigger>
            <TabsTrigger value="images">HÃ¬nh áº£nh</TabsTrigger>
            <TabsTrigger value="inventory">Kho</TabsTrigger>
            <TabsTrigger value="logistics">Váº­n chuyá»ƒn</TabsTrigger>
            <TabsTrigger value="label">Tem phá»¥</TabsTrigger>
            <TabsTrigger value="seo-default" className="gap-1">
              <Globe className="h-3 w-3" />
              SEO Chung
            </TabsTrigger>
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
            <BasicInfoTab
              unitOptions={unitOptions}
              brandOptions={brandOptions}
              productTypeOptions={productTypeOptions}
              categoryOptions={categoryOptions}
              supplierOptions={supplierOptions}
              salesPolicies={salesPolicies}
              isComboProduct={isComboProduct}
              tags={tags}
              setTags={setTags}
              tagInput={tagInput}
              setTagInput={setTagInput}
            />
          </TabsContent>

          {/* Tab 2: Images */}
          <TabsContent value="images" className="space-y-4 mt-4">
            <ImagesTab
              thumbnailStagingFiles={thumbnailStagingFiles}
              setThumbnailStagingFiles={setThumbnailStagingFiles}
              thumbnailSessionId={thumbnailSessionId}
              setThumbnailSessionId={setThumbnailSessionId}
              galleryStagingFiles={galleryStagingFiles}
              setGalleryStagingFiles={setGalleryStagingFiles}
              gallerySessionId={gallerySessionId}
              setGallerySessionId={setGallerySessionId}
            />
          </TabsContent>

          {/* Tab 3: Inventory */}
          <TabsContent value="inventory" className="space-y-4 mt-4">
            <InventoryTab storageLocationOptions={storageLocationOptions} />
          </TabsContent>

          {/* Tab 4: Logistics */}
          <TabsContent value="logistics" className="space-y-4 mt-4">
            <LogisticsTab />
          </TabsContent>

          {/* Tab 5: Label */}
          <TabsContent value="label" className="space-y-4 mt-4">
            <LabelTab />
          </TabsContent>

          {/* Tab 6: SEO Default */}
          <TabsContent value="seo-default" className="space-y-4 mt-4">
            <SeoDefaultTab />
          </TabsContent>

          {/* Tab 7: SEO PKGX */}
          <TabsContent value="seo-pkgx" className="space-y-4 mt-4">
            <SeoPkgxTab />
          </TabsContent>

          {/* Tab 8: SEO Trendtech */}
          <TabsContent value="seo-trendtech" className="space-y-4 mt-4">
            <SeoTrendtechTab />
          </TabsContent>
        </Tabs>
      </form>
    </FormProvider>
  );
}

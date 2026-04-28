import * as React from "react";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import type { Product } from "@/lib/types/prisma-extended";
import { useProductFinder } from "./hooks/use-all-products";
import { useProductFormData } from "./hooks/use-product-form-data";
import { useAllBranches } from "../settings/branches/hooks/use-all-branches";
import { useAllTaxes } from "../settings/taxes/hooks/use-taxes";
import { useImporterFinder } from "../settings/inventory/hooks/use-inventory-settings";
import { useEntityFiles } from "@/hooks/use-file-upload";
import { toast } from 'sonner';
import { Tabs, TabsContent } from "../../components/ui/tabs";
import { MobileTabsList, MobileTabsTrigger } from '@/components/layout/page-section';
import { Globe } from "lucide-react";
import { MIN_COMBO_ITEMS, MAX_COMBO_ITEMS, calculateComboCostPrice, calculateFinalComboPricesByPolicy } from './combo-utils';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { generateSubEntityId } from '@/lib/id-utils';
import type { UploadedImage } from '@/components/ui/simple-image-upload';
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

export type ProductFormCompleteHandle = {
  submit: () => void;
};

type ProductFormCompleteProps = {
  initialData: Product | null;
  onSubmit: (values: ProductFormCompleteValues) => void | Promise<void> | Promise<unknown>;
  onCancel: () => void;
  isEditMode?: boolean;
  defaultType?: Product['type'];
};

export const ProductFormComplete = React.forwardRef<ProductFormCompleteHandle, ProductFormCompleteProps>(function ProductFormComplete({ 
  initialData, 
  onSubmit, 
  onCancel: _onCancel,
  isEditMode = false,
  defaultType,
}, ref) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const { findById: findProductById } = useProductFinder();
  // ✅ OPTIMIZED: 9 reference data calls → 1 consolidated API call
  const {
    pricingPolicies, units, suppliers,
    storageLocations: allStorageLocations,
    productTypes: allProductTypes,
    brands: allBrands,
    categories: productCategories,
    slaSettings, logisticsSettings,
  } = useProductFormData();
  const { data: branches } = useAllBranches();
  const { data: taxes = [] } = useAllTaxes();
  const { getDefault: getDefaultImporter } = useImporterFinder();

  // ═══════════════════════════════════════════════════════════════
  // SIMPLIFIED IMAGE MANAGEMENT
  // Uses React Query (useEntityFiles) for deduplication — single API call
  // ═══════════════════════════════════════════════════════════════
  const { files: productFiles } = useEntityFiles('products', isEditMode ? initialData?.systemId : undefined);
  const [thumbnailImage, setThumbnailImage] = React.useState<UploadedImage | null>(null);
  const [galleryImages, setGalleryImages] = React.useState<UploadedImage[]>([]);
  const [imagesInitialized, setImagesInitialized] = React.useState(false);

  // Sync images from React Query result on first load
  React.useEffect(() => {
    if (imagesInitialized || !isEditMode || !initialData || productFiles.length === 0) return;
    setImagesInitialized(true);

    const thumbnailFile = productFiles.find(f => f.documentName === 'thumbnail');
    if (thumbnailFile) {
      setThumbnailImage({ id: thumbnailFile.id, url: thumbnailFile.url, name: thumbnailFile.originalName, size: thumbnailFile.fileSize });
    } else if (initialData.thumbnailImage) {
      setThumbnailImage({ id: generateSubEntityId('url'), url: initialData.thumbnailImage, name: 'thumbnail.jpg', size: 0 });
    }

    const galleryFiles = productFiles.filter(f => f.documentName === 'gallery');
    if (galleryFiles.length > 0) {
      setGalleryImages(galleryFiles.map(f => ({ id: f.id, url: f.url, name: f.originalName, size: f.fileSize })));
    } else {
      const productGallery = initialData.galleryImages ?? initialData.images ?? [];
      if (productGallery.length > 0) {
        setGalleryImages(productGallery.map((url: string, idx: number) => ({
          id: generateSubEntityId('url'), url, name: `gallery-${idx}.jpg`, size: 0,
        })));
      }
    }
  }, [productFiles, isEditMode, initialData, imagesInitialized]);

  // Fallback: if no files from API, use product URLs
  React.useEffect(() => {
    if (imagesInitialized || !isEditMode || !initialData) return;
    // Give React Query a moment, then fallback if no files
    const timer = setTimeout(() => {
      if (imagesInitialized) return;
      setImagesInitialized(true);
      if (initialData.thumbnailImage) {
        setThumbnailImage({ id: generateSubEntityId('url'), url: initialData.thumbnailImage, name: 'thumbnail.jpg', size: 0 });
      }
      const productGallery = initialData.galleryImages ?? initialData.images ?? [];
      if (productGallery.length > 0) {
        setGalleryImages(productGallery.map((url: string, idx: number) => ({
          id: generateSubEntityId('url'), url, name: `gallery-${idx}.jpg`, size: 0,
        })));
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isEditMode, initialData, imagesInitialized]);
  
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
    () => allStorageLocations.filter(loc => loc.isActive !== false),
    [allStorageLocations]
  );

  const storageLocationOptions = React.useMemo(
    () => activeStorageLocations.map(loc => ({ value: loc.systemId, label: loc.name })),
    [activeStorageLocations]
  );

  const defaultStorageLocation = React.useMemo(
    () => activeStorageLocations.find(loc => loc.isDefault),
    [activeStorageLocations]
  );

  const brandOptions = React.useMemo(
    () => allBrands.filter(b => b.isActive !== false).map(b => ({ value: b.systemId, label: b.name })),
    [allBrands]
  );

  const productTypeOptions = React.useMemo(
    () => allProductTypes.filter(pt => (pt as { isActive?: boolean }).isActive !== false).map(pt => ({ value: pt.systemId, label: pt.name })),
    [allProductTypes]
  );

  const categoryOptions = React.useMemo(
    () => productCategories
      .filter(c => c.isActive !== false)
      .map(c => ({ value: c.systemId, label: c.path || c.name })),
    [productCategories]
  );

  const defaultValues = React.useMemo((): ProductFormCompleteValues => {
    if (initialData) {
      // ✅ Transform prices from API array to form object format
      // API returns: ProductPrice[] with { pricingPolicyId, price }
      // Form needs: Record<string, number> with { [policyId]: price }
      const pricesObject: Record<string, number> = {};
      const apiPrices = (initialData as unknown as { prices?: Array<{ pricingPolicyId: string; price: number | string }> }).prices;
      if (Array.isArray(apiPrices)) {
        apiPrices.forEach((p) => {
          pricesObject[p.pricingPolicyId] = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
        });
      } else if (initialData.prices && typeof initialData.prices === 'object') {
        // Already in correct format
        Object.assign(pricesObject, initialData.prices);
      }

      // ✅ Transform productCategories from API array to categorySystemId
      // API returns: productCategories[] with { categoryId }
      // Form needs: categorySystemId (single) - take first one
      let categorySystemId: SystemId | undefined = initialData.categorySystemId ?? undefined;
      const categorySystemIds: SystemId[] = initialData.categorySystemIds ?? [];
      const apiProductCategories = (initialData as unknown as { productCategories?: Array<{ categoryId: string }> }).productCategories;
      if (Array.isArray(apiProductCategories) && apiProductCategories.length > 0) {
        categorySystemId = asSystemId(apiProductCategories[0].categoryId);
      } else if (categorySystemIds.length > 0) {
        categorySystemId = categorySystemIds[0];
      }

      // ✅ Get brandSystemId from brandId field (Prisma relation field)
      const brandSystemId: SystemId | undefined = initialData.brandSystemId ?? (initialData as unknown as { brandId?: string }).brandId ? asSystemId((initialData as unknown as { brandId?: string }).brandId!) : undefined;

      // ✅ Get productTypeSystemId - ensure it's passed through
      const productTypeSystemId: SystemId | undefined = initialData.productTypeSystemId ? asSystemId(initialData.productTypeSystemId) : undefined;

      // Debug log to verify data transformation

      return {
        ...initialData,
        systemId: initialData.systemId,
        id: initialData.id,
        title: initialData.ktitle ?? '',
        unit: initialData.unit ?? 'Cái',
        status: (initialData.status?.toUpperCase() as 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED') || 'ACTIVE',
        type: (initialData.type?.toLowerCase() as 'physical' | 'service' | 'digital' | 'combo') || 'physical',
        // ✅ Weight default 5g nếu null
        weight: initialData.weight ?? 5,
        weightUnit: ((initialData.weightUnit as string) === 'GRAM' ? 'g' : initialData.weightUnit) ?? 'g',
        comboItems: initialData.comboItems ?? [],
        comboPricingType: initialData.comboPricingType ?? 'fixed',
        comboDiscount: initialData.comboDiscount ?? 0,
        // ✅ SEO data từ database
        seoPkgx: initialData.seoPkgx || {},
        seoTrendtech: initialData.seoTrendtech || {},
        // ✅ Display flags từ database
        isPublished: initialData.isPublished ?? false,
        isFeatured: initialData.isFeatured ?? false,
        isNewArrival: initialData.isNewArrival ?? false,
        isBestSeller: initialData.isBestSeller ?? false,
        isOnSale: initialData.isOnSale ?? false,
        // ✅ Dates từ database - format cho date input
        launchedDate: initialData.launchedDate ? new Date(initialData.launchedDate).toISOString().split('T')[0] : undefined,
        publishedAt: initialData.publishedAt ? new Date(initialData.publishedAt).toISOString().split('T')[0] : undefined,
        // ✅ Transformed fields from API response
        prices: pricesObject,
        categorySystemId,
        categorySystemIds: categorySystemIds.length > 0 ? categorySystemIds : (categorySystemId ? [categorySystemId] : []),
        brandSystemId,
        productTypeSystemId,
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
      type: (defaultType?.toLowerCase() as 'physical' | 'service' | 'digital' | 'combo') ?? 'physical',
      status: 'ACTIVE',
      costPrice: 0,
      prices: {},
      inventoryByBranch: {},
      committedByBranch: {},
      inTransitByBranch: {},
      isStockTracked: true,
      reorderLevel: slaSettings.defaultReorderLevel,
      safetyStock: slaSettings.defaultSafetyStock,
      maxStock: slaSettings.defaultMaxStock,
      // ✅ Weight default 5g
      weight: logisticsPreset.weight || 5,
      weightUnit: ((logisticsPreset.weightUnit as string) === 'GRAM' ? 'g' : logisticsPreset.weightUnit) ?? 'g',
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
      form.setValue('type', defaultType.toLowerCase() as ProductFormCompleteValues['type']);
    }
  }, [defaultType, initialData, form]);

  // ✅ Auto-set default importer for new products
  React.useEffect(() => {
    if (initialData) return; // Only for new products
    const defaultImporter = getDefaultImporter();
    if (defaultImporter && !form.getValues('importerSystemId')) {
      form.setValue('importerSystemId', defaultImporter.systemId);
      form.setValue('importerName', defaultImporter.name);
      form.setValue('importerAddress', defaultImporter.address || '');
      form.setValue('origin', defaultImporter.origin || '');
      if (defaultImporter.usageGuide) {
        form.setValue('usageGuide', defaultImporter.usageGuide);
      }
    }
  }, [initialData, getDefaultImporter, form]);

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
      findProductById,
      defaultPricingPolicy?.systemId
        ? { fallbackPricingPolicyId: defaultPricingPolicy.systemId }
        : undefined
    );
    
    // Calculate total original price (sum of selling prices)
    let totalOriginalPrice = 0;
    for (const item of comboItems) {
      const product = findProductById(item.productSystemId);
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
          unitPrice = firstPrice || 0;
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
  }, [isComboProduct, comboItems, comboPricingType, comboDiscount, findProductById, defaultPricingPolicy]);

  const finalComboPricesByPolicy = React.useMemo(() => {
    if (!isComboProduct || !comboItems || comboItems.length === 0 || !comboPricingType) {
      return {} as Record<string, number>;
    }

    return calculateFinalComboPricesByPolicy(
      comboItems.map(item => ({
        productSystemId: item.productSystemId as SystemId,
        quantity: item.quantity,
      })),
      findProductById,
      comboPricingType,
      comboDiscount || 0,
      defaultPricingPolicy?.systemId
    );
  }, [
    isComboProduct,
    comboItems,
    comboPricingType,
    comboDiscount,
    findProductById,
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
    
    // Convert categorySystemId (single) to categorySystemIds (array) for API
    const categorySystemIds = values.categorySystemId 
      ? [values.categorySystemId] 
      : (values.categorySystemIds || []);
    
    // Show loading toast
    const loadingToastId = toast.loading(isEditMode ? 'Đang cập nhật sản phẩm...' : 'Đang tạo sản phẩm...');
    
    // Submit the form data with images
    // Images are already saved permanently when uploaded, but we need to include URLs for new products
    try {
      await onSubmit({
        ...values,
        tags,
        // Ensure categorySystemIds is always an array
        categorySystemIds,
        // Include image URLs for creating/updating product record
        thumbnailImage: thumbnailImage?.url,
        galleryImages: galleryImages.map(img => img.url),
      });
      // Dismiss loading toast on success (success toast shown in parent)
      toast.dismiss(loadingToastId);
    } catch (error) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToastId);
      console.error('[ProductFormComplete] Submit error:', error);
    }
  };
  
  // Handle react-hook-form validation errors
  const handleFormError = (errors: Record<string, unknown>) => {
    console.error('[ProductFormComplete] Form validation errors:', errors);
    toast.error('Vui lòng kiểm tra lại thông tin form');
  };

  // Expose submit method via ref for parent to call
  React.useImperativeHandle(ref, () => ({
    submit: () => {
      formRef.current?.requestSubmit();
    }
  }), []);

  return (
    <FormProvider {...form}>
      <form 
        ref={formRef}
        id="product-form-complete"
        onSubmit={form.handleSubmit(handleFormSubmit, handleFormError)} 
        className="space-y-6"
      >
        <Tabs defaultValue="basic" className="w-full">
          <MobileTabsList>
            <MobileTabsTrigger value="basic">Cơ bản & Giá bán</MobileTabsTrigger>
            <MobileTabsTrigger value="images">Hình ảnh</MobileTabsTrigger>
            <MobileTabsTrigger value="inventory">Kho</MobileTabsTrigger>
            <MobileTabsTrigger value="logistics">Vận chuyển</MobileTabsTrigger>
            <MobileTabsTrigger value="label">Tem phụ</MobileTabsTrigger>
            <MobileTabsTrigger value="seo-default" className="gap-1">
              <Globe className="h-3 w-3" />
              SEO Chung
            </MobileTabsTrigger>
            <MobileTabsTrigger value="seo-pkgx" className="gap-1">
              <Globe className="h-3 w-3" style={{ color: '#ef4444' }} />
              SEO PKGX
            </MobileTabsTrigger>
            <MobileTabsTrigger value="seo-trendtech" className="gap-1">
              <Globe className="h-3 w-3" style={{ color: '#3b82f6' }} />
              SEO Trendtech
            </MobileTabsTrigger>
          </MobileTabsList>

          {/* Tab 1: Basic Info */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <BasicInfoTab
              unitOptions={unitOptions}
              brandOptions={brandOptions}
              productTypeOptions={productTypeOptions}
              categoryOptions={categoryOptions}
              supplierOptions={supplierOptions}
              salesPolicies={salesPolicies}
              taxes={taxes}
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
              productId={initialData?.systemId}
              thumbnailImage={thumbnailImage}
              onThumbnailChange={setThumbnailImage}
              galleryImages={galleryImages}
              onGalleryChange={setGalleryImages}
            />
          </TabsContent>

          {/* Tab 3: Inventory */}
          <TabsContent value="inventory" className="space-y-4 mt-4">
            <InventoryTab 
              storageLocationOptions={storageLocationOptions} 
              branches={branches}
              isEditMode={isEditMode}
            />
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
        
        {/* Debug: Hidden submit button for testing */}
        <button type="submit" className="hidden" id="debug-submit-btn">Submit</button>
      </form>
    </FormProvider>
  );
});

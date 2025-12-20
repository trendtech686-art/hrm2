import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '../../../components/ui/alert';
import { 
  Globe, 
  Link, 
  Unlink, 
  Upload, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  DollarSign,
  Package,
  FileText,
  Search,
  Star,
  Flame,
  Sparkles,
  Home
} from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '../types';
import { usePkgxSettingsStore } from '../../settings/pkgx/store';
import { usePricingPolicyStore } from '../../settings/pricing/store';
import { useProductStore } from '../store';
import * as pkgxApi from '../../../lib/pkgx/api-service';
import { 
  mapHrmToPkgxPayload, 
  createPriceUpdatePayload, 
  createSeoUpdatePayload,
  createDescriptionUpdatePayload,
  createFlagsUpdatePayload,
  getTotalInventory 
} from '../../../lib/pkgx/mapping-service';

interface EcommerceTabProps {
  product: Product;
}

export function EcommerceTab({ product }: EcommerceTabProps) {
  const [isPushingPkgx, setIsPushingPkgx] = React.useState(false);
  const [isSyncingPrice, setIsSyncingPrice] = React.useState(false);
  const [isSyncingStock, setIsSyncingStock] = React.useState(false);
  const [isSyncingSeo, setIsSyncingSeo] = React.useState(false);
  const [isSyncingDesc, setIsSyncingDesc] = React.useState(false);
  const [isSyncingFlags, setIsSyncingFlags] = React.useState(false);
  const [isUnlinking, setIsUnlinking] = React.useState(false);
  
  const queryClient = useQueryClient();
  const pkgxSettings = usePkgxSettingsStore();
  const pricingPolicies = usePricingPolicyStore();
  const { update: updateProduct } = useProductStore();
  
  const isPkgxLinked = !!product.pkgxId;
  const isTrendtechLinked = !!product.trendtechId;
  
  // Get category mapping for this product
  const pkgxCategoryMapping = React.useMemo(() => {
    if (!product.categorySystemId) return null;
    return pkgxSettings.getCategoryMappingByHrmId(product.categorySystemId);
  }, [product.categorySystemId, pkgxSettings]);
  
  // Get brand mapping for this product
  const pkgxBrandMapping = React.useMemo(() => {
    if (!product.brandSystemId) return null;
    return pkgxSettings.getBrandMappingByHrmId(product.brandSystemId);
  }, [product.brandSystemId, pkgxSettings]);
  
  // Check if product can be pushed to PKGX
  const canPushToPkgx = React.useMemo(() => {
    if (!pkgxSettings.settings.apiUrl || !pkgxSettings.settings.apiKey) return false;
    if (!pkgxSettings.settings.enabled) return false;
    // Must have category mapping
    if (!pkgxCategoryMapping) return false;
    return true;
  }, [pkgxSettings.settings, pkgxCategoryMapping]);
  
  // Push product to PKGX
  const handlePushToPkgx = async () => {
    if (!canPushToPkgx) {
      toast.error('Chưa cấu hình đủ thông tin để đẩy lên PKGX');
      return;
    }
    
    setIsPushingPkgx(true);
    try {
      const payload = mapHrmToPkgxPayload(product);
      
      let response;
      if (isPkgxLinked) {
        // Update existing
        response = await pkgxApi.updateProduct(product.pkgxId!, payload);
      } else {
        // Create new
        response = await pkgxApi.createProduct(payload);
      }
      
      if (response.success && response.data) {
        // Update product with PKGX ID if newly created
        if (!isPkgxLinked && response.data.goods_id) {
          updateProduct(product.systemId, { 
            pkgxId: response.data.goods_id,
            updatedAt: new Date().toISOString(),
          });
          
          // Invalidate React Query cache so list page refreshes immediately
          queryClient.invalidateQueries({ queryKey: ['products'] });
        }
        
        pkgxSettings.addLog({
          action: isPkgxLinked ? 'update_product' : 'create_product',
          status: 'success',
          message: `${isPkgxLinked ? 'Cập nhật' : 'Tạo mới'} sản phẩm trên PKGX: ${product.name}`,
          details: { productId: product.systemId, pkgxId: response.data.goods_id || product.pkgxId },
        });
        
        toast.success(isPkgxLinked ? 'Đã cập nhật sản phẩm trên PKGX' : 'Đã đẩy sản phẩm lên PKGX');
      } else {
        throw new Error(response.error || 'Lỗi không xác định');
      }
    } catch (error) {
      pkgxSettings.addLog({
        action: isPkgxLinked ? 'update_product' : 'create_product',
        status: 'error',
        message: `Lỗi ${isPkgxLinked ? 'cập nhật' : 'tạo'} sản phẩm: ${product.name}`,
        details: { error: error instanceof Error ? error.message : String(error) },
      });
      toast.error(error instanceof Error ? error.message : 'Lỗi khi đẩy sản phẩm lên PKGX');
    } finally {
      setIsPushingPkgx(false);
    }
  };
  
  // Sync price to PKGX
  const handleSyncPrice = async () => {
    if (!isPkgxLinked) {
      toast.error('Sản phẩm chưa liên kết với PKGX');
      return;
    }
    
    setIsSyncingPrice(true);
    try {
      const pricePayload = createPriceUpdatePayload(product);
      
      const response = await pkgxApi.updateProduct(product.pkgxId!, pricePayload);
      
      if (response.success) {
        pkgxSettings.addLog({
          action: 'sync_price',
          status: 'success',
          message: `Đồng bộ giá thành công: ${product.name}`,
          details: { productId: product.systemId, pkgxId: product.pkgxId },
        });
        toast.success('Đã đồng bộ giá lên PKGX');
      } else {
        throw new Error(response.error || 'Lỗi không xác định');
      }
    } catch (error) {
      pkgxSettings.addLog({
        action: 'sync_price',
        status: 'error',
        message: `Lỗi đồng bộ giá: ${product.name}`,
        details: { error: error instanceof Error ? error.message : String(error) },
      });
      toast.error(error instanceof Error ? error.message : 'Lỗi khi đồng bộ giá');
    } finally {
      setIsSyncingPrice(false);
    }
  };
  
  // Sync stock to PKGX
  const handleSyncStock = async () => {
    if (!isPkgxLinked) {
      toast.error('Sản phẩm chưa liên kết với PKGX');
      return;
    }
    
    setIsSyncingStock(true);
    try {
      const totalStock = getTotalInventory(product);
      
      const response = await pkgxApi.updateProductStock(product.pkgxId!, totalStock);
      
      if (response.success) {
        pkgxSettings.addLog({
          action: 'sync_inventory',
          status: 'success',
          message: `Đồng bộ tồn kho thành công: ${product.name} (${totalStock})`,
          details: { productId: product.systemId, pkgxId: product.pkgxId, inventory: totalStock },
        });
        toast.success(`Đã đồng bộ tồn kho: ${totalStock} ${product.unit}`);
      } else {
        throw new Error(response.error || 'Lỗi không xác định');
      }
    } catch (error) {
      pkgxSettings.addLog({
        action: 'sync_inventory',
        status: 'error',
        message: `Lỗi đồng bộ tồn kho: ${product.name}`,
        details: { error: error instanceof Error ? error.message : String(error) },
      });
      toast.error(error instanceof Error ? error.message : 'Lỗi khi đồng bộ tồn kho');
    } finally {
      setIsSyncingStock(false);
    }
  };
  
  // Sync SEO to PKGX
  const handleSyncSeo = async () => {
    if (!isPkgxLinked) {
      toast.error('Sản phẩm chưa liên kết với PKGX');
      return;
    }
    
    setIsSyncingSeo(true);
    try {
      const seoPayload = createSeoUpdatePayload(product);
      const response = await pkgxApi.updateProduct(product.pkgxId!, seoPayload);
      
      if (response.success) {
        pkgxSettings.addLog({
          action: 'sync_seo',
          status: 'success',
          message: `Đồng bộ SEO thành công: ${product.name}`,
          details: { productId: product.systemId, pkgxId: product.pkgxId },
        });
        toast.success('Đã đồng bộ SEO lên PKGX');
      } else {
        throw new Error(response.error || 'Lỗi không xác định');
      }
    } catch (error) {
      pkgxSettings.addLog({
        action: 'sync_seo',
        status: 'error',
        message: `Lỗi đồng bộ SEO: ${product.name}`,
        details: { error: error instanceof Error ? error.message : String(error) },
      });
      toast.error(error instanceof Error ? error.message : 'Lỗi khi đồng bộ SEO');
    } finally {
      setIsSyncingSeo(false);
    }
  };
  
  // Sync Description to PKGX
  const handleSyncDescription = async () => {
    if (!isPkgxLinked) {
      toast.error('Sản phẩm chưa liên kết với PKGX');
      return;
    }
    
    setIsSyncingDesc(true);
    try {
      const descPayload = createDescriptionUpdatePayload(product);
      const response = await pkgxApi.updateProduct(product.pkgxId!, descPayload);
      
      if (response.success) {
        pkgxSettings.addLog({
          action: 'update_product',
          status: 'success',
          message: `Đồng bộ mô tả thành công: ${product.name}`,
          details: { productId: product.systemId, pkgxId: product.pkgxId },
        });
        toast.success('Đã đồng bộ mô tả lên PKGX');
      } else {
        throw new Error(response.error || 'Lỗi không xác định');
      }
    } catch (error) {
      pkgxSettings.addLog({
        action: 'update_product',
        status: 'error',
        message: `Lỗi đồng bộ mô tả: ${product.name}`,
        details: { error: error instanceof Error ? error.message : String(error) },
      });
      toast.error(error instanceof Error ? error.message : 'Lỗi khi đồng bộ mô tả');
    } finally {
      setIsSyncingDesc(false);
    }
  };
  
  // Sync Flags to PKGX
  const handleSyncFlags = async () => {
    if (!isPkgxLinked) {
      toast.error('Sản phẩm chưa liên kết với PKGX');
      return;
    }
    
    setIsSyncingFlags(true);
    try {
      const flagsPayload = createFlagsUpdatePayload(product);
      const response = await pkgxApi.updateProduct(product.pkgxId!, flagsPayload);
      
      if (response.success) {
        pkgxSettings.addLog({
          action: 'update_product',
          status: 'success',
          message: `Đồng bộ flags thành công: ${product.name}`,
          details: { productId: product.systemId, pkgxId: product.pkgxId },
        });
        toast.success('Đã đồng bộ flags lên PKGX');
      } else {
        throw new Error(response.error || 'Lỗi không xác định');
      }
    } catch (error) {
      pkgxSettings.addLog({
        action: 'update_product',
        status: 'error',
        message: `Lỗi đồng bộ flags: ${product.name}`,
        details: { error: error instanceof Error ? error.message : String(error) },
      });
      toast.error(error instanceof Error ? error.message : 'Lỗi khi đồng bộ flags');
    } finally {
      setIsSyncingFlags(false);
    }
  };
  
  // View on PKGX website
  const handleViewOnPkgx = () => {
    if (!isPkgxLinked) {
      toast.error('Sản phẩm chưa liên kết với PKGX');
      return;
    }
    
    const slug = product.pkgxSlug || `product-${product.pkgxId}`;
    const url = `https://phukiengiaxuong.com.vn/${slug}.html`;
    window.open(url, '_blank');
  };
  
  // Unlink from PKGX
  const handleUnlinkPkgx = async () => {
    if (!isPkgxLinked) return;
    
    setIsUnlinking(true);
    try {
      updateProduct(product.systemId, { 
        pkgxId: undefined,
        updatedAt: new Date().toISOString(),
      });
      
      pkgxSettings.addLog({
        action: 'unlink_product',
        status: 'success',
        message: `Hủy liên kết sản phẩm: ${product.name}`,
        details: { productId: product.systemId, pkgxId: product.pkgxId },
      });
      
      toast.success('Đã hủy liên kết với PKGX');
    } catch (error) {
      toast.error('Lỗi khi hủy liên kết');
    } finally {
      setIsUnlinking(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* PKGX Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg">PKGX (phukiengiaxuong.com.vn)</CardTitle>
            </div>
            {isPkgxLinked ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Đã liên kết
              </Badge>
            ) : (
              <Badge variant="secondary">Chưa liên kết</Badge>
            )}
          </div>
          <CardDescription>
            Quản lý sản phẩm trên website PKGX
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Info */}
          {isPkgxLinked && (
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">ID PKGX:</span>
                  <span className="ml-2 font-mono font-medium">{product.pkgxId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Slug:</span>
                  <span className="ml-2 font-mono text-xs">{product.pkgxSlug || '-'}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://phukiengiaxuong.com.vn/goods-${product.pkgxId}.html`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Xem
              </Button>
            </div>
          )}
          
          {/* Mapping Status */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Trạng thái mapping:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant={pkgxCategoryMapping ? 'default' : 'destructive'} className="text-xs">
                {pkgxCategoryMapping ? (
                  <>✓ Danh mục: {pkgxCategoryMapping.pkgxCatName}</>
                ) : (
                  <>✗ Chưa mapping danh mục</>
                )}
              </Badge>
              <Badge variant={pkgxBrandMapping ? 'default' : 'secondary'} className="text-xs">
                {pkgxBrandMapping ? (
                  <>✓ Thương hiệu: {pkgxBrandMapping.pkgxBrandName}</>
                ) : (
                  <>- Không có thương hiệu</>
                )}
              </Badge>
            </div>
          </div>
          
          {/* Warnings */}
          {!canPushToPkgx && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Không thể đẩy lên PKGX</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-sm mt-1">
                  {!pkgxSettings.settings.enabled && <li>PKGX chưa được bật</li>}
                  {!pkgxSettings.settings.apiUrl && <li>Chưa cấu hình API URL</li>}
                  {!pkgxSettings.settings.apiKey && <li>Chưa cấu hình API Key</li>}
                  {!pkgxCategoryMapping && <li>Danh mục sản phẩm chưa được mapping với PKGX</li>}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          <Separator />
          
          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handlePushToPkgx}
              disabled={!canPushToPkgx || isPushingPkgx}
            >
              {isPushingPkgx ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {isPkgxLinked ? 'Cập nhật PKGX' : 'Đẩy lên PKGX'}
            </Button>
            
            {isPkgxLinked && (
              <>
                <Button
                  variant="outline"
                  onClick={handleSyncPrice}
                  disabled={isSyncingPrice}
                >
                  {isSyncingPrice ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <DollarSign className="h-4 w-4 mr-2" />
                  )}
                  Sync giá
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleSyncStock}
                  disabled={isSyncingStock}
                >
                  {isSyncingStock ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Package className="h-4 w-4 mr-2" />
                  )}
                  Sync tồn kho
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleSyncSeo}
                  disabled={isSyncingSeo}
                >
                  {isSyncingSeo ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Sync SEO
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleSyncDescription}
                  disabled={isSyncingDesc}
                >
                  {isSyncingDesc ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Sync mô tả
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleSyncFlags}
                  disabled={isSyncingFlags}
                >
                  {isSyncingFlags ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Star className="h-4 w-4 mr-2" />
                  )}
                  Sync flags
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleViewOnPkgx}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Xem trên web
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={handleUnlinkPkgx}
                  disabled={isUnlinking}
                  className="text-destructive hover:text-destructive"
                >
                  {isUnlinking ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Unlink className="h-4 w-4 mr-2" />
                  )}
                  Hủy liên kết
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Trendtech Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Trendtech</CardTitle>
            </div>
            {isTrendtechLinked ? (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Đã liên kết
              </Badge>
            ) : (
              <Badge variant="secondary">Chưa liên kết</Badge>
            )}
          </div>
          <CardDescription>
            Quản lý sản phẩm trên website Trendtech
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isTrendtechLinked ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <span className="text-muted-foreground text-sm">ID Trendtech:</span>
                  <span className="ml-2 font-mono font-medium">{product.trendtechId}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Chức năng sync Trendtech sẽ sớm được triển khai.
              </p>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Trendtech API chưa sẵn sàng</p>
              <p className="text-sm mt-1">Chức năng sẽ được kích hoạt khi API hoàn thiện</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Search, Unlink, RefreshCw, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useMeiliProductSearch } from '@/hooks/use-meilisearch';
import { useTrendtechSettings, useTrendtechLogMutations } from '../hooks/use-trendtech-settings';

export function ProductMappingTab() {
  // ✅ Use Meilisearch for product search with infinite scroll support
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  
  const { data: productsData, isLoading: isLoadingProducts } = useMeiliProductSearch(searchTerm, {
    debounceMs: 300,
    enabled: true,
  });
  
  const { data: settings } = useTrendtechSettings();
  const { addLog } = useTrendtechLogMutations();
  
  // Flatten Meilisearch results
  const allProducts = React.useMemo(() => (productsData?.data ?? []) as Array<(typeof productsData.data)[number] & { isDeleted?: boolean; trendtechId?: number | null; seoTrendtech?: { slug?: string } | null }>, [productsData]);

  // Get HRM products with/without Trendtech link
  const hrmProducts = React.useMemo(() => {
    const products = allProducts.filter(p => !p.isDeleted);
    return products;
  }, [allProducts]);

  const linkedProducts = React.useMemo(
    () => hrmProducts.filter(p => p.trendtechId),
    [hrmProducts]
  );

  const unlinkedProducts = React.useMemo(
    () => hrmProducts.filter(p => !p.trendtechId),
    [hrmProducts]
  );

  const handleRefresh = async () => {
    if (!settings?.enabled) {
      toast.error('Vui lòng bật tích hợp Trendtech trước');
      return;
    }

    setIsLoading(true);

    try {
      // Fetch products from Trendtech API
      const response = await fetch(`${settings?.apiUrl}/products?limit=100`, {
        headers: {
          'Authorization': `Bearer ${settings?.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      const trendtechProducts = json.products || json.data || [];

      // Transform to TrendtechProduct format and cache locally
      // Note: Actual product linking happens via product creation/sync on Trendtech side
      addLog.mutate({
        action: 'get_products',
        status: 'success',
        message: `Đã lấy ${trendtechProducts.length} sản phẩm từ Trendtech`,
        details: { total: trendtechProducts.length },
      });

      toast.success(`Đã cập nhật (${trendtechProducts.length} sản phẩm từ Trendtech)`);
    } catch (error) {
      addLog.mutate({
        action: 'get_products',
        status: 'error',
        message: 'Lỗi lấy sản phẩm từ Trendtech',
        details: { error: error instanceof Error ? error.message : 'Unknown' },
      });
      toast.error('Lỗi: ' + (error instanceof Error ? error.message : 'Unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle size="lg">Thống kê liên kết</CardTitle>
          <CardDescription>Tổng quan sản phẩm HRM đã liên kết với Trendtech</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xl font-bold text-green-600">{isLoadingProducts ? '-' : linkedProducts.length}</p>
              <p className="text-sm text-muted-foreground">Đã liên kết</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-muted-foreground">{isLoadingProducts ? '-' : unlinkedProducts.length}</p>
              <p className="text-sm text-muted-foreground">Chưa liên kết</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{isLoadingProducts ? '-' : hrmProducts.length}</p>
              <p className="text-sm text-muted-foreground">Tổng SP HRM</p>
            </div>
            
            <div className="ml-auto">
              <Button onClick={handleRefresh} disabled={isLoading || !settings?.enabled}>
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Đang tải...</>
                ) : (
                  <><RefreshCw className="h-4 w-4 mr-2" />Làm mới</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle size="lg">Danh sách sản phẩm đã liên kết</CardTitle>
          <CardDescription>Sản phẩm HRM đã có trendtechId</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoadingProducts ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
              <span className="text-muted-foreground">Đang tải sản phẩm...</span>
            </div>
          ) : linkedProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Không tìm thấy sản phẩm nào' : 'Chưa có sản phẩm nào được liên kết với Trendtech'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Tên sản phẩm HRM</TableHead>
                  <TableHead>Trendtech ID</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="w-25">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {linkedProducts.map((product) => (
                  <TableRow key={product.systemId}>
                    <TableCell className="font-mono">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.trendtechId}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.seoTrendtech?.slug || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (!product.trendtechId) return;
                            // Unlink product - calls API to clear trendtechId
                            fetch(`/api/products/${product.systemId}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ trendtechId: null, seoTrendtech: null }),
                            })
                              .then(res => {
                                if (!res.ok) throw new Error('Failed to unlink');
                                toast.success('Đã hủy liên kết sản phẩm');
                                addLog.mutate({
                                  action: 'unlink_product',
                                  status: 'success',
                                  message: `Đã hủy liên kết: ${product.name}`,
                                  details: { productId: product.systemId, trendtechId: product.trendtechId },
                                });
                              })
                              .catch(err => {
                                toast.error('Lỗi hủy liên kết: ' + err.message);
                                addLog.mutate({
                                  action: 'unlink_product',
                                  status: 'error',
                                  message: `Lỗi hủy liên kết: ${product.name}`,
                                  details: { productId: product.systemId, error: err.message },
                                });
                              });
                          }}
                          title="Hủy liên kết"
                        >
                          <Unlink className="h-4 w-4 text-red-500" />
                        </Button>
                        {product.seoTrendtech?.slug && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (!settings?.apiUrl || !product.seoTrendtech?.slug) return;
                              // Open product on Trendtech website
                              const baseUrl = settings.apiUrl.replace('/api/hrm', '');
                              const productUrl = `${baseUrl}/products/${product.seoTrendtech.slug}`;
                              window.open(productUrl, '_blank');
                              addLog.mutate({
                                action: 'link_product',
                                status: 'info',
                                message: `Mở sản phẩm trên Trendtech: ${product.name}`,
                                details: { productId: product.systemId, trendtechId: product.trendtechId, url: productUrl },
                              });
                            }}
                            title="Xem trên Trendtech"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {linkedProducts.length > 50 && (
            <p className="text-center text-sm text-muted-foreground">
              Hiển thị 50/{linkedProducts.length} sản phẩm
            </p>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle size="lg">Hướng dẫn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Liên kết sản phẩm:</strong> Khi đăng sản phẩm lên Trendtech, hệ thống sẽ tự động lưu 
            <code className="mx-1 px-1 bg-muted rounded">trendtechId</code> vào sản phẩm HRM.
          </p>
          <p>
            <strong>Đồng bộ:</strong> Sử dụng tab <em>Auto Sync</em> để cấu hình đồng bộ tự động giá, tồn kho, SEO.
          </p>
          <p>
            <strong>Lưu ý:</strong> Tính năng liên kết/đăng sản phẩm sẽ hoạt động khi API Trendtech sẵn sàng.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

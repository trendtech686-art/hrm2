import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.tsx';
import { Button } from '../../../../components/ui/button.tsx';
import { Input } from '../../../../components/ui/input.tsx';
import { Badge } from '../../../../components/ui/badge.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table.tsx';
import { Search, Link, Unlink, RefreshCw, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useProductStore } from '../../../products/store';
import { useTrendtechSettingsStore } from '../store';

export function ProductMappingTab() {
  const productStore = useProductStore();
  const { settings, addLog } = useTrendtechSettingsStore();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Get HRM products with/without Trendtech link
  const hrmProducts = React.useMemo(() => {
    const products = productStore.getActive();
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return products.filter(
        p => p.name.toLowerCase().includes(term) ||
             p.id.toLowerCase().includes(term)
      );
    }
    
    return products;
  }, [productStore, searchTerm]);

  const linkedProducts = React.useMemo(
    () => hrmProducts.filter(p => p.trendtechId),
    [hrmProducts]
  );

  const unlinkedProducts = React.useMemo(
    () => hrmProducts.filter(p => !p.trendtechId),
    [hrmProducts]
  );

  const handleRefresh = async () => {
    if (!settings.enabled) {
      toast.error('Vui lòng bật tích hợp Trendtech trước');
      return;
    }
    
    setIsLoading(true);
    toast.info('Đang cập nhật danh sách... (API chưa sẵn sàng)');
    
    // TODO: Fetch products from Trendtech when API is ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog({
      action: 'get_products',
      status: 'info',
      message: 'Lấy danh sách sản phẩm (API chưa sẵn sàng)',
      details: {},
    });
    
    setIsLoading(false);
    toast.success('Đã cập nhật (đang chờ API Trendtech)');
  };

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thống kê liên kết</CardTitle>
          <CardDescription>Tổng quan sản phẩm HRM đã liên kết với Trendtech</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-2xl font-bold text-green-600">{linkedProducts.length}</p>
              <p className="text-sm text-muted-foreground">Đã liên kết</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-400">{unlinkedProducts.length}</p>
              <p className="text-sm text-muted-foreground">Chưa liên kết</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{hrmProducts.length}</p>
              <p className="text-sm text-muted-foreground">Tổng SP HRM</p>
            </div>
            
            <div className="ml-auto">
              <Button onClick={handleRefresh} disabled={isLoading || !settings.enabled}>
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
          <CardTitle className="text-lg">Danh sách sản phẩm đã liên kết</CardTitle>
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

          {linkedProducts.length === 0 ? (
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
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {linkedProducts.slice(0, 50).map((product) => (
                  <TableRow key={product.systemId}>
                    <TableCell className="font-mono">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.trendtechId}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.trendtechSlug || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            // TODO: Unlink product
                            toast.info('Tính năng hủy liên kết sẽ có khi API sẵn sàng');
                          }}
                          title="Hủy liên kết"
                        >
                          <Unlink className="h-4 w-4 text-red-500" />
                        </Button>
                        {product.trendtechSlug && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              // TODO: Open product on Trendtech
                              toast.info('Mở sản phẩm trên Trendtech');
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
          <CardTitle className="text-lg">Hướng dẫn</CardTitle>
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

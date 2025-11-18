
import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
// FIX: Import the renamed store.
import { useProvinceStore } from './store.ts';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { ArrowLeft, Edit } from 'lucide-react';
import { DetailField } from '../../../components/ui/detail-field.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table.tsx';

export function ProvinceDetailPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  // FIX: Use the renamed store and its methods.
  const { findById, getWardsByProvinceId } = useProvinceStore();
  
  const province = React.useMemo(() => (systemId ? findById(systemId) : null), [systemId, findById]);
  const wards = React.useMemo(() => (province ? getWardsByProvinceId(province.id) : []), [province, getWardsByProvinceId]);

  usePageHeader();

  if (!province) {
    return (
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold">Không tìm thấy tỉnh thành</h2>
            <Button onClick={() => navigate('/settings/provinces')} className="mt-4"><ArrowLeft className="mr-2 h-4 w-4" />Quay về danh sách</Button>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{province.name}</CardTitle>
              <CardDescription className="mt-1">
                Mã: {province.id}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate('/settings/provinces')}><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại</Button>
              <Button onClick={() => navigate('/settings/provinces')}><Edit className="mr-2 h-4 w-4" /> Sửa</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <dl>
              <DetailField label="Mã Tỉnh thành" value={province.id} />
              <DetailField label="Tên Tỉnh thành" value={province.name} />
            </dl>
        </CardContent>
      </Card>
      <Card>
          <CardHeader>
              <CardTitle>Danh sách Phường/Xã</CardTitle>
          </CardHeader>
          <CardContent>
              <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã Phường/Xã</TableHead>
                            <TableHead>Tên Phường/Xã</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {wards.map(ward => (
                            <TableRow key={ward.systemId}>
                                <TableCell className="font-medium">{ward.id}</TableCell>
                                <TableCell>{ward.name}</TableCell>
                            </TableRow>
                        ))}
                         {wards.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center text-muted-foreground">
                                    Chưa có dữ liệu Phường/Xã cho tỉnh thành này.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
              </div>
          </CardContent>
      </Card>
    </div>
  );
}

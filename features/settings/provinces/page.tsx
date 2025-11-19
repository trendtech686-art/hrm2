import * as React from "react"
import * as XLSX from 'xlsx';
import Fuse from "fuse.js"
import { useProvinceStore } from "./store.ts"
import { asSystemId, asBusinessId } from '@/lib/id-types';
import { ProvinceForm, type ProvinceFormValues } from "./form.tsx"
import { WardForm, type WardFormValues } from "./ward-form.tsx"
import { DistrictForm, type DistrictFormValues } from "./district-form.tsx"
import type { Province, Ward, District } from "./types.ts"
import { usePageHeader } from "../../../contexts/page-header-context.tsx";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card.tsx"
import { Button } from "../../../components/ui/button.tsx"
import { Input } from "../../../components/ui/input.tsx"
import { ScrollArea } from "../../../components/ui/scroll-area.tsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog.tsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table.tsx";
import { PlusCircle, Search, Upload, Download, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../../lib/utils.ts";
import { useToast } from "../../../hooks/use-toast.ts";

type ImportPreviewState = {
  provinces: Array<Omit<Province, 'systemId'>>;
  wards: Array<Omit<Ward, 'systemId'>>;
  summary: {
    provinceCount: number;
    wardCount: number;
  };
};

export function ProvincesPage() {
  const { 
    data: provinces, 
    districts,
    getWards2Level,
    getWards2LevelByProvinceId,
    getWards3LevelByProvinceId,
    getWards3LevelByDistrictId,
    getDistricts3LevelByProvinceId,
    remove, 
    add, 
    update, 
    addWard, 
    updateWard, 
    removeWard,
    addDistrict,
    updateDistrict,
    removeDistrict,
    importAdministrativeUnits
  } = useProvinceStore();
  const { toast } = useToast();
  const [importPreview, setImportPreview] = React.useState<ImportPreviewState | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  
  const [mode, setMode] = React.useState<'2-level' | '3-level'>('3-level');
  
  usePageHeader({
    title: 'Tỉnh thành - Quận huyện',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Cài đặt', href: '/settings' },
      { label: 'Tỉnh thành', href: '/settings/provinces', isCurrent: true }
    ],
    actions: [
      <Button key="add" onClick={() => setIsProvinceFormOpen(true)} className="h-9">
        <PlusCircle className="mr-2 h-4 w-4" />
        Thêm tỉnh thành
      </Button>
    ]
  });
  
  // State for selections and modals
  const [selectedProvinceId, setSelectedProvinceId] = React.useState<string | null>(provinces[0]?.systemId || null);
  const [selectedDistrictId, setSelectedDistrictId] = React.useState<number | null>(null);
  const [provinceSearch, setProvinceSearch] = React.useState('');
  const [districtSearch, setDistrictSearch] = React.useState('');
  const [wardSearch, setWardSearch] = React.useState('');

  const [isProvinceFormOpen, setIsProvinceFormOpen] = React.useState(false);
  const [editingProvince, setEditingProvince] = React.useState<Province | null>(null);
  const [isWardFormOpen, setIsWardFormOpen] = React.useState(false);
  const [editingWard, setEditingWard] = React.useState<Ward | null>(null);
  const [isDistrictFormOpen, setIsDistrictFormOpen] = React.useState(false);
  const [editingDistrict, setEditingDistrict] = React.useState<District | null>(null);

  const [dialogState, setDialogState] = React.useState<{ type: 'province' | 'ward' | 'district'; systemId: string } | null>(null);
  
  // Pagination states
  const [wardPage, setWardPage] = React.useState(0);
  const [districtPage, setDistrictPage] = React.useState(0);
  const pageSize = 15;

  const selectedProvince = React.useMemo(() => provinces.find(p => p.systemId === selectedProvinceId), [provinces, selectedProvinceId]);

  React.useEffect(() => {
    if (!provinces.length) {
      if (selectedProvinceId !== null) {
        setSelectedProvinceId(null);
      }
      return;
    }

    const exists = provinces.some((province) => province.systemId === selectedProvinceId);
    if (!exists) {
      setSelectedProvinceId(provinces[0]?.systemId ?? null);
    }
  }, [provinces, selectedProvinceId]);
  
  // Get wards based on mode
  const wardsForSelectedProvince = React.useMemo(() => {
    if (!selectedProvince) return [];
    
    if (mode === '2-level') {
      return getWards2LevelByProvinceId(selectedProvince.id);
    } else {
      // For 3-level, get wards by selected district
      if (selectedDistrictId) {
        return getWards3LevelByDistrictId(selectedDistrictId);
      }
      return [];
    }
  }, [mode, selectedProvince, selectedDistrictId, getWards2LevelByProvinceId, getWards3LevelByDistrictId]);

  // Get districts for 3-level mode
  const districtsForProvince = React.useMemo(() => {
    if (mode !== '3-level' || !selectedProvince) return [];
    return getDistricts3LevelByProvinceId(selectedProvince.id);
  }, [mode, selectedProvince, getDistricts3LevelByProvinceId]);
  
  const provinceFuse = React.useMemo(() => new Fuse(provinces, { keys: ["name", "id"], threshold: 0.3 }), [provinces]);
  const filteredProvinces = React.useMemo(() => provinceSearch ? provinceFuse.search(provinceSearch).map(r => r.item) : provinces, [provinces, provinceSearch, provinceFuse]);

  const districtFuse = React.useMemo(() => new Fuse(districtsForProvince, { keys: ["name"], threshold: 0.3 }), [districtsForProvince]);
  const filteredDistricts = React.useMemo(() => districtSearch ? districtFuse.search(districtSearch).map(r => r.item) : districtsForProvince, [districtsForProvince, districtSearch, districtFuse]);

  const wardFuse = React.useMemo(() => new Fuse(wardsForSelectedProvince, { keys: ["name", "id"], threshold: 0.3 }), [wardsForSelectedProvince]);
  const filteredWards = React.useMemo(() => wardSearch ? wardFuse.search(wardSearch).map(r => r.item) : wardsForSelectedProvince, [wardsForSelectedProvince, wardSearch, wardFuse]);

  // Paginated data
  const paginatedWards = React.useMemo(() => {
    const start = wardPage * pageSize;
    return filteredWards.slice(start, start + pageSize);
  }, [filteredWards, wardPage]);

  const paginatedDistricts = React.useMemo(() => {
    const start = districtPage * pageSize;
    return filteredDistricts.slice(start, start + pageSize);
  }, [filteredDistricts, districtPage]);

  const wardTotalPages = Math.ceil(filteredWards.length / pageSize);
  const districtTotalPages = Math.ceil(filteredDistricts.length / pageSize);

  // Handlers for Provinces
  const handleAddProvince = () => { setEditingProvince(null); setIsProvinceFormOpen(true); };
  const handleEditProvince = (province: Province) => { setEditingProvince(province); setIsProvinceFormOpen(true); };
  const handleDeleteProvince = (systemId: string) => setDialogState({ type: 'province', systemId });
  const handleProvinceFormSubmit = (values: ProvinceFormValues) => {
    if (editingProvince) {
      update(editingProvince.systemId, { ...editingProvince, ...values });
    } else {
      add(values);
    }
    setIsProvinceFormOpen(false);
  };

  // Handlers for Wards
  const handleAddWard = () => { setEditingWard(null); setIsWardFormOpen(true); };
  const handleEditWard = (ward: Ward) => { setEditingWard(ward); setIsWardFormOpen(true); };
  const handleDeleteWard = (systemId: string) => setDialogState({ type: 'ward', systemId });
  const handleWardFormSubmit = (values: WardFormValues) => {
    if (!selectedProvince) return;
    const finalValues = { ...values, provinceId: selectedProvince.id };
    if (editingWard) {
      updateWard(editingWard.systemId, { ...editingWard, ...finalValues });
    } else {
      addWard(finalValues);
    }
    setIsWardFormOpen(false);
  };

  // Handlers for Districts
  const handleAddDistrict = () => { setEditingDistrict(null); setIsDistrictFormOpen(true); };
  const handleEditDistrict = (district: District) => { setEditingDistrict(district); setIsDistrictFormOpen(true); };
  const handleDeleteDistrict = (systemId: string) => setDialogState({ type: 'district', systemId });
  const handleDistrictFormSubmit = (values: DistrictFormValues) => {
    if (!selectedProvince) return;
    const finalValues = { ...values, provinceId: selectedProvince.id };
    if (editingDistrict) {
      updateDistrict(editingDistrict.systemId, { ...editingDistrict, ...finalValues });
    } else {
      addDistrict(finalValues);
    }
    setIsDistrictFormOpen(false);
  };
  
  const confirmDelete = () => {
    if (!dialogState) return;
    if (dialogState.type === 'province') {
        if (dialogState.systemId === selectedProvinceId) {
            setSelectedProvinceId(provinces.length > 1 ? provinces.find(p => p.systemId !== dialogState.systemId)?.systemId || null : null);
        }
        remove(asSystemId(dialogState.systemId));
    } else if (dialogState.type === 'ward') {
        removeWard(asSystemId(dialogState.systemId));
    } else if (dialogState.type === 'district') {
        if (dialogState.systemId === districtsForProvince.find(d => d.id === selectedDistrictId)?.systemId) {
            setSelectedDistrictId(null);
        }
        removeDistrict(asSystemId(dialogState.systemId));
    }
    setDialogState(null);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<any>(worksheet);

        const provincesMap = new Map<string, Omit<Province, 'systemId'>>();
        const wards: Array<Omit<Ward, 'systemId'>> = [];

        json.forEach((row) => {
          const rawProvinceId = row['Mã tỉnh (BNV)'] ?? row['Ma Tinh'];
          const provinceName = row['Tên tỉnh/TP mới'] ?? row['Ten tinh'];
          const wardCode = row['Mã phường/xã mới'] ?? row['Ma phuong/xa'];
          const wardName = row['Tên Phường/Xã mới'] ?? row['Ten Phuong/Xa'];

          if (!rawProvinceId || !provinceName || !wardCode || !wardName) {
            return;
          }

          const provinceId = String(rawProvinceId).padStart(2, '0');

          if (!provincesMap.has(provinceId)) {
            provincesMap.set(provinceId, {
              id: asBusinessId(provinceId),
              name: String(provinceName).trim(),
            });
          }

          wards.push({
            id: String(wardCode).trim(),
            name: String(wardName).trim(),
            provinceId: asBusinessId(provinceId),
            provinceName: String(provinceName).trim(),
          });
        });

        if (provincesMap.size === 0 || wards.length === 0) {
          toast({
            title: 'Không tìm thấy dữ liệu hợp lệ',
            description: 'Vui lòng kiểm tra lại định dạng file Excel.',
            variant: 'destructive',
          });
          return;
        }

        setImportPreview({
          provinces: Array.from(provincesMap.values()),
          wards,
          summary: {
            provinceCount: provincesMap.size,
            wardCount: wards.length,
          },
        });
        setIsImportDialogOpen(true);
      } catch (error) {
        toast({
          title: 'Lỗi khi đọc file',
          description: error instanceof Error ? error.message : 'File không hợp lệ',
          variant: 'destructive',
        });
      }
    };
    reader.readAsBinaryString(file);
    event.target.value = '';
  };

  const handleImportDialogChange = (open: boolean) => {
    if (!open) {
      if (isImporting) return;
      setIsImportDialogOpen(false);
      setImportPreview(null);
      return;
    }
    setIsImportDialogOpen(true);
  };

  const handleConfirmImport = () => {
    if (!importPreview) return;
    setIsImporting(true);
    try {
      importAdministrativeUnits({
        provinces: importPreview.provinces,
        wards: importPreview.wards,
      });

      toast({
        title: 'Đã nhập dữ liệu hành chính',
        description: `Ghi đè ${importPreview.summary.provinceCount.toLocaleString('vi-VN')} tỉnh/thành và ${importPreview.summary.wardCount.toLocaleString('vi-VN')} phường/xã (2 cấp).`,
      });
      setIsImportDialogOpen(false);
      setImportPreview(null);
    } catch (error) {
      toast({
        title: 'Không thể ghi dữ liệu',
        description: error instanceof Error ? error.message : 'Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };
  
  const handleExport = () => {
    const provincesToExport = provinces.map(({ systemId, ...rest }) => ({'Mã tỉnh': rest.id, 'Tên Tỉnh/Thành phố': rest.name}));
    
    const wards2Level = getWards2LevelByProvinceId(asBusinessId('08')); // Example
    const wardsToExport = wards2Level.map(({ systemId, ...rest }) => ({'Mã tỉnh': rest.provinceId, 'Mã Phường/Xã': rest.id, 'Tên Phường/Xã': rest.name}));

    const provincesWs = XLSX.utils.json_to_sheet(provincesToExport);
    const wardsWs = XLSX.utils.json_to_sheet(wardsToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, provincesWs, "TinhThanh");
    XLSX.utils.book_append_sheet(wb, wardsWs, "PhuongXa");
    XLSX.writeFile(wb, "Danh_sach_Don_vi_hanh_chinh.xlsx");
  }

  return (
    <div className="h-full flex flex-col">
       <div className="flex-shrink-0 flex items-center justify-between mb-4">
        <Tabs value={mode} onValueChange={(v) => {
          setMode(v as '2-level' | '3-level');
          setSelectedDistrictId(null);
          setWardPage(0);
          setDistrictPage(0);
        }}>
          <TabsList>
            <TabsTrigger value="2-level">
              2 cấp (Tỉnh → Phường) - 3,321 wards
            </TabsTrigger>
            <TabsTrigger value="3-level">
              3 cấp (Tỉnh → Quận → Phường) - 10,035 wards
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
            <input
                type="file"
                id="import-file-input"
                className="hidden"
                accept=".xlsx, .xls"
                onChange={handleImport}
            />
            <Button asChild variant="outline" size="sm" className="h-9">
                <label htmlFor="import-file-input" className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" /> Nhập file
                </label>
            </Button>
            <Button variant="outline" size="sm" className="h-9" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Xuất file
            </Button>
        </div>
      </div>
      
      {/* Content based on mode */}
      {mode === '2-level' ? (
        // 2-LEVEL: Province → Ward (2 panels)
        <div className="flex-grow flex gap-4 min-h-0">
          {/* LEFT: Provinces */}
          <Card className="w-1/3 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                  <CardTitle>Tỉnh/Thành phố</CardTitle>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddProvince}><PlusCircle className="h-4 w-4" /></Button>
              </div>
              <div className="relative pt-2">
                  <Search className="absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input placeholder="Tìm kiếm..." className="pl-8 h-9" value={provinceSearch} onChange={e => setProvinceSearch(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="p-2 flex-grow overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-1">
                  {filteredProvinces.map(p => (
                    <div key={p.systemId} className="group relative">
                      <Button
                        variant="ghost"
                        className={cn("w-full justify-start h-auto py-2 pr-16 flex-col items-start", selectedProvinceId === p.systemId && "bg-accent text-accent-foreground")}
                        onClick={() => {
                          setSelectedProvinceId(p.systemId);
                          setWardPage(0);
                        }}
                      >
                        <span className="font-medium">{p.name}</span>
                        <span className="text-xs text-muted-foreground">Mã: {p.id}</span>
                      </Button>
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProvince(p);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive hover:text-destructive" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProvince(p.systemId);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* RIGHT: Wards */}
          <div className="w-2/3 flex flex-col">
            {selectedProvince ? (
              <Card className="flex-grow flex flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{selectedProvince.name}</CardTitle>
                          <CardDescription>Mã: {selectedProvince.id} • {filteredWards.length} phường/xã (2 cấp)</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={handleAddWard}><PlusCircle className="mr-2 h-4 w-4" />Thêm phường/xã</Button>
                        </div>
                    </div>
                    <div className="relative pt-2">
                        <Search className="absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input placeholder="Tìm phường/xã..." className="pl-8 h-9" value={wardSearch} onChange={e => {setWardSearch(e.target.value); setWardPage(0);}} />
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col p-4 pt-0">
                    <div className="flex-1 overflow-auto rounded-md border">
                      <Table>
                        <TableHeader className="sticky top-0 bg-muted/50">
                          <TableRow>
                            <TableHead className="w-[100px]">Mã</TableHead>
                            <TableHead>Tên phường/xã</TableHead>
                            <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedWards.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                Không tìm thấy phường/xã nào
                              </TableCell>
                            </TableRow>
                          ) : (
                            paginatedWards.map(ward => (
                              <TableRow key={ward.systemId}>
                                <TableCell className="font-mono text-xs">{ward.id}</TableCell>
                                <TableCell>{ward.name}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditWard(ward)}><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteWard(ward.systemId)}><Trash2 className="h-4 w-4" /></Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {/* Pagination */}
                    {wardTotalPages > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                          Trang {wardPage + 1} / {wardTotalPages} • {filteredWards.length} kết quả
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setWardPage(p => Math.max(0, p - 1))}
                            disabled={wardPage === 0}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setWardPage(p => Math.min(wardTotalPages - 1, p + 1))}
                            disabled={wardPage >= wardTotalPages - 1}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                      <p>Chọn một Tỉnh/Thành phố để xem chi tiết.</p>
                  </div>
              </Card>
            )}
          </div>
        </div>
      ) : (
        // 3-LEVEL: Province → District → Ward (3 panels)
        <div className="flex-grow flex gap-4 min-h-0">
          {/* LEFT: Provinces */}
          <Card className="w-1/4 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                  <CardTitle>Tỉnh/TP</CardTitle>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddProvince}><PlusCircle className="h-4 w-4" /></Button>
              </div>
              <div className="relative pt-2">
                  <Search className="absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input placeholder="Tìm..." className="pl-8 h-9" value={provinceSearch} onChange={e => setProvinceSearch(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="p-2 flex-grow overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-1">
                  {filteredProvinces.map(p => (
                    <div key={p.systemId} className="group relative">
                      <Button
                        variant="ghost"
                        className={cn("w-full justify-start h-auto py-2 pr-16 flex-col items-start", selectedProvinceId === p.systemId && "bg-accent text-accent-foreground")}
                        onClick={() => {
                          setSelectedProvinceId(p.systemId);
                          setSelectedDistrictId(null);
                          setDistrictPage(0);
                          setWardPage(0);
                        }}
                      >
                        <span className="font-medium text-sm">{p.name}</span>
                        <span className="text-xs text-muted-foreground">Mã: {p.id}</span>
                      </Button>
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProvince(p);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive hover:text-destructive" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProvince(p.systemId);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* MIDDLE: Districts */}
          <Card className="w-1/4 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Quận/Huyện</CardTitle>
                {selectedProvince && (
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddDistrict}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {selectedProvince && (
                <div className="relative pt-2">
                    <Search className="absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input placeholder="Tìm quận/huyện..." className="pl-8 h-9" value={districtSearch} onChange={e => {setDistrictSearch(e.target.value); setDistrictPage(0);}} />
                </div>
              )}
            </CardHeader>
            <CardContent className="p-2 flex-grow overflow-hidden">
              {selectedProvince ? (
                <>
                  <ScrollArea className="h-[calc(100%-60px)]">
                    <div className="space-y-1">
                      {paginatedDistricts.map(d => (
                        <div key={d.systemId} className="group relative">
                          <Button
                            variant="ghost"
                            className={cn("w-full justify-start h-auto py-1.5 pr-16 flex-col items-start", selectedDistrictId === d.id && "bg-accent text-accent-foreground")}
                            onClick={() => {
                              setSelectedDistrictId(d.id);
                              setWardPage(0);
                            }}
                          >
                            <span className="font-medium text-sm">{d.name}</span>
                            <span className="text-xs text-muted-foreground">Mã: {d.id}</span>
                          </Button>
                          <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditDistrict(d);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-destructive hover:text-destructive" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDistrict(d.systemId);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  {districtTotalPages > 1 && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t">
                      <span className="text-xs text-muted-foreground">{districtPage + 1}/{districtTotalPages}</span>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setDistrictPage(p => Math.max(0, p - 1))} disabled={districtPage === 0}>
                          <ChevronLeft className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => setDistrictPage(p => Math.min(districtTotalPages - 1, p + 1))} disabled={districtPage >= districtTotalPages - 1}>
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  Chọn tỉnh/TP trước
                </div>
              )}
            </CardContent>
          </Card>

          {/* RIGHT: Wards */}
          <Card className="flex-1 flex flex-col">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Phường/Xã</CardTitle>
                      {selectedDistrictId && (
                        <CardDescription className="text-xs mt-1">
                          {districtsForProvince.find(d => d.id === selectedDistrictId)?.name} • {filteredWards.length} phường/xã
                        </CardDescription>
                      )}
                    </div>
                    {selectedDistrictId && (
                      <Button size="sm" onClick={handleAddWard}><PlusCircle className="mr-2 h-4 w-4" />Thêm</Button>
                    )}
                </div>
                {selectedDistrictId && (
                  <div className="relative pt-2">
                      <Search className="absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input placeholder="Tìm phường/xã..." className="pl-8 h-9" value={wardSearch} onChange={e => {setWardSearch(e.target.value); setWardPage(0);}} />
                  </div>
                )}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col p-4 pt-0">
                {selectedDistrictId ? (
                  <>
                    <div className="flex-1 overflow-auto rounded-md border">
                      <Table>
                        <TableHeader className="sticky top-0 bg-muted/50">
                          <TableRow>
                            <TableHead className="w-[100px]">Mã</TableHead>
                            <TableHead>Tên phường/xã</TableHead>
                            <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedWards.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                Không tìm thấy phường/xã nào
                              </TableCell>
                            </TableRow>
                          ) : (
                            paginatedWards.map(ward => (
                              <TableRow key={ward.systemId}>
                                <TableCell className="font-mono text-xs">{ward.id}</TableCell>
                                <TableCell>{ward.name}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditWard(ward)}><Edit className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteWard(ward.systemId)}><Trash2 className="h-4 w-4" /></Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {wardTotalPages > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                          Trang {wardPage + 1} / {wardTotalPages} • {filteredWards.length} kết quả
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setWardPage(p => Math.max(0, p - 1))} disabled={wardPage === 0}>
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setWardPage(p => Math.min(wardTotalPages - 1, p + 1))} disabled={wardPage >= wardTotalPages - 1}>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Chọn quận/huyện để xem phường/xã
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dialogs */}
      <Dialog open={isProvinceFormOpen} onOpenChange={setIsProvinceFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingProvince ? 'Chỉnh sửa Tỉnh thành' : 'Thêm Tỉnh thành mới'}</DialogTitle>
            </DialogHeader>
            <ProvinceForm initialData={editingProvince} onSubmit={handleProvinceFormSubmit} onCancel={() => setIsProvinceFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isWardFormOpen} onOpenChange={setIsWardFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingWard ? 'Chỉnh sửa Phường/Xã' : 'Thêm Phường/Xã mới'}</DialogTitle>
            </DialogHeader>
            <WardForm initialData={editingWard} onSubmit={handleWardFormSubmit} onCancel={() => setIsWardFormOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isDistrictFormOpen} onOpenChange={setIsDistrictFormOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingDistrict ? 'Chỉnh sửa Quận/Huyện' : 'Thêm Quận/Huyện mới'}</DialogTitle>
            </DialogHeader>
            <DistrictForm 
              initialData={editingDistrict} 
              provinceId={selectedProvince?.id || ''} 
              onSubmit={handleDistrictFormSubmit} 
              onCancel={() => setIsDistrictFormOpen(false)} 
            />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!dialogState} onOpenChange={() => setDialogState(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogState?.type === 'province' 
                ? 'Hành động này sẽ xóa Tỉnh/Thành phố và tất cả Phường/Xã liên quan. Hành động này không thể được hoàn tác.'
                : dialogState?.type === 'district'
                ? 'Hành động này sẽ xóa Quận/Huyện và tất cả Phường/Xã liên quan. Hành động này không thể được hoàn tác.'
                : 'Hành động này sẽ xóa Phường/Xã. Hành động này không thể được hoàn tác.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {importPreview && (
        <Dialog open={isImportDialogOpen} onOpenChange={handleImportDialogChange}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Xác nhận ghi đè dữ liệu địa giới</DialogTitle>
              <DialogDescription>
                File mới sẽ thay thế toàn bộ danh sách tỉnh/thành và phường/xã (2 cấp). Dữ liệu quận/huyện và phường/xã 3 cấp được giữ nguyên.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-md border border-dashed bg-muted/40 p-4 text-sm">
                <p className="font-medium">Tóm tắt</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>
                    • {importPreview.summary.provinceCount.toLocaleString('vi-VN')} tỉnh/thành phố mới
                  </li>
                  <li>
                    • {importPreview.summary.wardCount.toLocaleString('vi-VN')} phường/xã (2 cấp)
                  </li>
                  <li>
                    • Ghi đè toàn bộ dữ liệu hiện có cho cấp tỉnh và phường/xã 2 cấp
                  </li>
                </ul>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border p-3">
                  <p className="text-sm font-medium">Danh sách tỉnh/thành</p>
                  <ScrollArea className="mt-2 h-40">
                    <ul className="divide-y text-sm">
                      {importPreview.provinces.slice(0, 12).map((province) => (
                        <li key={province.id} className="flex items-center justify-between py-1.5">
                          <span>{province.name}</span>
                          <span className="font-mono text-xs text-muted-foreground">{province.id}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Hiển thị tối đa 12 / {importPreview.summary.provinceCount.toLocaleString('vi-VN')} tỉnh/thành.
                  </p>
                </div>

                <div className="rounded-md border p-3">
                  <p className="text-sm font-medium">Một số phường/xã (2 cấp)</p>
                  <ScrollArea className="mt-2 h-40">
                    <ul className="divide-y text-sm">
                      {importPreview.wards.slice(0, 12).map((ward, index) => (
                        <li key={`${ward.provinceId}-${ward.id}-${index}`} className="py-1.5">
                          <div className="flex items-center justify-between">
                            <span>{ward.name}</span>
                            <span className="font-mono text-xs text-muted-foreground">{ward.id}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Thuộc tỉnh: {ward.provinceName}</p>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Hiển thị tối đa 12 / {importPreview.summary.wardCount.toLocaleString('vi-VN')} phường/xã.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="h-9"
                onClick={() => handleImportDialogChange(false)}
                disabled={isImporting}
              >
                Hủy
              </Button>
              <Button
                type="button"
                className="h-9"
                onClick={handleConfirmImport}
                disabled={isImporting}
              >
                {isImporting ? 'Đang ghi dữ liệu...' : 'Xác nhận nhập file'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

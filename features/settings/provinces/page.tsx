'use client'

import * as React from "react";
import dynamic from "next/dynamic";
import { useFuseFilter } from "@/hooks/use-fuse-search";
import { useProvinces, useDistricts, useWards } from "./hooks/use-administrative-units";
import { useProvinceStore } from "./store";
import { asSystemId, asBusinessId } from "@/lib/id-types";
import { ProvinceForm, type ProvinceFormValues } from "./form";
import { WardForm, type WardFormValues } from "./ward-form";
import { DistrictForm, type DistrictFormValues } from "./district-form";
import type { Province, Ward, District } from '@/lib/types/prisma-extended';
import { useSettingsPageHeader } from "../use-settings-page-header";
import { SettingsActionButton } from "@/components/settings/SettingsActionButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Upload, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { ProvinceItem, DistrictItem, WardList } from "./components";

// Dynamic imports for dialogs
const ImportPreviewDialog = dynamic(() => import("./components/import-preview-dialog").then(m => m.ImportPreviewDialog), { ssr: false });

function useDebounce<T>(value: T, delay: number): T { const [d, setD] = React.useState(value); React.useEffect(() => { const t = setTimeout(() => setD(value), delay); return () => clearTimeout(t); }, [value, delay]); return d; }

type ImportPreviewState = { provinces: Array<Omit<Province, "systemId">>; wards: Array<Omit<Ward, "systemId">>; summary: { provinceCount: number; wardCount: number } };

export function ProvincesPage() {
  const { data: provinces = [] } = useProvinces();
  const { add, update, remove, addWard, updateWard, removeWard, addDistrict, updateDistrict, removeDistrict, importAdministrativeUnits } = useProvinceStore();
  const importInputRef = React.useRef<HTMLInputElement | null>(null);

  const [mode, setMode] = React.useState<"2-level" | "3-level">("3-level");
  const [selectedProvinceId, setSelectedProvinceId] = React.useState<string | null>(provinces[0]?.systemId ?? null);
  const [selectedDistrictId, setSelectedDistrictId] = React.useState<number | null>(null);
  const [provinceSearchInput, setProvinceSearchInput] = React.useState("");
  const [districtSearchInput, setDistrictSearchInput] = React.useState("");
  const [wardSearchInput, setWardSearchInput] = React.useState("");
  const provinceSearch = useDebounce(provinceSearchInput, 300);
  const districtSearch = useDebounce(districtSearchInput, 300);
  const wardSearch = useDebounce(wardSearchInput, 300);
  const [isProvinceFormOpen, setIsProvinceFormOpen] = React.useState(false);
  const [editingProvince, setEditingProvince] = React.useState<Province | null>(null);
  const [isWardFormOpen, setIsWardFormOpen] = React.useState(false);
  const [editingWard, setEditingWard] = React.useState<Ward | null>(null);
  const [isDistrictFormOpen, setIsDistrictFormOpen] = React.useState(false);
  const [editingDistrict, setEditingDistrict] = React.useState<District | null>(null);
  const [dialogState, setDialogState] = React.useState<{ type: "province" | "ward" | "district"; systemId: string } | null>(null);
  const [importPreview, setImportPreview] = React.useState<ImportPreviewState | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);

  const selectedProvince = React.useMemo(() => provinces.find(p => p.systemId === selectedProvinceId) ?? null, [provinces, selectedProvinceId]);
  React.useEffect(() => {
    if (!provinces.length) {
      if (selectedProvinceId !== null) setSelectedProvinceId(null);
      return;
    }

    // If nothing is selected, pick the first province
    if (selectedProvinceId === null) {
      const next = provinces[0]?.systemId ?? null;
      if (next !== null) setSelectedProvinceId(next);
      return;
    }

    // If current selection no longer exists, fall back to first
    if (!provinces.some(p => p.systemId === selectedProvinceId)) {
      const next = provinces[0]?.systemId ?? null;
      if (next !== selectedProvinceId) setSelectedProvinceId(next);
    }
  }, [provinces, selectedProvinceId]);

  const selectedProvinceBusinessId = selectedProvince?.id ?? null;

  // Fetch districts for 3-level mode
  const { data: districtsData = [] } = useDistricts(mode === "3-level" && selectedProvinceBusinessId ? selectedProvinceBusinessId : undefined);
  
  // Fetch wards based on mode (depend only on primitive ids to keep stable)
  const wardsFilter = React.useMemo(() => {
    if (!selectedProvinceBusinessId) return undefined;
    if (mode === "2-level") return { provinceId: selectedProvinceBusinessId, level: '2-level' as const };
    if (mode === "3-level" && selectedDistrictId) return { districtId: selectedDistrictId, level: '3-level' as const };
    return undefined;
  }, [mode, selectedProvinceBusinessId, selectedDistrictId]);
  const { data: wardsData = [] } = useWards(wardsFilter);

  const wardsForSelectedProvince = wardsData;
  const districtsForProvince = districtsData;

  const provinceFuseOptions = React.useMemo(() => ({ keys: ["name", "id"], threshold: 0.3 }), []);
  const searchedProvinces = useFuseFilter(provinces, provinceSearch, provinceFuseOptions);
  const filteredProvinces = React.useMemo(() => provinceSearch ? searchedProvinces : provinces, [searchedProvinces, provinceSearch, provinces]);
  const orderedProvinces = React.useMemo(() => [...filteredProvinces].sort((a, b) => a.name.localeCompare(b.name)), [filteredProvinces]);

  const districtFuseOptions = React.useMemo(() => ({ keys: ["name"], threshold: 0.3 }), []);
  const searchedDistricts = useFuseFilter(districtsForProvince, districtSearch, districtFuseOptions);
  const filteredDistricts = React.useMemo(() => districtSearch ? searchedDistricts : districtsForProvince, [searchedDistricts, districtSearch, districtsForProvince]);

  const wardFuseOptions = React.useMemo(() => ({ keys: ["name", "id"], threshold: 0.3 }), []);
  const searchedWards = useFuseFilter(wardsForSelectedProvince, wardSearch, wardFuseOptions);
  const filteredWards = React.useMemo(() => wardSearch ? searchedWards : wardsForSelectedProvince, [searchedWards, wardSearch, wardsForSelectedProvince]);

  const handleAddProvince = React.useCallback(() => { setEditingProvince(null); setIsProvinceFormOpen(true); }, []);
  const handleEditProvince = (p: Province) => { setEditingProvince(p); setIsProvinceFormOpen(true); };
  const handleDeleteProvince = (id: string) => setDialogState({ type: "province", systemId: id });
  const handleProvinceFormSubmit = (v: ProvinceFormValues) => { if (editingProvince) update(editingProvince.systemId, { ...editingProvince, ...v }); else add(v); setIsProvinceFormOpen(false); };
  const handleAddWard = () => { setEditingWard(null); setIsWardFormOpen(true); };
  const handleEditWard = (w: Ward) => { setEditingWard(w); setIsWardFormOpen(true); };
  const handleDeleteWard = (id: string) => setDialogState({ type: "ward", systemId: id });
  const handleWardFormSubmit = (v: WardFormValues) => { if (!selectedProvince) return; const fv = { ...v, provinceId: selectedProvince.id }; if (editingWard) updateWard(editingWard.systemId, { ...editingWard, ...fv }); else addWard(fv); setIsWardFormOpen(false); };
  const handleAddDistrict = () => { setEditingDistrict(null); setIsDistrictFormOpen(true); };
  const handleEditDistrict = (d: District) => { setEditingDistrict(d); setIsDistrictFormOpen(true); };
  const handleDeleteDistrict = (id: string) => setDialogState({ type: "district", systemId: id });
  const handleDistrictFormSubmit = (v: DistrictFormValues) => { if (!selectedProvince) return; const fv = { ...v, provinceId: selectedProvince.id }; if (editingDistrict) updateDistrict(editingDistrict.systemId, { ...editingDistrict, ...fv }); else addDistrict(fv); setIsDistrictFormOpen(false); };

  const confirmDelete = () => { if (!dialogState) return; if (dialogState.type === "province") { if (dialogState.systemId === selectedProvinceId) { const fb = provinces.find(p => p.systemId !== dialogState.systemId); setSelectedProvinceId(fb?.systemId ?? null); setSelectedDistrictId(null); } remove(asSystemId(dialogState.systemId)); } else if (dialogState.type === "ward") removeWard(asSystemId(dialogState.systemId)); else if (dialogState.type === "district") { const d = districtsForProvince.find(x => x.systemId === dialogState.systemId); if (d && d.id === selectedDistrictId) setSelectedDistrictId(null); removeDistrict(asSystemId(dialogState.systemId)); } setDialogState(null); };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const XLSX = await import('xlsx'); const reader = new FileReader(); reader.onload = le => { try { const data = le.target?.result; const wb = XLSX.read(data, { type: "binary" }); const ws = wb.Sheets[wb.SheetNames[0]]; const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws); const pm = new Map<string, Omit<Province, "systemId">>(); const wards: Array<Omit<Ward, "systemId">> = []; json.forEach(r => { const pid = r["Mã tỉnh (BNV)"] ?? r["Ma Tinh"]; const pn = r["Tên tỉnh/TP mới"] ?? r["Ten tinh"]; const wc = r["Mã phường/xã mới"] ?? r["Ma phuong/xa"]; const wn = r["Tên Phường/Xã mới"] ?? r["Ten Phuong/Xa"]; if (!pid || !pn || !wc || !wn) return; const id = String(pid).padStart(2, "0"); if (!pm.has(id)) pm.set(id, { id: asBusinessId(id), name: String(pn).trim() }); wards.push({ id: String(wc).trim(), name: String(wn).trim(), provinceId: asBusinessId(id), provinceName: String(pn).trim() }); }); if (pm.size === 0 || wards.length === 0) { toast.error('Không tìm thấy dữ liệu hợp lệ'); return; } setImportPreview({ provinces: Array.from(pm.values()), wards, summary: { provinceCount: pm.size, wardCount: wards.length } }); setIsImportDialogOpen(true); } catch (err) { toast.error('Lỗi đọc file', { description: err instanceof Error ? err.message : 'File không hợp lệ' }); } }; reader.readAsBinaryString(file); e.target.value = ""; };
  const handleConfirmImport = () => { if (!importPreview) return; setIsImporting(true); try { importAdministrativeUnits({ provinces: importPreview.provinces, wards: importPreview.wards }); toast.success('Đã nhập dữ liệu hành chính', { description: `${importPreview.summary.provinceCount} tỉnh/thành, ${importPreview.summary.wardCount} phường/xã` }); setIsImportDialogOpen(false); setImportPreview(null); } catch (err) { toast.error('Không thể ghi dữ liệu', { description: err instanceof Error ? err.message : 'Thử lại sau' }); } finally { setIsImporting(false); } };
  
  // Use ref to avoid re-creating headerActions when provinces changes
  const provincesRef = React.useRef(provinces);
  provincesRef.current = provinces;
  const handleExport = React.useCallback(async () => { const pe = provincesRef.current.map(({ systemId: _s, ...r }) => ({ "Mã tỉnh": r.id, "Tên Tỉnh/Thành phố": r.name })); const res = await fetch('/api/administrative-units/wards?level=2-level&limit=20000'); const json = await res.json(); const w2 = json.success ? json.data : []; const we = w2.map(({ systemId: _s, ...r }: Ward) => ({ "Mã tỉnh": r.provinceId, "Mã Phường/Xã": r.id, "Tên Phường/Xã": r.name })); const XLSX = await import('xlsx'); const pws = XLSX.utils.json_to_sheet(pe); const wws = XLSX.utils.json_to_sheet(we); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, pws, "TinhThanh"); XLSX.utils.book_append_sheet(wb, wws, "PhuongXa"); XLSX.writeFile(wb, "Danh_sach_Don_vi_hanh_chinh.xlsx"); }, []);
  const handleImportButtonClick = React.useCallback(() => { importInputRef.current?.click(); }, []);

  const headerActions = React.useMemo(() => [<SettingsActionButton key="import" variant="outline" onClick={handleImportButtonClick}><Upload className="h-4 w-4" />Nhập file</SettingsActionButton>, <SettingsActionButton key="export" variant="outline" onClick={handleExport}><Download className="h-4 w-4" />Xuất file</SettingsActionButton>, <SettingsActionButton key="add" onClick={handleAddProvince}><PlusCircle className="h-4 w-4" />Thêm tỉnh thành</SettingsActionButton>], [handleImportButtonClick, handleExport, handleAddProvince]);
  useSettingsPageHeader({ title: "Tỉnh thành - Quận huyện", actions: headerActions });

  const handleSelectProvince = React.useCallback((id: string) => { setSelectedProvinceId(id); setSelectedDistrictId(null); }, []);

  const renderProvinceList = () => (<Card className={cn("flex flex-col", mode === "2-level" ? "w-1/3" : "w-1/4")}><CardHeader><div className="flex items-center justify-between"><CardTitle className={mode === "3-level" ? "text-base" : undefined}>{mode === "2-level" ? "Tỉnh/Thành phố" : "Tỉnh/TP"}</CardTitle><Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddProvince}><PlusCircle className="h-4 w-4" /></Button></div><div className="relative pt-2"><Search className="pointer-events-none absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground" /><Input placeholder={mode === "2-level" ? "Tìm kiếm..." : "Tìm..."} className="h-9 pl-8" value={provinceSearchInput} onChange={e => setProvinceSearchInput(e.target.value)} /></div></CardHeader><CardContent className="flex-grow overflow-hidden p-2"><ScrollArea className="h-full"><div className="space-y-2 pb-2">{orderedProvinces.map(p => <ProvinceItem key={p.systemId} province={p} isActive={selectedProvinceId === p.systemId} onSelect={handleSelectProvince} onEdit={handleEditProvince} onDelete={handleDeleteProvince} />)}</div></ScrollArea></CardContent></Card>);

  const renderWardPanel = (showAdd: boolean) => (<>{filteredWards.length > 0 ? <div className="flex-1 h-full overflow-hidden"><WardList wards={filteredWards} onEdit={handleEditWard} onDelete={handleDeleteWard} /></div> : <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center"><p className="font-medium text-muted-foreground">Chưa có phường/xã</p><p className="text-sm text-muted-foreground">Thêm phường/xã mới.</p>{showAdd && <Button size="sm" onClick={handleAddWard}><PlusCircle className="mr-2 h-4 w-4" />Thêm phường/xã</Button>}</div>}</>);

  return (
    <div className="flex h-full flex-col">
      <input ref={importInputRef} type="file" className="hidden" accept=".xlsx, .xls" onChange={handleImport} />
      <div className="mb-4 flex flex-shrink-0 items-center"><Tabs value={mode} onValueChange={v => { setMode(v as "2-level" | "3-level"); setSelectedDistrictId(null); }}><TabsList><TabsTrigger value="2-level">2 cấp (Tỉnh → Phường)</TabsTrigger><TabsTrigger value="3-level">3 cấp (Tỉnh → Quận → Phường)</TabsTrigger></TabsList></Tabs></div>

      {mode === "2-level" ? (<div className="flex min-h-0 flex-grow gap-4">{renderProvinceList()}<div className="flex w-2/3 flex-col">{selectedProvince ? <Card className="flex flex-grow flex-col"><CardHeader><div className="flex items-center justify-between"><div><CardTitle>{selectedProvince.name}</CardTitle><CardDescription>Mã: {selectedProvince.id} • {filteredWards.length} phường/xã</CardDescription></div><Button size="sm" onClick={handleAddWard}><PlusCircle className="mr-2 h-4 w-4" />Thêm phường/xã</Button></div><div className="relative pt-2"><Search className="pointer-events-none absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground" /><Input placeholder="Tìm phường/xã..." className="h-9 pl-8" value={wardSearchInput} onChange={e => setWardSearchInput(e.target.value)} /></div></CardHeader><CardContent className="flex flex-grow flex-col p-0">{renderWardPanel(true)}</CardContent></Card> : <Card className="flex h-full items-center justify-center"><div className="text-center text-muted-foreground">Chọn một Tỉnh/Thành phố.</div></Card>}</div></div>) : (<div className="flex min-h-0 flex-grow gap-4">{renderProvinceList()}<Card className="flex w-1/4 flex-col"><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-base">Quận/Huyện</CardTitle>{selectedProvince && <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddDistrict}><PlusCircle className="h-4 w-4" /></Button>}</div>{selectedProvince && <div className="relative pt-2"><Search className="pointer-events-none absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground" /><Input placeholder="Tìm quận/huyện..." className="h-9 pl-8" value={districtSearchInput} onChange={e => setDistrictSearchInput(e.target.value)} /></div>}</CardHeader><CardContent className="flex-grow overflow-hidden p-2">{selectedProvince ? <ScrollArea className="h-full"><div className="space-y-2 pb-2">{filteredDistricts.map(d => <DistrictItem key={d.systemId} district={d} isActive={selectedDistrictId === d.id} onSelect={setSelectedDistrictId} onEdit={handleEditDistrict} onDelete={handleDeleteDistrict} />)}</div></ScrollArea> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Chọn tỉnh/TP trước</div>}</CardContent></Card><Card className="flex flex-1 flex-col"><CardHeader><div className="flex items-center justify-between"><div><CardTitle className="text-base">Phường/Xã</CardTitle>{selectedDistrictId && <CardDescription className="mt-1 text-xs">{districtsForProvince.find(d => d.id === selectedDistrictId)?.name} • {filteredWards.length} phường/xã</CardDescription>}</div>{selectedDistrictId && <Button size="sm" onClick={handleAddWard}><PlusCircle className="mr-2 h-4 w-4" />Thêm</Button>}</div>{selectedDistrictId && <div className="relative pt-2"><Search className="pointer-events-none absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground" /><Input placeholder="Tìm phường/xã..." className="h-9 pl-8" value={wardSearchInput} onChange={e => setWardSearchInput(e.target.value)} /></div>}</CardHeader><CardContent className="flex flex-1 flex-col p-0">{selectedDistrictId ? renderWardPanel(true) : <div className="flex h-full items-center justify-center text-muted-foreground">Chọn quận/huyện để xem phường/xã</div>}</CardContent></Card></div>)}

      <Dialog open={isProvinceFormOpen} onOpenChange={setIsProvinceFormOpen}><DialogContent><DialogHeader><DialogTitle>{editingProvince ? "Chỉnh sửa Tỉnh thành" : "Thêm Tỉnh thành mới"}</DialogTitle></DialogHeader><ProvinceForm initialData={editingProvince} onSubmit={handleProvinceFormSubmit} onCancel={() => setIsProvinceFormOpen(false)} /></DialogContent></Dialog>
      <Dialog open={isWardFormOpen} onOpenChange={setIsWardFormOpen}><DialogContent><DialogHeader><DialogTitle>{editingWard ? "Chỉnh sửa Phường/Xã" : "Thêm Phường/Xã mới"}</DialogTitle></DialogHeader><WardForm initialData={editingWard} onSubmit={handleWardFormSubmit} onCancel={() => setIsWardFormOpen(false)} /></DialogContent></Dialog>
      <Dialog open={isDistrictFormOpen} onOpenChange={setIsDistrictFormOpen}><DialogContent><DialogHeader><DialogTitle>{editingDistrict ? "Chỉnh sửa Quận/Huyện" : "Thêm Quận/Huyện mới"}</DialogTitle></DialogHeader><DistrictForm initialData={editingDistrict} provinceId={selectedProvince?.id ?? ""} onSubmit={handleDistrictFormSubmit} onCancel={() => setIsDistrictFormOpen(false)} /></DialogContent></Dialog>
      <AlertDialog open={!!dialogState} onOpenChange={() => setDialogState(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle><AlertDialogDescription>{dialogState?.type === "province" ? "Xóa Tỉnh/TP và tất cả Phường/Xã liên quan." : dialogState?.type === "district" ? "Xóa Quận/Huyện và tất cả Phường/Xã liên quan." : "Xóa Phường/Xã này."}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Tiếp tục</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <ImportPreviewDialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen} preview={importPreview} isImporting={isImporting} onConfirm={handleConfirmImport} onCancel={() => { setIsImportDialogOpen(false); setImportPreview(null); }} />
    </div>
  );
}

export default ProvincesPage;

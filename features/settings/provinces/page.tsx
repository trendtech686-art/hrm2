'use client'

import * as React from "react";
import { useFuseFilter } from "@/hooks/use-fuse-search";
import { useProvinces } from "./hooks/use-administrative-units";
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
import { PlusCircle, Search, Upload, Download, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { useVirtualizer } from "@tanstack/react-virtual";

function useDebounce<T>(value: T, delay: number): T { const [d, setD] = React.useState(value); React.useEffect(() => { const t = setTimeout(() => setD(value), delay); return () => clearTimeout(t); }, [value, delay]); return d; }

type ImportPreviewState = { provinces: Array<Omit<Province, "systemId">>; wards: Array<Omit<Ward, "systemId">>; summary: { provinceCount: number; wardCount: number } };

const ProvinceItem = React.memo(function ProvinceItem({ province, isActive, onSelect, onEdit, onDelete }: { province: Province; isActive: boolean; onSelect: (id: string) => void; onEdit: (p: Province) => void; onDelete: (id: string) => void }) {
  return (<div onClick={() => onSelect(province.systemId)} className={cn("group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors hover:bg-muted/50", isActive ? "bg-primary/5 border-primary/20" : "hover:border-border/50")}><div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{province.name.slice(0, 2).toUpperCase()}</div><div className="flex flex-1 flex-col gap-0.5"><span className="text-sm font-medium leading-none">{province.name}</span><span className="text-xs text-muted-foreground">Mã: {province.id}</span></div><div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => { e.stopPropagation(); onEdit(province); }}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={e => { e.stopPropagation(); onDelete(province.systemId); }}><Trash2 className="h-4 w-4" /></Button></div></div>);
});

const DistrictItem = React.memo(function DistrictItem({ district, isActive, onSelect, onEdit, onDelete }: { district: District; isActive: boolean; onSelect: (id: number) => void; onEdit: (d: District) => void; onDelete: (id: string) => void }) {
  return (<div onClick={() => onSelect(district.id)} className={cn("group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors hover:bg-muted/50", isActive ? "bg-primary/5 border-primary/20" : "hover:border-border/50")}><div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{district.name.slice(0, 2).toUpperCase()}</div><div className="flex flex-1 flex-col gap-0.5"><span className="text-sm font-medium leading-none">{district.name}</span><span className="text-xs text-muted-foreground">Mã: {district.id}</span></div><div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => { e.stopPropagation(); onEdit(district); }}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={e => { e.stopPropagation(); onDelete(district.systemId); }}><Trash2 className="h-4 w-4" /></Button></div></div>);
});

function WardList({ wards, onEdit, onDelete }: { wards: Ward[]; onEdit: (w: Ward) => void; onDelete: (id: string) => void }) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const rv = useVirtualizer({ count: wards.length, getScrollElement: () => parentRef.current, estimateSize: () => 60, overscan: 5 });
  return (<div ref={parentRef} className="h-full w-full overflow-auto"><div style={{ height: `${rv.getTotalSize()}px`, width: "100%", position: "relative" }}>{rv.getVirtualItems().map(vi => { const w = wards[vi.index]; return (<div key={vi.key} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: `${vi.size}px`, transform: `translateY(${vi.start}px)` }} className="flex items-center justify-between border-b px-4 hover:bg-muted/50 group"><div className="flex flex-col justify-center h-full"><span className="font-medium text-sm">{w.name}</span><span className="text-xs text-muted-foreground font-mono">{w.id}</span></div><div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(w)}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(w.systemId)}><Trash2 className="h-4 w-4" /></Button></div></div>); })}</div></div>);
}

export function ProvincesPage() {
  const { data: provinces = [] } = useProvinces();
  const { add, update, remove, addWard, updateWard, removeWard, addDistrict, updateDistrict, removeDistrict, getWards2LevelByProvinceId, getWards3LevelByDistrictId, getDistricts3LevelByProvinceId, importAdministrativeUnits } = useProvinceStore();
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
  React.useEffect(() => { if (!provinces.length) { if (selectedProvinceId !== null) setSelectedProvinceId(null); return; } if (!provinces.some(p => p.systemId === selectedProvinceId)) setSelectedProvinceId(provinces[0]?.systemId ?? null); }, [provinces, selectedProvinceId]);

  const wardsForSelectedProvince = React.useMemo(() => { if (!selectedProvince) return []; if (mode === "2-level") return getWards2LevelByProvinceId(selectedProvince.id); if (selectedDistrictId) return getWards3LevelByDistrictId(selectedDistrictId); return []; }, [mode, selectedProvince, selectedDistrictId, getWards2LevelByProvinceId, getWards3LevelByDistrictId]);
  const districtsForProvince = React.useMemo(() => mode !== "3-level" || !selectedProvince ? [] : getDistricts3LevelByProvinceId(selectedProvince.id), [mode, selectedProvince, getDistricts3LevelByProvinceId]);

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
  const handleExport = React.useCallback(async () => { const pe = provinces.map(({ systemId: _s, ...r }) => ({ "Mã tỉnh": r.id, "Tên Tỉnh/Thành phố": r.name })); const w2 = getWards2LevelByProvinceId(asBusinessId("08")); const we = w2.map(({ systemId: _s, ...r }) => ({ "Mã tỉnh": r.provinceId, "Mã Phường/Xã": r.id, "Tên Phường/Xã": r.name })); const XLSX = await import('xlsx'); const pws = XLSX.utils.json_to_sheet(pe); const wws = XLSX.utils.json_to_sheet(we); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, pws, "TinhThanh"); XLSX.utils.book_append_sheet(wb, wws, "PhuongXa"); XLSX.writeFile(wb, "Danh_sach_Don_vi_hanh_chinh.xlsx"); }, [provinces, getWards2LevelByProvinceId]);
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
      {importPreview && <Dialog open={isImportDialogOpen} onOpenChange={o => { if (!o && !isImporting) { setIsImportDialogOpen(false); setImportPreview(null); } else setIsImportDialogOpen(o); }}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Xác nhận ghi đè dữ liệu địa giới</DialogTitle><DialogDescription>File mới sẽ thay thế toàn bộ danh sách tỉnh/thành và phường/xã (2 cấp).</DialogDescription></DialogHeader><div className="space-y-4"><div className="rounded-md border border-dashed bg-muted/40 p-4 text-sm"><p className="font-medium">Tóm tắt</p><ul className="mt-2 space-y-1 text-muted-foreground"><li>• {importPreview.summary.provinceCount} tỉnh/thành phố</li><li>• {importPreview.summary.wardCount} phường/xã</li></ul></div><div className="grid gap-4 md:grid-cols-2"><div className="rounded-md border p-3"><p className="text-sm font-medium">Danh sách tỉnh/thành</p><ScrollArea className="mt-2 h-40"><ul className="divide-y text-sm">{importPreview.provinces.slice(0, 12).map(p => <li key={p.id} className="flex items-center justify-between py-1.5"><span>{p.name}</span><span className="font-mono text-xs text-muted-foreground">{p.id}</span></li>)}</ul></ScrollArea></div><div className="rounded-md border p-3"><p className="text-sm font-medium">Một số phường/xã</p><ScrollArea className="mt-2 h-40"><ul className="divide-y text-sm">{importPreview.wards.slice(0, 12).map((w, i) => <li key={`${w.provinceId}-${w.id}-${i}`} className="py-1.5"><div className="flex items-center justify-between"><span>{w.name}</span><span className="font-mono text-xs text-muted-foreground">{w.id}</span></div><p className="text-xs text-muted-foreground">Thuộc: {w.provinceName}</p></li>)}</ul></ScrollArea></div></div></div><DialogFooter><Button variant="outline" className="h-9" onClick={() => { setIsImportDialogOpen(false); setImportPreview(null); }} disabled={isImporting}>Hủy</Button><Button className="h-9" onClick={handleConfirmImport} disabled={isImporting}>{isImporting ? "Đang ghi..." : "Xác nhận"}</Button></DialogFooter></DialogContent></Dialog>}
    </div>
  );
}

export default ProvincesPage;

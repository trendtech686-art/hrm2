import * as React from "react";
import * as XLSX from "xlsx";
import Fuse from "fuse.js";
import { useProvinceStore } from "./store";
import { asSystemId, asBusinessId } from "@/lib/id-types";
import { ProvinceForm, type ProvinceFormValues } from "./form";
import { WardForm, type WardFormValues } from "./ward-form";
import { DistrictForm, type DistrictFormValues } from "./district-form";
import type { Province, Ward, District } from '@/lib/types/prisma-extended';
import { useSettingsPageHeader } from "../use-settings-page-header";
import { SettingsActionButton } from "../../../components/settings/SettingsActionButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { ScrollArea } from "../../../components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { PlusCircle, Search, Upload, Download, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import { toast } from 'sonner';
import { SortableCard } from "../../../components/settings/SortableCard";
import { useVirtualizer } from "@tanstack/react-virtual";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

type ImportPreviewState = {
  provinces: Array<Omit<Province, "systemId">>;
  wards: Array<Omit<Ward, "systemId">>;
  summary: {
    provinceCount: number;
    wardCount: number;
  };
};

const getInitials = (name: string) => {
  const fallback = name.slice(0, 2).toUpperCase();
  const parts = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return parts || fallback;
};

interface ProvinceItemProps {
  province: Province;
  isActive: boolean;
  onSelect: (systemId: string) => void;
  onEdit: (province: Province) => void;
  onDelete: (systemId: string) => void;
  index: number;
}

const ProvinceItem = React.memo(function ProvinceItem({
  province,
  isActive,
  onSelect,
  onEdit,
  onDelete,
  index,
}: ProvinceItemProps) {
  return (
    <div
      onClick={() => onSelect(province.systemId)}
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors hover:bg-muted/50",
        isActive ? "bg-primary/5 border-primary/20" : "hover:border-border/50"
      )}
    >
       <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {province.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-sm font-medium leading-none">{province.name}</span>
            <span className="text-xs text-muted-foreground">Mã: {province.id}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(province);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(province.systemId);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
    </div>
  );
});

interface DistrictItemProps {
  district: District;
  isActive: boolean;
  onSelect: (id: number) => void;
  onEdit: (district: District) => void;
  onDelete: (systemId: string) => void;
}

const DistrictItem = React.memo(function DistrictItem({
  district,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}: DistrictItemProps) {
  return (
    <div
      onClick={() => onSelect(district.id)}
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors hover:bg-muted/50",
        isActive ? "bg-primary/5 border-primary/20" : "hover:border-border/50"
      )}
    >
       <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {district.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-sm font-medium leading-none">{district.name}</span>
            <span className="text-xs text-muted-foreground">Mã: {district.id}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(district);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(district.systemId);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
    </div>
  );
});

interface WardListProps {
  wards: Ward[];
  onEdit: (ward: Ward) => void;
  onDelete: (id: string) => void;
}

function WardList({ wards, onEdit, onDelete }: WardListProps) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: wards.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-full w-full overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const ward = wards[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
              className="flex items-center justify-between border-b px-4 hover:bg-muted/50 group"
            >
              <div className="flex flex-col justify-center h-full">
                <span className="font-medium text-sm">{ward.name}</span>
                <span className="text-xs text-muted-foreground font-mono">{ward.id}</span>
              </div>
              <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(ward)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onDelete(ward.systemId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProvincesPage() {
  const {
    data: provinces,
    add,
    update,
    remove,
    addWard,
    updateWard,
    removeWard,
    addDistrict,
    updateDistrict,
    removeDistrict,
    getWards2LevelByProvinceId,
    getWards3LevelByDistrictId,
    getDistricts3LevelByProvinceId,
    importAdministrativeUnits,
  } = useProvinceStore();
  const [importPreview, setImportPreview] = React.useState<ImportPreviewState | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);

  const [mode, setMode] = React.useState<"2-level" | "3-level">("3-level");
  const importInputRef = React.useRef<HTMLInputElement | null>(null);

  const [selectedProvinceId, setSelectedProvinceId] = React.useState<Province["systemId"] | null>(
    provinces[0]?.systemId ?? null,
  );
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

  const selectedProvince = React.useMemo(
    () => provinces.find((province) => province.systemId === selectedProvinceId) ?? null,
    [provinces, selectedProvinceId],
  );

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

  const wardsForSelectedProvince = React.useMemo(() => {
    if (!selectedProvince) return [];
    if (mode === "2-level") {
      return getWards2LevelByProvinceId(selectedProvince.id);
    }
    if (selectedDistrictId) {
      return getWards3LevelByDistrictId(selectedDistrictId);
    }
    return [];
  }, [mode, selectedProvince, selectedDistrictId, getWards2LevelByProvinceId, getWards3LevelByDistrictId]);

  const districtsForProvince = React.useMemo(() => {
    if (mode !== "3-level" || !selectedProvince) return [];
    return getDistricts3LevelByProvinceId(selectedProvince.id);
  }, [mode, selectedProvince, getDistricts3LevelByProvinceId]);

  const provinceFuse = React.useMemo(
    () => new Fuse(provinces, { keys: ["name", "id"], threshold: 0.3 }),
    [provinces],
  );
  const filteredProvinces = React.useMemo(
    () => (provinceSearch ? provinceFuse.search(provinceSearch).map((result) => result.item) : provinces),
    [provinceFuse, provinceSearch, provinces],
  );
  const orderedProvinces = React.useMemo(() => {
    return [...filteredProvinces].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredProvinces]);

  const districtFuse = React.useMemo(
    () => new Fuse(districtsForProvince, { keys: ["name"], threshold: 0.3 }),
    [districtsForProvince],
  );
  const filteredDistricts = React.useMemo(
    () => (districtSearch ? districtFuse.search(districtSearch).map((result) => result.item) : districtsForProvince),
    [districtFuse, districtSearch, districtsForProvince],
  );

  const wardFuse = React.useMemo(
    () => new Fuse(wardsForSelectedProvince, { keys: ["name", "id"], threshold: 0.3 }),
    [wardsForSelectedProvince],
  );
  const filteredWards = React.useMemo(
    () => (wardSearch ? wardFuse.search(wardSearch).map((result) => result.item) : wardsForSelectedProvince),
    [wardFuse, wardSearch, wardsForSelectedProvince],
  );

  const handleAddProvince = React.useCallback(() => {
    setEditingProvince(null);
    setIsProvinceFormOpen(true);
  }, [setEditingProvince, setIsProvinceFormOpen]);
  const handleEditProvince = (province: Province) => {
    setEditingProvince(province);
    setIsProvinceFormOpen(true);
  };
  const handleDeleteProvince = (systemId: string) => setDialogState({ type: "province", systemId });
  const handleProvinceFormSubmit = (values: ProvinceFormValues) => {
    if (editingProvince) {
      update(editingProvince.systemId, { ...editingProvince, ...values });
    } else {
      add(values);
    }
    setIsProvinceFormOpen(false);
  };

  const handleAddWard = () => {
    setEditingWard(null);
    setIsWardFormOpen(true);
  };
  const handleEditWard = (ward: Ward) => {
    setEditingWard(ward);
    setIsWardFormOpen(true);
  };
  const handleDeleteWard = (systemId: string) => setDialogState({ type: "ward", systemId });
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

  const handleAddDistrict = () => {
    setEditingDistrict(null);
    setIsDistrictFormOpen(true);
  };
  const handleEditDistrict = (district: District) => {
    setEditingDistrict(district);
    setIsDistrictFormOpen(true);
  };
  const handleDeleteDistrict = (systemId: string) => setDialogState({ type: "district", systemId });
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
    if (dialogState.type === "province") {
      if (dialogState.systemId === selectedProvinceId) {
        const fallback = provinces.find((province) => province.systemId !== dialogState.systemId);
        setSelectedProvinceId(fallback?.systemId ?? null);
        setSelectedDistrictId(null);
      }
      remove(asSystemId(dialogState.systemId));
    } else if (dialogState.type === "ward") {
      removeWard(asSystemId(dialogState.systemId));
    } else if (dialogState.type === "district") {
      const district = districtsForProvince.find((d) => d.systemId === dialogState.systemId);
      if (district && district.id === selectedDistrictId) {
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
    reader.onload = (loadEvent) => {
      try {
        const data = loadEvent.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<any>(worksheet);

        const provincesMap = new Map<string, Omit<Province, "systemId">>();
        const wards: Array<Omit<Ward, "systemId">> = [];

        json.forEach((row) => {
          const rawProvinceId = row["Mã tỉnh (BNV)"] ?? row["Ma Tinh"];
          const provinceName = row["Tên tỉnh/TP mới"] ?? row["Ten tinh"];
          const wardCode = row["Mã phường/xã mới"] ?? row["Ma phuong/xa"];
          const wardName = row["Tên Phường/Xã mới"] ?? row["Ten Phuong/Xa"];

          if (!rawProvinceId || !provinceName || !wardCode || !wardName) {
            return;
          }

          const provinceId = String(rawProvinceId).padStart(2, "0");

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
          toast.error('Không tìm thấy dữ liệu hợp lệ', {
            description: 'Vui lòng kiểm tra lại định dạng file Excel.',
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
        toast.error('Lỗi khi đọc file', {
          description: error instanceof Error ? error.message : 'File không hợp lệ',
        });
      }
    };
    reader.readAsBinaryString(file);
    event.target.value = "";
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
      toast.success('Đã nhập dữ liệu hành chính', {
        description: `Ghi đè ${importPreview.summary.provinceCount.toLocaleString("vi-VN")} tỉnh/thành và ${importPreview.summary.wardCount.toLocaleString("vi-VN")} phường/xã (2 cấp).`,
      });
      setIsImportDialogOpen(false);
      setImportPreview(null);
    } catch (error) {
      toast.error('Không thể ghi dữ liệu', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại sau.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = React.useCallback(() => {
    const provincesToExport = provinces.map(({ systemId, ...rest }) => ({
      "Mã tỉnh": rest.id,
      "Tên Tỉnh/Thành phố": rest.name,
    }));

    const wards2Level = getWards2LevelByProvinceId(asBusinessId("08"));
    const wardsToExport = wards2Level.map(({ systemId, ...rest }) => ({
      "Mã tỉnh": rest.provinceId,
      "Mã Phường/Xã": rest.id,
      "Tên Phường/Xã": rest.name,
    }));

    const provincesWs = XLSX.utils.json_to_sheet(provincesToExport);
    const wardsWs = XLSX.utils.json_to_sheet(wardsToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, provincesWs, "TinhThanh");
    XLSX.utils.book_append_sheet(wb, wardsWs, "PhuongXa");
    XLSX.writeFile(wb, "Danh_sach_Don_vi_hanh_chinh.xlsx");
  }, [provinces, getWards2LevelByProvinceId]);

  const handleImportButtonClick = React.useCallback(() => {
    importInputRef.current?.click();
  }, [importInputRef]);

  const headerActions = React.useMemo(
    () => [
      <SettingsActionButton key="import" variant="outline" onClick={handleImportButtonClick}>
        <Upload className="h-4 w-4" />
        Nhập file
      </SettingsActionButton>,
      <SettingsActionButton key="export" variant="outline" onClick={handleExport}>
        <Download className="h-4 w-4" />
        Xuất file
      </SettingsActionButton>,
      <SettingsActionButton key="add" onClick={handleAddProvince}>
        <PlusCircle className="h-4 w-4" />
        Thêm tỉnh thành
      </SettingsActionButton>,
    ],
    [handleImportButtonClick, handleExport, handleAddProvince],
  );

  useSettingsPageHeader({
    title: "Tỉnh thành - Quận huyện",
    actions: headerActions,
  });

  const handleSelectProvince = React.useCallback((systemId: Province["systemId"]) => {
    setSelectedProvinceId(systemId);
    setSelectedDistrictId(null);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <input
        ref={importInputRef}
        type="file"
        className="hidden"
        accept=".xlsx, .xls"
        onChange={handleImport}
      />

      <div className="mb-4 flex flex-shrink-0 items-center">
        <Tabs
          value={mode}
          onValueChange={(value) => {
            setMode(value as "2-level" | "3-level");
            setSelectedDistrictId(null);
          }}
        >
          <TabsList>
            <TabsTrigger value="2-level">2 cấp (Tỉnh → Phường) - 3,321 wards</TabsTrigger>
            <TabsTrigger value="3-level">3 cấp (Tỉnh → Quận → Phường) - 10,035 wards</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {mode === "2-level" ? (
        <div className="flex min-h-0 flex-grow gap-4">
          <Card className="flex w-1/3 flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tỉnh/Thành phố</CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddProvince}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="relative pt-2">
                <Search className="pointer-events-none absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  className="h-9 pl-8"
                  value={provinceSearchInput}
                  onChange={(event) => setProvinceSearchInput(event.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-2">
              <ScrollArea className="h-full">
                <div className="space-y-2 pb-2">
                  {orderedProvinces.map((province, index) => (
                    <ProvinceItem
                      key={province.systemId}
                      province={province}
                      index={index}
                      isActive={selectedProvinceId === province.systemId}
                      onSelect={handleSelectProvince}
                      onEdit={handleEditProvince}
                      onDelete={handleDeleteProvince}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="flex w-2/3 flex-col">
            {selectedProvince ? (
              <Card className="flex flex-grow flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedProvince.name}</CardTitle>
                      <CardDescription>
                        Mã: {selectedProvince.id} • {filteredWards.length} phường/xã (2 cấp)
                      </CardDescription>
                    </div>
                    <Button size="sm" onClick={handleAddWard}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Thêm phường/xã
                    </Button>
                  </div>
                  <div className="relative pt-2">
                    <Search className="pointer-events-none absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm phường/xã..."
                      className="h-9 pl-8"
                      value={wardSearchInput}
                      onChange={(event) => setWardSearchInput(event.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex flex-grow flex-col p-0">
                  {filteredWards.length > 0 ? (
                    <div className="flex-1 h-full overflow-hidden">
                      <WardList
                        wards={filteredWards}
                        onEdit={handleEditWard}
                        onDelete={handleDeleteWard}
                      />
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                      <p className="font-medium text-muted-foreground">Chưa có phường/xã</p>
                      <p className="text-sm text-muted-foreground">Thêm phường/xã mới cho tỉnh/thành này.</p>
                      <Button size="sm" onClick={handleAddWard}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Thêm phường/xã
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="flex h-full items-center justify-center">
                <div className="text-center text-muted-foreground">Chọn một Tỉnh/Thành phố để xem chi tiết.</div>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-grow gap-4">
          <Card className="flex w-1/4 flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tỉnh/TP</CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddProvince}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="relative pt-2">
                <Search className="pointer-events-none absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm..."
                  className="h-9 pl-8"
                  value={provinceSearchInput}
                  onChange={(event) => setProvinceSearchInput(event.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-2">
              <ScrollArea className="h-full">
                <div className="space-y-2 pb-2">
                  {orderedProvinces.map((province, index) => (
                    <ProvinceItem
                      key={province.systemId}
                      province={province}
                      index={index}
                      isActive={selectedProvinceId === province.systemId}
                      onSelect={handleSelectProvince}
                      onEdit={handleEditProvince}
                      onDelete={handleDeleteProvince}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex w-1/4 flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Quận/Huyện</CardTitle>
                {selectedProvince ? (
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddDistrict}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
              {selectedProvince ? (
                <div className="relative pt-2">
                  <Search className="pointer-events-none absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm quận/huyện..."
                    className="h-9 pl-8"
                    value={districtSearchInput}
                    onChange={(event) => setDistrictSearchInput(event.target.value)}
                  />
                </div>
              ) : null}
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-2">
              {selectedProvince ? (
                <>
                  <ScrollArea className="h-full">
                    <div className="space-y-2 pb-2">
                      {filteredDistricts.map((district) => (
                        <DistrictItem
                          key={district.systemId}
                          district={district}
                          isActive={selectedDistrictId === district.id}
                          onSelect={setSelectedDistrictId}
                          onEdit={handleEditDistrict}
                          onDelete={handleDeleteDistrict}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Chọn tỉnh/TP trước
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="flex flex-1 flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Phường/Xã</CardTitle>
                  {selectedDistrictId ? (
                    <CardDescription className="mt-1 text-xs text-muted-foreground">
                      {districtsForProvince.find((district) => district.id === selectedDistrictId)?.name} • {filteredWards.length} phường/xã
                    </CardDescription>
                  ) : null}
                </div>
                {selectedDistrictId ? (
                  <Button size="sm" onClick={handleAddWard}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Thêm
                  </Button>
                ) : null}
              </div>
              {selectedDistrictId ? (
                <div className="relative pt-2">
                  <Search className="pointer-events-none absolute left-2.5 top-[18px] h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm phường/xã..."
                    className="h-9 pl-8"
                    value={wardSearchInput}
                    onChange={(event) => setWardSearchInput(event.target.value)}
                  />
                </div>
              ) : null}
            </CardHeader>
            <CardContent className="flex flex-1 flex-col p-0">
              {selectedDistrictId ? (
                filteredWards.length > 0 ? (
                  <div className="flex-1 h-full overflow-hidden">
                    <WardList
                      wards={filteredWards}
                      onEdit={handleEditWard}
                      onDelete={handleDeleteWard}
                    />
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                    <p className="font-medium text-muted-foreground">Chưa có phường/xã</p>
                    <p className="text-sm text-muted-foreground">Thêm phường/xã mới cho quận/huyện này.</p>
                    <Button size="sm" onClick={handleAddWard}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Thêm phường/xã
                    </Button>
                  </div>
                )
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  Chọn quận/huyện để xem phường/xã
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Dialog open={isProvinceFormOpen} onOpenChange={setIsProvinceFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProvince ? "Chỉnh sửa Tỉnh thành" : "Thêm Tỉnh thành mới"}</DialogTitle>
          </DialogHeader>
          <ProvinceForm
            initialData={editingProvince}
            onSubmit={handleProvinceFormSubmit}
            onCancel={() => setIsProvinceFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isWardFormOpen} onOpenChange={setIsWardFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingWard ? "Chỉnh sửa Phường/Xã" : "Thêm Phường/Xã mới"}</DialogTitle>
          </DialogHeader>
          <WardForm
            initialData={editingWard}
            onSubmit={handleWardFormSubmit}
            onCancel={() => setIsWardFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDistrictFormOpen} onOpenChange={setIsDistrictFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDistrict ? "Chỉnh sửa Quận/Huyện" : "Thêm Quận/Huyện mới"}</DialogTitle>
          </DialogHeader>
          <DistrictForm
            initialData={editingDistrict}
            provinceId={selectedProvince?.id ?? ""}
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
              {dialogState?.type === "province"
                ? "Hành động này sẽ xóa Tỉnh/Thành phố và tất cả Phường/Xã liên quan. Hành động này không thể được hoàn tác."
                : dialogState?.type === "district"
                ? "Hành động này sẽ xóa Quận/Huyện và tất cả Phường/Xã liên quan. Hành động này không thể được hoàn tác."
                : "Hành động này sẽ xóa Phường/Xã. Hành động này không thể được hoàn tác."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {importPreview ? (
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
                  <li>• {importPreview.summary.provinceCount.toLocaleString("vi-VN")} tỉnh/thành phố mới</li>
                  <li>• {importPreview.summary.wardCount.toLocaleString("vi-VN")} phường/xã (2 cấp)</li>
                  <li>• Ghi đè toàn bộ dữ liệu hiện có cho cấp tỉnh và phường/xã 2 cấp</li>
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
                    Hiển thị tối đa 12 / {importPreview.summary.provinceCount.toLocaleString("vi-VN")} tỉnh/thành.
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
                    Hiển thị tối đa 12 / {importPreview.summary.wardCount.toLocaleString("vi-VN")} phường/xã.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" className="h-9" onClick={() => handleImportDialogChange(false)} disabled={isImporting}>
                Hủy
              </Button>
              <Button type="button" className="h-9" onClick={handleConfirmImport} disabled={isImporting}>
                {isImporting ? "Đang ghi dữ liệu..." : "Xác nhận nhập file"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}

export default ProvincesPage;

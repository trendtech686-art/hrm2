import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe } from "lucide-react";
import type { Brand, WebsiteSeoData, MultiWebsiteSeo } from "./types";
import { PREDEFINED_WEBSITES } from "../websites/types";

// Schema cho SEO của một website
const websiteSeoSchema = z.object({
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  slug: z.string().optional(),
}).optional();

const brandFormSchema = z.object({
  id: z.string()
    .min(1, "Mã thương hiệu là bắt buộc")
    .max(50, "Mã thương hiệu không được quá 50 ký tự")
    .regex(/^[A-Z0-9-_]+$/, "Mã chỉ được chứa chữ in hoa, số, gạch ngang và gạch dưới"),
  name: z.string()
    .min(1, "Tên thương hiệu là bắt buộc")
    .max(100, "Tên thương hiệu không được quá 100 ký tự"),
  description: z.string().optional(),
  website: z.string().url("Địa chỉ website không hợp lệ").optional().or(z.literal("")),
  isActive: z.boolean(),
  // SEO cho HRM internal
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  // SEO cho từng website
  websiteSeo: z.object({
    pkgx: websiteSeoSchema,
    trendtech: websiteSeoSchema,
  }).optional(),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;

interface BrandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: Brand | null;
  onSubmit: (values: BrandFormValues) => void;
  existingIds: string[];
}

export function BrandFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  existingIds,
}: BrandFormDialogProps) {
  const [activeTab, setActiveTab] = React.useState<'general' | 'seo-pkgx' | 'seo-trendtech'>('general');
  
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      website: "",
      isActive: true,
      seoTitle: "",
      metaDescription: "",
      shortDescription: "",
      longDescription: "",
      websiteSeo: {
        pkgx: {},
        trendtech: {},
      },
    },
  });

  React.useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          id: initialData.id,
          name: initialData.name,
          description: initialData.description || "",
          website: initialData.website || "",
          isActive: initialData.isActive ?? true,
          seoTitle: initialData.seoTitle || "",
          metaDescription: initialData.metaDescription || "",
          shortDescription: initialData.shortDescription || "",
          longDescription: initialData.longDescription || "",
          websiteSeo: {
            pkgx: initialData.websiteSeo?.pkgx || {},
            trendtech: initialData.websiteSeo?.trendtech || {},
          },
        });
      } else {
        form.reset({
          id: "",
          name: "",
          description: "",
          website: "",
          isActive: true,
          seoTitle: "",
          metaDescription: "",
          shortDescription: "",
          longDescription: "",
          websiteSeo: {
            pkgx: {},
            trendtech: {},
          },
        });
      }
      setActiveTab('general');
    }
  }, [open, initialData, form]);

  const handleSubmit = (values: BrandFormValues) => {
    // Validate unique ID
    if (!initialData && existingIds.includes(values.id)) {
      form.setError("id", {
        type: "manual",
        message: "Mã thương hiệu đã tồn tại",
      });
      return;
    }
    
    if (initialData && initialData.id !== values.id && existingIds.includes(values.id)) {
      form.setError("id", {
        type: "manual",
        message: "Mã thương hiệu đã tồn tại",
      });
      return;
    }

    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
          </DialogTitle>
          <DialogDescription>
            Quản lý thông tin thương hiệu sản phẩm.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Thông tin chung</TabsTrigger>
                <TabsTrigger value="seo-pkgx" className="gap-1">
                  <Globe className="h-3 w-3" style={{ color: '#ef4444' }} />
                  SEO PKGX
                </TabsTrigger>
                <TabsTrigger value="seo-trendtech" className="gap-1">
                  <Globe className="h-3 w-3" style={{ color: '#3b82f6' }} />
                  SEO Trendtech
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px] pr-4">
                <TabsContent value="general" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã thương hiệu</FormLabel>
                        <FormControl>
                          <Input placeholder="VD: APPLE" {...field} />
                        </FormControl>
                        <FormDescription>
                          Mã định danh duy nhất, viết liền không dấu.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên thương hiệu</FormLabel>
                        <FormControl>
                          <Input placeholder="VD: Apple Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả chung</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Mô tả về thương hiệu" {...field} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Trạng thái hoạt động</FormLabel>
                          <FormDescription>
                            Thương hiệu này có đang được sử dụng không?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* SEO PKGX Tab */}
                <TabsContent value="seo-pkgx" className="space-y-4 mt-4">
                  <div className="flex items-center gap-2 pb-2 border-b mb-4">
                    <Globe className="h-4 w-4" style={{ color: '#ef4444' }} />
                    <span className="font-medium">Phụ kiện giá xưởng</span>
                    <span className="text-xs text-muted-foreground">(phukiengiaxuong.com.vn)</span>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="websiteSeo.pkgx.seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiêu đề SEO</FormLabel>
                        <FormControl>
                          <Input placeholder="Tiêu đề cho PKGX" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormDescription>Title tag cho trang web. Nên 50-60 ký tự.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteSeo.pkgx.metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Mô tả SEO cho PKGX" {...field} value={field.value || ''} rows={2} />
                        </FormControl>
                        <FormDescription>Mô tả hiển thị trên Google. Nên 150-160 ký tự.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteSeo.pkgx.seoKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Từ khóa SEO</FormLabel>
                        <FormControl>
                          <Input placeholder="từ khóa 1, từ khóa 2" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormDescription>Các từ khóa cách nhau bằng dấu phẩy</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteSeo.pkgx.shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả ngắn</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Mô tả ngắn gọn 1-2 câu" {...field} value={field.value || ''} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteSeo.pkgx.longDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả chi tiết</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Mô tả đầy đủ (hỗ trợ HTML)" {...field} value={field.value || ''} rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* SEO Trendtech Tab */}
                <TabsContent value="seo-trendtech" className="space-y-4 mt-4">
                  <div className="flex items-center gap-2 pb-2 border-b mb-4">
                    <Globe className="h-4 w-4" style={{ color: '#3b82f6' }} />
                    <span className="font-medium">Trendtech</span>
                    <span className="text-xs text-muted-foreground">(Coming soon)</span>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="websiteSeo.trendtech.seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiêu đề SEO</FormLabel>
                        <FormControl>
                          <Input placeholder="Tiêu đề cho Trendtech" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormDescription>Title tag cho trang web. Nên 50-60 ký tự.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteSeo.trendtech.metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Mô tả SEO cho Trendtech" {...field} value={field.value || ''} rows={2} />
                        </FormControl>
                        <FormDescription>Mô tả hiển thị trên Google. Nên 150-160 ký tự.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteSeo.trendtech.seoKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Từ khóa SEO</FormLabel>
                        <FormControl>
                          <Input placeholder="từ khóa 1, từ khóa 2" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormDescription>Các từ khóa cách nhau bằng dấu phẩy</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteSeo.trendtech.shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả ngắn</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Mô tả ngắn gọn 1-2 câu" {...field} value={field.value || ''} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteSeo.trendtech.longDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả chi tiết</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Mô tả đầy đủ (hỗ trợ HTML)" {...field} value={field.value || ''} rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </ScrollArea>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">Lưu thay đổi</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

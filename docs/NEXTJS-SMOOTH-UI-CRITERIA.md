# Tiêu chí UI mượt — Next.js + React Query

> Mục tiêu: Thao tác người dùng phản hồi **tức thì**, không thấy loading spinner, không chờ server.

---

## 1. Optimistic Updates

**Vấn đề**: User click → chờ API → UI mới cập nhật → lag 200-500ms+

**Chuẩn**: UI cập nhật **ngay lập tức**, rollback nếu server lỗi.

```typescript
// ✅ Chuẩn: Optimistic update
const updateMutation = useMutation({
  mutationFn: updateComplaintAction,
  onMutate: async (newData) => {
    // Cancel pending queries
    await queryClient.cancelQueries({ queryKey: complaintKeys.detail(id) })
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(complaintKeys.detail(id))
    
    // Optimistically update cache
    queryClient.setQueryData(complaintKeys.detail(id), (old) => ({
      ...old,
      ...newData,
    }))
    
    return { previous }
  },
  onError: (_err, _vars, context) => {
    // Rollback on error
    queryClient.setQueryData(complaintKeys.detail(id), context?.previous)
    toast.error('Lỗi cập nhật')
  },
  onSettled: () => {
    // Refetch to ensure consistency
    queryClient.invalidateQueries({ queryKey: complaintKeys.detail(id) })
  },
})

// ❌ Sai: Chờ server xong mới update
const updateMutation = useMutation({
  mutationFn: updateComplaintAction,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: complaintKeys.detail(id) })
    // UI chờ refetch xong mới đổi → lag
  },
})
```

### Khi nào dùng Optimistic Update?

| Thao tác | Optimistic? | Lý do |
|----------|-------------|-------|
| Đổi trạng thái | ✅ Có | Đơn giản, dễ rollback |
| Gán nhân viên | ✅ Có | Chỉ đổi 1 field |
| Xóa item | ✅ Có | Undo được |
| Toggle checkbox | ✅ Có | Binary state |
| Tạo mới (cần ID từ server) | ❌ Không | Cần server trả ID |
| Upload file | ❌ Không | Cần server xử lý |
| Tạo phiếu chi/thu | ❌ Không | Business logic phức tạp |

---

## 2. Prefetching — Load trước khi user cần

**Vấn đề**: Click vào detail → loading spinner → chờ API

**Chuẩn**: Hover/focus → prefetch → click vào thấy data ngay.

```typescript
// ✅ Prefetch on hover
<Link
  href={`/complaints/${id}`}
  onMouseEnter={() => {
    queryClient.prefetchQuery({
      queryKey: complaintKeys.detail(id),
      queryFn: () => fetchComplaint(id),
      staleTime: 60_000,
    })
  }}
>
  {complaint.id}
</Link>

// ✅ Prefetch adjacent pages
useEffect(() => {
  if (hasNextPage) {
    queryClient.prefetchQuery({
      queryKey: complaintKeys.list({ ...params, page: page + 1 }),
      queryFn: () => fetchComplaints({ ...params, page: page + 1 }),
    })
  }
}, [page])
```

---

## 3. staleTime đúng — Không refetch thừa

**Vấn đề**: Mỗi lần mount component → refetch → flash loading

**Chuẩn**: Data ít đổi → staleTime cao, tránh refetch vô nghĩa.

| Data type | staleTime khuyến nghị | Lý do |
|-----------|----------------------|-------|
| Employees | 5-10 phút | Ít đổi, dùng nhiều nơi |
| Branches | 10 phút | Gần như không đổi |
| Settings | 10 phút | Đổi rất hiếm |
| Complaint detail | 30-60s | Có thể đổi khi nhiều người xử lý |
| Complaint list | 30s | Cần fresh cho filter/search |
| Activity logs | 0 (always fresh) | Cần real-time |

```typescript
// ❌ Sai: staleTime quá ngắn → refetch liên tục
useQuery({ queryKey: ['employees'], staleTime: 0 })

// ✅ Chuẩn: Employees 5 phút
useQuery({ queryKey: ['employees'], staleTime: 5 * 60 * 1000 })
```

---

## 4. initialData từ Server Component — Zero loading state

**Vấn đề**: Client mount → loading spinner → fetch → render

**Chuẩn**: Server Component fetch → pass initialData → client render ngay.

```typescript
// Server Component (page.tsx)
export default async function ComplaintsPage() {
  const stats = await getComplaintStats()
  return <ComplaintsClient initialStats={stats} />
}

// Client Component
function ComplaintsClient({ initialStats }: { initialStats: Stats }) {
  const { data: stats } = useComplaintStats(initialStats) // Render ngay, không loading
}
```

**Áp dụng cho**: Stats, list page data (first page), detail page data.

---

## 5. Parallel Queries — Không waterfall

**Vấn đề**: Query A xong → mới bắt đầu Query B → chậm gấp đôi

**Chuẩn**: Các query độc lập chạy song song.

```typescript
// ❌ Waterfall: Query nối tiếp
const { data: complaint } = useComplaint(id)
const { data: order } = useOrder(complaint?.orderId) // Chờ complaint xong mới fetch

// ✅ Song song khi có thể
const { data: complaint } = useComplaint(id)
const { data: employees } = useAllEmployees()  // Chạy cùng lúc
const { data: settings } = useComplaintsSettings()  // Chạy cùng lúc

// ✅ Inline data: API trả order kèm complaint → không cần query riêng
// GET /api/complaints/[id] → include relatedOrder
```

---

## 6. Skeleton / Placeholder — Không layout shift

**Vấn đề**: Loading spinner → data appear → page nhảy layout

**Chuẩn**: Skeleton cùng kích thước với content thật.

```typescript
// ✅ Skeleton giữ layout ổn định
if (isLoading) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/3" />     {/* Title */}
      <Skeleton className="h-50 w-full" /> {/* Card */}
      <Skeleton className="h-75 w-full" /> {/* Table */}
    </div>
  )
}

// ❌ Spinner giữa trang → content xuất hiện → nhảy layout
if (isLoading) return <Spinner />
```

---

## 7. Debounced Search — Không fetch mỗi keystroke

**Vấn đề**: Gõ "abc" → 3 fetch request → race condition

**Chuẩn**: Debounce 300ms, chỉ fetch khi user ngừng gõ.

```typescript
// ✅ Đã có trong complaints
const [searchQuery, setSearchQuery] = useState("")
const [debouncedSearch, setDebouncedSearch] = useState("")

useEffect(() => {
  const t = setTimeout(() => setDebouncedSearch(searchQuery), 300)
  return () => clearTimeout(t)
}, [searchQuery])

// Query dùng debouncedSearch, không phải searchQuery
useComplaints({ search: debouncedSearch })
```

---

## 8. Lazy Loading Components — Giảm bundle size

**Vấn đề**: Import dialog 50KB nhưng 95% user không mở

**Chuẩn**: Dynamic import cho components nặng, ít dùng.

```typescript
// ✅ Lazy load dialog chỉ khi cần
const VerificationDialog = dynamic(
  () => import('./verification-dialog').then(m => ({ default: m.VerificationDialog })),
  { ssr: false }
)

// ✅ Lazy load server actions trong handler
const handleProcess = async () => {
  const { createPaymentAction } = await import('@/app/actions/payments')
  await createPaymentAction(data)
}

// ❌ Import hết lên đầu file
import { VerificationDialog } from './verification-dialog'  // Always loaded
import { createPaymentAction } from '@/app/actions/payments'  // Always bundled
```

---

## 9. useTransition — Không block UI khi navigate/filter

**Vấn đề**: Click filter → UI freeze → render xong mới responsive

**Chuẩn**: `useTransition` cho non-urgent updates.

```typescript
const [isPending, startTransition] = useTransition()

const onFilterChange = (value: string) => {
  // Urgent: update input ngay
  setSearchQuery(value)
  
  // Non-urgent: filter có thể chờ
  startTransition(() => {
    setDebouncedSearch(value)
  })
}

// Show subtle indicator, KHÔNG block interaction
<div className={cn(isPending && "opacity-70 pointer-events-none transition-opacity")}>
  <DataTable ... />
</div>
```

---

## 10. Mutation Loading State — Disable button, không block page

**Vấn đề**: Click "Lưu" → không feedback → user click 2 lần

**Chuẩn**: Button hiện loading, page vẫn responsive.

```typescript
// ✅ Button loading state
<Button 
  disabled={mutation.isPending}
  onClick={() => mutation.mutate(data)}
>
  {mutation.isPending ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Đang xử lý...
    </>
  ) : 'Lưu'}
</Button>

// ❌ Full-page loading overlay
{mutation.isPending && <FullPageSpinner />}
```

---

## Checklist áp dụng cho HRM2

| # | Tiêu chí | Complaints List | Complaints Detail | Warranty |
|---|----------|-----------------|-------------------|----------|
| 1 | Optimistic Updates | ❌ Chưa | ❌ Chưa | ❌ Chưa |
| 2 | Prefetch on hover | ❌ Chưa | N/A | ❌ Chưa |
| 3 | staleTime hợp lý | ✅ 60s | ✅ 60s | Cần check |
| 4 | initialData từ Server | ✅ Stats | ❌ Chưa | ❌ Chưa |
| 5 | Parallel queries | ✅ Có | ✅ Có | Cần check |
| 6 | Skeleton loading | ❌ Spinner | ❌ Spinner | ❌ Spinner |
| 7 | Debounced search | ✅ 300ms | N/A | ✅ Có |
| 8 | Lazy load dialogs | ⚠️ 1 phần | ⚠️ Handler only | Cần check |
| 9 | useTransition | ❌ Chưa | ❌ Chưa | ❌ Chưa |
| 10 | Button loading | ⚠️ 1 phần | ⚠️ 1 phần | ⚠️ 1 phần |

### Ưu tiên triển khai

1. **Optimistic Updates** cho đổi trạng thái, gán nhân viên → impact cao nhất
2. **Prefetch on hover** cho list → detail navigation
3. **Skeleton loading** thay spinner → giảm layout shift
4. **useTransition** cho filter/search → không freeze UI

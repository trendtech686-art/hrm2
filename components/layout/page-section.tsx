import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

/**
 * MobilePageShell — shell chuẩn mobile-first cho các trang "list / feed".
 *
 * MainLayout áp `px-4 md:px-6` cho mọi page. Shell này dùng `-mx-4 md:-mx-6` để
 * kéo nội dung full-width trên mobile (edge-to-edge như app native), giữ padding
 * trên desktop. Bên trong là flex column để các `StickyToolbar` + `ListContainer`
 * xếp đúng.
 *
 * Dùng cho: công việc của tôi, khiếu nại, nghỉ phép, phiếu lương, danh sách nhân viên...
 */
interface MobilePageShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MobilePageShell({ className, children, ...rest }: MobilePageShellProps) {
  return (
    <div
      className={cn('flex h-full flex-col -mx-4 md:-mx-6', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * StickyToolbar — thanh công cụ (summary + search + tabs/filters) dính đỉnh
 * sau PageHeader, edge-to-edge trên mobile, có backdrop blur.
 */
interface StickyToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function StickyToolbar({ className, children, ...rest }: StickyToolbarProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * MobileListContainer — vùng cuộn chính chứa danh sách items.
 * Mobile: edge-to-edge (không padding ngang). Desktop: padding 24px, cho phép grid.
 */
interface MobileListContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MobileListContainer = React.forwardRef<HTMLDivElement, MobileListContainerProps>(
  function MobileListContainer({ className, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn('flex-1 overflow-y-auto md:px-6 md:py-3', className)}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

/**
 * MobileListItem — container chuẩn cho 1 item trong danh sách.
 * Mobile: border-bottom (list row), không bo góc, padding 12px.
 * Desktop: card đầy đủ với border + rounded + padding 16px.
 *
 * Dùng như:
 *   <MobileListItem onClick={...}>
 *     ...nội dung item...
 *   </MobileListItem>
 */
interface MobileListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Thêm style overdue / emphasis */
  emphasis?: 'none' | 'destructive' | 'warning'
  /** Tắt hover/active feedback (khi không clickable) */
  inert?: boolean
}

export function MobileListItem({
  className,
  emphasis = 'none',
  inert = false,
  children,
  ...rest
}: MobileListItemProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2.5 bg-card p-3 text-card-foreground',
        'border-b border-x-0 border-t-0 rounded-none',
        'md:gap-3 md:p-4 md:rounded-md md:border',
        !inert && 'transition-colors cursor-pointer touch-manipulation',
        !inert && 'hover:bg-muted/30 md:hover:border-foreground/20 md:hover:bg-card active:bg-muted/50',
        emphasis === 'destructive' && 'md:border-destructive/30',
        emphasis === 'warning' && 'md:border-yellow-500/30',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * MobileListGrid — grid wrapper cho danh sách items.
 * Mobile: 1 cột stacked không gap (dùng border-b của item). Desktop: grid responsive.
 */
interface MobileListGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Số cột tối đa trên desktop (md+). Mặc định 2, xl: 3. */
  cols?: 1 | 2 | 3
}

export function MobileListGrid({
  className,
  cols = 2,
  children,
  ...rest
}: MobileListGridProps) {
  return (
    <div
      className={cn(
        'md:grid md:gap-3',
        cols === 1 && 'md:grid-cols-1',
        cols === 2 && 'md:grid-cols-2',
        cols === 3 && 'md:grid-cols-2 xl:grid-cols-3',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * UnderlineTabsList / UnderlineTabsTrigger — preset class giúp tabs shadcn render
 * dạng underline edge-to-edge, scrollable ngang, không có khung pill.
 */
export const underlineTabsListClass =
  'h-10 md:h-11 w-max min-w-full bg-transparent p-0 rounded-none flex justify-start gap-0 px-1 md:px-4'

export const underlineTabsTriggerClass = cn(
  'relative h-10 md:h-11 shrink-0 gap-1.5 px-3 text-[13px] md:text-sm rounded-none',
  'bg-transparent shadow-none text-muted-foreground font-medium',
  'data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground',
  "after:content-[''] after:absolute after:left-2 after:right-2 after:bottom-0 after:h-0.5 after:rounded-full",
  'after:bg-transparent data-[state=active]:after:bg-primary',
)

export const hiddenScrollbarClass =
  'overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'

/**
 * mobileBleedCardClass — preset className áp vào `<Card>` shadcn để biến
 * thành edge-to-edge trên mobile (phá padding `px-4` của MainLayout), giữ
 * style đầy đủ trên desktop.
 *
 * Dùng cho các Card nằm TRONG detail/form pages (bên trong TabsContent /
 * section chính), nơi user đã tap vào page xem nội dung và muốn maximize
 * không gian ngang trên mobile như app native.
 *
 *   <Card className={mobileBleedCardClass}>…</Card>
 *
 * KHÔNG áp cho: Card trong Dialog, Card trong list grid, Card thumbnail.
 */
export const mobileBleedCardClass =
  '-mx-4 rounded-none border-x-0 shadow-none md:mx-0 md:rounded-lg md:border-x md:shadow-sm'

/**
 * MobileTabsList — drop-in thay cho `<TabsList>` shadcn trong các trang
 * "chính" (detail / list). Render underline style + scroll ngang edge-to-edge
 * trên mobile (ẩn scrollbar), trên desktop vẫn giữ chiều ngang bình thường.
 *
 * Dùng cặp với `<MobileTabsTrigger>`.
 *
 * Mặc định pad ngang `px-1` (mobile) / `px-0` (desktop) + `border-b` phân
 * chia với content. Khi cần full-bleed trên desktop, pass className thêm.
 */
type MobileTabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>

export const MobileTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  MobileTabsListProps
>(function MobileTabsList({ className, children, ...rest }, ref) {
  return (
    <div
      className={cn(
        hiddenScrollbarClass,
        // Edge-to-edge mobile (phá padding của MainLayout), giữ padding desktop
        '-mx-4 border-b md:mx-0',
      )}
    >
      <TabsPrimitive.List
        ref={ref}
        className={cn(underlineTabsListClass, className)}
        {...rest}
      >
        {children}
      </TabsPrimitive.List>
    </div>
  )
})

/**
 * MobileTabsTrigger — drop-in thay cho `<TabsTrigger>` shadcn. Render dạng
 * underline chuẩn mobile app — không có pill/background, chỉ có gạch chân
 * primary khi active. Tự scroll vào view khi click.
 */
type MobileTabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>

export const MobileTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  MobileTabsTriggerProps
>(function MobileTabsTrigger({ className, onClick, ...rest }, ref) {
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      // Tự scroll tab hiện tại vào view khi người dùng tap
      const btn = e.currentTarget
      if (btn && typeof btn.scrollIntoView === 'function') {
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    },
    [onClick],
  )

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap ring-offset-background',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        underlineTabsTriggerClass,
        className,
      )}
      {...rest}
    />
  )
})

/**
 * ListPageShell — wrapper tiêu chuẩn cho các trang admin list (dùng StatsBar +
 * PageFilters + ResponsiveDataTable).
 *
 * Thay thế cho pattern `<div className="flex flex-col w-full h-full">` đang dùng
 * ở 15+ trang list. Bản thân shell vẫn giữ padding ngang của MainLayout
 * (để header/filters căn đúng), nhưng các shared component bên trong đã được
 * nâng cấp tự "thoát padding" trên mobile (StatsBar, PageFilters,
 * ResponsiveDataTable mobile cards đều áp `-mx-4 md:mx-0`) — nghĩa là chỉ cần
 * đổi outer wrapper thành `<ListPageShell>` là trang tự chuẩn mobile-first.
 *
 * Dùng cho: complaints, employees, customers, products, orders, payroll list,
 * warranty, stock-transfers, penalties, v.v.
 */
interface ListPageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Khoảng cách dọc giữa các khối. Mặc định `none` (các trang legacy đã có spacing riêng). Opt-in `sm|md|lg` nếu cần. */
  gap?: 'none' | 'sm' | 'md' | 'lg'
}

export function ListPageShell({
  className,
  gap = 'none',
  children,
  ...rest
}: ListPageShellProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col',
        gap === 'sm' && 'gap-2 md:gap-3',
        gap === 'md' && 'gap-3 md:gap-4',
        gap === 'lg' && 'gap-4 md:gap-6',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * ListPageHeaderActions — hàng action buttons (Import / Export / Customize /
 * Add new) đỉnh trang list, tự xếp hợp lý mobile (stack) và desktop (inline).
 *
 * Không bắt buộc dùng — các trang cũ vẫn có layout riêng; nhưng nếu cần đồng
 * bộ thì đây là preset.
 */
interface ListPageHeaderActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ListPageHeaderActions({
  className,
  children,
  ...rest
}: ListPageHeaderActionsProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2',
        'md:justify-end',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * DetailPageShell — wrapper chuẩn cho các trang CHI TIẾT (xem/sửa 1 record).
 *
 * - Mobile: flex column, gap 12px, nội dung flow từ trên xuống (single column).
 * - Desktop: cho phép layout 2 cột qua `DetailPageMain` + `DetailPageSide`.
 *
 * Dùng với `MobileSectionCard` để mỗi section (thông tin chung, timeline,
 * comments, attachments…) tự chuẩn mobile-first.
 *
 * Dùng cho: complaint-detail, leave-detail, payroll-detail, task-detail,
 * order-detail, warranty-detail, v.v.
 */
interface DetailPageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** gap dọc giữa các section. Mặc định md. */
  gap?: 'sm' | 'md' | 'lg'
}

export function DetailPageShell({
  className,
  gap = 'md',
  children,
  ...rest
}: DetailPageShellProps) {
  return (
    <div
      className={cn(
        'flex w-full max-w-[100vw] flex-col overflow-hidden',
        gap === 'sm' && 'gap-2 md:gap-3',
        gap === 'md' && 'gap-3 md:gap-4',
        gap === 'lg' && 'gap-4 md:gap-6',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * DetailPageGrid — layout 2 cột cho trang chi tiết lớn.
 * Mobile: stack 1 cột. Desktop (lg+): 2 cột (main + side).
 *
 *   <DetailPageGrid>
 *     <DetailPageMain>...</DetailPageMain>
 *     <DetailPageSide>...</DetailPageSide>
 *   </DetailPageGrid>
 */
interface DetailPageGridProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DetailPageGrid({ className, children, ...rest }: DetailPageGridProps) {
  return (
    <div
      className={cn('grid gap-3 md:gap-4 lg:grid-cols-[minmax(0,1fr)_320px]', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

export function DetailPageMain({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-3 md:gap-4', className)} {...rest}>
      {children}
    </div>
  )
}

export function DetailPageSide({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-3 md:gap-4 lg:sticky lg:top-20 lg:self-start', className)}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * MobileSectionCard — section card chuẩn mobile-first cho trang CHI TIẾT / FORM.
 *
 * - Mobile: edge-to-edge (`-mx-4`), không border ngang, chỉ border-y, không bo
 *   góc — giống "section" của iOS/Android app.
 * - Desktop (md+): card đầy đủ với border 1px + rounded-lg + shadow-sm.
 *
 * Dùng thay cho `<Card>` từ shadcn trong các trang detail/form khi muốn
 * chuẩn mobile app. Header/Body/Footer slot có sẵn.
 */
interface MobileSectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Bỏ padding trong (khi child tự handle padding) */
  noPadding?: boolean
}

export function MobileSectionCard({
  className,
  noPadding = false,
  children,
  ...rest
}: MobileSectionCardProps) {
  return (
    <section
      className={cn(
        'bg-card text-card-foreground',
        '-mx-4 border-y md:mx-0 md:rounded-lg md:border md:shadow-sm',
        !noPadding && 'p-4',
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  )
}

/**
 * MobileSectionHeader / Title — header cho MobileSectionCard. Có optional
 * action slot bên phải (thường là "Xem tất cả" / menu).
 */
interface MobileSectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode
}

export function MobileSectionHeader({
  className,
  action,
  children,
  ...rest
}: MobileSectionHeaderProps) {
  return (
    <div
      className={cn('mb-3 flex items-center justify-between gap-2', className)}
      {...rest}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {action ? <div className="flex items-center gap-1 shrink-0">{action}</div> : null}
    </div>
  )
}

export function MobileSectionTitle({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-semibold leading-tight tracking-tight', className)} {...rest}>
      {children}
    </h3>
  )
}

/**
 * FormPageShell — wrapper cho trang FORM (tạo/sửa).
 *
 * - Mobile: full-height flex column, content scroll chính, action bar sticky ở
 *   đáy (nếu truyền `footer`).
 * - Desktop: flow bình thường, footer inline.
 *
 * Dùng cho: leave-create, leave-edit, complaint-form, employee-form,
 * task-form, purchase-order-form, v.v.
 */
interface FormPageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sticky bottom action bar. Truyền Button(s) vào đây. */
  footer?: React.ReactNode
  /** Gap giữa các section. Mặc định md. */
  gap?: 'sm' | 'md' | 'lg'
}

export function FormPageShell({
  className,
  footer,
  gap = 'md',
  children,
  ...rest
}: FormPageShellProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col',
        // Leave room for sticky footer on mobile to avoid content being covered
        footer && 'pb-[calc(env(safe-area-inset-bottom)+72px)] md:pb-0',
        className,
      )}
      {...rest}
    >
      <div
        className={cn(
          'flex w-full flex-col',
          gap === 'sm' && 'gap-2 md:gap-3',
          gap === 'md' && 'gap-3 md:gap-4',
          gap === 'lg' && 'gap-4 md:gap-6',
        )}
      >
        {children}
      </div>
      {footer ? <FormPageFooter>{footer}</FormPageFooter> : null}
    </div>
  )
}

/**
 * FormPageFooter — sticky action bar đáy màn hình trên mobile, inline trên desktop.
 * Tự động add safe-area-inset-bottom để không đè lên home indicator iPhone.
 */
interface FormPageFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FormPageFooter({ className, children, ...rest }: FormPageFooterProps) {
  return (
    <div
      className={cn(
        // Mobile: fixed at bottom edge-to-edge, above content
        'fixed bottom-0 left-0 right-0 z-20 flex items-center gap-2 border-t bg-background/95 px-4 pt-3 backdrop-blur supports-backdrop-filter:bg-background/80',
        'pb-[calc(env(safe-area-inset-bottom)+12px)]',
        // Desktop: static, align right
        'md:static md:border-t-0 md:bg-transparent md:p-0 md:pt-4 md:justify-end md:backdrop-blur-none',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

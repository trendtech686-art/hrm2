'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  User, Mail, Phone, Briefcase, Building2, Shield, LogOut,
  Calendar, Clock, CalendarOff, BadgeCent, DollarSign,
  CreditCard, Heart, MapPin, FileText, ChevronDown, Lock, Eye, EyeOff,
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { usePageHeader } from '@/contexts/page-header-context'
import { useAttendanceByEmployee } from '@/features/attendance/hooks/use-attendance-by-employee'
import { usePayrollByEmployee } from '@/features/payroll/hooks/use-payroll-by-employee'
import { useLeaveQuota } from '@/features/leaves/hooks/use-leaves'
import { usePenaltiesByEmployee } from '@/features/settings/penalties/hooks/use-all-penalties'
import { useRoleSettings } from '@/features/settings/employees/hooks/use-role-settings'
import { formatDate } from '@/lib/date-utils'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

// ============ Helpers ============

const formatCurrency = (value?: number | null) => {
  if (typeof value !== 'number') return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const formatGender = (g?: string | null) => {
  if (!g) return '—'
  const map: Record<string, string> = { MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác', Nam: 'Nam', Nữ: 'Nữ' }
  return map[g] || g
}

const formatEmploymentStatus = (s?: string | null) => {
  if (!s) return '—'
  const map: Record<string, string> = { ACTIVE: 'Đang làm việc', ON_LEAVE: 'Tạm nghỉ', TERMINATED: 'Đã nghỉ việc' }
  return map[s.toUpperCase()] || s
}

const formatEmployeeType = (t?: string | null) => {
  if (!t) return '—'
  const map: Record<string, string> = { FULLTIME: 'Toàn thời gian', PARTTIME: 'Bán thời gian', INTERN: 'Thực tập', PROBATION: 'Thử việc' }
  return map[t.toUpperCase()] || t
}

const statusBadgeVariant = (s?: string | null): 'default' | 'secondary' | 'destructive' => {
  if (!s) return 'destructive'
  const u = s.toUpperCase()
  if (u === 'ACTIVE' || s.includes('làm việc')) return 'default'
  if (u === 'ON_LEAVE') return 'secondary'
  return 'destructive'
}

// ============ Sub Components ============

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="text-muted-foreground shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm truncate">{value}</p>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, icon }: { label: string; value: React.ReactNode; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl bg-muted/50 p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-base font-semibold leading-tight">{value}</div>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  )
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 active:bg-muted/30 transition-colors touch-manipulation"
      >
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

function LoadingRow() {
  return <Skeleton className="h-10 w-full rounded-lg" />
}

// ============ Main Page ============

type MainTab = 'info' | 'attendance' | 'payroll' | 'penalties'

export default function ProfilePage() {
  const router = useRouter()
  const { user, employee, logout } = useAuth()
  const employeeId = employee?.systemId

  // Data hooks — all skip if no employeeId
  const { data: attendanceSummary, isLoading: loadingAttendance } = useAttendanceByEmployee(employeeId)
  const { data: payrollHistory, isLoading: loadingPayroll } = usePayrollByEmployee(employeeId)
  const { data: leaveQuota, isLoading: loadingLeaves } = useLeaveQuota(employeeId)
  const { data: penalties, isLoading: loadingPenalties } = usePenaltiesByEmployee(employeeId)
  const { data: customRoles } = useRoleSettings()

  // Map role ID to Vietnamese name
  const roleName = React.useMemo(() => {
    if (!employee?.role) return undefined
    const match = customRoles?.find(r => r.id === employee.role)
    return match?.name || employee.role
  }, [employee?.role, customRoles])

  usePageHeader({ title: 'Tài khoản' })

  // Tab & load-more state
  const [activeTab, setActiveTab] = React.useState<MainTab>('info')
  const [attendanceLimit, setAttendanceLimit] = React.useState(3)
  const [payrollLimit, setPayrollLimit] = React.useState(3)
  const [penaltyLimit, setPenaltyLimit] = React.useState(5)

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = React.useState(false)
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [showCurrentPw, setShowCurrentPw] = React.useState(false)
  const [showNewPw, setShowNewPw] = React.useState(false)
  const [changingPassword, setChangingPassword] = React.useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Đăng xuất thành công')
    router.push('/login')
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Vui lòng điền đầy đủ')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }
    setChangingPassword(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Đổi mật khẩu thất bại')
        return
      }
      toast.success('Đổi mật khẩu thành công')
      setShowPasswordForm(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      toast.error('Lỗi kết nối')
    } finally {
      setChangingPassword(false)
    }
  }

  // Current month attendance
  const currentMonthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  const currentAttendance = attendanceSummary?.find(a => a.monthKey === currentMonthKey)

  // Latest payslip
  const latestPayslip = payrollHistory?.[0]

  // Pending penalties count
  const pendingPenalties = penalties?.filter(p => p.status === 'Chưa thanh toán') || []

  const tabs: { key: MainTab; label: string }[] = [
    { key: 'info', label: 'Thông tin' },
    { key: 'attendance', label: 'Chấm công' },
    { key: 'payroll', label: 'Phiếu lương' },
    { key: 'penalties', label: `Phiếu phạt (${penalties?.length ?? 0})` },
  ]

  return (
    <div className="pb-20 -mx-4 md:mx-0">
      {/* Avatar + Name + Status */}
      <div className="flex flex-col items-center py-6 border-b">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-3">
          <User className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="text-base font-semibold">{employee?.fullName || user?.name || 'Người dùng'}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{employee?.jobTitle || user?.email}</p>
        {employee?.employmentStatus && (
          <Badge variant={statusBadgeVariant(employee.employmentStatus)} className="mt-2 text-xs">
            {formatEmploymentStatus(employee.employmentStatus)}
          </Badge>
        )}
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-4 border-b">
        <div className="grid grid-cols-2 gap-2">
          <StatCard
            label="Ngày phép còn"
            value={loadingLeaves ? <Skeleton className="h-5 w-12" /> : (leaveQuota?.remaining ?? (12 - (employee?.leaveTaken || 0)))}
            sub={loadingLeaves ? undefined : `Đã dùng ${leaveQuota?.used ?? employee?.leaveTaken ?? 0} ngày`}
            icon={<CalendarOff className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Chấm công T.này"
            value={loadingAttendance ? <Skeleton className="h-5 w-12" /> : (currentAttendance?.workDays ?? 0)}
            sub={currentAttendance ? `Đi muộn: ${currentAttendance.lateArrivals}` : undefined}
            icon={<Clock className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Lương gần nhất"
            value={loadingPayroll ? <Skeleton className="h-5 w-16" /> : (latestPayslip ? formatCurrency(latestPayslip.netSalary) : '—')}
            sub={latestPayslip?.monthKey ? `Tháng ${latestPayslip.monthKey}` : undefined}
            icon={<DollarSign className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Phiếu phạt"
            value={loadingPenalties ? <Skeleton className="h-5 w-12" /> : pendingPenalties.length}
            sub={pendingPenalties.length > 0 ? 'Chưa thanh toán' : 'Không có'}
            icon={<BadgeCent className="h-3.5 w-3.5" />}
          />
        </div>
      </div>

      {/* Main Tabs */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex px-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors touch-manipulation ${
                activeTab === t.key ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-0">
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div>
            <Section title="Thông tin cá nhân">
              <div className="space-y-0.5">
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={employee?.workEmail || user?.email} />
                <InfoRow icon={<Phone className="h-4 w-4" />} label="Điện thoại" value={employee?.phone} />
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Ngày sinh" value={formatDate(employee?.dob)} />
                <InfoRow icon={<Heart className="h-4 w-4" />} label="Giới tính" value={formatGender(employee?.gender)} />
                <InfoRow icon={<MapPin className="h-4 w-4" />} label="Quê quán" value={employee?.placeOfBirth} />
                <InfoRow icon={<FileText className="h-4 w-4" />} label="CCCD/CMND" value={employee?.nationalId} />
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email cá nhân" value={employee?.personalEmail} />
              </div>
            </Section>

            <Section title="Thông tin công việc">
              <div className="space-y-0.5">
                <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Chức vụ" value={employee?.jobTitle} />
                <InfoRow icon={<Building2 className="h-4 w-4" />} label="Phòng ban" value={employee?.department} />
                <InfoRow icon={<Shield className="h-4 w-4" />} label="Vai trò" value={roleName} />
                <InfoRow icon={<User className="h-4 w-4" />} label="Loại NV" value={formatEmployeeType(employee?.employeeType)} />
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="Ngày vào làm" value={formatDate(employee?.hireDate)} />
                <InfoRow icon={<FileText className="h-4 w-4" />} label="Mã nhân viên" value={employee?.id} />
                <InfoRow icon={<FileText className="h-4 w-4" />} label="Hợp đồng" value={employee?.contractNumber} />
                <InfoRow icon={<Calendar className="h-4 w-4" />} label="HĐ đến ngày" value={formatDate(employee?.contractEndDate)} />
              </div>
            </Section>

            <Section title="Thông tin lương" defaultOpen={false}>
              <div className="space-y-0.5">
                <InfoRow icon={<DollarSign className="h-4 w-4" />} label="Lương cơ bản" value={formatCurrency(employee?.baseSalary)} />
                <InfoRow icon={<DollarSign className="h-4 w-4" />} label="Phụ cấp chức vụ" value={formatCurrency(employee?.positionAllowance)} />
                <InfoRow icon={<DollarSign className="h-4 w-4" />} label="Phụ cấp ăn trưa" value={formatCurrency(employee?.mealAllowance)} />
                <InfoRow icon={<DollarSign className="h-4 w-4" />} label="Phụ cấp khác" value={formatCurrency(employee?.otherAllowances)} />
                <InfoRow icon={<CreditCard className="h-4 w-4" />} label="Ngân hàng" value={employee?.bankName} />
                <InfoRow icon={<CreditCard className="h-4 w-4" />} label="Số tài khoản" value={employee?.bankAccountNumber} />
                <InfoRow icon={<CreditCard className="h-4 w-4" />} label="Chi nhánh NH" value={employee?.bankBranch} />
              </div>
            </Section>

            {/* Change Password */}
            <Section title="Bảo mật">
              <div>
                {!showPasswordForm ? (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="flex items-center gap-3 py-2 w-full text-left active:bg-muted/30 rounded-lg touch-manipulation"
                  >
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Đổi mật khẩu</p>
                      <p className="text-xs text-muted-foreground">Thay đổi mật khẩu đăng nhập</p>
                    </div>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        placeholder="Mật khẩu hiện tại"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm pr-10"
                      />
                      <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm pr-10"
                      />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <input
                      type="password"
                      placeholder="Xác nhận mật khẩu mới"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setShowPasswordForm(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword('') }}
                        className="flex-1 py-2 rounded-lg border text-sm font-medium active:bg-muted/30 touch-manipulation"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleChangePassword}
                        disabled={changingPassword}
                        className="flex-1 py-2 rounded-lg bg-foreground text-background text-sm font-medium active:opacity-80 touch-manipulation disabled:opacity-50"
                      >
                        {changingPassword ? 'Đang đổi...' : 'Xác nhận'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Section>

            {/* Logout */}
            <div className="px-4 pt-6 pb-4">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md border text-destructive text-sm font-medium active:bg-destructive/5 transition-colors touch-manipulation"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="px-4 py-4">
            {loadingAttendance ? (
              <div className="space-y-2"><LoadingRow /><LoadingRow /></div>
            ) : attendanceSummary && attendanceSummary.length > 0 ? (
              <div className="space-y-3">
                {attendanceSummary.slice(0, attendanceLimit).map((a) => (
                  <div key={a.monthKey} className="rounded-xl bg-muted/50 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Tháng {a.monthKey}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div><div className="text-sm font-semibold">{a.workDays}</div><div className="text-xs text-muted-foreground">Ngày công</div></div>
                      <div><div className="text-sm font-semibold">{a.leaveDays}</div><div className="text-xs text-muted-foreground">Nghỉ</div></div>
                      <div><div className="text-sm font-semibold">{a.lateArrivals}</div><div className="text-xs text-muted-foreground">Đi muộn</div></div>
                    </div>
                  </div>
                ))}
                {attendanceSummary.length > attendanceLimit && (
                  <button onClick={() => setAttendanceLimit(l => l + 5)} className="w-full py-2 text-xs text-primary font-medium active:bg-muted/30 rounded-lg touch-manipulation">
                    Xem thêm ({attendanceSummary.length - attendanceLimit} tháng)
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Chưa có dữ liệu chấm công</p>
            )}
          </div>
        )}

        {/* Payroll Tab */}
        {activeTab === 'payroll' && (
          <div className="px-4 py-4">
            {loadingPayroll ? (
              <div className="space-y-2"><LoadingRow /><LoadingRow /></div>
            ) : payrollHistory && payrollHistory.length > 0 ? (
              <div className="space-y-3">
                {payrollHistory.slice(0, payrollLimit).map((p) => (
                  <div key={p.systemId} className="rounded-xl bg-muted/50 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium">Tháng {p.monthKey}</span>
                      <Badge variant="outline" className="text-xs">{p.status === 'locked' ? 'Đã khóa' : p.status === 'reviewed' ? 'Đã duyệt' : p.status === 'draft' ? 'Nháp' : p.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><div className="text-xs text-muted-foreground">Lương net</div><div className="text-sm font-semibold">{formatCurrency(p.netSalary)}</div></div>
                      <div><div className="text-xs text-muted-foreground">Lương gross</div><div className="text-sm font-semibold">{formatCurrency(p.grossSalary)}</div></div>
                      <div><div className="text-xs text-muted-foreground">Khấu trừ</div><div className="text-sm font-semibold">{formatCurrency(p.totalDeductions)}</div></div>
                      <div><div className="text-xs text-muted-foreground">Ngày công</div><div className="text-sm font-semibold">{p.workDays}</div></div>
                    </div>
                  </div>
                ))}
                {payrollHistory.length > payrollLimit && (
                  <button onClick={() => setPayrollLimit(l => l + 5)} className="w-full py-2 text-xs text-primary font-medium active:bg-muted/30 rounded-lg touch-manipulation">
                    Xem thêm ({payrollHistory.length - payrollLimit} phiếu)
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Chưa có phiếu lương</p>
            )}
          </div>
        )}

        {/* Penalties Tab */}
        {activeTab === 'penalties' && (
          <div className="px-4 py-4">
            {loadingPenalties ? (
              <div className="space-y-2"><LoadingRow /><LoadingRow /></div>
            ) : penalties && penalties.length > 0 ? (
              <div className="space-y-2">
                {penalties.slice(0, penaltyLimit).map((p) => (
                  <div key={p.systemId} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{p.reason || p.penaltyTypeName || 'Phiếu phạt'}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(p.issueDate)} · {formatCurrency(p.amount)}</p>
                    </div>
                    <Badge
                      variant={p.status === 'Đã thanh toán' ? 'default' : p.status === 'Đã hủy' ? 'secondary' : 'destructive'}
                      className="ml-2 text-xs shrink-0"
                    >
                      {p.status}
                    </Badge>
                  </div>
                ))}
                {penalties.length > penaltyLimit && (
                  <button onClick={() => setPenaltyLimit(l => l + 5)} className="w-full py-2 text-xs text-primary font-medium active:bg-muted/30 rounded-lg touch-manipulation">
                    Xem thêm ({penalties.length - penaltyLimit} phiếu)
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Không có phiếu phạt</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

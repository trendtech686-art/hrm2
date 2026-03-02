import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Users, Calendar, AlertTriangle, Clock, TrendingUp, Award } from 'lucide-react';
import type { AttendanceDataRow } from '../types';
import { cn } from '../../../lib/utils';

interface StatisticsDashboardProps {
  data: AttendanceDataRow[];
  currentDate: Date;
}

export function StatisticsDashboard({ data, currentDate: _currentDate }: StatisticsDashboardProps) {
  const stats = React.useMemo(() => {
    const totalEmployees = data.length;
    const totalWorkDays = data.reduce((sum, emp) => sum + emp.workDays, 0);
    const totalLeaveDays = data.reduce((sum, emp) => sum + emp.leaveDays, 0);
    const totalAbsentDays = data.reduce((sum, emp) => sum + emp.absentDays, 0);
    const totalLateArrivals = data.reduce((sum, emp) => sum + emp.lateArrivals, 0);
    const totalOTHours = data.reduce((sum, emp) => sum + emp.otHours, 0);
    
    const avgWorkDays = totalEmployees > 0 ? (totalWorkDays / totalEmployees).toFixed(1) : 0;
    const totalPossibleDays = totalWorkDays + totalAbsentDays;
    const attendanceRate = totalPossibleDays > 0 
      ? ((totalWorkDays / totalPossibleDays) * 100).toFixed(1)
      : '0';
    
    // Find top performers
    const topOTEmployee = data.reduce((max, emp) => emp.otHours > max.otHours ? emp : max, data[0] || { otHours: 0, fullName: '-' });
    const mostLateEmployee = data.reduce((max, emp) => emp.lateArrivals > max.lateArrivals ? emp : max, data[0] || { lateArrivals: 0, fullName: '-' });
    
    return {
      totalEmployees,
      totalWorkDays,
      totalLeaveDays,
      totalAbsentDays,
      totalLateArrivals,
      totalOTHours,
      avgWorkDays,
      attendanceRate,
      topOTEmployee,
      mostLateEmployee,
    };
  }, [data]);

  const statCards = [
    {
      title: 'Tổng nhân viên',
      value: stats.totalEmployees,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Công trung bình',
      value: `${stats.avgWorkDays} ngày`,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Tỷ lệ đi làm',
      value: `${stats.attendanceRate}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Tổng giờ làm thêm',
      value: `${stats.totalOTHours}h`,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Đi trễ nhiều nhất',
      value: stats.mostLateEmployee.fullName,
      subtitle: `${stats.mostLateEmployee.lateArrivals} lần`,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'OT nhiều nhất',
      value: stats.topOTEmployee.fullName,
      subtitle: `${stats.topOTEmployee.otHours}h`,
      icon: Award,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      {statCards.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="p-2 pb-1">
            <div className="flex items-center justify-between">
              <CardTitle size="sm" className="text-muted-foreground leading-tight">
                {stat.title}
              </CardTitle>
              <div className={cn('p-1 rounded-md', stat.bgColor)}>
                <stat.icon className={cn('h-3 w-3', stat.color)} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="text-sm font-semibold truncate" title={String(stat.value)}>
              {stat.value}
            </div>
            {stat.subtitle && (
              <p className="text-[10px] text-muted-foreground">
                {stat.subtitle}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

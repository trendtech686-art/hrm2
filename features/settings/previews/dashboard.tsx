import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Calendar } from '../../../components/ui/calendar';
import { ChartBar } from '../../../components/ui/chart';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { Input } from '../../../components/ui/input';
import { Slider } from '../../../components/ui/slider';
import { ArrowUpRight, ArrowDownRight, Users, CreditCard, Activity, DollarSign, Plus, Minus, Send } from 'lucide-react';

export function PreviewDashboard() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [moveGoal, setMoveGoal] = React.useState(350);

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
      </Card>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.231.890đ</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+20.1%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đăng ký mới</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+180.1%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Doanh số</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowDownRight className="h-3 w-3 text-red-500" />
              <span className="text-red-500">-4.3%</span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+201</span> từ giờ trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle>Tổng quan</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartBar 
              data={[
                { name: 'T1', value: 4500 },
                { name: 'T2', value: 3200 },
                { name: 'T3', value: 6100 },
                { name: 'T4', value: 4800 },
                { name: 'T5', value: 5300 },
                { name: 'T6', value: 7200 },
                { name: 'T7', value: 3500 },
                { name: 'T8', value: 4100 },
                { name: 'T9', value: 5800 },
                { name: 'T10', value: 4200 },
                { name: 'T11', value: 3900 },
                { name: 'T12', value: 6500 }
              ]}
              bars={[{ dataKey: 'value', name: 'Doanh thu' }]}
              height={300}
            />
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Doanh số gần đây</CardTitle>
            <CardDescription>Bạn có 265 đơn hàng tháng này</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Nguyễn Văn A', email: 'a@email.com', amount: '+1.999.000đ' },
              { name: 'Trần Thị B', email: 'b@email.com', amount: '+39.000đ' },
              { name: 'Lê Văn C', email: 'c@email.com', amount: '+299.000đ' },
              { name: 'Phạm Thị D', email: 'd@email.com', amount: '+99.000đ' },
              { name: 'Hoàng Văn E', email: 'e@email.com', amount: '+39.000đ' },
            ].map((sale) => (
              <div key={sale.email} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{sale.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{sale.name}</p>
                  <p className="text-sm text-muted-foreground">{sale.email}</p>
                </div>
                <div className="ml-auto font-medium">{sale.amount}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Calendar */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Lịch</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-0"
            />
          </CardContent>
        </Card>

        {/* Move Goal */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Mục tiêu di chuyển</CardTitle>
            <CardDescription>Đặt mục tiêu hoạt động hàng ngày</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => setMoveGoal(Math.max(0, moveGoal - 10))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <div className="text-5xl font-bold tracking-tighter">{moveGoal}</div>
                <div className="text-xs uppercase text-muted-foreground">KCAL/NGÀY</div>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => setMoveGoal(moveGoal + 10)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button className="w-full">Đặt mục tiêu</Button>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">Sofia Davis</CardTitle>
                <p className="text-xs text-muted-foreground">m@example.com</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-end">
                <div className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground max-w-[80%]">
                  Xin chào, tôi có thể giúp gì cho bạn?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="rounded-lg bg-muted px-3 py-2 text-sm max-w-[80%]">
                  Tôi cần hỗ trợ về tài khoản.
                </div>
              </div>
              <div className="flex justify-end">
                <div className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground max-w-[80%]">
                  Vui lòng cho tôi biết chi tiết.
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Nhập tin nhắn..." className="flex-1" />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exercise Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Phút tập luyện</CardTitle>
          <CardDescription>
            Số phút tập luyện của bạn cao hơn bình thường.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartBar 
            data={[
              { name: 'T2', value: 45 },
              { name: 'T3', value: 30 },
              { name: 'T4', value: 60 },
              { name: 'T5', value: 20 },
              { name: 'T6', value: 50 },
              { name: 'T7', value: 40 },
              { name: 'CN', value: 35 }
            ]}
            bars={[{ dataKey: 'value', name: 'Phút' }]}
            height={200}
          />
        </CardContent>
      </Card>
    </div>
  );
}

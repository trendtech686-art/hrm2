import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Label } from '../../../components/ui/label.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { Switch } from '../../../components/ui/switch.tsx';
import { Slider } from '../../../components/ui/slider.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar.tsx';
import { Separator } from '../../../components/ui/separator.tsx';
import { Progress } from '../../../components/ui/progress.tsx';
import { Check, CreditCard, Star } from 'lucide-react';

export function PreviewCards() {
    const [progress] = React.useState(68);
    
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1: Create Account */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                <CardHeader>
                    <CardTitle>Tạo tài khoản</CardTitle>
                    <CardDescription>Nhập thông tin để tạo tài khoản mới</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Họ tên</Label>
                        <Input id="name" placeholder="Nguyễn Văn A" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="email@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Vai trò</Label>
                        <Select defaultValue="user">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Quản trị viên</SelectItem>
                                <SelectItem value="user">Người dùng</SelectItem>
                                <SelectItem value="viewer">Chỉ xem</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Tạo tài khoản</Button>
                </CardFooter>
            </Card>

            {/* Card 2: Payment Method */}
            <Card>
                <CardHeader>
                    <CardTitle>Phương thức thanh toán</CardTitle>
                    <CardDescription>Thêm thẻ thanh toán mới</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="card-name">Tên trên thẻ</Label>
                        <Input id="card-name" placeholder="Nguyễn Văn A" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="card-number">Số thẻ</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiry">Hết hạn</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Lưu thẻ
                    </Button>
                </CardFooter>
            </Card>

            {/* Card 3: Upgrade Plan */}
            <Card>
                <CardHeader>
                    <CardTitle>Nâng cấp gói dịch vụ</CardTitle>
                    <CardDescription>
                        Bạn đang sử dụng gói miễn phí. Nâng cấp để có thêm tính năng.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Dung lượng đã dùng</span>
                            <span className="text-sm text-muted-foreground">{progress}%</span>
                        </div>
                        <Progress value={progress} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span className="text-sm">Không giới hạn dự án</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span className="text-sm">Hỗ trợ ưu tiên</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span className="text-sm">Tích hợp API</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">Hủy</Button>
                    <Button className="flex-1">Nâng cấp</Button>
                </CardFooter>
            </Card>

            {/* Card 4: Team Members */}
            <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                    <CardTitle>Thành viên nhóm</CardTitle>
                    <CardDescription>Mời thành viên mới vào nhóm của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { name: 'Nguyễn Văn A', email: 'a@example.com', role: 'Chủ sở hữu' },
                        { name: 'Trần Thị B', email: 'b@example.com', role: 'Nhà phát triển' },
                        { name: 'Lê Văn C', email: 'c@example.com', role: 'Kế toán' },
                    ].map((member, i) => (
                        <React.Fragment key={member.email}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium leading-none">{member.name}</p>
                                        <p className="text-sm text-muted-foreground">{member.email}</p>
                                    </div>
                                </div>
                                <Badge variant="outline">{member.role}</Badge>
                            </div>
                            {i < 2 && <Separator />}
                        </React.Fragment>
                    ))}
                </CardContent>
            </Card>

            {/* Card 5: Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Cài đặt thông báo</CardTitle>
                    <CardDescription>Quản lý cách bạn nhận thông báo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Email Marketing</Label>
                            <p className="text-xs text-muted-foreground">Nhận email khuyến mãi</p>
                        </div>
                        <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Bảo mật</Label>
                            <p className="text-xs text-muted-foreground">Thông báo đăng nhập mới</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="space-y-3">
                        <Label>Âm lượng thông báo</Label>
                        <Slider defaultValue={[75]} max={100} step={1} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

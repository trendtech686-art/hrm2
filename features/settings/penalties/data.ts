import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { Penalty } from './types.ts';

export const data: Penalty[] = [
  {
    systemId: asSystemId('PP000001'),
    id: asBusinessId('PP000001'),
    employeeSystemId: asSystemId('EMP000003'),
    employeeName: 'Lê Văn Cường',
    reason: 'Đi làm trễ 30 phút không có lý do.',
    amount: 100000,
    issueDate: '2025-10-28',
    status: 'Đã thanh toán',
    issuerName: 'Nguyễn Văn An',
  },
  {
    systemId: asSystemId('PP000002'),
    id: asBusinessId('PP000002'),
    employeeSystemId: asSystemId('EMP000005'),
    employeeName: 'Hoàng Văn Em',
    reason: 'Không tuân thủ đồng phục công ty.',
    amount: 50000,
    issueDate: '2025-11-02',
    status: 'Chưa thanh toán',
    issuerName: 'Phạm Thị Dung',
  },
  {
    systemId: asSystemId('PP000003'),
    id: asBusinessId('PP000003'),
    employeeSystemId: asSystemId('EMP000014'),
    employeeName: 'Ngô Thị Phương',
    reason: 'Gửi báo cáo tuần chậm 1 ngày.',
    amount: 50000,
    issueDate: '2025-11-04',
    status: 'Chưa thanh toán',
    issuerName: 'Đỗ Hùng',
  },
  {
    systemId: asSystemId('PP000004'),
    id: asBusinessId('PP000004'),
    employeeSystemId: asSystemId('EMP000003'),
    employeeName: 'Lê Văn Cường',
    reason: 'Quên chấm công khi ra về.',
    amount: 50000,
    issueDate: '2025-11-05',
    status: 'Đã hủy',
    issuerName: 'Phạm Thị Dung',
  },
];

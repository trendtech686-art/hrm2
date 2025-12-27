import type { Order } from '../../orders/types';

export type OrderWithProfit = Order & {
    profit: number;
    costOfGoods: number;
};

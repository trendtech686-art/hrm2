import type { Order } from '../../orders/types.ts';

export type OrderWithProfit = Order & {
    profit: number;
    costOfGoods: number;
};

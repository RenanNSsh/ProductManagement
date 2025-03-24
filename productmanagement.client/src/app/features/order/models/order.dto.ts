import { OrderItemDto } from './order-item.dto';
import { OrderStatus } from './order-status.enum';

export interface OrderDto {
  id: string;
  orderDate: Date;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: OrderStatus;
  orderItems: OrderItemDto[];
  createdAt: Date;
  updatedAt?: Date;
}
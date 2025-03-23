import { OrderItemDto } from './order-item.dto';
import { OrderStatus } from './order-status.enum';

export interface PaginatedResponseDTO<T> {
  hasNext: boolean;
  hasPrevious: boolean; 
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

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



export interface CreateOrderDto {
  customerName: string;
  customerEmail: string;
  orderItems: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
} 
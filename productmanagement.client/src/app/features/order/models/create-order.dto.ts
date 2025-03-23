import { CreateOrderItemDto } from "./create-order-item.dto";

export interface CreateOrderDto {
    customerName: string;
    customerEmail: string;
    orderItems: CreateOrderItemDto[];
}
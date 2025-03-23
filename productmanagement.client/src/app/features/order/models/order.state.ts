import { ApiErrorDto } from "../../../shared/models/api-error.dto";
import { OrderDto } from "./order.dto";

export interface OrderState {
    orders: OrderDto[];
    selectedOrder: OrderDto | null;
    loading: boolean;
    error: ApiErrorDto | null;
}
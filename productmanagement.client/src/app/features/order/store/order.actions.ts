import { createAction, props } from '@ngrx/store';

import { ApiErrorDto } from '../../../shared/models/api-error.dto';
import { PaginatedResponseDTO } from '../../../shared/models/paginated-reponse.dto';
import { CreateOrderDto } from '../models/create-order.dto';
import { OrderDto } from '../models/order.dto';
import { OrderStatus } from '../models/order-status.enum';
import { UpdateOrderStatusDto } from '../models/update-order-status.dto';

export const loadOrders = createAction('[Order] Load Orders');
export const loadOrdersSuccess = createAction(
  '[Order] Load Orders Success',
  props<{ paginatedOrders: PaginatedResponseDTO<OrderDto> }>()
);
export const loadOrdersFailure = createAction(
  '[Order] Load Orders Failure',
  props<{ error: ApiErrorDto }>()
);

export const loadOrderById = createAction(
  '[Order] Load Order By Id',
  props<{ id: string }>()
);
export const loadOrderByIdSuccess = createAction(
  '[Order] Load Order By Id Success',
  props<{ order: OrderDto }>()
);
export const loadOrderByIdFailure = createAction(
  '[Order] Load Order By Id Failure',
  props<{ error: ApiErrorDto }>()
);

export const createOrder = createAction(
  '[Order] Create Order',
  props<{ order: CreateOrderDto }>()
);
export const createOrderSuccess = createAction(
  '[Order] Create Order Success',
  props<{ order: OrderDto }>()
);
export const createOrderFailure = createAction(
  '[Order] Create Order Failure',
  props<{ error: ApiErrorDto }>()
);

export const updateOrderStatus = createAction(
  '[Order] Update Order Status',
  props<{ id: string; status: UpdateOrderStatusDto }>()
);
export const updateOrderStatusSuccess = createAction(
  '[Order] Update Order Status Success',
  props<{ order: OrderDto }>()
);
export const updateOrderStatusFailure = createAction(
  '[Order] Update Order Status Failure',
  props<{ error: ApiErrorDto }>()
);

export const loadOrdersByStatus = createAction(
  '[Order] Load Orders By Status',
  props<{ status: OrderStatus }>()
);
export const loadOrdersByStatusSuccess = createAction(
  '[Order] Load Orders By Status Success',
  props<{ orders: OrderDto[] }>()
);
export const loadOrdersByStatusFailure = createAction(
  '[Order] Load Orders By Status Failure',
  props<{ error: ApiErrorDto }>()
);

export const loadOrdersByCustomerEmail = createAction(
  '[Order] Load Orders By Customer Email',
  props<{ email: string }>()
);
export const loadOrdersByCustomerEmailSuccess = createAction(
  '[Order] Load Orders By Customer Email Success',
  props<{ orders: OrderDto[] }>()
);
export const loadOrdersByCustomerEmailFailure = createAction(
  '[Order] Load Orders By Customer Email Failure',
  props<{ error: ApiErrorDto }>()
); 
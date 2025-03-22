import { createReducer, on } from '@ngrx/store';
import { OrderDto } from '../../models/order.dto';
import * as OrderActions from './order.actions';

export interface OrderState {
  orders: OrderDto[];
  selectedOrder: OrderDto | null;
  loading: boolean;
  error: any;
}

export const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null
};

export const orderReducer = createReducer(
  initialState,
  on(OrderActions.loadOrders, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(OrderActions.loadOrdersSuccess, (state, { paginatedOrders }) => ({
    ...state,
    orders: paginatedOrders.items,
    loading: false
  })),
  on(OrderActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(OrderActions.loadOrderById, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(OrderActions.loadOrderByIdSuccess, (state, { order }) => ({
    ...state,
    selectedOrder: order,
    loading: false
  })),
  on(OrderActions.loadOrderByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(OrderActions.createOrder, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(OrderActions.createOrderSuccess, (state, { order }) => ({
    ...state,
    orders: [...state.orders, order],
    loading: false
  })),
  on(OrderActions.createOrderFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(OrderActions.updateOrderStatus, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(OrderActions.updateOrderStatusSuccess, (state, { order }) => ({
    ...state,
    orders: state.orders.map(o => o.id === order.id ? order : o),
    selectedOrder: state.selectedOrder?.id === order.id ? order : state.selectedOrder,
    loading: false
  })),
  on(OrderActions.updateOrderStatusFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(OrderActions.loadOrdersByStatus, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(OrderActions.loadOrdersByStatusSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: false
  })),
  on(OrderActions.loadOrdersByStatusFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(OrderActions.loadOrdersByCustomerEmail, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(OrderActions.loadOrdersByCustomerEmailSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: false
  })),
  on(OrderActions.loadOrdersByCustomerEmailFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
); 
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from '../models/order.state';
import { OrderDto } from '../models/order.dto';
import { ApiErrorDto } from '../../../shared/models/api-error.dto';

export const selectOrderState = createFeatureSelector<OrderState>('order');

export const selectOrders = createSelector(
  selectOrderState,
  (state: OrderState) => state.orders
);

export const selectLoading = createSelector(
  selectOrderState,
  (state: OrderState) => state.loading
);

export const selectError = createSelector(
  selectOrderState,
  (state: OrderState) => state.error
);

export const selectOrdersByStatus = (status: number | null) => createSelector(
  selectOrders,
  (orders: OrderDto[]) => {
    if (status === null) {
      return orders;
    }
    return orders.filter(order => order.status === status);
  }
); 
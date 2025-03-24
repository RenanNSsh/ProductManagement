import { inject,Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError,map, mergeMap } from 'rxjs/operators';

import { OrderService } from '../services/order/order.service';
import * as OrderActions from './order.actions';

@Injectable()
export class OrderEffects {
  private readonly actions$ = inject(Actions);
  private readonly orderService = inject(OrderService);

  loadOrders$ = createEffect(() => 
    this.actions$.pipe(
      ofType(OrderActions.loadOrders),
      mergeMap(() =>
        this.orderService.getAllOrders().pipe(
          map(paginatedOrders => OrderActions.loadOrdersSuccess({ paginatedOrders })),
          catchError(error => of(OrderActions.loadOrdersFailure({ error })))
        )
      )
    )
  );

  loadOrderById$ = createEffect(() => 
    this.actions$.pipe(
      ofType(OrderActions.loadOrderById),
      mergeMap(({ id }) =>
        this.orderService.getOrderById(id).pipe(
          map(order => OrderActions.loadOrderByIdSuccess({ order })),
          catchError(error => of(OrderActions.loadOrderByIdFailure({ error })))
        )
      )
    )
  );

  createOrder$ = createEffect(() => 
    this.actions$.pipe(
      ofType(OrderActions.createOrder),
      mergeMap(({ order }) =>
        this.orderService.createOrder(order).pipe(
          map(createdOrder => OrderActions.createOrderSuccess({ order: createdOrder })),
          catchError(error => of(OrderActions.createOrderFailure({ error })))
        )
      )
    )
  );

  updateOrderStatus$ = createEffect(() => 
    this.actions$.pipe(
      ofType(OrderActions.updateOrderStatus),
      mergeMap(({ id, status }) =>
        this.orderService.updateOrderStatus(id, status).pipe(
          map(order => OrderActions.updateOrderStatusSuccess({ order })),
          catchError(error => of(OrderActions.updateOrderStatusFailure({ error })))
        )
      )
    )
  );

  loadOrdersByStatus$ = createEffect(() => 
    this.actions$.pipe(
      ofType(OrderActions.loadOrdersByStatus),
      mergeMap(({ status }) =>
        this.orderService.getOrdersByStatus(status).pipe(
          map(orders => OrderActions.loadOrdersByStatusSuccess({ orders })),
          catchError(error => of(OrderActions.loadOrdersByStatusFailure({ error })))
        )
      )
    )
  );

  loadOrdersByCustomerEmail$ = createEffect(() => 
    this.actions$.pipe(
      ofType(OrderActions.loadOrdersByCustomerEmail),
      mergeMap(({ email }) =>
        this.orderService.getOrdersByCustomerEmail(email).pipe(
          map(orders => OrderActions.loadOrdersByCustomerEmailSuccess({ orders })),
          catchError(error => of(OrderActions.loadOrdersByCustomerEmailFailure({ error })))
        )
      )
    )
  );
} 
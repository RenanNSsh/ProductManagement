import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OrderDto } from '../../models/order.dto';
import { OrderStatus } from '../../models/order-status.enum';
import * as OrderActions from '../../store/order/order.actions';
import { OrderState } from '../../store/order/order.reducer';

@Component({
  standalone: false,
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders$: Observable<OrderDto[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  orderStatuses = Object.values(OrderStatus).filter(value => typeof value === 'number');

  constructor(private store: Store<{ order: OrderState }>) {
    this.orders$ = this.store.select(state => state.order.orders);
    this.loading$ = this.store.select(state => state.order.loading);
    this.error$ = this.store.select(state => state.order.error);
  }

  ngOnInit(): void {
    this.loadAllOrders();
  }

  loadAllOrders(): void {
    this.store.dispatch(OrderActions.loadOrders());
  }

  loadOrdersByStatus(status: OrderStatus): void {
    this.store.dispatch(OrderActions.loadOrdersByStatus({ status }));
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    this.store.dispatch(OrderActions.updateOrderStatus({
      id: orderId,
      status: { status }
    }));
  }
} 
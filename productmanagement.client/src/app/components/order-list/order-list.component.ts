import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { OrderDto } from '../../models/order.dto';
import { OrderStatus } from '../../models/order-status.enum';
import * as OrderActions from '../../store/order/order.actions';
import { OrderState } from '../../store/order/order.reducer';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SkeletonLoaderComponent
  ],
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders$: Observable<OrderDto[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  orderStatuses = Object.values(OrderStatus).filter(value => typeof value === 'number');
  selectedStatus: OrderStatus | null = null;

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

  onStatusChange(event: Event): void {
    if (this.selectedStatus === null) {
      this.loadAllOrders();
    } else {
      this.loadOrdersByStatus(this.selectedStatus);
    }
  }

  loadOrdersByStatus(status: OrderStatus): void {
    this.store.dispatch(OrderActions.loadOrdersByStatus({ status }));
  }

  updateOrderStatus(orderId: string, event: Event): void {
    const select = event.target as HTMLSelectElement;
    const status = Number(select.value) as OrderStatus;
    this.store.dispatch(OrderActions.updateOrderStatus({
      id: orderId,
      status: { status }
    }));
  }

  getStatusLabel(status: OrderStatus): string {
    return OrderStatus[status];
  }
} 
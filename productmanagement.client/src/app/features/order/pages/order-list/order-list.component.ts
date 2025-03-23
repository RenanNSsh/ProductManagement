import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { ApiErrorDto } from '../../../../shared/models/api-error.dto';
import { OrderDto } from '../../models/order.dto';
import { OrderState } from '../../models/order.state';
import { OrderStatus } from '../../models/order-status.enum';
import * as OrderActions from '../../store/order.actions';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  imports: [
    CommonModule,
    FormsModule,
    SkeletonLoaderComponent
  ],
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders$: Observable<OrderDto[]>;
  loading$: Observable<boolean>;
  error$: Observable<ApiErrorDto | null>;
  orderStatuses = Object.values(OrderStatus).filter(value => typeof value === 'number');
  selectedStatus: OrderStatus | null = null;
  private signalRSubscription: Subscription = new Subscription();
  private newOrderSubscription: Subscription = new Subscription();

  constructor(
    private store: Store<{ order: OrderState }>,
    private signalRService: SignalRService
  ) {
    this.orders$ = this.store.select(state => state.order.orders);
    this.loading$ = this.store.select(state => state.order.loading);
    this.error$ = this.store.select(state => state.order.error);
  }

  ngOnInit(): void {
    this.loadAllOrders();
    this.setupSignalR();
  }

  ngOnDestroy(): void {
    if (this.signalRSubscription) {
      this.signalRSubscription.unsubscribe();
    }
    if (this.newOrderSubscription) {
      this.newOrderSubscription.unsubscribe();
    }
    this.signalRService.disconnect();
  }

  private setupSignalR(): void {
    // Handle order updates
    this.signalRSubscription = this.signalRService.getOrderUpdates()
      .subscribe(order => {
        if (order) {
          this.refreshOrders();
        }
      });

    // Handle new orders
    this.newOrderSubscription = this.signalRService.getOrderCreated()
      .subscribe(order => {
        if (order) {
          // Only refresh if we're not filtering or if the new order matches our filter
          if (this.selectedStatus === null || order.status === this.selectedStatus) {
            this.refreshOrders();
          }
        }
      });
  }

  private refreshOrders(): void {
    if (this.selectedStatus === null) {
      this.loadAllOrders();
    } else {
      this.loadOrdersByStatus(this.selectedStatus);
    }
  }

  loadAllOrders(): void {
    this.store.dispatch(OrderActions.loadOrders());
  }

  onStatusChange(_event: Event): void {
    this.refreshOrders();
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
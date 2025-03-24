import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    ReactiveFormsModule,
    SkeletonLoaderComponent
  ],
  styleUrls: ['./order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders$: Observable<OrderDto[]>;
  loading$: Observable<boolean>;
  error$: Observable<ApiErrorDto | null>;
  orderStatuses = Object.values(OrderStatus).filter(value => typeof value === 'number');
  filterForm: FormGroup;
  private signalRSubscription: Subscription = new Subscription();
  private newOrderSubscription: Subscription = new Subscription();
  private statusFilterSubscription: Subscription = new Subscription();

  constructor(
    private store: Store<{ order: OrderState }>,
    private signalRService: SignalRService,
    private fb: FormBuilder
  ) {
    this.orders$ = this.store.select(state => state.order.orders);
    this.loading$ = this.store.select(state => state.order.loading);
    this.error$ = this.store.select(state => state.order.error);
    
    this.filterForm = this.fb.group({
      status: [null]
    });

    // Subscribe to status changes
    const statusControl = this.filterForm.get('status');
    if (statusControl) {
      this.statusFilterSubscription = statusControl.valueChanges.subscribe(status => {
        if (status === null) {
          this.loadAllOrders();
        } else {
          this.loadOrdersByStatus(status);
        }
      });
    }
  }

  ngOnInit(): void {
    this.loadAllOrders();
    this.setupSignalR();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.signalRSubscription.unsubscribe();
    this.newOrderSubscription.unsubscribe();
    this.statusFilterSubscription.unsubscribe();
    this.signalRService.disconnect();
  }

  setupSignalR(): void {
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
          const currentStatus = this.filterForm.get('status')?.value;
          // Only refresh if we're not filtering or if the new order matches our filter
          if (currentStatus === null || order.status === currentStatus) {
            this.refreshOrders();
          }
        }
      });
  }

  private refreshOrders(): void {
    const status = this.filterForm.get('status')?.value;
    if (status === null) {
      this.loadAllOrders();
    } else {
      this.loadOrdersByStatus(status);
    }
  }

  loadAllOrders(): void {
    this.store.dispatch(OrderActions.loadOrders());
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
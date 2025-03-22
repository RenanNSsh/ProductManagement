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
  template: `
    <div class="container">
      <h2>Orders</h2>
      
      <div class="filters">
        <button (click)="loadAllOrders()">All Orders</button>
        <button *ngFor="let status of orderStatuses" 
                (click)="loadOrdersByStatus(status)">
          {{status}}
        </button>
      </div>

      <div *ngIf="loading$ | async" class="loading">
        Loading...
      </div>

      <div *ngIf="error$ | async as error" class="error">
        {{error}}
      </div>

      <div class="orders-grid">
        <div *ngFor="let order of orders$ | async" class="order-card">
          <h3>Order #{{order.id}}</h3>
          <p>Customer: {{order.customerName}}</p>
          <p>Email: {{order.customerEmail}}</p>
          <p>Status: {{order.status}}</p>
          <p>Total: $ {{order.totalAmount}}</p>
          <p>Date: {{order.orderDate | date}}</p>
          
          <div class="order-items">
            <h4>Items:</h4>
            <ul>
              <li *ngFor="let item of order.orderItems">
                {{item.productName}} x {{item.quantity}} - $ {{item.totalPrice}}
              </li>
            </ul>
          </div>

          <div class="actions">
            <select [(ngModel)]="order.status" 
                    (change)="updateOrderStatus(order.id, order.status)">
              <option *ngFor="let status of orderStatuses" [value]="status">
                {{status}}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }

    .filters {
      margin-bottom: 20px;
    }

    .filters button {
      margin-right: 10px;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
    }

    .filters button:hover {
      background-color: #0056b3;
    }

    .loading {
      text-align: center;
      padding: 20px;
    }

    .error {
      color: red;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid red;
      border-radius: 4px;
    }

    .orders-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .order-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .order-card h3 {
      margin-top: 0;
      color: #333;
    }

    .order-items {
      margin: 15px 0;
    }

    .order-items ul {
      list-style: none;
      padding: 0;
    }

    .order-items li {
      padding: 5px 0;
      border-bottom: 1px solid #eee;
    }

    .actions {
      margin-top: 15px;
    }

    .actions select {
      width: 100%;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
  `]
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
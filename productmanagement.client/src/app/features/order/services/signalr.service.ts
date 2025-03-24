import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { OrderDto } from '../models/order.dto';
import { OrderStatus } from '../models/order-status.enum';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  private orderUpdates = new BehaviorSubject<OrderDto | null>(null);
  private orderCreated = new BehaviorSubject<OrderDto | null>(null);

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/orderHub`)
      .withAutomaticReconnect()
      .build();

    this.startConnection();
  }

  private startConnection() {
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected!');
        this.joinOrderStatusGroups();
      })
      .catch(err => console.error('Error while establishing connection: ' + err));

    this.hubConnection.on('OrderStatusUpdated', (order: OrderDto) => {
      this.orderUpdates.next(order);
    });

    this.hubConnection.on('OrderCreated', (order: OrderDto) => {
      this.orderCreated.next(order);
    });
  }

  private joinOrderStatusGroups() {
    // Join groups for all order statuses
    Object.values(OrderStatus)
      .filter(value => typeof value === 'number')
      .forEach(status => {
        this.hubConnection.invoke('JoinOrderStatusGroup', status);
      });
  }

  public getOrderUpdates() {
    return this.orderUpdates.asObservable();
  }

  public getOrderCreated() {
    return this.orderCreated.asObservable();
  }

  public disconnect() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
} 
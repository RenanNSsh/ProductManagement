import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { PaginatedResponseDTO } from '../../../shared/models/paginated-reponse.dto';
import { CreateOrderDto } from './create-order.dto';
import { OrderDto } from './order.dto';
import { OrderStatus } from './order-status.enum';
import { UpdateOrderStatusDto } from './update-order-status.dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/api/orders`;

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<PaginatedResponseDTO<OrderDto>> {
    return this.http.get<PaginatedResponseDTO<OrderDto>>(this.apiUrl);
  }

  getOrderById(id: string): Observable<OrderDto> {
    return this.http.get<OrderDto>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: CreateOrderDto): Observable<OrderDto> {
    return this.http.post<OrderDto>(this.apiUrl, order);
  }

  updateOrderStatus(id: string, status: UpdateOrderStatusDto): Observable<OrderDto> {
    return this.http.put<OrderDto>(`${this.apiUrl}/${id}/status`, status);
  }

  getOrdersByStatus(status: OrderStatus): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/status/${status}`);
  }

  getOrdersByCustomerEmail(email: string): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/customer/${email}`);
  }
} 
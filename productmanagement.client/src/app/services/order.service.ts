import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDto, CreateOrderDto, UpdateOrderStatusDto, PaginatedResponseDTO } from '../models/order.dto';
import { OrderStatus } from '../models/order-status.enum';
import { environment } from '../../environments/environment';

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
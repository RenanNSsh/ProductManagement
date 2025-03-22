import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDto } from '../models/product.dto';
import { PaginatedResponseDTO } from '../models/order.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<PaginatedResponseDTO<ProductDto>> {
    return this.http.get<PaginatedResponseDTO<ProductDto>>(this.apiUrl);
  }
} 
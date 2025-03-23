import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PaginatedResponseDTO } from '../../shared/models/paginated-reponse.dto';
import { ProductDto } from './product.dto';

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
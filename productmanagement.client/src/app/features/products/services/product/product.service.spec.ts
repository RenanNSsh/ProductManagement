import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import { PaginatedResponseDTO } from '../../../shared/models/paginated-reponse.dto';
import { ProductDto } from '../models/product.dto';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products', () => {
    const mockProducts: PaginatedResponseDTO<ProductDto> = {
      items: [
        {
          id: '1',
          name: 'Test Product',
          description: 'Test Description',
          price: 100,
          stock: 10,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false
    };

    service.getProducts().subscribe(response => {
      expect(response).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });
}); 
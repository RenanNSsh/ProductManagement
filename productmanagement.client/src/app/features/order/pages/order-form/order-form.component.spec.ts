import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

import { ProductDto } from '../../../products/models/product.dto';
import { ProductService } from '../../../products/services/product.service';
import { OrderFormComponent } from './order-form.component';

describe('OrderFormComponent', () => {
  let component: OrderFormComponent;
  let fixture: ComponentFixture<OrderFormComponent>;
  let store: jasmine.SpyObj<Store>;
  let toastr: jasmine.SpyObj<ToastrService>;

  const mockProducts: ProductDto[] = [
    {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success']);

    storeSpy.select.and.returnValue(of(null));
    productServiceSpy.getProducts.and.returnValue(of({
      items: mockProducts,
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false
    }));

    await TestBed.configureTestingModule({
      imports: [OrderFormComponent],
      providers: [
        FormBuilder,
        { provide: Store, useValue: storeSpy },
        { provide: ProductService, useValue: productServiceSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.orderForm.get('customerName')?.value).toBe('');
    expect(component.orderForm.get('customerEmail')?.value).toBe('');
    expect(component.orderItems.length).toBe(1);
  });

  it('should load products on init', () => {
    component.products$.subscribe(products => {
      expect(products).toEqual(mockProducts);
    });
  });

  it('should add order item', () => {
    component.addOrderItem();
    expect(component.orderItems.length).toBe(2);
  });

  it('should remove order item if more than one exists', () => {
    component.addOrderItem();
    component.removeOrderItem(0);
    expect(component.orderItems.length).toBe(1);
  });

  it('should not remove order item if only one exists', () => {
    component.removeOrderItem(0);
    expect(component.orderItems.length).toBe(1);
  });

  it('should submit form when valid', fakeAsync(() => {
    const formValue = {
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      orderItems: [
        {
          productId: '1',
          quantity: 2
        }
      ]
    };

    // Set form values
    component.orderForm.patchValue(formValue);
    fixture.detectChanges();

    // Submit form
    component.onSubmit();
    tick(); // Wait for the next tick to ensure form reset is complete
    fixture.detectChanges();

    // Verify store dispatch and toastr
    expect(store.dispatch).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalled();

    // Verify form reset
    expect(component.orderForm.get('customerName')?.value).toBe(null);
    expect(component.orderForm.get('customerEmail')?.value).toBe(null);
    expect(component.orderItems.length).toBe(1);
    expect(component.orderItems.at(0).get('productId')?.value).toBe('');
    expect(component.orderItems.at(0).get('quantity')?.value).toBe(1);
  }));

  it('should not submit form when invalid', () => {
    component.onSubmit();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(toastr.success).not.toHaveBeenCalled();
  });
}); 
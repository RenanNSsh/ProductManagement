import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProductDto } from '../../models/product.dto';
import { CreateOrderDto, CreateOrderItemDto, PaginatedResponseDTO } from '../../models/order.dto';
import * as OrderActions from '../../store/order/order.actions';
import { OrderState } from '../../store/order/order.reducer';
import { ProductService } from '../../services/product.service';

@Component({
  standalone: false,
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  products$: Observable<PaginatedResponseDTO<ProductDto>>;
  error$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ order: OrderState }>,
    private productService: ProductService
  ) {
    this.orderForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      orderItems: this.fb.array([], Validators.required)
    });

    this.error$ = this.store.select(state => state.order.error);
    this.products$ = this.productService.getProducts();
  }

  ngOnInit(): void {
    // Add initial order item
    this.addOrderItem();
  }

  get orderItems() {
    return this.orderForm.get('orderItems') as FormArray;
  }

  addOrderItem(): void {
    const orderItem = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.orderItems.push(orderItem);
  }

  removeOrderItem(index: number): void {
    if (this.orderItems.length > 1) {
      this.orderItems.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.value;
      const order: CreateOrderDto = {
        customerName: formValue.customerName,
        customerEmail: formValue.customerEmail,
        orderItems: formValue.orderItems.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      this.store.dispatch(OrderActions.createOrder({ order }));
      this.orderForm.reset();
      this.orderItems.clear();
      this.addOrderItem();
    }
  }
} 
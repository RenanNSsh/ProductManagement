import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { ApiErrorDto } from '../../../../shared/models/api-error.dto';
import { ProductDto } from '../../../products/models/product.dto';
import { ProductService } from '../../../products/services/product.service';
import { CreateOrderDto } from '../../models/create-order.dto';
import { OrderState } from '../../models/order.state';
import { OrderItemDto } from '../../models/order-item.dto';
import * as OrderActions from '../../store/order.actions';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  products$: Observable<ProductDto[]>;
  error$: Observable<ApiErrorDto | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ order: OrderState }>,
    private productService: ProductService,
    private toastr: ToastrService
  ) {
    this.orderForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      orderItems: this.fb.array([], Validators.required)
    });

    this.error$ = this.store.select(state => state.order.error);
    this.products$ = this.productService.getProducts().pipe(
      map(response => response.items)
    );
  }

  ngOnInit(): void {
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
        orderItems: formValue.orderItems.map((item: OrderItemDto) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      this.store.dispatch(OrderActions.createOrder({ order }));
      this.orderForm.reset();
      this.orderItems.clear();
      this.addOrderItem();
      this.toastr.success('Order created successfully!', 'Success');
    }
  }
} 
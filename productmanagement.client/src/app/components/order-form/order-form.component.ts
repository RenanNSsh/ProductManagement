import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProductDto } from '../../models/product.dto';
import { CreateOrderDto, CreateOrderItemDto } from '../../models/order.dto';
import * as OrderActions from '../../store/order/order.actions';
import { OrderState } from '../../store/order/order.reducer';

@Component({
  standalone: false,
  selector: 'app-order-form',
  template: `
    <div class="container">
      <h2>Create New Order</h2>

      <form [formGroup]="orderForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="customerName">Customer Name</label>
          <input type="text" 
                 id="customerName" 
                 formControlName="customerName" 
                 class="form-control">
        </div>

        <div class="form-group">
          <label for="customerEmail">Customer Email</label>
          <input type="email" 
                 id="customerEmail" 
                 formControlName="customerEmail" 
                 class="form-control">
        </div>

        <div formArrayName="orderItems">
          <h3>Order Items</h3>
          <div *ngFor="let item of orderItems.controls; let i=index" [formGroupName]="i">
            <div class="order-item">
              <div class="form-group">
                <label [for]="'productId' + i">Product</label>
                <select [id]="'productId' + i" 
                        formControlName="productId" 
                        class="form-control">
                  <option value="">Select a product</option>
                  <option *ngFor="let product of products$ | async" 
                          [value]="product.id">
                    {{product.name}} - $ {{product.price}}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label [for]="'quantity' + i">Quantity</label>
                <input type="number" 
                       [id]="'quantity' + i" 
                       formControlName="quantity" 
                       class="form-control">
              </div>

              <button type="button" 
                      (click)="removeOrderItem(i)" 
                      class="btn btn-danger">
                Remove
              </button>
            </div>
          </div>

          <button type="button" 
                  (click)="addOrderItem()" 
                  class="btn btn-secondary">
            Add Item
          </button>
        </div>

        <button type="submit" 
                [disabled]="!orderForm.valid" 
                class="btn btn-primary">
          Create Order
        </button>
      </form>

      <div *ngIf="error$ | async as error" class="error">
        {{error}}
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .order-item {
      display: grid;
      grid-template-columns: 2fr 1fr auto;
      gap: 15px;
      align-items: end;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    .error {
      color: red;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid red;
      border-radius: 4px;
    }
  `]
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  products$: Observable<ProductDto[]> = new Observable<ProductDto[]>();
  error$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ order: OrderState }>
  ) {
    this.orderForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      orderItems: this.fb.array([], Validators.required)
    });

    this.error$ = this.store.select(state => state.order.error);
  }

  ngOnInit(): void {
    // Load products from store
    // this.products$ = this.store.select(state => state.product.products);
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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MemoizedSelector } from '@ngrx/store';
import { of } from 'rxjs';

import { OrderDto } from '../../models/order.dto';
import { OrderStatus } from '../../models/order-status.enum';
import { SignalRService } from '../../services/signalr/signalr.service';
import { selectError, selectLoading, selectOrders } from '../../store/order.selectors';
import { OrderListComponent } from './order-list.component';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let store: jasmine.SpyObj<Store>;
  let signalRService: jasmine.SpyObj<SignalRService>;

  const mockOrders: OrderDto[] = [
    {
      id: '1',
      orderDate: new Date(),
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      totalAmount: 100,
      status: OrderStatus.Pending,
      orderItems: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    const signalRSpy = jasmine.createSpyObj('SignalRService', ['getOrderUpdates', 'getOrderCreated', 'disconnect']);

    storeSpy.select.and.callFake((selector: MemoizedSelector<object, unknown>) => {
      if (selector === selectOrders) {
        return of(mockOrders);
      }
      if (selector === selectLoading) {
        return of(false);
      }
      if (selector === selectError) {
        return of(null);
      }
      return of(null);
    });
    signalRSpy.getOrderUpdates.and.returnValue(of(null));
    signalRSpy.getOrderCreated.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [OrderListComponent, ReactiveFormsModule],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: SignalRService, useValue: signalRSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    signalRService = TestBed.inject(SignalRService) as jasmine.SpyObj<SignalRService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with orders', () => {
    expect(component.orders$).toBeDefined();
    component.orders$.subscribe(orders => {
      expect(orders).toEqual(mockOrders);
    });
  });

  it('should initialize filter form', () => {
    expect(component.filterForm).toBeDefined();
    expect(component.filterForm.get('status')).toBeDefined();
    expect(component.filterForm.get('status')?.value).toBeNull();
  });

  it('should load all orders on init', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should load orders by status when filter changes', () => {
    const statusControl = component.filterForm.get('status');
    statusControl?.setValue(OrderStatus.Pending);
    expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
      type: '[Order] Load Orders By Status',
      status: OrderStatus.Pending
    }));
  });

  it('should load all orders when filter is cleared', () => {
    const statusControl = component.filterForm.get('status');
    statusControl?.setValue(null);
    expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
      type: '[Order] Load Orders'
    }));
  });

  it('should update order status', () => {
    const event = { target: { value: OrderStatus.Processing } } as unknown as Event;
    component.updateOrderStatus('1', event);
    expect(store.dispatch).toHaveBeenCalledWith(jasmine.objectContaining({
      type: '[Order] Update Order Status',
      id: '1',
      status: { status: OrderStatus.Processing }
    }));
  });

  it('should get status label', () => {
    const label = component.getStatusLabel(OrderStatus.Pending);
    expect(label).toBe('Pending');
  });

  it('should refresh orders when receiving SignalR updates', () => {
    const mockOrder = { ...mockOrders[0], status: OrderStatus.Processing };
    signalRService.getOrderUpdates.and.returnValue(of(mockOrder));
    
    component.setupSignalR();
    fixture.detectChanges();
    
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should refresh orders when receiving new orders via SignalR', () => {
    const mockOrder = { ...mockOrders[0], status: OrderStatus.Pending };
    signalRService.getOrderCreated.and.returnValue(of(mockOrder));
    
    component.setupSignalR();
    fixture.detectChanges();
    
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should cleanup all subscriptions on destroy', () => {
    const unsubscribeSpy = spyOn(component['signalRSubscription'], 'unsubscribe');
    const newOrderUnsubscribeSpy = spyOn(component['newOrderSubscription'], 'unsubscribe');
    const statusFilterUnsubscribeSpy = spyOn(component['statusFilterSubscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(newOrderUnsubscribeSpy).toHaveBeenCalled();
    expect(statusFilterUnsubscribeSpy).toHaveBeenCalled();
    expect(signalRService.disconnect).toHaveBeenCalled();
  });
}); 
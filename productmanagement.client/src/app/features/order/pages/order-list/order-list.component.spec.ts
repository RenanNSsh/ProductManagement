import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { OrderListComponent } from './order-list.component';
import { OrderStatus } from '../../models/order-status.enum';
import { OrderDto } from '../../models/order.dto';
import { ApiErrorDto } from '../../../../shared/models/api-error.dto';
import { SignalRService } from '../../services/signalr.service';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { FormsModule } from '@angular/forms';

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

    storeSpy.select.and.returnValue(of(mockOrders));
    signalRSpy.getOrderUpdates.and.returnValue(of(null));
    signalRSpy.getOrderCreated.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [OrderListComponent, FormsModule],
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

  it('should load all orders on init', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should handle status change', () => {
    const event = { target: { value: OrderStatus.Pending } } as unknown as Event;
    component.onStatusChange(event);
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should update order status', () => {
    const event = { target: { value: OrderStatus.Processing } } as unknown as Event;
    component.updateOrderStatus('1', event);
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should get status label', () => {
    const label = component.getStatusLabel(OrderStatus.Pending);
    expect(label).toBe('Pending');
  });

  it('should cleanup subscriptions on destroy', () => {
    component.ngOnDestroy();
    expect(signalRService.disconnect).toHaveBeenCalled();
  });
}); 
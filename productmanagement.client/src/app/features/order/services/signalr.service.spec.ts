import { TestBed } from '@angular/core/testing';
import { SignalRService } from './signalr.service';
import { OrderDto } from '../models/order.dto';
import { OrderStatus } from '../models/order-status.enum';
import { environment } from '../../../../environments/environment';

describe('SignalRService', () => {
  let service: SignalRService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignalRService]
    });
    service = TestBed.inject(SignalRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return order updates observable', () => {
    const orderUpdates$ = service.getOrderUpdates();
    expect(orderUpdates$).toBeDefined();
  });

  it('should return order created observable', () => {
    const orderCreated$ = service.getOrderCreated();
    expect(orderCreated$).toBeDefined();
  });

  it('should disconnect from hub', () => {
    service.disconnect();
    // No error should be thrown
  });
}); 
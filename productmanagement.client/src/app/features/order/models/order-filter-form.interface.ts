import { FormControl } from '@angular/forms';
import { OrderStatus } from './order-status.enum';

export interface OrderFilterForm {
  status: FormControl<OrderStatus | null>;
} 
import { Routes } from '@angular/router';

import { OrderFormComponent } from './features/order/pages/order-form/order-form.component';
import { OrderListComponent } from './features/order/pages/order-list/order-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  { path: 'orders', component: OrderListComponent },
  { path: 'orders/new', component: OrderFormComponent }
];

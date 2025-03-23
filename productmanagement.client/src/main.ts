import { provideHttpClient } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { AppComponent } from './app/app.component';
import { routes } from './app/app-routes';
import { OrderEffects } from './app/features/order/store/order.effects';
import { orderReducer } from './app/features/order/store/order.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideStore({ order: orderReducer }),
    provideEffects([OrderEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode()
    }),
    provideHttpClient()
  ]
}).catch(err => console.error(err));

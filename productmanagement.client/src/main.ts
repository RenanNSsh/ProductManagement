import { provideHttpClient } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideToastr } from 'ngx-toastr';

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
    provideHttpClient(),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true
    }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
  ]
}).catch(err => console.error(err));

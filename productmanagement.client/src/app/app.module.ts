import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { orderReducer } from './store/order/order.reducer';
import { OrderEffects } from './store/order/order.effects';
import { OrderService } from './services/order.service';
import { ProductService } from './services/product.service';

@NgModule({
  declarations: [
    AppComponent,
    OrderListComponent,
    OrderFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ order: orderReducer }),
    EffectsModule.forRoot([OrderEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode()
    }),
    AppRoutingModule
  ],
  providers: [OrderService, ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }

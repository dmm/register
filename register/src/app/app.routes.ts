import { Routes } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoginComponent } from './login/login.component';
import { PointOfSaleComponent } from './point-of-sale/point-of-sale.component';

export const routes: Routes = [
  { path: 'checkout', component: CheckoutComponent },
  { path: 'pointofsale', component: PointOfSaleComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

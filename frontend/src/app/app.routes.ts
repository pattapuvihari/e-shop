import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { CartComponent } from './components/cart/cart';
import { ProductDetailsComponent } from './components/product-details/product-details';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'cart', component: CartComponent },
    { path: 'product/:id', component: ProductDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
    { path: '**', redirectTo: '' }
];

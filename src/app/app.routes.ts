import { Routes } from '@angular/router';
import { AppLayoutComponent } from '../app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: AppLayoutComponent,
  },
  {
    path: 'newProduct',
    loadComponent: () =>
      import('../components/product-form/product-form.component').then(
        (m) => m.ProductFormComponent,
      ),
  },
  {
    path: 'editProduct/:id',
    loadComponent: () =>
      import('../components/product-form/product-form.component').then(
        (m) => m.ProductFormComponent,
      ),
  },
  {
    path: 'modal',
    loadComponent: () =>
      import('../components/product-remove/product-remove.component').then(
        (m) => m.ProductRemoveComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

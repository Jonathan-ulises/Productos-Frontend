import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { AddEditProductsComponent } from './pages/add-edit-products/add-edit-products.component';

const routes: Routes = [
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'addProduct',
    component: AddEditProductsComponent
  },
  {
    path: 'editProduct/:id',
    component: AddEditProductsComponent
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

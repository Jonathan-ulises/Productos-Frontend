import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product, TypeProduct } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import Swal from 'sweetalert2';

/**
 * ## ProductsComponent
 *
 * Componente para mostrar productos y poder
 * buscarlos. Tambien muestra las acciones de editar,
 * eliminar y editar productos.
 *
 * @author Jonathan Sanchez
 */
@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {

  public listTypeProduct: TypeProduct[] = [];
  public listProducts: Product[] = [];

  public keySearch: string | null = null;
  public typeProductIdSearch: number | null = null;

  constructor(private _productService: ProductsService, private _router: Router) {
    this.requestFromServer();
  }

  requestFromServer(): void {
    this.getAllTypesProduct();
    this.getAllProducts();
  }

  getAllTypesProduct() {
    this._productService.getTypeProduct().subscribe({
      next: ({ok, result}) => {
        if (ok) {
          this.listTypeProduct = result;
        }
      },
      error: console.error,
      complete: () => { console.log(this.listTypeProduct) }
    });
  }

  getAllProducts(): void {
    this._productService.getAllProducts().subscribe({
      next: ({ok, result}) => {
        if (ok) {
          this.listProducts = result;
        }
      },
      error: console.error,
      complete: () => { console.log(this.listProducts) }
    });
  }

  toSaveProductPage(): void {
    this._router.navigate(['/addProduct'])
  }

  toEditProductPage(selectedItem: Product): void {
    this._router.navigate(['/editProduct', selectedItem.idProduct])
  }

  toEliminateProduct(selectedItem: Product): void {
    Swal.fire({
      text: '¿Eliminar producto?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(({isConfirmed}) => {
      if (isConfirmed) {
        this._productService.deleteProduct(selectedItem.idProduct!)
          .subscribe({
            next: ({ok}) => {
              if (ok) {
                Swal.fire({
                  text: 'Eliminacion exitosa',
                  icon: 'success',
                });
                this.getAllProducts();
              }
            },
            error: (err) => {
              console.error(err);
              Swal.fire({
                text: 'Eliminar producto fallo',
                icon: 'error',
              });
            }
          })
      }
    });
  }

  search(): void {
    this._productService.searchProduct(this.keySearch?.toUpperCase()!, this.typeProductIdSearch!)
      .subscribe({
        next: ({ok, result}) => {
          if (ok) {
            this.listProducts = result;
          }
        },
        error: console.error
      });
  }

  clearSearch(): void {
    this.keySearch = null;
    this.typeProductIdSearch = null;
    this.getAllProducts();
  }
}

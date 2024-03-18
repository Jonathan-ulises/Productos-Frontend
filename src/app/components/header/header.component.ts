import { Component } from '@angular/core';
import { ActivationStart, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AddEditProductsComponent } from 'src/app/pages/add-edit-products/add-edit-products.component';
import { ProductsComponent } from 'src/app/pages/products/products.component';

/**
 * ## HeaderComponent
 *
 * Componente para mostrar el encabezado de la pagina
 * con el titulo correspondiente al componente mostrado
 * en el navegador.
 *
 * @author Jonathan Sanchez
 */
@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  public titleHeader: string = "";

  constructor(private _router: Router) {
    console.log(this._router.url)

    this._router.events
      .pipe(filter(event => event instanceof ActivationStart))
      .subscribe({
        next: (value) => {
          console.log(value)
          const { snapshot: routeInfo } = value as ActivationStart;
          switch (routeInfo.component) {
            case ProductsComponent:
              this.titleHeader = "Lista de Productos"
              break;
            case AddEditProductsComponent:
              this.titleHeader = routeInfo.url.length > 1 ? "Editar Producto" : "Agregar Producto"
              break;
          }
        }
      });
  }


}

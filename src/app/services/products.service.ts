import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResultWS } from '../models/response.model';
import { Product, Supplier, SupplierProductAdd, TypeProduct } from '../models/product.model';

/**
 * ## ProductsService
 *
 * Servicio que contiene metodos para hacer
 * peticiones al servidor relacionadas al producto.
 * Consulta de tipos de productos, proveedores registrados,
 * productos y proveedores relacionados a productos.
 *
 * Servicio configurado para proveer a todo elemento que
 * lo injecte.
 *
 * @author Jonathan Sanchez
 */
@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private BASE_URL = `${environment.BASE_URL}/products`

  constructor(private _http: HttpClient) { }

  /**
   * Request all types product from server.
   * @returns Observable of types product.
   */
  getTypeProduct(): Observable<ResultWS<TypeProduct[]>> {
    return this._http.get<ResultWS<TypeProduct[]>>(`${this.BASE_URL}/typeProducts`)
  }

  /**
   * Request all products from server.
   * @returns Observable of list products.
   */
  getAllProducts(): Observable<ResultWS<Product[]>> {
    return this._http.get<ResultWS<Product[]>>(`${this.BASE_URL}/getAll`);
  }

  /**
   * Request product by Id from server.
   * @param idProduct {@link number} Id of producto to search in server.
   * @returns Observable of product.
   */
  getProductById(idProduct: number): Observable<ResultWS<Product>> {
    return this._http.post<ResultWS<Product>>(`${this.BASE_URL}/findById`, { idProduct });
  }

  /**
   * Request all suppliers from server
   * @returns Observable of list suppliers.
   */
  getAllSuppliers(): Observable<ResultWS<Supplier[]>> {
    return this._http.get<ResultWS<Supplier[]>>(`${this.BASE_URL}/suppliers`);
  }

  /**
   * Request to save a product in server.
   * @param product {@link Product} Producto to save.
   * @returns Observable of product saved
   */
  saveProduct(product: Product): Observable<ResultWS<Product>> {
    return this._http.post<ResultWS<Product>>(`${this.BASE_URL}/create`, product);
  }

  /**
   * Request to update a producto from server.
   * @param product {@link Product} Producto to update.
   * @returns Observable of product updated.
   */
  editProduct(product: Product): Observable<ResultWS<Product>> {
    return this._http.post<ResultWS<Product>>(`${this.BASE_URL}/update`, product);
  }

  /**
   * Request to delete a product from server.
   * @param idProduct {@link number} Id of product to delete from server.
   * @returns Observable result of deleted product.
   */
  deleteProduct(idProduct: number): Observable<ResultWS<string>> {
    return this._http.post<ResultWS<string>>(`${this.BASE_URL}/delete`, { idProduct })
  }


  /**
   * Request to add many suppliers to product.
   * @param suppliersToAdd {@link SupplierProductAdd[]} Supplier list to add a product.
   * @returns Observable result of added supplier to product.
   */
  addSupplierToProduct(suppliersToAdd: SupplierProductAdd[]): Observable<ResultWS<string>> {
    return this._http.post<ResultWS<string>>(`${this.BASE_URL}/addProductToSupplier`, suppliersToAdd)
  }

  /**
   * Request list suppliert of producto from server.
   * @param idProduct {@link number} Id of product to request his suppliers.
   * @returns Observable of list suppliers of product.
   */
  getAllSupplierOfProduct(idProduct: number): Observable<ResultWS<SupplierProductAdd[]>> {
    return this._http.post<ResultWS<SupplierProductAdd[]>>(`${this.BASE_URL}/getSuppliersProducts`, { idProduct });
  }

  /**
   * Request to add, edit or delete suppliers of products from server.
   * @param suppliersToAdd {@link SupplierProductAdd[]} Suppliers of product.
   * @returns Observable of request.
   */
  editSuppliersProduct(suppliersToAdd: SupplierProductAdd[]): Observable<ResultWS<string>> {
    return this._http.post<ResultWS<string>>(`${this.BASE_URL}/uploadProductToSupplier`, suppliersToAdd);
  }

  /**
   * Request a product searching by name and type product id from server.
   * @param name {@link string} Name of product.
   * @param typeProductId {@link number} Type product Id of product.
   * @returns Observable of request.
   */
  searchProduct(key: string | null, typeProductId: number | null): Observable<ResultWS<Product[]>> {
    return this._http.post<ResultWS<Product[]>>(`${this.BASE_URL}/searchBykeyAndTypeProduct`, { key, typeProductId })
  }
}

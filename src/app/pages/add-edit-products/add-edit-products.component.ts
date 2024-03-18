import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Product, Supplier, SupplierProductAdd, TypeProduct } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import Swal from 'sweetalert2';

/**
 * ## AddEditProductsComponent
 *
 * Componente para realizar los procesos de guardado
 * y edicion de productos. Tambien permite
 * la gestion de agregar, editar o eliminar
 * proveedores relacionados al producto
 *
 * @author Jonathan Sanchez
 */
@Component({
  selector: 'add-edit-products',
  templateUrl: './add-edit-products.component.html',
  styleUrls: ['./add-edit-products.component.css']
})
export class AddEditProductsComponent {

  public listTypeProduct: TypeProduct[] = [];
  public listSupplier: Supplier[] = [];
  public listSupplierProduct: SupplierProductAdd[] = [];
  public listSupplierProductRemoved: SupplierProductAdd[] = [];

  private selectedSuplierProductId: number = 0;
  public isEditionSupplier: boolean = false;
  public buttonProcessText: string = "Guardar";
  public idProductToEdit: number = 0;

  public formSupplier: FormGroup = new FormGroup({
    supplier:   new FormControl<Supplier | null>(null),
    productKey: new FormControl<string | null>(null),
    cost:       new FormControl<number | null>(null)
  });

  public formProduct: FormGroup = new FormGroup({
    productName:    new FormControl<string | null>(null),
    price:          new FormControl<number | null>(null),
    productKey:     new FormControl<string | null>(null),
    typeProduct:    new FormControl<TypeProduct | null>(null),
    productStatus:  new FormControl<boolean>(true)
  })

  constructor(
    private _productService: ProductsService,
    private _router: Router,
    private _activatedRouted: ActivatedRoute) {
    this.idProductToEdit = 0;
    this.requestFromServer();
    this.setEditDataProduct();
  }

  // Getters formsControls
  get supplierControl() {
    return this.formSupplier.get('supplier');
  }

  get productSupplierKeyControl() {
    return this.formSupplier.get('productKey');
  }

  get costControl() {
    return this.formSupplier.get('cost');
  }

  // Getter formsControls formProduct
  get productNameControl() {
    return this.formProduct.get('productName');
  }

  get priceControl() {
    return this.formProduct.get('price');
  }

  get productKeyControl() {
    return this.formProduct.get('productKey');
  }

  get typeProductControl() {
    return this.formProduct.get('typeProduct');
  }

  get productStatusControl() {
    return this.formProduct.get('productStatus');
  }

  get isEditPage(): boolean {
    return this.buttonProcessText == "Editar";
  }

  requestFromServer(): void {
    this.getAllTypesProduct();
    this.getAllSuppliers();
  }

  getAllTypesProduct(): void {
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

  getAllSuppliers(): void {
    this._productService.getAllSuppliers().subscribe({
      next: ({ok, result}) => {
        if (ok) {
          this.listSupplier = result
        }
      },
      error: console.error,
      complete: () => { console.log(this.listSupplier) }
    });
  }

  getAllSuppliersProduct(): void {
    this._productService.getAllSupplierOfProduct(this.idProductToEdit).subscribe({
      next: ({ok, result}) => {
        if (ok) {
          this.listSupplierProduct = result.map(sp => {
            sp.idProduct = sp.product?.idProduct!;
            sp.idSupplier = sp.supplier?.idSupplier!;
            sp.supplierName = sp.supplier?.supplierName!;

            return sp;
          })
        }
      },
      error: console.error
    });
  }

  addSupplierToProduct(): void {
    console.log(this.formSupplier)
    console.log(this.formSupplier.controls['supplier'].value)
    console.log(typeof(this.formSupplier.controls['supplier'].value))

    const supplierSelected: Supplier = this.supplierControl!.value;
    const productKey: string = (this.productSupplierKeyControl!.value as string).toUpperCase();
    const cost: number = this.costControl!.value;

    this.listSupplierProduct.push({
      idSupplier: supplierSelected.idSupplier,
      supplierName: supplierSelected.supplierName,
      supplierProductKey: productKey,
      supplierCost: cost
    });

    this.resetSupplierProductForm();
  }

  resetSupplierProductForm(): void {
    this.formSupplier.reset();
    this.supplierControl?.enable();
    this.isEditionSupplier = false;
  }

  removeSupplierProduct(selectedItem: SupplierProductAdd): void {
    Swal.fire({
      text: '¿Borrar proveedor?',
      icon: 'question',
      showCancelButton: true
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        // debugger
        const index = this.listSupplierProduct.findIndex(supplierProduct => supplierProduct.idSupplier === selectedItem.idSupplier);
        if (index != -1) {
          const supplierRemoved = this.listSupplierProduct[index];
          this.listSupplierProduct.splice(index, 1);

          if (this.isEditPage && !this.listSupplierProductRemoved.some(sp => sp.idSupplier == supplierRemoved.idSupplier)) {
            if (supplierRemoved.idProductSupplier) {
              supplierRemoved.productSupplierStatus = false;
              this.listSupplierProductRemoved.push(supplierRemoved);
            }
          }
        }

        console.log(this.listSupplierProduct)
        console.log(this.listSupplierProductRemoved)
      }
    });
  }

  loadSupplierProductToEdit(selectedItem: SupplierProductAdd): void {
    const suppliarSelected: Supplier = this.listSupplier.find(s => s.idSupplier == selectedItem.idSupplier)!;
    this.selectedSuplierProductId = selectedItem.idSupplier;
    this.supplierControl!.setValue(suppliarSelected);
    this.supplierControl!.disable();
    this.productSupplierKeyControl!.setValue(selectedItem.supplierProductKey);
    this.costControl!.setValue(selectedItem.supplierCost);
    this.isEditionSupplier = true;
  }

  editSupplierProductToEdit(): void {
    Swal.fire({
      text: '¿Guardar cambios?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then(({isConfirmed}) => {
      if (isConfirmed) {
        const productKey: string = (this.productSupplierKeyControl!.value as string).toUpperCase();
        const cost: number = this.costControl!.value;
        const supplierProduct = this.listSupplierProduct.find(sp => sp.idSupplier == this.selectedSuplierProductId);
        supplierProduct!.supplierCost = cost;
        supplierProduct!.supplierProductKey = productKey;
        this.isEditionSupplier = false;
      }
    });
  }

  saveProduct(): void {
    Swal.fire({
      text: '¿Guardar producto?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(({isConfirmed}) => {
      if (isConfirmed) {
        const product: Product = {
          productName: (this.productNameControl?.value as string)?.toUpperCase(),
          key: (this.productKeyControl?.value as string).toUpperCase(),
          price: this.priceControl?.value,
          productStatus: this.productStatusControl?.value,
          typeProduct: this.typeProductControl?.value
        }

        let saveStatus = false;

        this._productService.saveProduct(product).subscribe({
          next: ({ok, result}) => {
            console.log({ok, result})
            if (ok) {

              const producSuppliarToAdd = this.setupListSupplierProduct(result)

              this._productService.addSupplierToProduct(producSuppliarToAdd).subscribe({
                next: ({ok, result}) => {
                  saveStatus = ok;
                  if (ok) {
                    Swal.fire({
                      text: 'Guardado exitoso',
                      icon: 'success',
                    })
                  }
                },
                error: (err) => {
                  console.error(err)
                  saveStatus = false
                },
                complete: () => {
                  Swal.fire({
                    text: saveStatus ? 'Guardado exitoso' : 'Guardado fallo',
                    icon: saveStatus ? 'success' : 'error'
                  })

                  saveStatus && this._router.navigate(['products'])
                }
              })

            }
          },
          error: console.error
        })
      }
    })
  }

  setEditDataProduct(): void {
    if (this._router.url.includes('editProduct')) {
      this.buttonProcessText = "Editar"
      this._activatedRouted.params
        .pipe(
          switchMap(({id}) => this._productService.getProductById(id))
        ).subscribe({
          next: ({ok, result}) => {
            if (ok) {
              this.idProductToEdit = result.idProduct!;
              console.log({result})
              this.productNameControl!.setValue(result.productName);
              this.priceControl!.setValue(result.price);
              this.productKeyControl!.setValue(result.key);
              this.productStatusControl!.setValue(result.productStatus);

              const typeProduct = this.listTypeProduct.find(tp => tp.idTypeProduct == result.typeProduct.idTypeProduct);
              if (typeProduct) {
                this.typeProductControl!.setValue(typeProduct);
              }

              this.getAllSuppliersProduct();
            }
          },
          error: console.error,
          complete: () => {  }
        })
    }
  }

  editProduct(): void {
    Swal.fire({
      text: '¿Editar producto?',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        const product: Product = {
          idProduct: this.idProductToEdit,
          productName: (this.productNameControl?.value as string)?.toUpperCase(),
          key: (this.productKeyControl?.value as string).toUpperCase(),
          price: this.priceControl?.value,
          productStatus: this.productStatusControl?.value,
          typeProduct: this.typeProductControl?.value
        }


        console.log('PROUCT => ', product)
        console.log('LIST_ADD_EDIT_SUPPLIERS => ', this.listSupplierProduct);
        console.log('LIST_REMOVED => ', this.listSupplierProductRemoved);

        let editStatus = false;

        this._productService.editProduct(product).subscribe({
          next: ({ ok, result }) => {
            console.log({ ok, result })
            if (ok) {
              Swal.fire({
                text: 'Edición exitosa',
                icon: 'success',
              })

              const producSuppliarToAdd = this.setupListSupplierProduct(result);
              console.log('SETUP_LIST => ', producSuppliarToAdd);

              this._productService.editSuppliersProduct(producSuppliarToAdd).subscribe({
                next: ({ ok }) => {
                  editStatus = ok;
                  if (ok) {
                    Swal.fire({
                      text: 'Edición exitoso',
                      icon: 'success',
                    })
                  }
                },
                error: (err) => {
                  console.error(err)
                  editStatus = false
                },
                complete: () => {
                  Swal.fire({
                    text: editStatus ? 'Edición exitoso' : 'Edición fallo',
                    icon: editStatus ? 'success' : 'error'
                  })

                  editStatus
                }
              })

              this._router.navigate(['products'])
            } else {
              Swal.fire({
                text: 'Edición fallo',
                icon: 'error',
              });
            }
          },
          error: (err) => {
            console.error(err)
            Swal.fire({
              text: 'Edición fallo',
              icon: 'error',
            });
          },
          complete: () => { }
        })
      }
    })
  }

  setupListSupplierProduct(product: Product): SupplierProductAdd[] {
    let producSuppliarToAdd = [];
    if (this.isEditPage) {
      producSuppliarToAdd = [
        ...this.listSupplierProduct.map((sp) => {
          sp.idProduct = product.idProduct;
          sp.idProductSupplier = sp.idProductSupplier;
          sp.productSupplierStatus = sp.productSupplierStatus;
          return sp;
        }),
        ...this.listSupplierProductRemoved.map((sp) => {
          sp.idProduct = product.idProduct;
          sp.idProductSupplier = sp.idProductSupplier;
          sp.productSupplierStatus = sp.productSupplierStatus;
          return sp;
        }),
      ];
    } else {
      producSuppliarToAdd = [
        ...this.listSupplierProduct.map((sp) => {
          sp.idProduct = product.idProduct;
          sp.idProductSupplier = null;
          sp.productSupplierStatus = true;
          return sp;
        })
      ];
    }

    return producSuppliarToAdd;
  }

  cancel(): void {
    this._router.navigate(['/products'])
  }
}

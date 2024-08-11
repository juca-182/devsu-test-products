import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Product } from '../../models/product.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GridFooterComponent } from '../grid-footer/grid-footer.component';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { ProductRemoveComponent } from '../product-remove/product-remove.component';

@Component({
  selector: 'app-products-grid',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    GridFooterComponent,
    RouterLink,
    ProductRemoveComponent,
  ],
  templateUrl: './products-grid.component.html',
  styleUrl: './products-grid.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProductsGridComponent implements OnChanges {
  @Input() products: Product[] | null | undefined = null;
  @Output() refreshProduct = new EventEmitter<void>();

  private router: Router = inject(Router);
  private productService: ProductsService = inject(ProductsService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  public search: string = '';
  public productsFiltered: Product[] | null | undefined = null;
  productToRemove: string | null = null;
  isModalOpen = false;
  deleteCallback: any | null = null;

  startIndex = signal(0);
  rowsAmount = signal(0);
  endIndex = signal(0);

  ngOnChanges(): void {
    this.productsFiltered = this.products;
    this.cdr.detectChanges();
  }

  searchProduct(event: KeyboardEvent) {
    if (this.search) {
      this.productsFiltered = this.products
        ?.filter((product: Product) => {
          return [
            product.name.toLowerCase().includes(this.search.toLowerCase()),
            product.description
              .toLowerCase()
              .includes(this.search.toLowerCase()),
          ].some(Boolean);
        })
        .slice(this.startIndex(), this.rowsAmount());
    }
    if (!this.search) {
      this.productsFiltered = this.products?.slice(
        this.startIndex(),
        this.rowsAmount(),
      );
    }

    this.cdr.detectChanges();
  }

  navigate() {
    this.router.navigate(['newProduct'])?.then();
  }

  handleIndexChild(startIndex: number) {
    this.startIndex.set(startIndex);
    this.endIndex.set(this.startIndex() + this.rowsAmount());
    this.productsFiltered = this.products?.slice(
      this.startIndex(),
      this.endIndex(),
    );
    this.cdr.detectChanges();
  }

  handleRowsAmountChild(rowsAmount: number) {
    this.rowsAmount.set(rowsAmount);
    this.startIndex.set(0);
    this.endIndex.set(this.startIndex() + this.rowsAmount());
    this.productsFiltered = this.products?.slice(
      this.startIndex(),
      this.endIndex(),
    );
    this.cdr.detectChanges();
  }

  handleAction(event: Event, product: any) {
    const action = (event.target as HTMLSelectElement).value;
    if (action === 'edit') {
      this.editProduct(product);
    } else if (action === 'delete') {
      this.productToRemove = product.name;
      this.isModalOpen = true;
      this.deleteCallback = () => {
        this.deleteProduct(product);
      };
    }
    (event.target as HTMLSelectElement).value = '';
  }

  editProduct(product: any) {
    this.router.navigate([`editProduct/${product.id}`])?.then();
  }

  deleteProduct(product: any) {
    if (!product) return;
    this.productService
      .removeProduct(product.id)
      .subscribe((res) => this.getProductEmitter());
    this.isModalOpen = false;
  }

  getProductEmitter() {
    this.refreshProduct.emit();
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}

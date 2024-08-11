import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.interface';
import { CommonModule } from '@angular/common';
import { ProductsGridComponent } from '../components/products-grid/products-grid.component';
import { GridFooterComponent } from '../components/grid-footer/grid-footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [
    CommonModule,
    ProductsGridComponent,
    GridFooterComponent,
    RouterOutlet,
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppLayoutComponent implements OnInit {
  public products: Product[] = [];

  private productsGridService = inject(ProductsService);

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productsGridService.getProducts().subscribe((products) => {
      this.products = products.data;
    });
  }

  refreshProductHandler() {
    this.getProducts();
  }
}

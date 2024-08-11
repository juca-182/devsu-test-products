import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Product } from '../models/product.interface';
import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http: HttpClient = inject(HttpClient);

  getProducts(): Observable<{ data: Product[] }> {
    return this.http
      .get<{ data: Product[] }>(`${environment.url}/bp/products`)
      .pipe(catchError(this.handleError));
  }

  addProduct(product: Product): Observable<Product> {
    return this.http
      .post<Product>(`${environment.url}/bp/products/`, product)
      .pipe(catchError(this.handleError));
  }

  editProduct(product: Product): Observable<Product> {
    return this.http
      .put<Product>(`${environment.url}/bp/products/${product.id}`, product)
      .pipe(catchError(this.handleError));
  }
  removeProduct(id: string): Observable<{}> {
    return this.http
      .delete<{}>(`${environment.url}/bp/products/${id}`)
      .pipe(catchError(this.handleError));
  }

  getProductByID(id: string): Observable<Product> {
    return this.http
      .get<Product>(`${environment.url}/bp/products/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';
    if (error.error) {
      errorMessage = error.error.message?.toLowerCase().includes('duplicate')
        ? 'Ya existe una entrada con este ID'
        : error.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
}

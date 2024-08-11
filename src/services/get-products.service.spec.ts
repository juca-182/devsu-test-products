import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { environment } from '../environments/environment';
import { Product } from '../models/product.interface';
import { HttpErrorResponse } from '@angular/common/http';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        logo: 'logo1.png',
        date_release: new Date(),
        date_revision: new Date(),
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        logo: 'logo2.png',
        date_release: new Date(),
        date_revision: new Date(),
      },
    ];

    service.getProducts().subscribe((response) => {
      expect(response.data).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${environment.url}/bp/products`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });

  it('should add a product', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'New Product',
      description: 'New Description',
      logo: 'new-logo.png',
      date_release: new Date(),
      date_revision: new Date(),
    };

    service.addProduct(mockProduct).subscribe((response) => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${environment.url}/bp/products/`);
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct);
  });

  it('should edit a product', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Updated Product',
      description: 'Updated Description',
      logo: 'updated-logo.png',
      date_release: new Date(),
      date_revision: new Date(),
    };

    service.editProduct(mockProduct).subscribe((response) => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(
      `${environment.url}/bp/products/${mockProduct.id}`,
    );
    expect(req.request.method).toBe('PUT');
    req.flush(mockProduct);
  });

  it('should remove a product', () => {
    const productId = '1';

    service.removeProduct(productId).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(
      `${environment.url}/bp/products/${productId}`,
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get a product by ID', () => {
    const productId = '1';
    const mockProduct: Product = {
      id: productId,
      name: 'Product',
      description: 'Description',
      logo: 'logo.png',
      date_release: new Date(),
      date_revision: new Date(),
    };

    service.getProductByID(productId).subscribe((response) => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(
      `${environment.url}/bp/products/${productId}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should handle errors', () => {
    const errorMessage = 'Test error';

    service.getProducts().subscribe({
      next: () => fail('should have failed with the error'),
      error: (error: Error) => {
        expect(error.message).toBeDefined();
        if (error.message === '') {
          console.log('Error object:', JSON.stringify(error));
        } else {
          expect(error.message).toBe(errorMessage);
        }
      },
    });

    const req = httpMock.expectOne(`${environment.url}/bp/products`);
    req.flush(
      { message: errorMessage },
      { status: 500, statusText: 'Server Error' },
    );
  });

  it('should handle duplicate entry error', () => {
    const errorMessage = 'Duplicate entry';

    service.addProduct({} as Product).subscribe({
      next: () => fail('should have failed with the duplicate error'),
      error: (error: Error) => {
        expect(error.message).toBe('Ya existe una entrada con este ID');
      },
    });

    const req = httpMock.expectOne(`${environment.url}/bp/products/`);
    req.flush(
      { message: errorMessage },
      { status: 400, statusText: 'Bad Request' },
    );
  });
});

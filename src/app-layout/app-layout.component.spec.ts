import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppLayoutComponent } from './app-layout.component';
import { ProductsService } from '../services/products.service';
import { of } from 'rxjs';
import { ProductsGridComponent } from '../components/products-grid/products-grid.component';
import { GridFooterComponent } from '../components/grid-footer/grid-footer.component';
import { Product } from '../models/product.interface';

describe('AppLayoutComponent', () => {
  let component: AppLayoutComponent;
  let fixture: ComponentFixture<AppLayoutComponent>;
  let productsService: jasmine.SpyObj<ProductsService>;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: new Date('2023-01-01'),
      date_revision: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      logo: 'logo2.png',
      date_release: new Date('2023-02-01'),
      date_revision: new Date('2024-02-01'),
    },
  ];

  beforeEach(async () => {
    const productsServiceSpy = jasmine.createSpyObj('ProductsService', [
      'getProducts',
    ]);

    await TestBed.configureTestingModule({
      imports: [AppLayoutComponent, ProductsGridComponent, GridFooterComponent],
      providers: [{ provide: ProductsService, useValue: productsServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppLayoutComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(
      ProductsService,
    ) as jasmine.SpyObj<ProductsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on init', () => {
    productsService.getProducts.and.returnValue(of({ data: mockProducts }));

    fixture.detectChanges();

    expect(productsService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
  });

  it('should refresh products when refreshProductHandler is called', () => {
    productsService.getProducts.and.returnValue(of({ data: mockProducts }));

    component.refreshProductHandler();

    expect(productsService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
  });

  it('should have ProductsGridComponent', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-products-grid')).not.toBeNull();
  });

  it('should have GridFooterComponent', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-grid-footer')).not.toBeNull();
  });
});

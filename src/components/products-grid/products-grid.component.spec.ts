import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ProductsGridComponent } from './products-grid.component';
import { ProductsService } from '../../services/products.service';
import { of } from 'rxjs';
import { Product } from '../../models/product.interface';
import { FormsModule } from '@angular/forms';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

const setupTestBed = () => {
  try {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(),
    );
  } catch (e) {
    if (
      !(e as any).message ||
      (e as any).message.indexOf('TestBed is already initialized.') === -1
    ) {
      throw e;
    }
  }
};

describe('ProductsGridComponent', () => {
  let component: ProductsGridComponent;
  let fixture: ComponentFixture<ProductsGridComponent>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;

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


  setupTestBed();


  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductsService', ['removeProduct']);

    await TestBed.configureTestingModule({
      imports: [ProductsGridComponent, FormsModule],
      providers: [{ provide: ProductsService, useValue: spy }],
    }).compileComponents();

    productsServiceSpy = TestBed.inject(
      ProductsService,
    ) as jasmine.SpyObj<ProductsService>;

    fixture = TestBed.createComponent(ProductsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter products based on search input', fakeAsync(() => {
    component.products = mockProducts;
    fixture.detectChanges();
    tick();

    component.search = 'Product 1';
    component.searchProduct(new KeyboardEvent('keyup'));
    fixture.detectChanges();
    tick();

    expect(component.productsFiltered?.length).toBe(1);
    expect(component.productsFiltered?.[0].name).toBe('Product 1');
  }));

  it('should reset filtered products when search is empty', fakeAsync(() => {
    component.products = mockProducts;
    fixture.detectChanges();
    tick();
    component.search = '';
    component.searchProduct(new KeyboardEvent('keyup'));
    tick();
    expect(component.productsFiltered?.length).toBe(2);
  }));

  it('should navigate to new product page', fakeAsync(() => {
    component.products = mockProducts;
    fixture.detectChanges();
    tick();
    const routerSpy = spyOn(component['router'], 'navigate');
    component.navigate();
    expect(routerSpy).toHaveBeenCalledWith(['newProduct']);
  }));

  it('should update indexes when handleIndexChild is called', () => {
    component.handleIndexChild(5);
    expect(component.startIndex()).toBe(5);
    expect(component.endIndex()).toBe(5 + component.rowsAmount());
  });

  it('should update rows amount when handleRowsAmountChild is called', () => {
    component.handleRowsAmountChild(10);
    expect(component.rowsAmount()).toBe(10);
    expect(component.startIndex()).toBe(0);
    expect(component.endIndex()).toBe(10);
  });

  it('should handle edit action correctly', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const mockEvent = { target: { value: 'edit' } } as unknown as Event;
    component.handleAction(mockEvent, mockProducts[0]);
    expect(routerSpy).toHaveBeenCalledWith(['editProduct/1']);
  });

  it('should handle delete action correctly', () => {
    const mockEvent = { target: { value: 'delete' } } as unknown as Event;
    component.handleAction(mockEvent, mockProducts[0]);
    expect(component.productToRemove).toBe('Product 1');
    expect(component.isModalOpen).toBeTrue();
  });

  it('should delete product when deleteProduct is called', () => {
    productsServiceSpy.removeProduct.and.returnValue(of({}));
    const emitSpy = spyOn(component.refreshProduct, 'emit');
    component.deleteProduct(mockProducts[0]);
    expect(productsServiceSpy.removeProduct).toHaveBeenCalledWith('1');
    expect(emitSpy).toHaveBeenCalled();
    expect(component.isModalOpen).toBeFalse();
  });

  it('should emit refresh event when getProductEmitter is called', () => {
    const emitSpy = spyOn(component.refreshProduct, 'emit');
    component.getProductEmitter();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should open modal', () => {
    component.openModal();
    expect(component.isModalOpen).toBeTrue();
  });

  it('should close modal', () => {
    component.closeModal();
    expect(component.isModalOpen).toBeFalse();
  });

  it('should filter products based on name and description', fakeAsync(() => {
    component.products = mockProducts;
    fixture.detectChanges();
    tick();
    component.search = 'Description 2';
    component.searchProduct(new KeyboardEvent('keyup'));
    tick();
    expect(component.productsFiltered?.length).toBe(1);
    expect(component.productsFiltered?.[0].name).toBe('Product 2');
  }));

  it('should have date fields in the products', fakeAsync(() => {
    component.products = mockProducts;
    fixture.detectChanges();
    tick();
    expect(component.products[0].date_release).toBeInstanceOf(Date);
    expect(component.products[0].date_revision).toBeInstanceOf(Date);
  }));
});

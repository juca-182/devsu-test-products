import {ComponentFixture, TestBed } from "@angular/core/testing";
import { ProductFormComponent } from './product-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from '../services/products.service';
import { ActivatedRoute } from '@angular/router';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;


  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductsService', ['getProductByID', 'addProduct', 'editProduct']);

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductsService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {}
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize the form with validations', () => {
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('id')).toBeDefined();
    expect(component.productForm.get('name')).toBeDefined();
    expect(component.productForm.get('description')).toBeDefined();
    expect(component.productForm.get('logo')).toBeDefined();
    expect(component.productForm.get('date_release')).toBeDefined();
    expect(component.productForm.get('date_revision')).toBeDefined();
  });

  it('should disable date_revision field on init', () => {
    expect(component.productForm.get('date_revision')?.disabled).toBeTrue();
  });


  it('should validate date_release is not before today', () => {
    const control = component.productForm.get('date_release');
    const today = new Date();
    const pastDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const futureDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Formatear las fechas como strings en el formato 'YYYY-MM-DD'
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    control?.setValue(formatDate(pastDate));
    expect(control?.valid).toBeFalse();
    expect(control?.hasError('dateNotBeforeToday')).toBeTrue();

    control?.setValue(formatDate(futureDate));
    expect(control?.valid).toBeTrue();
    expect(control?.hasError('dateNotBeforeToday')).toBeFalse();
  });



});

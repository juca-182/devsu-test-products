import {
  Component,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;

  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private productService: ProductsService = inject(ProductsService);

  loading = false;
  errorMessage: string | null = null;
  id: string = '';
  product!: Product | null;

  constructor() {
    if (this.activatedRoute.snapshot.params['id']) {
      this.id = this.activatedRoute.snapshot.params['id'];
    }
  }
  ngOnInit(): void {
    this.formValidations();
    this.productForm.get('date_revision')?.disable();
    this.getProduct();
  }

  getProduct() {
    if (this.id) {
      this.productForm.get('id')?.disable();
      this.productService.getProductByID(this.id).subscribe((product) => {
        this.product = product;
        this.productForm.patchValue(product);
      });
    }
  }

  formValidations() {
    this.productForm = new FormGroup(
      {
        id: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ]),
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ]),
        description: new FormControl('', [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ]),
        logo: new FormControl('', Validators.required),
        date_release: new FormControl('', [
          Validators.required,
          this.dateNotBeforeTodayValidator,
        ]),
        date_revision: new FormControl('', Validators.required),
      },
      { validators: this.dateRevisionValidator as ValidatorFn },
    );
  }

  addProduct(form: Product) {
    this.loading = true;
    this.errorMessage = null;
    this.productService.addProduct(form).subscribe({
      next: (response) => {
        this.loading = false;
        this.navigate();
      },
      error: (error) => {
        if (error) {
          this.errorMessage = error;
          this.loading = false;
        }
      },
    });
  }

  editProduct(form: Product) {
    if (!this.product) return;
    this.loading = true;
    this.errorMessage = null;
    this.productService
      .editProduct({ ...form, id: this.product.id })
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.navigate();
        },
        error: (error) => {
          if (error) {
            this.errorMessage = error;
            this.loading = false;
          }
        },
      });
  }

  resetForm() {
    this.productForm.reset();

    if (this.id && this.product) {
      this.productForm.get('id')?.patchValue(this.product.id);
    }
  }

  navigate() {
    this.router.navigate(['']).then();
  }

  setDateRevision() {
    const dateRelease = this.dateTransform(
      this.productForm.get('date_release')?.value,
    );
    dateRelease.setFullYear(dateRelease.getFullYear() + 1);
    const month = dateRelease.getMonth() + 1;

    this.productForm
      .get('date_revision')
      ?.setValue(
        `${dateRelease.getFullYear()}-${month < 10 ? `0${month}` : month}-${dateRelease.getDate()}`,
      );
  }

  dateTransform(date: string) {
    if (!date) return new Date();
    const rawDate = date.split('-');

    return new Date(
      Number(rawDate?.[0]),
      Number(rawDate?.[1]) - 1,
      Number(rawDate?.[2]),
    );
  }

  dateNotBeforeTodayValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    if (!control.value) return null;
    const rawDate = control.value.split('-');

    const inputDate = new Date(
      Number(rawDate?.[0]),
      Number(rawDate?.[1]) - 1,
      Number(rawDate?.[2]),
    );
    const today = new Date();

    inputDate.setHours(23, 59, 59, 0);

    return inputDate.getTime() >= today.getTime()
      ? null
      : { dateNotBeforeToday: true };
  }

  dateRevisionValidator: ValidatorFn = (
    control: any,
  ): ValidationErrors | null => {
    const group = control as FormGroup;
    const dateRelease = group.value['date_release'];
    const dateRevision = group.value['date_revision'];

    if (dateRelease && dateRevision && dateRevision <= dateRelease) {
      return { invalidRevisionDate: true };
    }

    return null;
  };

  onSubmit() {
    if (this.productForm.valid) {
      this.id && this.product
        ? this.editProduct(this.productForm.getRawValue())
        : this.addProduct(this.productForm.getRawValue());
    } else {
      Object.values(this.productForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
  }
}

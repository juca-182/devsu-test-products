import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-remove',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-remove.component.html',
  styleUrl: './product-remove.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProductRemoveComponent {
  @Input() isOpen = false;
  @Input() productName = '';
  @Input() callback: any | null = null;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }

  executeCallback() {
    if (this.callback) {
      this.callback();
    }
  }
}

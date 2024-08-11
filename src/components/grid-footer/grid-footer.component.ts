import {
  Component,
  effect,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grid-footer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './grid-footer.component.html',
  styleUrl: './grid-footer.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GridFooterComponent implements OnChanges {
  @Input() set rowsQuantity(value: number) {
    this._rowsQuantity.set(value);
    if (value) {
      this.calculatePages();
      this.currentPage.set(1);
    }
  }

  @Output() startIndexEvent = new EventEmitter<number>();
  @Output() rowsAmountEvent = new EventEmitter<number>();
  private _rowsQuantity = signal(0);
  rowsAmount = signal(5);
  pages = signal(0);
  currentPage = signal(0);

  constructor() {
    effect(
      () => {
        this.rowsAmount();
        this.calculatePages();
      },
      { allowSignalWrites: true },
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    this.sendRowsAmountToParent();
  }

  get rowsQuantity() {
    return this._rowsQuantity();
  }

  calculatePages() {
    this.pages.set(Math.ceil(this._rowsQuantity() / this.rowsAmount()));
  }

  changeRowsAmount(newValue: number) {
    this.rowsAmount.set(newValue);
    this.currentPage.set(1);
    this.sendIndexToParent();
    this.sendRowsAmountToParent();
  }

  sendIndexToParent() {
    const startIndex = (this.currentPage() - 1) * this.rowsAmount();
    this.startIndexEvent.emit(startIndex);
  }

  sendRowsAmountToParent() {
    this.rowsAmountEvent.emit(this.rowsAmount());
  }
  nextPage() {
    if (this.currentPage() >= this.pages()) return;
    this.currentPage.set(this.currentPage() + 1);
    this.sendIndexToParent();
  }

  previousPage() {
    if (this.currentPage() <= 1) return;
    this.currentPage.set(this.currentPage() - 1);
    this.sendIndexToParent();
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridFooterComponent } from './grid-footer.component';
import { FormsModule } from '@angular/forms';
import { SimpleChange } from '@angular/core';

describe('GridFooterComponent', () => {
  let component: GridFooterComponent;
  let fixture: ComponentFixture<GridFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridFooterComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(GridFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.rowsQuantity).toBe(0);
    expect(component.rowsAmount()).toBe(5);
    expect(component.pages()).toBe(0);
    expect(component.currentPage()).toBe(0);
  });

  it('should calculate pages correctly when rowsQuantity changes', () => {
    component.rowsQuantity = 20;
    expect(component.pages()).toBe(4);
    expect(component.currentPage()).toBe(1);
  });

  it('should emit rowsAmount on ngOnChanges', () => {
    spyOn(component.rowsAmountEvent, 'emit');
    component.ngOnChanges({});
    expect(component.rowsAmountEvent.emit).toHaveBeenCalledWith(5);
  });

  it('should change rows amount and emit events', () => {
    spyOn(component.startIndexEvent, 'emit');
    spyOn(component.rowsAmountEvent, 'emit');
    component.changeRowsAmount(10);
    expect(component.rowsAmount()).toBe(10);
    expect(component.currentPage()).toBe(1);
    expect(component.startIndexEvent.emit).toHaveBeenCalledWith(0);
    expect(component.rowsAmountEvent.emit).toHaveBeenCalledWith(10);
  });

  it('should navigate to next page and emit startIndex', () => {
    component.rowsQuantity = 20;
    spyOn(component.startIndexEvent, 'emit');
    component.nextPage();
    expect(component.currentPage()).toBe(2);
    expect(component.startIndexEvent.emit).toHaveBeenCalledWith(5);
  });

  it('should not navigate to next page if already on last page', () => {
    component.rowsQuantity = 20;
    component.currentPage.set(4);
    component.nextPage();
    expect(component.currentPage()).toBe(4);
  });

  it('should navigate to previous page and emit startIndex', () => {
    component.rowsQuantity = 20;
    component.currentPage.set(2);
    spyOn(component.startIndexEvent, 'emit');
    component.previousPage();
    expect(component.currentPage()).toBe(1);
    expect(component.startIndexEvent.emit).toHaveBeenCalledWith(0);
  });

  it('should not navigate to previous page if on first page', () => {
    component.rowsQuantity = 20;
    component.previousPage();
    expect(component.currentPage()).toBe(1);
  });

  it('should recalculate pages when rowsAmount changes', () => {
    component.rowsQuantity = 20;
    component.changeRowsAmount(5);
    expect(component.pages()).toBe(4);
  });
});

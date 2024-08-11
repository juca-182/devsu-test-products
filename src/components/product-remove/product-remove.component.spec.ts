import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductRemoveComponent } from './product-remove.component';
import { By } from '@angular/platform-browser';

describe('ProductRemoveComponent', () => {
  let component: ProductRemoveComponent;
  let fixture: ComponentFixture<ProductRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRemoveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close()', () => {
    it('should emit closeModal event', () => {
      spyOn(component.closeModal, 'emit');
      component.close();
      expect(component.closeModal.emit).toHaveBeenCalled();
    });
  });

  describe('executeCallback()', () => {
    it('should call the callback function if it exists', () => {
      const mockCallback = jasmine.createSpy('mockCallback');
      component.callback = mockCallback;
      component.executeCallback();
      expect(mockCallback).toHaveBeenCalled();
    });

    it('should not throw an error if callback is not defined', () => {
      component.callback = null;
      expect(() => component.executeCallback()).not.toThrow();
    });
  });

  describe('Modal rendering', () => {
    it('should not display the modal when isOpen is false', () => {
      component.isOpen = false;
      fixture.detectChanges();
      const modalOverlay = fixture.debugElement.query(By.css('.modal-overlay'));
      expect(modalOverlay).toBeNull();
    });

    it('should display the modal when isOpen is true', () => {
      component.isOpen = true;
      fixture.detectChanges();
      const modalOverlay = fixture.debugElement.query(By.css('.modal-overlay'));
      expect(modalOverlay).not.toBeNull();
    });

    it('should display the correct product name in the modal', () => {
      component.isOpen = true;
      component.productName = 'Test Product';
      fixture.detectChanges();
      const modalBody = fixture.debugElement.query(By.css('.modal-body'));
      expect(modalBody.nativeElement.textContent).toContain('Test Product');
    });
  });

  describe('Modal interactions', () => {
    beforeEach(() => {
      component.isOpen = true;
      fixture.detectChanges();
    });

    it('should call close() when clicking on modal overlay', () => {
      spyOn(component, 'close');
      const modalOverlay = fixture.debugElement.query(By.css('.modal-overlay'));
      modalOverlay.triggerEventHandler('click', null);
      expect(component.close).toHaveBeenCalled();
    });

    it('should not call close() when clicking on modal content', () => {
      spyOn(component, 'close');
      const modalContent = fixture.debugElement.query(By.css('.modal-content'));
      modalContent.triggerEventHandler('click', { stopPropagation: () => {} });
      expect(component.close).not.toHaveBeenCalled();
    });

    it('should call close() when clicking on Cancel button', () => {
      spyOn(component, 'close');
      const cancelButton = fixture.debugElement.query(
        By.css('.modal-footer button:first-child'),
      );
      cancelButton.triggerEventHandler('click', null);
      expect(component.close).toHaveBeenCalled();
    });

    it('should call executeCallback() when clicking on Confirm button', () => {
      spyOn(component, 'executeCallback');
      const confirmButton = fixture.debugElement.query(
        By.css('.modal-footer button:last-child'),
      );
      confirmButton.triggerEventHandler('click', null);
      expect(component.executeCallback).toHaveBeenCalled();
    });
  });
});

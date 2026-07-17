import { ShBaseAuthComponent } from './../../../components/base/base-auth.component';
import { ShSpinnerComponent } from '../../../components/spinner/spinner.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { ElementRef } from '@angular/core';

describe('Spinner component', () => {
  let component: ShSpinnerComponent;
  let fixture: ComponentFixture<ShSpinnerComponent>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShSpinnerComponent],
      providers: [IdSequenceService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShSpinnerComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector('div');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });

  it('should set defaults correctly', () => {
    expect(component.isInline).toBeFalsy();
    expect(component.isOverlay).toBeFalsy();
  });

  it('constructor should set element ref', () => {
    expect(component['_element']).toBeDefined();
    expect(component['_element']).not.toBeNull();
    expect(component['_element']).toBeInstanceOf(ElementRef);
  });

  describe('ngOnDestroy', () => {
    it('should call super ngOnDestroy', () => {
      const superSpy = spyOn(ShBaseAuthComponent.prototype, 'ngOnDestroy');
      expect(superSpy).not.toHaveBeenCalled();

      component.ngOnDestroy();

      expect(superSpy).toHaveBeenCalledTimes(1);
    });
    it('should call remove on nativeElement when isOverlay is set to true', () => {
      component.isOverlay = true;
      const fakeElement = $('<div></div>');
      const removeSpy = spyOn(fakeElement, 'remove');
      component['_element'].nativeElement = fakeElement[0];
      const jQuerySpy = spyOn(window as any, '$').and.returnValue(fakeElement);

      component.ngOnDestroy();

      expect(jQuerySpy).toHaveBeenCalledOnceWith(fakeElement[0]);
      expect(removeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should do nothing when isOverlay is not set', () => {
      const fakeElement = $('<div></div>');
      const jQuerySpy = spyOn(window as any, '$').and.returnValue(fakeElement);
      jQuerySpy.calls.reset();
      component.isOverlay = false;

      component.ngAfterViewInit();

      expect(jQuerySpy).toHaveBeenCalledTimes(1);
    });
    it('ngAfterViewInit should add spinner-overlay class to the element and append it to body', () => {
      const fakeSpinner = $('<div><div>');
      const fakeBody = $('<body></body>');
      const jQuerySpy = spyOn(window as any, '$').and.returnValues(fakeSpinner, fakeBody);
      const addClassSpy = spyOn(fakeSpinner, 'addClass');
      const appendSpy = spyOn(fakeBody, 'append');
      component['_element'].nativeElement = fakeSpinner[0];
      component.isOverlay = true;

      component.ngAfterViewInit();

      expect(jQuerySpy).toHaveBeenCalledTimes(2);
      expect(jQuerySpy).toHaveBeenCalledWith(fakeSpinner[0]);
      expect(jQuerySpy).toHaveBeenCalledWith('body');
      expect(addClassSpy).toHaveBeenCalledOnceWith('spinner-overlay');
      expect(appendSpy).toHaveBeenCalledOnceWith(fakeSpinner);
    });
  });
});

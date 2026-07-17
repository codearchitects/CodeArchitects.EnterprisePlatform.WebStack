import { ShButtonComponent, ShIconComponent } from './../../../components';
import { TranslateModule } from '@ngx-translate/core';
import { ShModalComponent } from '../../../components/modal/modal.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormHandlerService, IdSequenceService } from '../../../services';
import { ValidatorHelper } from '@ca-webstack/ng-aspects';
import { ElementRef } from '@angular/core';
import * as $ from 'jquery';
import * as commons from '../../../utilities/common.utility';

describe('Modal component', () => {
  let component: ShModalComponent;
  let fixture: ComponentFixture<ShModalComponent>;
  let htmlElement: HTMLDivElement;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ShModalComponent, ShIconComponent, ShButtonComponent],
      providers: [IdSequenceService, ValidatorHelper]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShModalComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    htmlElement = fixture.debugElement.nativeElement.querySelector('div');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });

  it('should initialize values correctly', () => {
    expect(component.cancelText).toEqual('cancel');
    expect(component.confirmText).toEqual('confirm');
    expect(component.closeOnConfirm).toBeTruthy();
    expect(component.closeOnCancel).toBeTruthy();
    expect(component.closeOnClickOutside).toBeFalsy();
    expect(component.hasConfirmButton).toBeTruthy();
    expect(component.hasCancelButton).toBeTruthy();
  });

  describe('constructor', () => {
    it('should set element', () => {
      expect(component['_element']).toBeDefined();
      expect(component['_element']).not.toBeNull();
      expect(component['_element']).toBeInstanceOf(ElementRef);
    });
    it('should set formHandlerService', () => {
      expect(component['formHandler']).toBeDefined();
      expect(component['formHandler']).not.toBeNull();
      expect(component['formHandler']).toBeInstanceOf(FormHandlerService);
    });
  });

  describe('ngOnInit', () => {
    it('should set formGroup when value is defined', () => {
      const expectedGroup: any = { myGroup: 'sample' };
      const getGroupSpy = spyOn(component['formHandler'], 'getGroup').and.returnValue(expectedGroup);
      component.value = 'foo';

      component.ngOnInit();

      expect(getGroupSpy).toHaveBeenCalledTimes(1);
      expect(component['formGroup']).toEqual(expectedGroup);
    });
    it('should append to body native element', () => {
      const fakeBody = $('<div></div>');
      const fakeElement = $('<p></p>');
      const fakeNative = fakeElement[0];
      const fakeBodyAppendSpy = spyOn(fakeBody, 'append');
      const jQuerySpy = spyOn((window as any), '$').and.returnValues(fakeBody, fakeElement);
      component['_element'].nativeElement = fakeNative;

      component.ngOnInit();

      expect(jQuerySpy).toHaveBeenCalledTimes(2);
      expect(jQuerySpy).toHaveBeenCalledWith('body');
      expect(jQuerySpy).toHaveBeenCalledWith(fakeNative);
      expect(fakeBodyAppendSpy).toHaveBeenCalledOnceWith(fakeElement);
    });
    it('should call yieldFunc', async(() => {
      fixture.whenStable().then(() => {
        const yieldFuncSpy = spyOn(commons, 'yieldFunc');
        yieldFuncSpy.calls.reset();

        component.ngOnInit();

        expect(yieldFuncSpy).toHaveBeenCalledTimes(2); // base component and modal component both calls yieldFunc in their ngOnInit implementation
      });
    }));
    it('yield function callback should set initialized to true', async(() => {
      jasmine.clock().uninstall();
      fixture.whenStable().then(() => {
        jasmine.clock().install();
        jasmine.clock().tick(1);
        component['_isInitialized'] = false;

        component.ngOnInit();
        jasmine.clock().tick(1);

        expect(component['_isInitialized']).toBeTruthy();
        jasmine.clock().uninstall();
      });
    }));
  });

  it('ngOnDestroy should call jQuery remove on nativeElement', () => {
    const fakeElement = $('<span></span>');
    const fakeNative = fakeElement[0];
    const jQuerySpy = spyOn((window as any), '$').and.returnValue(fakeElement);
    const fakeElementRemoveSpy = spyOn(fakeElement, 'remove');
    component['_element'].nativeElement = fakeNative;

    component.ngOnDestroy();

    expect(jQuerySpy).toHaveBeenCalledOnceWith(fakeNative);
    expect(fakeElementRemoveSpy).toHaveBeenCalledTimes(1);
  });

  describe('onCancel', () => {
    it('should emit cancel', () => {
      const cancelEmitSpy = spyOn(component.cancel, 'emit');
      component.closeOnCancel = false;

      component['onCancel']();

      expect(cancelEmitSpy).toHaveBeenCalledTimes(1);
    });
    it('should call close when closeOnCancel is true', () => {
      const closeSpy = spyOn(component as any, 'close');
      component.closeOnCancel = true;

      component['onCancel']();

      expect(closeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onCancel', () => {
    it('should emit confirm', () => {
      const confirmEmitSpy = spyOn(component.confirm, 'emit');
      component.closeOnConfirm = false;

      component['onConfirm']();

      expect(confirmEmitSpy).toHaveBeenCalledTimes(1);
    });
    it('should call close when closeOnConfirm is true', () => {
      const closeSpy = spyOn(component as any, 'close');
      component.closeOnConfirm = true;

      component['onConfirm']();

      expect(closeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onClickOutside', () => {
    it('should not call close when component is not initialized', () => {
      const closeSpy = spyOn(component as any, 'close');
      component.closeOnClickOutside = true;
      component['_isInitialized'] = false;

      component['onClickOutside']();

      expect(closeSpy).not.toHaveBeenCalled();
    });
    it('should not call close when closeOnClickOutside is false', () => {
      const closeSpy = spyOn(component as any, 'close');
      component.closeOnClickOutside = false;
      component['_isInitialized'] = true;

      component['onClickOutside']();

      expect(closeSpy).not.toHaveBeenCalled();
    });
    it('should call close when closeOnClickOutside is true and component is initialized', () => {
      const closeSpy = spyOn(component as any, 'close');
      component.closeOnClickOutside = true;
      component['_isInitialized'] = true;

      component['onClickOutside']();

      expect(closeSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('close should set emit modelChange with false and set model to false', () => {
    const modelChangeEmitSpy = spyOn(component.modelChange, 'emit');
    component.model = true;

    component['close']();

    expect(component.model).toEqual(false);
    expect(modelChangeEmitSpy).toHaveBeenCalledOnceWith(false);
  });

});

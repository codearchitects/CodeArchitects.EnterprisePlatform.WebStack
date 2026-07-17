import { ShComponentsModule } from './../../../components/components.module';
import { IShValidatorMessageOptions, ShValidationMessageComponent } from '../../../components/validation-message/validation-message.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComplexTypeList, FormHandlerService, ShFormControl, ShFormGroupComponent } from '../../..';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

describe('ValidationMessage component', () => {
  let component: ShValidationMessageComponent<any, IShValidatorMessageOptions>;
  let fixture: ComponentFixture<ShValidationMessageComponent<any, IShValidatorMessageOptions>>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ShComponentsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShValidationMessageComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: 'myPropValue' };
    component.prop = 'prop';
    fixture.detectChanges();
    htmlElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    Object.defineProperty(component, 'touched', {
      value: true
    });
    fixture.detectChanges();
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });

  describe('errors', () => {
    it('getter should return empty array if there are no errors', () => {
      expect(component.errors).toEqual([]);
    });
    it('getter should return control errors keys', () => {
      Object.defineProperty(component['control'], 'errors', {
        value: {
          'my-err': true,
          'my-err2': true
        }
      });

      expect(component.errors).toEqual(['my-err', 'my-err2']);
    });
  });

  describe('warnings', () => {
    it('getter should return empty array if there are no warnings', () => {
      expect(component.warnings).toEqual([]);
    });
    it('getter should return control warnings keys', () => {
      Object.defineProperty(component['control'], 'warnings', {
        value: {
          'my-warn': true,
          'my-warn2': true
        }
      });

      expect(component.warnings).toEqual(['my-warn', 'my-warn2']);
    });
  });

  describe('constructor', () => {
    it('should set formHandler service', () => {
      expect(component['formHandler']).toBeDefined();
      expect(component['formHandler']).not.toBeNull();
      expect(component['formHandler']).toBeInstanceOf(FormHandlerService);
    });
    it('should set complexTypeList service', () => {
      expect(component['complexType']).toBeDefined();
      expect(component['complexType']).not.toBeNull();
    });
  });

  describe('ngOnChanges', () => {
    it('should call getControl', () => {
      const changes: SimpleChanges = {
        'myChange': new SimpleChange(undefined, undefined, false)
      };
      const spy = spyOn(component as any, 'getControl');

      component.ngOnChanges(changes);

      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call removeGroup and delete control when model changes', () => {
      const prevModel = { a: 'b' };
      const changes: SimpleChanges = {
        'model': new SimpleChange(prevModel, undefined, false)
      };
      const getControlSpy = spyOn(component as any, 'getControl');
      const removeGroupSpy = spyOn(component['formHandler'], 'removeGroup');

      component.ngOnChanges(changes);

      expect(removeGroupSpy).toHaveBeenCalledOnceWith(prevModel);
      expect(component['control']).toBeUndefined();
      expect(getControlSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('ngOnInit should call getControl', () => {
    const getControlSpy = spyOn(component as any, 'getControl');

    component.ngOnInit();

    expect(getControlSpy).toHaveBeenCalledTimes(1);
  });

  it('getDefaultOptions should get options correctly', () => {
    const opts = component['getDefaultOptions']() as IShValidatorMessageOptions;

    expect(opts.showValidationMessage).toBeTruthy();
    expect(opts.messages).toEqual({});
  });

  describe('isComplexType', () => {
    class MyClass {
      myProp: string;
    }
    class MyClass1 {
      myProp: number;
    }
    class MyClass2 {
      myProp: boolean;
    }
    it('should return true since value type is in complext type list', () => {
      const obj = new MyClass1();
      component['complexType'].types = [MyClass, MyClass1];

      expect(component['isComplexType'](obj)).toBeTruthy();
    });
    it('should return false since value type is not in complext type list', () => {
      const obj = new MyClass2();
      component['complexType'].types = [MyClass, MyClass1];

      expect(component['isComplexType'](obj)).toBeFalsy();
    });
  });

  describe('getControl', () => {
    it('should call getGroup with model if prop is undefined and set control', () => {
      const fakeModel = { myModel: 'foo' };
      const fakeGroup = new FormGroup({ 'a': new ShFormControl() });
      const getGroupSpy = spyOn(component['formHandler'], 'getGroup').and.returnValue(fakeGroup);
      component['control'] = undefined;
      component.prop = undefined;
      component.model = fakeModel;

      component['getControl']();

      expect(getGroupSpy).toHaveBeenCalledOnceWith(fakeModel);
      expect(component['control']).toEqual(fakeGroup);
    });
    it('should call getControl with model and prop if prop is defined and it has not complex type', () => {
      const fakeModel = { myModel: 'foo' };
      const fakeProp = 'prop';
      const fakeControl = new ShFormControl();
      const getControlSpy = spyOn(component['formHandler'], 'getControl').and.returnValue(fakeControl);
      component['control'] = undefined;
      component.model = fakeModel;
      component.prop = fakeProp;

      component['getControl']();

      expect(getControlSpy).toHaveBeenCalledOnceWith(fakeModel, fakeProp);
      expect(component['control']).toEqual(fakeControl);
    });
    it('should call getGroup with model prop and model if prop is defined and it has complex type', () => {
      const fakeModel = { myModel: 'foo' };
      const fakeProp = 'prop';
      const fakeGroup = new FormGroup({ 'b': new ShFormControl() });
      const getGroupSpy = spyOn(component['formHandler'], 'getGroup').and.returnValue(fakeGroup);
      const isComplexTypeSpy = spyOn(component as any, 'isComplexType').and.returnValue(true);
      component['control'] = undefined;
      component.model = fakeModel;
      component.prop = fakeProp;

      component['getControl']();

      expect(isComplexTypeSpy).toHaveBeenCalledOnceWith(fakeModel[fakeProp]);
      expect(getGroupSpy).toHaveBeenCalledOnceWith(fakeModel[fakeProp], fakeModel);
      expect(component['control']).toEqual(fakeGroup);
    });
  });

});

import { ShFormControl } from './../../../utilities/form-control.utility';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { AspectHelper, Context, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { FormHandlerService } from '../../../services/form-handler.service';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { BaseInputFixture } from '../../fixtures';
import { SimpleChange } from '@angular/core';

describe('BaseInput component', () => {
  let component: BaseInputFixture;
  let fixture: ComponentFixture<BaseInputFixture>;
  let htmlElement: HTMLDivElement;

  const mockedContext: Context = Context.edit;
  const mockedContextService = {
    context: mockedContext
  };

  const mockedLabel = 'baz';
  const mockedGetLabel = jasmine.createSpy().and.returnValue(mockedLabel);
  const mockedAspectHelper = {
    getLabel: mockedGetLabel
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseInputFixture],
      providers: [IdSequenceService, ValidatorHelper, FormHandlerService,
        { provide: AspectHelper, useValue: mockedAspectHelper },
        { provide: ContextService, useValue: mockedContextService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseInputFixture);
    component = fixture.debugElement.componentInstance;
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector<HTMLDivElement>('#base-input-component');
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });
  it('should return input class as string', () => {
    const classes = ['class1', 'class2', 'class3'];
    component['internalOptions'].inputClass = classes;

    expect(component.inputClass).toEqual('class1 class2 class3');
  });
  it('should return internal options readonly value', () => {
    const expectedValue = true;
    component['internalOptions'].isReadonly = expectedValue;

    expect(component.isReadonly).toEqual(expectedValue);
  });
  it('should set internal options readonly value', () => {
    const expectedValue = true;
    expect(component.isReadonly).toBeFalsy();

    component.isReadonly = expectedValue;
    expect(component['internalOptions'].isReadonly).toEqual(expectedValue);
  });
  describe('constructor side effects', () => {
    it('should set form handler service', () => {
      expect(component['formHandler']).toBeDefined();
      expect(component['formHandler']).not.toBeNull();
      expect(component['formHandler'] instanceof FormHandlerService).toBeTruthy();
    });
    it('should set aspect helper', () => {
      expect(component['_aspectHelper']).toBeDefined();
      expect(component['_aspectHelper']).not.toBeNull();
      expect(component['_aspectHelper']).toEqual(mockedAspectHelper as any);
    });
    it('should set context service', () => {
      expect(component['_contextService']).toBeDefined();
      expect(component['_contextService']).not.toBeNull();
      expect(component['_contextService']).toEqual(mockedContextService as any);
    });
  });
  describe('ngOnInit side effects', () => {
    it('should call createFormControl', () => {
      const spy = spyOn(component as any, 'createFormControl');
      spy.calls.reset();

      component.ngOnInit();

      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should set internal options placeholder if set', () => {
      const expectedPlaceholder = 'baz';
      component['internalOptions'].placeholder = expectedPlaceholder;

      component.ngOnInit();
      expect(component['placeholder']).toEqual(expectedPlaceholder);
    });
    it('should call aspect helper getLabel to set placeholder', () => {
      const model = { prop1: 'a' };
      const prop = 'prop1';
      component.prop = prop;
      component.model = model;
      mockedGetLabel.calls.reset();

      component.ngOnInit();
      expect(mockedGetLabel).toHaveBeenCalledTimes(1);
      expect(mockedGetLabel).toHaveBeenCalledWith(model, prop, mockedContext);
      expect(component['placeholder']).toEqual(mockedLabel);
    });
  });
  it('ngDoCheck should call right handlers', () => {
    const modelValuesChangeHandlerSpy = spyOn(component as any, 'modelValueChangesHandler');
    const checkDisablingSpy = spyOn(component as any, 'checkDisabling');
    modelValuesChangeHandlerSpy.calls.reset();
    checkDisablingSpy.calls.reset();

    component.ngDoCheck();
    expect(modelValuesChangeHandlerSpy).toHaveBeenCalledTimes(1);
    expect(checkDisablingSpy).toHaveBeenCalledTimes(1);
  });
  it('ngOnDestroy should call destroyFormControl', () => {
    const spy = spyOn(component as any, 'destroyFormControl');
    spy.calls.reset();

    component.ngOnDestroy();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should create form control', () => {
    const service = component['formHandler'];
    const expectedControl = new ShFormControl();
    const spy = spyOn(service, 'getControl').and.returnValue(expectedControl);
    const model = { prop1: 'a' };
    const prop = 'prop1';
    component.prop = prop;
    component.model = model;
    component['formControl'] = undefined;
    spy.calls.reset();

    component['createFormControl']();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(model, prop);
    expect(component['formControl']).toEqual(expectedControl);
  });
  it('should destroy form control', () => {
    const service = component['formHandler'];
    const spy = spyOn(service, 'removeControl');
    const model = { prop1: 'a' };
    const prop = 'prop1';
    component.prop = prop;
    component.model = model;
    spy.calls.reset();

    component['destroyFormControl']();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(model, prop);
  });
  it('getDefaultOptions should have input options', () => {
    const defaults = component['getDefaultOptions']();

    expect(defaults).toBeDefined();
    expect(defaults.placeholder).toEqual('');
    expect(defaults.inputClass).toEqual([]);
    expect((defaults as any).onChange).toBeDefined();
    expect(typeof (defaults as any).onChange).toEqual('function');
    expect((defaults as any).onChange(null)).toBeUndefined();
  });
  it('onControlValueChanges should call setModelValue when value has changed', () => {
    const model = { prop1: 'a' };
    const prop = 'prop1';
    const newValue = 'b';
    const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(newValue);
    const setModelValueSpy = spyOn(component as any, 'setModelValue');
    component.prop = prop;
    component.model = model;
    getControlValueSpy.calls.reset();
    setModelValueSpy.calls.reset();

    component['onControlValueChanges']();
    expect(getControlValueSpy).toHaveBeenCalledTimes(1);
    expect(setModelValueSpy).toHaveBeenCalledTimes(1);
    expect(setModelValueSpy).toHaveBeenCalledWith(newValue);
  });
  it('should call setControlValue ad onModelValueChanges when value has changed', () => {
    const model = { prop1: 'a' };
    const prop = 'prop1';
    const newValue = 'b';
    const onModelValueChanges = jasmine.createSpy();
    const getModeValueSpy = spyOn(component as any, 'getModelValue').and.returnValue(newValue);
    const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(model[prop]);
    const setControlValueSpy = spyOn(component as any, 'setControlValue');
    component.model = model;
    component.prop = prop;
    component['onModelValueChanges'] = onModelValueChanges;
    getModeValueSpy.calls.reset();
    getControlValueSpy.calls.reset();
    setControlValueSpy.calls.reset();

    component['modelValueChangesHandler']();
    expect(getModeValueSpy).toHaveBeenCalledTimes(1);
    expect(getControlValueSpy).toHaveBeenCalledTimes(1);
    expect(onModelValueChanges).toHaveBeenCalledTimes(1);
    expect(onModelValueChanges).toHaveBeenCalledWith(model[prop], newValue);
    expect(setControlValueSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledWith(newValue);
  });
  describe('check disabling', () => {
    it('should call formControl enable when component enable is true and formControl is disabled', () => {
      const control = new ShFormControl();
      component['formControl'] = control;
      component.enable = true;
      Object.defineProperty(control, 'disabled', {
        writable: true
      });
      (control as any).disabled = true;
      const spy = spyOn(control, 'enable');

      component['checkDisabling']();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call formControl disable when component enable is false and formControl is enabled', () => {
      const control = new ShFormControl();
      component['formControl'] = control;
      component.enable = false;
      Object.defineProperty(control, 'enabled', {
        writable: true
      });
      (control as any).enabled = true;
      const spy = spyOn(control, 'disable');

      component['checkDisabling']();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
  it('should return formControl value', () => {
    const control = new ShFormControl();
    const expectedValue = 'sample';
    Object.defineProperty(control, 'value', {
      writable: true
    });
    (control as any).value = expectedValue;
    component['formControl'] = control;

    expect(component['getControlValue']()).toEqual(expectedValue);
  });
  it('should call formControl setValue', () => {
    const expectedValue = 'foo';
    const control = new ShFormControl();
    component['formControl'] = control;
    const spy = spyOn(control, 'setValue');

    component['setControlValue'](expectedValue);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expectedValue);
  });
  it('should call formControl markAsDirty', () => {
    const control = new ShFormControl();
    component['formControl'] = control;
    const spy = spyOn(control, 'markAsDirty');

    component['markAsDirty']();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should delete formControl and create a new one when model changes', () => {
    const previousModel = { prop1: 'bar' };
    const prop = 'prop1';
    const newModel = { prop1: 'baz' };
    const change = new SimpleChange(previousModel, newModel, false);
    const service = component['formHandler'];
    const removeControlSpy = spyOn(service, 'removeControl');
    const createFormControlSpy = spyOn(component as any, 'createFormControl');
    component.model = previousModel;
    component.prop = prop;
    removeControlSpy.calls.reset();
    createFormControlSpy.calls.reset();

    component.ngOnChanges({ model: change });
    expect(removeControlSpy).toHaveBeenCalledTimes(1);
    expect(removeControlSpy).toHaveBeenCalledWith(previousModel, prop);
    expect(createFormControlSpy).toHaveBeenCalledTimes(1);
  });
});

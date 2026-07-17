import { ShFormControl } from './../../../utilities/form-control.utility';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { BehaviorSubject } from 'rxjs';
import { ILookupMulti } from '../../../components/base';
import { FormHandlerService } from '../../../services/form-handler.service';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { BaseLookupMultiFixture } from '../../fixtures';
import { PipeTransform } from '@angular/core';

describe('BaseLookupMulti component', () => {
  let component: BaseLookupMultiFixture;
  let fixture: ComponentFixture<BaseLookupMultiFixture>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseLookupMultiFixture],
      providers: [IdSequenceService, ValidatorHelper, FormHandlerService, AspectHelper, ContextService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLookupMultiFixture);
    component = fixture.debugElement.componentInstance;
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector<HTMLDivElement>('#base-lookup-multi-component');
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });
  it('should call extractValuesFromOptions onOptionsChanges', () => {
    const spy = spyOn(component as any, 'extractValuesFromOptions');
    spy.calls.reset();

    component['onOptionsChanges']();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('setControlValue should call formControl setValue for each value', () => {
    const newValue = 'sample';
    const formControl1 = new ShFormControl();
    const formControl2 = new ShFormControl();
    const mappedValues: ILookupMulti<string>[] = [
      {
        id: '0',
        label: 'foo',
        formControl: formControl1,
        ref: 'foo'
      },
      {
        id: '1',
        label: 'sample',
        formControl: formControl2,
        ref: 'sample'
      }
    ];
    component['values'] = mappedValues;
    const formControl1SetValueSpy = spyOn(formControl1, 'setValue');
    const formControl2SetValueSpy = spyOn(formControl2, 'setValue');
    formControl1SetValueSpy.calls.reset();
    formControl2SetValueSpy.calls.reset();

    component['setControlValue'](newValue);
    expect(formControl1SetValueSpy).toHaveBeenCalledTimes(1);
    expect(formControl1SetValueSpy).toHaveBeenCalledWith(false, { emitEvent: false });
    expect(formControl2SetValueSpy).toHaveBeenCalledTimes(1);
    expect(formControl2SetValueSpy).toHaveBeenCalledWith(true, { emitEvent: false });
  });
  it('should call setModelValue onControlValueChanges', () => {
    const modelValue = 'foo';
    const controlValue = ['sample'];
    const transformedValue = controlValue.map(v => v.toUpperCase());
    const getModelValueSpy = spyOn(component as any, 'getModelValue').and.returnValue(modelValue);
    const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(controlValue);
    const isEquivalentSpy = spyOn(component as any, 'isEquivalent').and.returnValue(false);
    const spyTransformSpy = spyOn(component['internalOptions'], 'transform').and.returnValue(transformedValue);
    const setModelValueSpy = spyOn(component as any, 'setModelValue');
    getModelValueSpy.calls.reset();
    getControlValueSpy.calls.reset();
    isEquivalentSpy.calls.reset();
    setModelValueSpy.calls.reset();

    component['onControlValueChanges']();
    expect(getModelValueSpy).toHaveBeenCalledTimes(1);
    expect(getControlValueSpy).toHaveBeenCalledTimes(2);
    expect(isEquivalentSpy).toHaveBeenCalledTimes(1);
    expect(isEquivalentSpy).toHaveBeenCalledWith(modelValue, controlValue);
    expect(spyTransformSpy).toHaveBeenCalledTimes(1);
    expect(spyTransformSpy).toHaveBeenCalledWith(controlValue);
    expect(setModelValueSpy).toHaveBeenCalledTimes(1);
    expect(setModelValueSpy).toHaveBeenCalledWith(transformedValue);
  });
  it('should call setControlValue and onModelValueChanges on modelValueChangesHandler', () => {
    const modelValue = ['foo'];
    const controlValue = 'sample';
    const getModelValueSpy = spyOn(component as any, 'getModelValue').and.returnValue(modelValue);
    const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(controlValue);
    const isEquivalentSpy = spyOn(component as any, 'isEquivalent').and.returnValue(false);
    const getSelectedValuesSpy = spyOn(component as any, 'getSelectedValues').and.returnValue(modelValue);
    const setControlValueSpy = spyOn(component as any, 'setControlValue');
    const modelChanges = jasmine.createSpy();
    getModelValueSpy.calls.reset();
    getControlValueSpy.calls.reset();
    isEquivalentSpy.calls.reset();
    setControlValueSpy.calls.reset();
    component['onModelValueChanges'] = modelChanges;

    component['modelValueChangesHandler']();
    expect(getModelValueSpy).toHaveBeenCalledTimes(1);
    expect(getControlValueSpy).toHaveBeenCalledTimes(1);
    expect(isEquivalentSpy).toHaveBeenCalledTimes(1);
    expect(isEquivalentSpy).toHaveBeenCalledWith(modelValue, controlValue);
    expect(modelChanges).toHaveBeenCalledTimes(1);
    expect(modelChanges).toHaveBeenCalledWith(controlValue, modelValue);
    expect(getSelectedValuesSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledWith(modelValue);
  });
  it('should set defaultOptions correctly', () => {
    const defaults = component['getDefaultOptions']();
    expect(defaults.values).toBeDefined();
    expect(defaults.values).toEqual([]);
    expect(defaults.equalityFunc).toBeDefined();
    expect(typeof defaults.equalityFunc === 'function').toBeTruthy();
    expect(defaults.equalityFunc('foo', 'foo')).toBeTruthy();
    expect(defaults.equalityFunc('foo', 'sample')).toBeFalsy();
    expect(defaults.transform).toBeDefined();
    expect(typeof defaults.transform === 'function').toBeTruthy();
    expect(() => defaults.transform(['foo'])).not.toThrowError();
  });
  describe('extractValuesFromOptions', () => {
    it('should next resetOptions', () => {
      const spy = spyOn(component['resetOptions$'], 'next');
      spy.calls.reset();

      component['extractValuesFromOptions']();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('shoud set internalOptions values if it is not an observable', () => {
      const values = ['a', 'b'];
      const spy = spyOn(component as any, 'setValues');
      component['internalOptions'].values = values;
      spy.calls.reset();

      component['extractValuesFromOptions']();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(values);
    });
    it('should set values when values is an observable', () => {
      const emit = ['a', 'b'];
      const values = new BehaviorSubject(emit);
      component['internalOptions'].values = values;
      const spy = spyOn(component as any, 'setValues');
      spy.calls.reset();

      component['extractValuesFromOptions']();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(emit);
    });
  });
  it('should set values correctly', () => {
    const values = ['a', 'b'];
    const mappedValues: ILookupMulti<string>[] = [
      {
        id: '0',
        label: 'a',
        formControl: new ShFormControl(),
        ref: 'a'
      },
      {
        id: '1',
        label: 'b',
        formControl: new ShFormControl(),
        ref: 'b'
      }
    ];
    const spy = spyOn(component as any, 'convertValue').and.returnValues(mappedValues[0], mappedValues[1]);
    spy.calls.reset();

    component['setValues'](values);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(component['values']).toEqual(mappedValues as any);
  });
  it('should convert value correctly', () => {
    const value = 0;
    const expectedIndex = '15';
    const expectedLabel = `${value}`;
    const expectedFormControl = new ShFormControl();
    const sequenceServiceSpy = spyOn(component['idSequence'], 'next').and.returnValue(expectedIndex);
    const getLabelSpy = spyOn(component as any, 'getLabel').and.returnValue(expectedLabel);
    const getFormControlSpy = spyOn(component as any, 'getFormControl').and.returnValue(expectedFormControl);
    sequenceServiceSpy.calls.reset();
    getLabelSpy.calls.reset();
    getFormControlSpy.calls.reset();

    const convertedValue = component['convertValue'](value);
    expect(sequenceServiceSpy).toHaveBeenCalledTimes(1);
    expect(getLabelSpy).toHaveBeenCalledTimes(1);
    expect(getFormControlSpy).toHaveBeenCalledTimes(1);
    expect(convertedValue).toBeDefined();
    expect(convertedValue.id).toEqual(expectedIndex);
    expect(convertedValue.label).toEqual(expectedLabel);
    expect(convertedValue.ref).toEqual(value);
    expect(convertedValue.formControl).toEqual(expectedFormControl);
  });
  describe('getLabel', () => {
    it('should return value as string', () => {
      const value = 10;
      expect(component['getLabel'](value)).toEqual(`${value}`);
    });
    it('should return transformed value when pipe is given', () => {
      const value = { myObj: 'myVal' };
      const transformedValue = value.myObj;
      const transform = jasmine.createSpy().and.returnValue(transformedValue);
      const pipe: PipeTransform = {
        transform
      };
      component['internalOptions'].valuesPipe = pipe;

      const label = component['getLabel'](value);
      expect(transform).toHaveBeenCalledTimes(1);
      expect(transform).toHaveBeenCalledWith(value);
      expect(label).toEqual(transformedValue);
    });
    it('should pass args to pipe and return transformed value', () => {
      const value = { myObj: 'myVal' };
      const transformedValue = value.myObj;
      const transform = jasmine.createSpy().and.returnValue(transformedValue);
      const pipe: PipeTransform = {
        transform
      };
      const pipeArgs = ['myArg'];
      component['internalOptions'].valuesPipe = pipe;
      component['internalOptions'].valuesPipeArgs = pipeArgs;

      const label = component['getLabel'](value);
      expect(transform).toHaveBeenCalledTimes(1);
      expect(transform).toHaveBeenCalledWith(value, ...pipeArgs);
      expect(label).toEqual(transformedValue);
    });
  });
  describe('getSelectedValues', () => {
    it('should return modelValue when there are no values', () => {
      const modelValue = ['sample'];
      const getModelValueSpy = spyOn(component as any, 'getModelValue').and.returnValue(modelValue);
      getModelValueSpy.calls.reset();

      component['values'] = undefined;
      const value = component['getSelectedValues']();
      expect(getModelValueSpy).toHaveBeenCalledTimes(1);
      expect(value).toEqual(modelValue);
    });
    it('should return selected ref value', () => {
      const mappedValues: ILookupMulti<number>[] = [
        {
          id: '0',
          label: 'c',
          formControl: new ShFormControl(),
          ref: 2
        },
        {
          id: '1',
          label: 'd',
          formControl: new ShFormControl(),
          ref: 3
        }
      ];
      component['values'] = mappedValues;
      const selectedValue = [mappedValues[1].ref];
      const isIncludedInModelSpy = spyOn(component as any, 'isIncludedInModel').and.callFake((ref) => selectedValue.includes(ref));
      isIncludedInModelSpy.calls.reset();

      const value = component['getSelectedValues']();
      expect(isIncludedInModelSpy).toHaveBeenCalledTimes(2);
      expect(isIncludedInModelSpy).toHaveBeenCalledWith(mappedValues[0].ref);
      expect(isIncludedInModelSpy).toHaveBeenCalledWith(mappedValues[1].ref);
      expect(value).toEqual(selectedValue);
    });
  });
  it('createFormControl should call setControlValue', () => {
    const selectedValues = ['val1', 'val2'];
    const getSelectedValuesSpy = spyOn(component as any, 'getSelectedValues').and.returnValue(selectedValues);
    const setControlValueSpy = spyOn(component as any, 'setControlValue');
    getSelectedValuesSpy.calls.reset();
    setControlValueSpy.calls.reset();

    component['createFormControl']();
    expect(getSelectedValuesSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledWith(selectedValues);
  });
  describe('isIncludedInModel', () => {
    it('should return false when model value is undefined or null', () => {
      const getModelValueSpy = spyOn(component as any, 'getModelValue').and.returnValue(undefined);
      getModelValueSpy.calls.reset();

      expect(component['isIncludedInModel']('foo')).toBeFalsy();
    });
    it('should return false when value is not in model', () => {
      const modelValue = ['foo', 'sample', 'bar'];
      const value = 'baz';
      const equalityFuncSpy = spyOn(component['internalOptions'], 'equalityFunc').and.callFake((model, control) => model === control);
      equalityFuncSpy.calls.reset();
      spyOn(component as any, 'getModelValue').and.returnValue(modelValue);

      expect(component['isIncludedInModel'](value)).toBeFalsy();
      expect(equalityFuncSpy).toHaveBeenCalledTimes(3);
    });
    it('should return true when value is in model', () => {
      const modelValue = ['foo', 'sample', 'bar'];
      spyOn(component as any, 'getModelValue').and.returnValue(modelValue);

      expect(component['isIncludedInModel']('sample')).toBeTruthy();
    });
  });
  describe('isIncludedInControl', () => {
    it('should return false control model value is undefined or null', () => {
      const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(undefined);
      getControlValueSpy.calls.reset();

      expect(component['isIncludedInControl']('foo')).toBeFalsy();
    });
    it('should return false when model value is not in control', () => {
      const controlValue = ['foo', 'sample', 'bar'];
      const model = 'baz';
      const equalityFuncSpy = spyOn(component['internalOptions'], 'equalityFunc').and.callFake((model, control) => model === control);
      equalityFuncSpy.calls.reset();
      spyOn(component as any, 'getControlValue').and.returnValue(controlValue);

      expect(component['isIncludedInControl'](model)).toBeFalsy();
      expect(equalityFuncSpy).toHaveBeenCalledTimes(3);
    });
    it('should return true when model value is in control', () => {
      const controlValue = ['foo', 'sample', 'bar'];
      spyOn(component as any, 'getControlValue').and.returnValue(controlValue);

      expect(component['isIncludedInControl']('sample')).toBeTruthy();
    });
  });
  it('should return form control calling addToControl and removeFromControl correctly', () => {
    const modelValue = ['val1', 'val2'];
    const value = modelValue[0];
    const getModelValueSpy = spyOn(component as any, 'getModelValue').and.returnValue(modelValue);
    const isIncludedInModelSpy = spyOn(component as any, 'isIncludedInModel').and.returnValue(true);
    const addToControlSpy = spyOn(component as any, 'addToControl');
    const removeFromControlSpy = spyOn(component as any, 'removeFromControl');
    getModelValueSpy.calls.reset();
    isIncludedInModelSpy.calls.reset();
    addToControlSpy.calls.reset();
    removeFromControlSpy.calls.reset();

    const formControl = component['getFormControl'](value);
    expect(formControl).toBeDefined();
    expect(formControl instanceof ShFormControl).toBeTruthy();
    expect(getModelValueSpy).toHaveBeenCalledTimes(1);
    expect(isIncludedInModelSpy).toHaveBeenCalledTimes(1);
    expect(isIncludedInModelSpy).toHaveBeenCalledWith(value);

    formControl.setValue(true, { emitEvent: true });
    expect(addToControlSpy).toHaveBeenCalledTimes(1);
    expect(addToControlSpy).toHaveBeenCalledWith(value);

    formControl.setValue(false, { emitEvent: true });
    expect(removeFromControlSpy).toHaveBeenCalledTimes(1);
    expect(removeFromControlSpy).toHaveBeenCalledWith(value);
  });
  describe('isEquivalent', () => {
    it('should return false when modelValues or lookupValues are not defined', () => {
      expect(component['isEquivalent'](undefined, [])).toBeFalsy();
      expect(component['isEquivalent']([], undefined)).toBeFalsy();
    });
    it('should call model isIncludedInControl for each modelValue', () => {
      const modelValues = ['a', 'b', 'c'];
      const isIncludedInControlSpy = spyOn(component as any, 'isIncludedInControl').and.returnValue(true);
      isIncludedInControlSpy.calls.reset();

      component['isEquivalent'](modelValues, []);
      expect(isIncludedInControlSpy).toHaveBeenCalledTimes(3);
      expect(isIncludedInControlSpy).toHaveBeenCalledWith(modelValues[0]);
      expect(isIncludedInControlSpy).toHaveBeenCalledWith(modelValues[1]);
      expect(isIncludedInControlSpy).toHaveBeenCalledWith(modelValues[2]);
    });
    it('should call model isIncludedInModel for each controlValue', () => {
      const controlValues = ['a', 'b', 'c'];
      const isIncludedInModelSpy = spyOn(component as any, 'isIncludedInModel').and.returnValue(true);
      isIncludedInModelSpy.calls.reset();

      component['isEquivalent']([], controlValues);
      expect(isIncludedInModelSpy).toHaveBeenCalledTimes(3);
      expect(isIncludedInModelSpy).toHaveBeenCalledWith(controlValues[0]);
      expect(isIncludedInModelSpy).toHaveBeenCalledWith(controlValues[1]);
      expect(isIncludedInModelSpy).toHaveBeenCalledWith(controlValues[2]);
    });
    it('should return false when values are not equivalent', () => {

      const modelValue = [0, 1, 3, 4];
      const controlValue = [0, 1, 3, 4];
      spyOn(component as any, 'getModelValue').and.returnValue(modelValue);
      spyOn(component as any, 'getControlValue').and.returnValue(controlValue);

      const modelValues = [3, 4];
      const lookupValues = [2];

      expect(component['isEquivalent'](modelValues, lookupValues)).toBeFalsy();

      const modelValues1 = [10, 3, 4];
      const lookupValues1 = [1];
      expect(component['isEquivalent'](modelValues1, lookupValues1)).toBeFalsy();
    });
    it('should return true when values are equivalent', () => {
      const modelValue = [0, 1, 2];
      const controlValue = [0, 1, 2];
      spyOn(component as any, 'getModelValue').and.returnValue(modelValue);
      spyOn(component as any, 'getControlValue').and.returnValue(controlValue);

      const modelValues = [0, 1];
      const controlValues = [0, 2];

      expect(component['isEquivalent'](modelValues, controlValues)).toBeTruthy();
    });
  });
  it('addToControl should call setControlValue with new value', () => {
    const controlValues = [0, 1, 2];
    const value = 3;
    const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(controlValues);
    const setControlValueSpy = spyOn(component as any, 'setControlValue');
    getControlValueSpy.calls.reset();
    setControlValueSpy.calls.reset();

    component['addToControl'](value);
    expect(getControlValueSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledWith([...controlValues, value]);
  });
  it('removeFromControl should call setControlValue without remove value', () => {
    const controlValues = [0, 1, 2];
    const value = 1;
    const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(controlValues);
    const setControlValueSpy = spyOn(component as any, 'setControlValue');
    getControlValueSpy.calls.reset();
    setControlValueSpy.calls.reset();

    component['removeFromControl'](value);
    expect(getControlValueSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledWith([0, 2]);
  });
  describe('isObservable', () => {
    it('should return false', () => {
      expect(component['isObservable']({ myVal: null })).toBeFalsy();
    });
    it('should return true', () => {
      expect(component['isObservable'](new BehaviorSubject(null))).toBeTruthy();
    });
  });
});

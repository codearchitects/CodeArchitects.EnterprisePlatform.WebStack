import { PipeTransform } from '@angular/core';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { BehaviorSubject } from 'rxjs';
import { ILookupSingle } from '../../../components/base';
import { FormHandlerService } from '../../../services/form-handler.service';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { BaseLookupSingleFixture } from '../../fixtures';

describe('BaseLookupSingle component', () => {
  let component: BaseLookupSingleFixture;
  let fixture: ComponentFixture<BaseLookupSingleFixture>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseLookupSingleFixture],
      providers: [IdSequenceService, ValidatorHelper, FormHandlerService, AspectHelper, ContextService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLookupSingleFixture);
    component = fixture.debugElement.componentInstance;
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector<HTMLDivElement>('#base-lookup-single-component');
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
  it('should call setModelValue onControlValueChanges', () => {
    const modelValue = 'foo';
    const controlValue = 'sample';
    const transformedValue = controlValue.toUpperCase();
    const getModelValueSpy = spyOn(component as any, 'getModelValue').and.returnValue(modelValue);
    const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(controlValue);
    const equalityFuncSpy = spyOn(component['internalOptions'], 'equalityFunc').and.returnValue(false);
    const spyTransformSpy = spyOn(component['internalOptions'], 'transform').and.returnValue(transformedValue);
    const setModelValueSpy = spyOn(component as any, 'setModelValue');
    getModelValueSpy.calls.reset();
    getControlValueSpy.calls.reset();
    equalityFuncSpy.calls.reset();
    setModelValueSpy.calls.reset();

    component['onControlValueChanges']();
    expect(getModelValueSpy).toHaveBeenCalledTimes(1);
    expect(getControlValueSpy).toHaveBeenCalledTimes(2);
    expect(equalityFuncSpy).toHaveBeenCalledTimes(1);
    expect(equalityFuncSpy).toHaveBeenCalledWith(modelValue, controlValue);
    expect(spyTransformSpy).toHaveBeenCalledTimes(1);
    expect(spyTransformSpy).toHaveBeenCalledWith(controlValue);
    expect(setModelValueSpy).toHaveBeenCalledTimes(1);
    expect(setModelValueSpy).toHaveBeenCalledWith(transformedValue);
  });
  it('should call setControlValue and onModelValueChanges on modelValueChangesHandler', () => {
    const modelValue = 'foo';
    const controlValue = 'sample';
    const getModelValueSpy = spyOn(component as any, 'getModelValue').and.returnValue(modelValue);
    const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(controlValue);
    const equalityFuncSpy = spyOn(component['internalOptions'], 'equalityFunc').and.returnValue(false);
    const getSelectedValueSpy = spyOn(component as any, 'getSelectedValue').and.returnValue(modelValue);
    const setControlValueSpy = spyOn(component as any, 'setControlValue');
    const modelChanges = jasmine.createSpy();
    getModelValueSpy.calls.reset();
    getControlValueSpy.calls.reset();
    equalityFuncSpy.calls.reset();
    setControlValueSpy.calls.reset();
    component['onModelValueChanges'] = modelChanges;

    component['modelValueChangesHandler']();
    expect(getModelValueSpy).toHaveBeenCalledTimes(1);
    expect(getControlValueSpy).toHaveBeenCalledTimes(1);
    expect(equalityFuncSpy).toHaveBeenCalledTimes(1);
    expect(equalityFuncSpy).toHaveBeenCalledWith(modelValue, controlValue);
    expect(modelChanges).toHaveBeenCalledTimes(1);
    expect(modelChanges).toHaveBeenCalledWith(controlValue, modelValue);
    expect(getSelectedValueSpy).toHaveBeenCalledTimes(1);
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
    expect(() => defaults.transform('foo')).not.toThrowError();
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
      const spy = spyOn(component, 'setValues');
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
      const spy = spyOn(component, 'setValues');
      spy.calls.reset();

      component['extractValuesFromOptions']();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(emit);
    });
  });
  it('should set values correctly', () => {
    const values = ['a', 'b'];
    const mappedValues: ILookupSingle<string>[] = [
      {
        id: '0',
        label: 'a',
        ref: 'a'
      },
      {
        id: '1',
        label: 'b',
        ref: 'b'
      }
    ];
    const spy = spyOn(component as any, 'convertValue').and.returnValues(mappedValues[0], mappedValues[1]);
    spy.calls.reset();

    component.setValues(values);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(component['values']).toEqual(mappedValues as any);
  });
  describe('getValues', () => {
    it('should return empty array when values are empty', () => {
      expect(component.getValues()).toEqual([]);
    });
    it('should return undefined when values are undefined', () => {
      spyOn(component['values'], 'map').and.returnValue(undefined);
      expect(component.getValues()).toEqual([]);
    });
    const values: ILookupSingle<number>[] = [
      {
        id: '0',
        label: 'a',
        ref: 1
      },
      {
        id: '1',
        label: 'b',
        ref: 2
      }
    ];
    it('should return all values when index is not given', () => {
      component['values'] = values;
      expect(component.getValues()).toEqual([1, 2]);
    });
    it('should return specific value when index is given', () => {
      const index = 1;
      component['values'] = values;
      expect(component.getValues(index)).toEqual(values[index].ref);
    });
  });
  it('should add value', () => {
    const mappedValue: ILookupSingle<number> = {
      id: '2',
      label: 'c',
      ref: 2
    };
    const mappedValues: ILookupSingle<number>[] = [
      {
        id: '0',
        label: 'a',
        ref: 0
      },
      {
        id: '1',
        label: 'b',
        ref: 1
      }
    ];
    component['values'] = [...mappedValues];
    const spy = spyOn(component as any, 'convertValue').and.returnValue(mappedValue);
    spy.calls.reset();

    component.addValue(2);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(2);
    expect(component['values'].length).toEqual(mappedValues.length + 1);
    expect(component['values']).toEqual([...mappedValues, mappedValue]);
  });
  it('should call setControlValue with value at given index', () => {
    const mappedValues: ILookupSingle<number>[] = [
      {
        id: '0',
        label: 'a',
        ref: 0
      },
      {
        id: '1',
        label: 'b',
        ref: 1
      }
    ];
    component['values'] = mappedValues;
    const index = 1;
    const spyGetValues = spyOn(component, 'getValues').and.returnValue(mappedValues.map(value => value.ref));
    const spySetControlValue = spyOn(component as any, 'setControlValue');
    spyGetValues.calls.reset();
    spySetControlValue.calls.reset();

    component.setValueAtIndex(index);
    expect(spyGetValues).toHaveBeenCalledTimes(1);
    expect(spySetControlValue).toHaveBeenCalledTimes(1);
    expect(spySetControlValue).toHaveBeenCalledWith(mappedValues[index].ref);
  });
  describe('getSelectedIndex', () => {
    it('should return -1 if values when not set', () => {
      expect(component.getSelectedIndex()).toEqual(-1);
    });
    it('should get index of selected item', () => {
      const mappedValues: ILookupSingle<number>[] = [
        {
          id: '0',
          label: 'c',
          ref: 2
        },
        {
          id: '1',
          label: 'd',
          ref: 3
        }
      ];
      component['values'] = mappedValues;
      const expectedIndex = 0;
      const spyGetValues = spyOn(component, 'getValues').and.returnValue(mappedValues.map(value => value.ref));
      const spyGetControlValue = spyOn(component as any, 'getControlValue').and.returnValue(mappedValues[expectedIndex].ref);
      spyGetValues.calls.reset();
      spyGetControlValue.calls.reset();

      expect(component.getSelectedIndex()).toEqual(expectedIndex);
      expect(spyGetValues).toHaveBeenCalledTimes(1);
      expect(spyGetControlValue).toHaveBeenCalledTimes(1);
    });
  });
  describe('isIndexSelected', () => {
    it('should return false when values is not set', () => {
      const spy = spyOn(component, 'getValues').and.returnValue(undefined);
      expect(component.isIndexSelected(0)).toBeFalsy();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    const mappedValues: ILookupSingle<number>[] = [
      {
        id: '0',
        label: 'c',
        ref: 2
      },
      {
        id: '1',
        label: 'd',
        ref: 3
      }
    ];
    it('should return false when index is not selected', () => {
      component['values'] = mappedValues;
      const selectedIndex = 1;
      const selectedIndexValue = mappedValues[selectedIndex].ref;
      const index = 0;
      const spyGetValues = spyOn(component, 'getValues').and.returnValue(mappedValues.map(value => value.ref));
      const spyGetSelectedValue = spyOn(component as any, 'getSelectedValue').and.returnValue(selectedIndexValue);
      spyGetValues.calls.reset();
      spyGetSelectedValue.calls.reset();

      expect(component.isIndexSelected(index)).toBeFalsy();
      expect(spyGetValues).toHaveBeenCalledTimes(1);
      expect(spyGetSelectedValue).toHaveBeenCalledTimes(1);
    });
    it('should return true when index is selected', () => {
      component['values'] = mappedValues;
      const selectedIndex = 1;
      const selectedIndexValue = mappedValues[selectedIndex].ref;
      const spyGetValues = spyOn(component, 'getValues').and.returnValue(mappedValues.map(value => value.ref));
      const spyGetSelectedValue = spyOn(component as any, 'getSelectedValue').and.returnValue(selectedIndexValue);
      spyGetValues.calls.reset();
      spyGetSelectedValue.calls.reset();

      expect(component.isIndexSelected(selectedIndex)).toBeTruthy();
      expect(spyGetValues).toHaveBeenCalledTimes(1);
      expect(spyGetSelectedValue).toHaveBeenCalledTimes(1);
    });
  });
  it('should convert value correctly', () => {
    const value = 0;
    const expectedIndex = '15';
    const expectedLabel = `${value}`;
    const sequenceServiceSpy = spyOn(component['idSequence'], 'next').and.returnValue(expectedIndex);
    const getLabelSpy = spyOn(component as any, 'getLabel').and.returnValue(expectedLabel);
    sequenceServiceSpy.calls.reset();
    getLabelSpy.calls.reset();

    const convertedValue = component['convertValue'](value);
    expect(sequenceServiceSpy).toHaveBeenCalledTimes(1);
    expect(getLabelSpy).toHaveBeenCalledTimes(1);
    expect(convertedValue).toBeDefined();
    expect(convertedValue.id).toEqual(expectedIndex);
    expect(convertedValue.label).toEqual(expectedLabel);
    expect(convertedValue.ref).toEqual(value);
  });
  describe('getLabel', () => {
    it('should return empty string when value is null', () => {
      expect(component['getLabel'](null)).toEqual('');
    });
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
  describe('getSelectedValue', () => {
    it('should return modelValue when there are no values', () => {
      const modelValue = 'sample';
      const getModelValueSpy = spyOn(component as any, 'getModelValue').and.returnValue(modelValue);
      getModelValueSpy.calls.reset();

      const value = component['getSelectedValue']();
      expect(getModelValueSpy).toHaveBeenCalledTimes(1);
      expect(value).toEqual(modelValue);
    });
    it('should return selected ref value', () => {
      const mappedValues: ILookupSingle<number>[] = [
        {
          id: '0',
          label: 'c',
          ref: 2
        },
        {
          id: '1',
          label: 'd',
          ref: 3
        }
      ];
      component['values'] = mappedValues;
      const selectedValue = mappedValues[1].ref;
      const getModelValueSpy = spyOn(component as any, 'getModelValue').and.returnValue(selectedValue);
      const equalityFuncSpy = spyOn(component['internalOptions'], 'equalityFunc').and.callFake((modelVal, ref) => modelVal === ref);
      equalityFuncSpy.calls.reset();
      getModelValueSpy.calls.reset();

      const value = component['getSelectedValue']();
      expect(getModelValueSpy).toHaveBeenCalledTimes(2);
      expect(equalityFuncSpy).toHaveBeenCalledTimes(2);
      expect(equalityFuncSpy).toHaveBeenCalledWith(selectedValue, mappedValues[0].ref);
      expect(equalityFuncSpy).toHaveBeenCalledWith(selectedValue, mappedValues[1].ref);
      expect(value).toEqual(selectedValue);
    });
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

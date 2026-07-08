import { Component, DebugElement, ElementRef, Injector, PipeTransform, provideZoneChangeDetection, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AspectHelper, Context, ContextService } from '@ca-webstack/ng-aspects';
import { IResourceParams, PolicyEngineService, ResourceService } from '@ca-webstack/ng-policy-engine';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { CaepSimpleOptionsChange } from '../../models';
import { CaepFormHandlerService, CaepIdSequenceService, CaepPipeMapperService } from '../../services';
import { CaepFormControl, PickAll } from '../../utilities';
import { CaepOptionComponent } from '../option/option.component';
import {
  CaepBaseLookupMultiComponent,
  CaepBaseLookupMultiOptions,
  ICaepBaseLookupMultiOptions,
  ICaepLookupMulti
} from './base-lookup-multi.component';

class SamplePipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }
}

interface IBaseLookupMultiChildFixtureOptions extends PickAll<BaseLookupMultiChildFixtureOptions> {}

class BaseLookupMultiChildFixtureOptions extends CaepBaseLookupMultiOptions<string, string> {
  dropdownWidth?: string;

  constructor(options?: IBaseLookupMultiChildFixtureOptions) {
    super(options);
  }
}

@Component({
    template: '<span id="base-lookup-multi-child">BaseLookupMulti Component Child Fixture</span>',
    standalone: false
})
class BaseLookupMultiChildFixtureComponent extends CaepBaseLookupMultiComponent<
  string,
  string,
  BaseLookupMultiChildFixtureOptions
> {
  constructor(injector: Injector) {
    super(injector, (value?: IBaseLookupMultiChildFixtureOptions) => new BaseLookupMultiChildFixtureOptions(value));
  }
}

@Component({
    template: '<span id="base-lookup-multi-child">BaseLookupMulti Component Child Fixture</span>',
    standalone: false
})
class BaseLookupMultiChildFixtureWithoutOptionsComponent extends CaepBaseLookupMultiComponent<string, string> {
  constructor(injector: Injector) {
    super(injector);
  }
}

describe('BaseLookupMultiComponent', () => {
  let fixture: ComponentFixture<BaseLookupMultiChildFixtureComponent>,
    component: BaseLookupMultiChildFixtureComponent,
    element: HTMLElement,
    rootControlElement: HTMLSpanElement,
    debugEl: DebugElement,
    formControl: CaepFormControl,
    mockPolicyEngineService,
    mockResourceService,
    mockIdSequenceService,
    mockFormHandlerService,
    mockAspectHelper,
    mockContextService,
    mockPipeMapperService,
    mockElementRef,
    mockInjector;
  const mockUri = 'mockUri',
    mockResource = { uri: mockUri } as IResourceParams,
    mockLabel = 'mockLabel',
    mockContext: Context = Context.edit;

  beforeEach(() => {
    formControl = new CaepFormControl();
    mockPolicyEngineService = jasmine.createSpyObj('mockPolicyEngine', ['observePolicies']);
    mockPolicyEngineService.observePolicies.and.returnValue(of({}));
    mockResourceService = jasmine.createSpyObj('mockResource', ['getResource']);
    mockResourceService.getResource.and.returnValue(mockResource);
    mockIdSequenceService = jasmine.createSpyObj('mockIdSequence', ['next']);
    mockIdSequenceService.next.and.returnValue('id-0');
    mockFormHandlerService = jasmine.createSpyObj('mockFormHandler', ['getControl', 'removeControl']);
    mockFormHandlerService.getControl.and.returnValue(formControl);
    mockAspectHelper = jasmine.createSpyObj('mockAspectHelper', ['getLabel']);
    mockAspectHelper.getLabel.and.returnValue(mockLabel);
    mockContextService = jasmine.createSpyObj('mockContext', {}, { context: mockContext });
    mockPipeMapperService = jasmine.createSpyObj('mockPipeMapper', ['findPipeByName']);
    mockPipeMapperService.findPipeByName.and.returnValue(SamplePipe);
    mockElementRef = jasmine.createSpyObj('elementRef', {}, { nativeElement: {} });
    mockInjector = jasmine.createSpyObj('injector', ['get']);
    mockInjector.get.and.callFake((token: Type<any>) => {
      if (token === CaepIdSequenceService) return mockIdSequenceService;
      else if (token === ElementRef) return mockElementRef;
      else return jasmine.createSpy();
    });
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [BaseLookupMultiChildFixtureComponent],
      providers: [
        { provide: CaepIdSequenceService, useValue: mockIdSequenceService },
        { provide: PolicyEngineService, useValue: mockPolicyEngineService },
        { provide: ResourceService, useValue: mockResourceService },
        { provide: CaepFormHandlerService, useValue: mockFormHandlerService },
        { provide: AspectHelper, useValue: mockAspectHelper },
        { provide: ContextService, useValue: mockContextService },
        { provide: CaepPipeMapperService, useValue: mockPipeMapperService },
        provideZoneChangeDetection()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLookupMultiChildFixtureComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    debugEl = fixture.debugElement;
    rootControlElement = element.querySelector<HTMLSpanElement>('#base-lookup-multi-child');
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
    expect(element).toBeDefined();
    expect(element).not.toBeNull();
    expect(debugEl).toBeDefined();
    expect(rootControlElement).toBeDefined();
    expect(rootControlElement).not.toBeNull();
  });

  describe('constructor', () => {
    it('should initialize properties', () => {
      expect(component.selectedLabels).toEqual([]);
      expect(component.resetOptions$).toBeInstanceOf(Subject);
    });
  });

  describe('setControlValue', () => {
    it('should set control value and selected labels calling updateValuesStateAndSelectedLabels method', () => {
      const expectedValue = ['value1'];
      const spyUpdateValuesStateAndSelectedLabels = spyOn<any>(component, 'updateValuesStateAndSelectedLabels');
      component.formControl = formControl;
      component.setControlValue(expectedValue);
      expect(component.formControl.value).toEqual(expectedValue);
      expect(spyUpdateValuesStateAndSelectedLabels).toHaveBeenCalledTimes(1);
    });
  });

  describe('onControlValueChanges', () => {
    it("should call setModelValue with transform option's result if isEquivalent method returns false", () => {
      const modelValue = ['value1'];
      const controlValue = ['VALUE2'];
      const transformedValue = ['value2'];
      const spySetModelValue = spyOn(component, 'setModelValue');
      const spyIsEquivalent = spyOn<any>(component, 'isEquivalent').and.returnValue(false);
      const spyTransform = spyOn(component.options, 'transform').and.returnValue(transformedValue);
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      component.onControlValueChanges();
      expect(spyIsEquivalent).toHaveBeenCalledOnceWith(modelValue, controlValue);
      expect(spySetModelValue).toHaveBeenCalledOnceWith(transformedValue);
      expect(spyTransform).toHaveBeenCalledOnceWith(controlValue);
    });

    it('should not call setModelValue method if isEquivalent method returns true', () => {
      const modelValue = ['value1'];
      const controlValue = ['VALUE1'];
      const spySetModelValue = spyOn(component, 'setModelValue');
      const spyIsEquivalent = spyOn<any>(component, 'isEquivalent').and.returnValue(true);
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      component.onControlValueChanges();
      expect(spyIsEquivalent).toHaveBeenCalledOnceWith(modelValue, controlValue);
      expect(spySetModelValue).not.toHaveBeenCalled();
    });
  });

  describe('modelValueChangesHandler', () => {
    it('should call setControlValue and onModelValueChanges handler if isEquivalent method returns false', () => {
      const modelValue = ['value2'];
      const controlValue = ['VALUE1'];
      const selectedValues = ['VALUE2'];
      const spySetControlValue = spyOn(component, 'setControlValue');
      const spyIsEquivalent = spyOn<any>(component, 'isEquivalent').and.returnValue(false);
      const spyGetSelectedValues = spyOn<any>(component, 'getSelectedValues').and.returnValue(selectedValues);
      const spyOnModelValueChanges = jasmine.createSpy();
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      component.onModelValueChanges = spyOnModelValueChanges;
      component.modelValueChangesHandler();
      expect(spyIsEquivalent).toHaveBeenCalledOnceWith(modelValue, controlValue);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(selectedValues);
      expect(spyOnModelValueChanges).toHaveBeenCalledOnceWith(controlValue, modelValue);
      expect(spyGetSelectedValues).toHaveBeenCalledTimes(1);
    });

    it('should not call setControlValue and onModelValueChanges handler if isEquivalent method returns true', () => {
      const modelValue = ['value1'];
      const controlValue = ['VALUE1'];
      const spySetControlValue = spyOn(component, 'setControlValue');
      const spyIsEquivalent = spyOn<any>(component, 'isEquivalent').and.returnValue(true);
      const spyOnModelValueChanges = jasmine.createSpy();
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      component.onModelValueChanges = spyOnModelValueChanges;
      component.modelValueChangesHandler();
      expect(spyIsEquivalent).toHaveBeenCalledOnceWith(modelValue, controlValue);
      expect(spySetControlValue).not.toHaveBeenCalled();
      expect(spyOnModelValueChanges).not.toHaveBeenCalled();
    });
  });

  describe('extractValuesFromOptions', () => {
    it('should call next on resetOptions$ subject', () => {
      const spyNext = spyOn(component.resetOptions$, 'next');
      component.extractValuesFromOptions();
      expect(spyNext).toHaveBeenCalledTimes(1);
    });

    it('should set values if option values are not an observable', () => {
      const values = ['value1', 'value2'];
      const spySetValues = spyOn(component, 'setValues');
      component.options.values = values;
      component.extractValuesFromOptions();
      expect(spySetValues).toHaveBeenCalledOnceWith(values);
    });

    it('should set values and call setControlValue method if option values are an observable', () => {
      const values = ['value1', 'value2'];
      const spySetValues = spyOn(component, 'setValues');
      const spySetControlValue = spyOn(component, 'setControlValue');
      const selectedValues = [values[1]];
      spyOn<any>(component, 'getSelectedValues').and.returnValue(selectedValues);
      component.options.values = new BehaviorSubject(values);
      component.formControl = formControl;
      component.extractValuesFromOptions();
      expect(spySetValues).toHaveBeenCalledOnceWith(values);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(selectedValues);
    });

    it('should set values if option values are an observable without calling setControlValue method if formControl is not defined', () => {
      const values = ['value1', 'value2'];
      const spySetValues = spyOn(component, 'setValues');
      const spySetControlValue = spyOn(component, 'setControlValue');
      component.options.values = new BehaviorSubject(values);
      component.formControl = undefined;
      component.extractValuesFromOptions();
      expect(spySetValues).toHaveBeenCalledOnceWith(values);
      expect(spySetControlValue).not.toHaveBeenCalled();
    });
  });

  it('should set values correctly', () => {
    const values = ['value1', 'value2'];
    const expectedLookups: ICaepLookupMulti<string>[] = [
      { id: 'id-0', label: values[0], ref: values[0], formControl: new CaepFormControl(false) },
      { id: 'id-1', label: values[1], ref: values[1], formControl: new CaepFormControl(false) }
    ];
    const spyConvertValues = spyOn(component, 'convertValue');
    spyConvertValues.and.returnValues(expectedLookups[0], expectedLookups[1]);
    component.setValues(values);
    expect(spyConvertValues).toHaveBeenCalledTimes(2);
    expect(component.values).toEqual(expectedLookups);
  });

  describe('convertValue', () => {
    it('should convert value correctly if it is not an CaepOptionComponent instance', () => {
      const value = 'value1';
      const expectedFormControl = new CaepFormControl(false);
      spyOn(component, 'getLabel').and.returnValue(value);
      spyOn(component, 'getFormControl').and.returnValue(expectedFormControl);
      const expectedLookup: ICaepLookupMulti<string> = {
        id: 'id-0',
        label: value,
        ref: value,
        formControl: expectedFormControl
      };
      const actualLookup = component.convertValue(value);
      expect(actualLookup).toEqual(expectedLookup);
    });

    it('should convert value correctly if it is an CaepOptionComponent instance', () => {
      const value = new CaepOptionComponent<string>(mockInjector);
      value.text = 'Zero';
      value.value = '0';
      const expectedFormControl = new CaepFormControl(false);
      spyOn(component, 'getFormControl').and.returnValue(expectedFormControl);
      const expectedLookup: ICaepLookupMulti<string> = {
        id: 'id-0',
        label: 'Zero',
        ref: '0',
        formControl: expectedFormControl
      };
      const actualLookup = component.convertValue(value);
      expect(actualLookup).toEqual(expectedLookup);
    });
  });

  describe('getLabel', () => {
    it('should return value as string if it is defined', () => {
      const value = 1;
      const expectedLabel = '1';
      const actualLabel = component.getLabel(value as any);
      expect(actualLabel).toEqual(expectedLabel);
    });

    it('should return empty string if passed value is null', () => {
      const expectedLabel = '';
      const actualLabel = component.getLabel(null);
      expect(actualLabel).toEqual(expectedLabel);
    });

    it('should return empty string if passed value is undefined', () => {
      const expectedLabel = '';
      const actualLabel = component.getLabel(undefined);
      expect(actualLabel).toEqual(expectedLabel);
    });

    it('should return formatted label if value pipe is defined', () => {
      const value = { name: 'Luca', surname: 'Rossi' };
      const formattedValue = `${value.name} ${value.surname}`;
      const pipe = jasmine.createSpyObj('pipe', ['transform']);
      pipe.transform.and.returnValue(formattedValue);
      component['valuesPipe'] = pipe;
      const actualLabel = component.getLabel(value as any);
      expect(pipe.transform).toHaveBeenCalledOnceWith(value);
      expect(actualLabel).toEqual(formattedValue);
    });

    it('should return formatted label if value pipe and value pipe args are defined', () => {
      const value = { name: 'Luca', surname: 'Rossi' };
      const formattedValue = `${value.name} ${value.surname}`;
      const pipe = jasmine.createSpyObj('pipe', ['transform']);
      pipe.transform.and.returnValue(formattedValue);
      const pipeArgs = ['pipeArg1'];
      component['valuesPipe'] = pipe;
      component.options.valuesPipeArgs = pipeArgs;
      const actualLabel = component.getLabel(value as any);
      expect(pipe.transform).toHaveBeenCalledOnceWith(value, ...pipeArgs);
      expect(actualLabel).toEqual(formattedValue);
    });
  });

  it('createFormControl should call setControlValue method with selected values', () => {
    const selectedValues = ['value1', 'value2'];
    const spySetControlValue = spyOn(component, 'setControlValue');
    const spyGetSelectedValues = spyOn<any>(component, 'getSelectedValues').and.returnValue(selectedValues);
    component.createFormControl();
    expect(spyGetSelectedValues).toHaveBeenCalledTimes(1);
    expect(spySetControlValue).toHaveBeenCalledOnceWith(selectedValues);
  });

  it('getFormControl should return form control with true value if passed value is included in model', () => {
    const value = 'value1';
    const modelValue = ['value1', 'value2'];
    const spyIsIncludedInModel = spyOn(component, 'isIncludedInModel').and.returnValue(true);
    spyOn(component, 'getModelValue').and.returnValue(modelValue);
    const actualFormControl = component.getFormControl(value);
    expect(actualFormControl).toBeInstanceOf(CaepFormControl);
    expect(actualFormControl.value).toBeTrue();
    expect(spyIsIncludedInModel).toHaveBeenCalledOnceWith(value);
  });

  it('getFormControl should return form control with false value if passed value is not included in model or model is not defined', () => {
    const value = 'value3';
    let modelValue = ['value1', 'value2'];
    const spyIsIncludedInModel = spyOn(component, 'isIncludedInModel').and.returnValue(false);
    const spyGetModelValue = spyOn(component, 'getModelValue').and.returnValue(modelValue);
    let actualFormControl = component.getFormControl(value);
    expect(actualFormControl).toBeInstanceOf(CaepFormControl);
    expect(actualFormControl.value).toBeFalse();
    expect(spyIsIncludedInModel).toHaveBeenCalledOnceWith(value);
    spyIsIncludedInModel.calls.reset();
    spyGetModelValue.and.returnValue(undefined);
    actualFormControl = component.getFormControl(value);
    expect(actualFormControl).toBeInstanceOf(CaepFormControl);
    expect(actualFormControl.value).toBeFalse();
    expect(spyIsIncludedInModel).not.toHaveBeenCalled();
  });

  it('getFormControl should call addToControl or removeFromControl methods on form control value change', () => {
    const spyAddToControl = spyOn<any>(component, 'addToControl');
    const spyRemoveFromControl = spyOn<any>(component, 'removeFromControl');
    const value = 'value1';
    const modelValue = ['value1', 'value2'];
    spyOn(component, 'isIncludedInModel').and.returnValue(true);
    spyOn(component, 'getModelValue').and.returnValue(modelValue);
    const formControl = component.getFormControl(value);
    formControl.setValue(false);
    expect(spyRemoveFromControl).toHaveBeenCalledOnceWith(value);
    formControl.setValue(true);
    expect(spyAddToControl).toHaveBeenCalledOnceWith(value);
  });

  describe('isIncludedInModel', () => {
    it('should return true if passed value is in model', () => {
      const modelValue = ['value1', 'value2'];
      const value = 'value2';
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      const spyEqualityFunc = spyOn(component.options, 'equalityFunc').and.callFake(
        (modelValue: string, lookupValue: string) => modelValue === lookupValue
      );
      const actualResult = component.isIncludedInModel(value);
      expect(actualResult).toBeTrue();
      expect(spyEqualityFunc).toHaveBeenCalledTimes(2);
      expect(spyEqualityFunc).toHaveBeenCalledWith(modelValue[0], value);
      expect(spyEqualityFunc).toHaveBeenCalledWith(modelValue[1], value);
    });

    it('should return false if passed value is not in model', () => {
      const modelValue = ['value1', 'value2'];
      const value = 'value3';
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      const spyEqualityFunc = spyOn(component.options, 'equalityFunc').and.callFake(
        (modelValue: string, lookupValue: string) => modelValue === lookupValue
      );
      const actualResult = component.isIncludedInModel(value);
      expect(actualResult).toBeFalse();
      expect(spyEqualityFunc).toHaveBeenCalledTimes(2);
      expect(spyEqualityFunc).toHaveBeenCalledWith(modelValue[0], value);
      expect(spyEqualityFunc).toHaveBeenCalledWith(modelValue[1], value);
    });

    it('should return falsy value if model value is not defined', () => {
      const modelValue = undefined;
      const value = 'value1';
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      const spyEqualityFunc = spyOn(component.options, 'equalityFunc');
      const actualResult = component.isIncludedInModel(value);
      expect(actualResult).toBeFalsy();
      expect(spyEqualityFunc).not.toHaveBeenCalled();
    });
  });

  describe('isIncludedInControl', () => {
    it('should return true if passed value is in control', () => {
      const controlValue = ['value1', 'value2'];
      const value = 'value2';
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      const spyEqualityFunc = spyOn(component.options, 'equalityFunc').and.callFake(
        (modelValue: string, lookupValue: string) => modelValue === lookupValue
      );
      const actualResult = component.isIncludedInControl(value);
      expect(actualResult).toBeTrue();
      expect(spyEqualityFunc).toHaveBeenCalledTimes(2);
      expect(spyEqualityFunc).toHaveBeenCalledWith(value, controlValue[0]);
      expect(spyEqualityFunc).toHaveBeenCalledWith(value, controlValue[1]);
    });

    it('should return false if passed value is not in control', () => {
      const controlValue = ['value1', 'value2'];
      const value = 'value3';
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      const spyEqualityFunc = spyOn(component.options, 'equalityFunc').and.callFake(
        (modelValue: string, lookupValue: string) => modelValue === lookupValue
      );
      const actualResult = component.isIncludedInControl(value);
      expect(actualResult).toBeFalse();
      expect(spyEqualityFunc).toHaveBeenCalledTimes(2);
      expect(spyEqualityFunc).toHaveBeenCalledWith(value, controlValue[0]);
      expect(spyEqualityFunc).toHaveBeenCalledWith(value, controlValue[1]);
    });

    it('should return falsy value if control value is not defined', () => {
      const controlValue = undefined;
      const value = 'value1';
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      const spyEqualityFunc = spyOn(component.options, 'equalityFunc');
      const actualResult = component.isIncludedInControl(value);
      expect(actualResult).toBeFalsy();
      expect(spyEqualityFunc).not.toHaveBeenCalled();
    });
  });

  describe('isEquivalent', () => {
    it('should return true if modelValues and lookupValues are both null or undefined', () => {
      let modelValues = undefined;
      let lookupValues = undefined;
      let actualResult = component['isEquivalent'](modelValues, lookupValues);
      expect(actualResult).toBeTrue();
      modelValues = null;
      lookupValues = null;
      actualResult = component['isEquivalent'](modelValues, lookupValues);
      expect(actualResult).toBeTrue();
    });

    it('should return false if modelValues and lookupValues are null and undefined', () => {
      let modelValues = null;
      let lookupValues = undefined;
      let actualResult = component['isEquivalent'](modelValues, lookupValues);
      expect(actualResult).toBeFalse();
      modelValues = undefined;
      lookupValues = null;
      actualResult = component['isEquivalent'](modelValues, lookupValues);
      expect(actualResult).toBeFalse();
    });

    it('should return falsy value if one of modelValues and lookupValues is not defined', () => {
      let modelValues = ['value1', 'value2'];
      let lookupValues = undefined;
      spyOn(component, 'isIncludedInControl').and.callFake(value => lookupValues?.includes(value));
      let actualResult = component['isEquivalent'](modelValues, lookupValues);
      expect(actualResult).toBeFalse();
      modelValues = undefined;
      lookupValues = ['value1', 'value2'];
      actualResult = component['isEquivalent'](modelValues, lookupValues);
      expect(actualResult).toBeFalsy();
    });

    it('should return true if modelValues and lookupValues are equivalent', () => {
      const modelValues = ['value1', 'value2'];
      const lookupValues = ['value1', 'value2'];
      const spyIsIncludedInModel = spyOn(component, 'isIncludedInModel').and.callFake(value =>
        modelValues.includes(value)
      );
      const spyIsIncludedInControl = spyOn(component, 'isIncludedInControl').and.callFake(value =>
        lookupValues.includes(value)
      );
      const actualResult = component['isEquivalent'](modelValues, lookupValues);
      expect(actualResult).toBeTrue();
      expect(spyIsIncludedInControl).toHaveBeenCalledTimes(2);
      expect(spyIsIncludedInControl).toHaveBeenCalledWith(modelValues[0]);
      expect(spyIsIncludedInControl).toHaveBeenCalledWith(modelValues[1]);
      expect(spyIsIncludedInModel).toHaveBeenCalledTimes(2);
      expect(spyIsIncludedInModel).toHaveBeenCalledWith(lookupValues[0]);
      expect(spyIsIncludedInModel).toHaveBeenCalledWith(lookupValues[1]);
    });

    it('should return false if modelValues and lookupValues are not equivalent', () => {
      let modelValues = ['value1', 'value2', 'value3'];
      let lookupValues = ['value1', 'value2'];
      const spyIsIncludedInModel = spyOn(component, 'isIncludedInModel').and.callFake(value =>
        modelValues.includes(value)
      );
      const spyIsIncludedInControl = spyOn(component, 'isIncludedInControl').and.callFake(value =>
        lookupValues.includes(value)
      );
      let actualResult = component['isEquivalent'](modelValues, lookupValues);
      expect(actualResult).toBeFalse();
      expect(spyIsIncludedInControl).toHaveBeenCalledTimes(3);
      expect(spyIsIncludedInControl).toHaveBeenCalledWith(modelValues[0]);
      expect(spyIsIncludedInControl).toHaveBeenCalledWith(modelValues[1]);
      expect(spyIsIncludedInControl).toHaveBeenCalledWith(modelValues[2]);
      expect(spyIsIncludedInModel).toHaveBeenCalledTimes(0);
      spyIsIncludedInControl.calls.reset();
      modelValues = ['value1', 'value2'];
      lookupValues = ['value1', 'value2', 'value3'];
      actualResult = component['isEquivalent'](modelValues, lookupValues);
      expect(actualResult).toBeFalse();
      expect(spyIsIncludedInControl).toHaveBeenCalledTimes(2);
      expect(spyIsIncludedInControl).toHaveBeenCalledWith(modelValues[0]);
      expect(spyIsIncludedInControl).toHaveBeenCalledWith(modelValues[1]);
      expect(spyIsIncludedInModel).toHaveBeenCalledTimes(3);
      expect(spyIsIncludedInModel).toHaveBeenCalledWith(lookupValues[0]);
      expect(spyIsIncludedInModel).toHaveBeenCalledWith(lookupValues[1]);
      expect(spyIsIncludedInModel).toHaveBeenCalledWith(lookupValues[2]);
    });
  });

  it('addToControl should call setControlValue method with new control values array', () => {
    const controlValue = ['value1', 'value2'];
    const newValue = 'value3';
    const expectedNewControlValue = [...controlValue, newValue];
    const spySetControlValue = spyOn(component, 'setControlValue');
    spyOn(component, 'getControlValue').and.returnValue(controlValue);
    component['addToControl'](newValue);
    expect(spySetControlValue).toHaveBeenCalledOnceWith(expectedNewControlValue);
  });

  it('addToControl should not call setControlValue method if control value is not defined', () => {
    const controlValue = undefined;
    const newValue = 'value3';
    const spySetControlValue = spyOn(component, 'setControlValue');
    spyOn(component, 'getControlValue').and.returnValue(controlValue);
    component['addToControl'](newValue);
    expect(spySetControlValue).not.toHaveBeenCalled();
  });

  it('addToControl should not call setControlValue method if control value includes the passed value', () => {
    const controlValue = ['value1', 'value2', 'value3'];
    const newValue = 'value3';
    const spySetControlValue = spyOn(component, 'setControlValue');
    spyOn(component, 'getControlValue').and.returnValue(controlValue);
    component['addToControl'](newValue);
    expect(spySetControlValue).not.toHaveBeenCalled();
  });

  it('removeFromControl should call setControlValue method with new control values array', () => {
    const controlValue = ['value1', 'value2', 'value3'];
    const removedValue = 'value3';
    const expectedNewControlValue = controlValue.filter(value => value !== removedValue);
    const spySetControlValue = spyOn(component, 'setControlValue');
    spyOn(component, 'getControlValue').and.returnValue(controlValue);
    component['removeFromControl'](removedValue);
    expect(spySetControlValue).toHaveBeenCalledOnceWith(expectedNewControlValue);
  });

  it('removeFromControl should not call setControlValue method if control value is not defined', () => {
    const controlValue = undefined;
    const removedValue = 'value3';
    const spySetControlValue = spyOn(component, 'setControlValue');
    spyOn(component, 'getControlValue').and.returnValue(controlValue);
    component['removeFromControl'](removedValue);
    expect(spySetControlValue).not.toHaveBeenCalled();
  });

  it('removeFromControl should not call setControlValue method if control value does not include the passed value', () => {
    const controlValue = ['value1', 'value2'];
    const removedValue = 'value3';
    const spySetControlValue = spyOn(component, 'setControlValue');
    spyOn(component, 'getControlValue').and.returnValue(controlValue);
    component['removeFromControl'](removedValue);
    expect(spySetControlValue).not.toHaveBeenCalled();
  });

  describe('getSelectedValues', () => {
    it('should retrieve correct selected values if values are defined', () => {
      const values: ICaepLookupMulti<string>[] = [
        { id: 'id-0', label: 'value1', ref: 'value1', formControl: new CaepFormControl(false) },
        { id: 'id-1', label: 'value2', ref: 'value2', formControl: new CaepFormControl(false) }
      ];
      const expectedSelectedValues = [values[1].ref];
      const spyIsIncludedInModel = spyOn<any>(component, 'isIncludedInModel').and.returnValues(false, true);
      component.values = values;
      const actualSelectedValues = component['getSelectedValues']();
      expect(actualSelectedValues).toEqual(expectedSelectedValues);
      expect(spyIsIncludedInModel).toHaveBeenCalledTimes(2);
      expect(spyIsIncludedInModel).toHaveBeenCalledWith(values[0].ref);
      expect(spyIsIncludedInModel).toHaveBeenCalledWith(values[1].ref);
    });

    it('should return model value if it is defined and values are not defined', () => {
      const modelValue = ['value1'];
      const spyIsIncludedInModel = spyOn<any>(component, 'isIncludedInModel');
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      component.values = undefined;
      const actualSelectedValues = component['getSelectedValues']();
      expect(actualSelectedValues).toEqual(modelValue);
      expect(spyIsIncludedInModel).not.toHaveBeenCalled();
    });

    it('should return empty array if there are not values included in model', () => {
      const values: ICaepLookupMulti<string>[] = [
        { id: 'id-0', label: 'value1', ref: 'value1', formControl: new CaepFormControl(false) },
        { id: 'id-1', label: 'value2', ref: 'value2', formControl: new CaepFormControl(false) }
      ];
      const modelValue = ['value3'];
      const spyIsIncludedInModel = spyOn<any>(component, 'isIncludedInModel').and.returnValues(false, false);
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      component.values = values;
      const actualSelectedValues = component['getSelectedValues']();
      expect(actualSelectedValues).toEqual([]);
      expect(spyIsIncludedInModel).toHaveBeenCalledTimes(2);
      expect(spyIsIncludedInModel).toHaveBeenCalledWith(values[0].ref);
      expect(spyIsIncludedInModel).toHaveBeenCalledWith(values[1].ref);
    });

    it('should return empty array if model value is not defined and values are not defined', () => {
      const modelValue = undefined;
      const spyIsIncludedInModel = spyOn<any>(component, 'isIncludedInModel');
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      component.values = undefined;
      const actualSelectedValues = component['getSelectedValues']();
      expect(actualSelectedValues).toEqual([]);
      expect(spyIsIncludedInModel).not.toHaveBeenCalled();
    });
  });

  describe('setContentValues', () => {
    it('should call setValues method', () => {
      const contentValue = new CaepOptionComponent<string>(mockInjector);
      const values = [contentValue];
      const spySetValues = spyOn(component, 'setValues');
      spyOn(component, 'setControlValue');
      component['setContentValues'](values);
      expect(spySetValues).toHaveBeenCalledOnceWith(values);
    });

    it('should call setControlValue method if selected values are different from model value', () => {
      const contentValue = new CaepOptionComponent<string>(mockInjector);
      const values = [contentValue];
      const modelValue = [{ name: 'Mario', surname: 'Rossi' }];
      const selectedValues = [{ name: 'Mario', surname: 'Rossi' }];
      const spySetControlValue = spyOn(component, 'setControlValue');
      const spyGetSelectedValues = spyOn<any>(component, 'getSelectedValues').and.returnValue(selectedValues);
      spyOn(component, 'getModelValue').and.returnValue(modelValue as any);
      component['setContentValues'](values);
      expect(spyGetSelectedValues).toHaveBeenCalledTimes(1);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(selectedValues);
    });

    it('should call updateValuesStateAndSelectedLabels method if form control value contains more than zero elements', () => {
      const spyUpdateValuesStateAndSelectedLabels = spyOn<any>(component, 'updateValuesStateAndSelectedLabels');
      const contentValue = new CaepOptionComponent<string>(mockInjector);
      const values = [contentValue];
      const modelValue = [{ name: 'Mario', surname: 'Rossi' }];
      const selectedValues = modelValue;
      const spyGetSelectedValues = spyOn<any>(component, 'getSelectedValues').and.returnValue(selectedValues);
      spyOn(component, 'getModelValue').and.returnValue(modelValue as any);
      spyOn(component, 'getControlValue').and.returnValue(selectedValues);
      component['setContentValues'](values);
      expect(spyUpdateValuesStateAndSelectedLabels).toHaveBeenCalledTimes(1);
    });

    it('setContentValues should not call updateValuesStateAndSelectedLabels method if form control/form control value is not defined', () => {
      const spyUpdateValuesStateAndSelectedLabels = spyOn<any>(component, 'updateValuesStateAndSelectedLabels');
      const contentValue = new CaepOptionComponent<string>(mockInjector);
      const values = [contentValue];
      const modelValue = undefined;
      const selectedValues = undefined;
      const spyGetSelectedValues = spyOn<any>(component, 'getSelectedValues').and.returnValue(selectedValues);
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      spyOn(component, 'getControlValue').and.returnValue(selectedValues);
      component['setContentValues'](values);
      expect(spyUpdateValuesStateAndSelectedLabels).not.toHaveBeenCalled();
    });

    it('setContentValues should not call updateValuesStateAndSelectedLabels method if form control value has zero elements', () => {
      const spyUpdateValuesStateAndSelectedLabels = spyOn<any>(component, 'updateValuesStateAndSelectedLabels');
      const contentValue = new CaepOptionComponent<string>(mockInjector);
      const values = [contentValue];
      const modelValue = undefined;
      const selectedValues = undefined;
      const spyGetSelectedValues = spyOn<any>(component, 'getSelectedValues').and.returnValue(selectedValues);
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      spyOn(component, 'getControlValue').and.returnValue([]);
      component['setContentValues'](values);
      expect(spyUpdateValuesStateAndSelectedLabels).not.toHaveBeenCalled();
    });
  });

  describe('onLookupOptionsChange', () => {
    it('should call updateValuesPipe and extractValuesFromOptions methods if pipe name option has changed', () => {
      const oldOptions: IBaseLookupMultiChildFixtureOptions = { valuesPipe: 'pipe1' };
      const newOptions: IBaseLookupMultiChildFixtureOptions = { valuesPipe: 'pipe2' };
      const change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      const spyUpdateValuesPipe = spyOn<any>(component, 'updateValuesPipe');
      const spyExtractValuesFromOptions = spyOn(component, 'extractValuesFromOptions');
      component['onLookupOptionsChange'](change);
      expect(spyUpdateValuesPipe).toHaveBeenCalledTimes(1);
      expect(spyExtractValuesFromOptions).toHaveBeenCalledTimes(1);
    });

    it('should call updateValuesStateAndSelectedLabels method if form control value is defined and pipe name option has changed', () => {
      const oldOptions: IBaseLookupMultiChildFixtureOptions = { valuesPipe: 'pipe1' };
      const newOptions: IBaseLookupMultiChildFixtureOptions = { valuesPipe: 'pipe2' };
      const change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      spyOn<any>(component, 'updateValuesPipe');
      spyOn(component, 'extractValuesFromOptions');
      const spyUpdateValuesStateAndSelectedLabels = spyOn<any>(component, 'updateValuesStateAndSelectedLabels');
      const controlValue = ['value1'];
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      component['onLookupOptionsChange'](change);
      expect(spyUpdateValuesStateAndSelectedLabels).toHaveBeenCalledTimes(1);
    });

    it('should not call updateValuesStateAndSelectedLabels method if pipe name option has changed but form control/form control value is not defined', () => {
      const oldOptions: IBaseLookupMultiChildFixtureOptions = { valuesPipe: 'pipe1' };
      const newOptions: IBaseLookupMultiChildFixtureOptions = { valuesPipe: 'pipe2' };
      const change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      spyOn<any>(component, 'updateValuesPipe');
      spyOn(component, 'extractValuesFromOptions');
      const spyUpdateValuesStateAndSelectedLabels = spyOn<any>(component, 'updateValuesStateAndSelectedLabels');
      spyOn(component, 'getControlValue').and.returnValue(undefined);
      component['onLookupOptionsChange'](change);
      expect(spyUpdateValuesStateAndSelectedLabels).not.toHaveBeenCalled();
    });

    it('should not call updateValuesStateAndSelectedLabels method if pipe name option has changed but form control value has zero elements', () => {
      const oldOptions: IBaseLookupMultiChildFixtureOptions = { valuesPipe: 'pipe1' };
      const newOptions: IBaseLookupMultiChildFixtureOptions = { valuesPipe: 'pipe2' };
      const change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      spyOn<any>(component, 'updateValuesPipe');
      spyOn(component, 'extractValuesFromOptions');
      const spyUpdateValuesStateAndSelectedLabels = spyOn<any>(component, 'updateValuesStateAndSelectedLabels');
      spyOn(component, 'getControlValue').and.returnValue([]);
      component['onLookupOptionsChange'](change);
      expect(spyUpdateValuesStateAndSelectedLabels).not.toHaveBeenCalled();
    });

    it('should call extractValuesFromOptions method if values or pipe arg options have changed', () => {
      let oldOptions: IBaseLookupMultiChildFixtureOptions = { values: ['value1'] };
      let newOptions: IBaseLookupMultiChildFixtureOptions = { values: ['value1', 'value2'] };
      let change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      const spyExtractValuesFromOptions = spyOn(component, 'extractValuesFromOptions');
      component['onLookupOptionsChange'](change);
      expect(spyExtractValuesFromOptions).toHaveBeenCalledTimes(1);
      spyExtractValuesFromOptions.calls.reset();
      oldOptions = { valuesPipeArgs: ['pipeArg1'] };
      newOptions = { valuesPipeArgs: ['pipeArg1', 'pipeArg2'] };
      change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      component['onLookupOptionsChange'](change);
      expect(spyExtractValuesFromOptions).toHaveBeenCalledTimes(1);
    });

    it('should call setControlValue method if form control value is defined and values or pipe arg options have changed', () => {
      let oldOptions: IBaseLookupMultiChildFixtureOptions = { values: ['value1'] };
      let newOptions: IBaseLookupMultiChildFixtureOptions = { values: ['value1', 'value2'] };
      let change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      spyOn(component, 'extractValuesFromOptions');
      const spySetControlValue = spyOn<any>(component, 'setControlValue');
      const controlValue = ['value1'];
      const selectedValues = undefined;
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      spyOn<any>(component, 'getSelectedValues').and.returnValue(selectedValues);
      component['onLookupOptionsChange'](change);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(selectedValues);
      spySetControlValue.calls.reset();
      oldOptions = { valuesPipeArgs: ['pipeArg1'] };
      newOptions = { valuesPipeArgs: ['pipeArg1', 'pipeArg2'] };
      change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      component['onLookupOptionsChange'](change);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(selectedValues);
    });

    it('should not call setControlValue method if values or pipe arg options have changed but form control/form control value is not defined', () => {
      let oldOptions: IBaseLookupMultiChildFixtureOptions = { values: ['value1'] };
      let newOptions: IBaseLookupMultiChildFixtureOptions = { values: ['value1', 'value2'] };
      let change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      spyOn(component, 'extractValuesFromOptions');
      const spySetControlValue = spyOn<any>(component, 'setControlValue');
      spyOn(component, 'getControlValue').and.returnValue(undefined);
      component['onLookupOptionsChange'](change);
      expect(spySetControlValue).not.toHaveBeenCalled();
      spySetControlValue.calls.reset();
      oldOptions = { valuesPipeArgs: ['pipeArg1'] };
      newOptions = { valuesPipeArgs: ['pipeArg1', 'pipeArg2'] };
      change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      component['onLookupOptionsChange'](change);
      expect(spySetControlValue).not.toHaveBeenCalled();
    });

    it('should not call setControlValue method if values or pipe arg options have changed but form control value has zero elements', () => {
      let oldOptions: IBaseLookupMultiChildFixtureOptions = { values: ['value1'] };
      let newOptions: IBaseLookupMultiChildFixtureOptions = { values: ['value1', 'value2'] };
      let change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      spyOn(component, 'extractValuesFromOptions');
      const spySetControlValue = spyOn<any>(component, 'setControlValue');
      spyOn(component, 'getControlValue').and.returnValue([]);
      component['onLookupOptionsChange'](change);
      expect(spySetControlValue).not.toHaveBeenCalled();
      spySetControlValue.calls.reset();
      oldOptions = { valuesPipeArgs: ['pipeArg1'] };
      newOptions = { valuesPipeArgs: ['pipeArg1', 'pipeArg2'] };
      change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      component['onLookupOptionsChange'](change);
      expect(spySetControlValue).not.toHaveBeenCalled();
    });

    it('should call extractValuesFromOptions and setControlValue methods only one time if values, pipe name and pipe arg options have all changed', () => {
      const oldOptions: IBaseLookupMultiChildFixtureOptions = {
        values: ['value1'],
        valuesPipe: 'pipe1',
        valuesPipeArgs: ['pipeArg1']
      };
      const newOptions: IBaseLookupMultiChildFixtureOptions = {
        values: ['value1', 'value2'],
        valuesPipe: 'pipe2',
        valuesPipeArgs: ['pipeArg1', 'pipeArg2']
      };
      const change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      const spyExtractValuesFromOptions = spyOn(component, 'extractValuesFromOptions');
      const spyUpdateValuesStateAndSelectedLabels = spyOn<any>(component, 'updateValuesStateAndSelectedLabels');
      const spySetControlValue = spyOn<any>(component, 'setControlValue');
      const controlValue = ['value1'];
      const selectedValues = undefined;
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      spyOn<any>(component, 'getSelectedValues').and.returnValue(selectedValues);
      component['onLookupOptionsChange'](change);
      expect(spyExtractValuesFromOptions).toHaveBeenCalledTimes(1);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(selectedValues);
      expect(spyUpdateValuesStateAndSelectedLabels).not.toHaveBeenCalled();
    });

    it('should not call updateValuesPipe and extractValuesFromOptions methods if values, pipe name and pipe arg options have not changed', () => {
      const options: IBaseLookupMultiChildFixtureOptions = {
        values: ['value1', 'value2'],
        valuesPipe: 'pipe1',
        valuesPipeArgs: ['pipeArg1', 'pipeArg2']
      };
      const change = new CaepSimpleOptionsChange(options, options);
      const spyUpdateValuesPipe = spyOn<any>(component, 'updateValuesPipe');
      const spyExtractValuesFromOptions = spyOn(component, 'extractValuesFromOptions');
      component['onLookupOptionsChange'](change);
      expect(spyUpdateValuesPipe).not.toHaveBeenCalled();
      expect(spyExtractValuesFromOptions).not.toHaveBeenCalled();
    });
  });

  describe('initializeContentValues', () => {
    it('should call setContentValues method if contentValues are defined', () => {
      const contentValues = jasmine.createSpyObj('queryListValues', ['toArray'], { length: 1, changes: new Subject() });
      const contentValue = new CaepOptionComponent<string>(mockInjector);
      const expectedArray = [contentValue];
      contentValues.toArray.and.returnValue(expectedArray);
      const spySetContentValues = spyOn<any>(component, 'setContentValues');
      component.contentValues = contentValues;
      component['initializeContentValues']();
      expect(spySetContentValues).toHaveBeenCalledOnceWith(expectedArray);
    });

    it('should not call setContentValues method if contentValues are not defined', () => {
      const spySetContentValues = spyOn<any>(component, 'setContentValues');
      component.contentValues = undefined;
      component['initializeContentValues']();
      expect(spySetContentValues).not.toHaveBeenCalled();
    });

    it('should not call setContentValues method if contentValues have length zero', () => {
      const contentValues = jasmine.createSpyObj('queryListValues', ['toArray'], { length: 0, changes: new Subject() });
      const spySetContentValues = spyOn<any>(component, 'setContentValues');
      component.contentValues = contentValues;
      component['initializeContentValues']();
      expect(spySetContentValues).not.toHaveBeenCalled();
    });

    it('should subscribe to contentValues changes and call setContentValues method on contentValue change', (done: Function) => {
      const changes$ = new Subject();
      const contentValues = jasmine.createSpyObj('queryListValues', ['toArray'], { length: 1, changes: changes$ });
      const contentValue = new CaepOptionComponent<string>(mockInjector);
      const expectedArray = [contentValue];
      contentValues.toArray.and.returnValue(expectedArray);
      const spySetContentValues = spyOn<any>(component, 'setContentValues');
      component.contentValues = contentValues;
      component['initializeContentValues']();
      const newContentValue = new CaepOptionComponent<string>(mockInjector);
      let values = [newContentValue];
      changes$.next(values);
      expect(spySetContentValues).toHaveBeenCalledWith(values);
      setTimeout(() => {
        const lastContentValue = new CaepOptionComponent<string>(mockInjector);
        values = [lastContentValue];
        changes$.next(values);
        expect(spySetContentValues).toHaveBeenCalledWith(values);
        done();
      });
    });
  });

  describe('updateValuesPipe', () => {
    it('should create values pipe calling CaepPipeMapperService', () => {
      const pipeName = 'pipe1';
      component.options.valuesPipe = pipeName;
      expect(component['valuesPipe']).toBeUndefined();
      component['updateValuesPipe']();
      expect(mockPipeMapperService.findPipeByName).toHaveBeenCalledOnceWith(pipeName);
      expect(component['valuesPipe']).toBeDefined();
      expect(component['valuesPipe']).toBeInstanceOf(SamplePipe);
    });

    it('should not create values pipe if there is not a mapping for the given pipe name', () => {
      const pipeName = 'pipe1';
      component.options.valuesPipe = pipeName;
      mockPipeMapperService.findPipeByName.and.returnValue(undefined);
      component['updateValuesPipe']();
      expect(mockPipeMapperService.findPipeByName).toHaveBeenCalledOnceWith(pipeName);
      expect(component['valuesPipe']).toBeUndefined();
    });

    it('should not call CaepPipeMapperService if pipe name is not defined', () => {
      component.options.valuesPipe = undefined;
      component['updateValuesPipe']();
      expect(mockPipeMapperService.findPipeByName).not.toHaveBeenCalled();
      expect(component['valuesPipe']).toBeUndefined();
    });
  });

  describe('updateValuesStateAndSelectedLabels', () => {
    it('should update values state and selected labels list if content values are not defined', () => {
      const value1State = new CaepFormControl(false);
      const value2State = new CaepFormControl(false);
      const value3State = new CaepFormControl(false);
      const values: ICaepLookupMulti<string>[] = [
        { id: 'id-0', label: 'value1', ref: 'value1', formControl: value1State },
        { id: 'id-1', label: 'value2', ref: 'value2', formControl: value2State },
        { id: 'id-2', label: 'value3', ref: 'value3', formControl: value3State }
      ];
      const controlValue = ['value2', 'value3'];
      const expectedSelectedLabels = [values[1].label, values[2].label];
      const spyGetControl = spyOn(component, 'getControlValue').and.returnValue(controlValue);
      component.values = values;
      expect(component.selectedLabels).toEqual([]);
      expect(value1State.value).toBeFalse();
      expect(value2State.value).toBeFalse();
      expect(value3State.value).toBeFalse();
      component['updateValuesStateAndSelectedLabels']();
      expect(component.selectedLabels).toEqual(expectedSelectedLabels);
      expect(value1State.value).toBeFalse();
      expect(value2State.value).toBeTrue();
      expect(value3State.value).toBeTrue();
      expect(spyGetControl).toHaveBeenCalledTimes(3);
    });

    it('should update selected labels list if content values and lookup values are not defined', () => {
      const controlValue = [
        { name: 'Mario', surname: 'Rossi' },
        { name: 'Francesco', surname: 'Verdi' }
      ];
      const expectedSelectedLabels = [
        `${controlValue[0].name} ${controlValue[0].surname}`,
        `${controlValue[1].name} ${controlValue[1].surname}`
      ];
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      const spyGetLabel = spyOn(component, 'getLabel').and.callFake((value: any) => `${value.name} ${value.surname}`);
      component.values = undefined;
      component.contentValues = undefined;
      component['updateValuesStateAndSelectedLabels']();
      expect(component.selectedLabels).toEqual(expectedSelectedLabels);
      expect(spyGetLabel).toHaveBeenCalledTimes(2);
      expect(spyGetLabel).toHaveBeenCalledWith(controlValue[0] as any);
      expect(spyGetLabel).toHaveBeenCalledWith(controlValue[1] as any);
    });

    it('should update values state and selected labels list if content values have length zero', () => {
      const value1State = new CaepFormControl(false);
      const value2State = new CaepFormControl(false);
      const value3State = new CaepFormControl(false);
      const values: ICaepLookupMulti<string>[] = [
        { id: 'id-0', label: 'value1', ref: 'value1', formControl: value1State },
        { id: 'id-1', label: 'value2', ref: 'value2', formControl: value2State },
        { id: 'id-2', label: 'value3', ref: 'value3', formControl: value3State }
      ];
      const controlValue = ['value2', 'value3'];
      const expectedSelectedLabels = [values[1].label, values[2].label];
      const spyGetControl = spyOn(component, 'getControlValue').and.returnValue(controlValue);
      component.values = values;
      component.contentValues = jasmine.createSpyObj('queryListValues', [], { length: 0 });
      expect(component.selectedLabels).toEqual([]);
      expect(value1State.value).toBeFalse();
      expect(value2State.value).toBeFalse();
      expect(value3State.value).toBeFalse();
      component['updateValuesStateAndSelectedLabels']();
      expect(component.selectedLabels).toEqual(expectedSelectedLabels);
      expect(value1State.value).toBeFalse();
      expect(value2State.value).toBeTrue();
      expect(value3State.value).toBeTrue();
      expect(spyGetControl).toHaveBeenCalledTimes(3);
    });

    it('should not update values state and selected labels list if values are empty', () => {
      const values = [];
      const spyGetControl = spyOn(component, 'getControlValue');
      component.values = values;
      expect(component.selectedLabels).toEqual([]);
      component['updateValuesStateAndSelectedLabels']();
      expect(component.selectedLabels).toEqual([]);
      expect(spyGetControl).not.toHaveBeenCalled();
    });

    it('should update values state and selected labels list with selected content texts if content values are from primitive types', () => {
      const contentValue1 = new CaepOptionComponent<string>(mockInjector);
      contentValue1.text = 'One';
      contentValue1.value = '1';
      const contentValue2 = new CaepOptionComponent<string>(mockInjector);
      contentValue2.text = 'Two';
      contentValue2.value = '2';
      const contentValue3 = new CaepOptionComponent<string>(mockInjector);
      contentValue3.text = 'Three';
      contentValue3.value = '3';
      const value1State = new CaepFormControl(false);
      const value2State = new CaepFormControl(false);
      const value3State = new CaepFormControl(false);
      const values: ICaepLookupMulti<string>[] = [
        { id: 'id-0', label: contentValue1.text, ref: contentValue1.value, formControl: value1State },
        { id: 'id-1', label: contentValue2.text, ref: contentValue2.value, formControl: value2State },
        { id: 'id-2', label: contentValue3.text, ref: contentValue3.value, formControl: value3State }
      ];
      const contentValues = [contentValue1, contentValue2, contentValue3];
      const controlValue = ['2', '3'];
      const spyGetControl = spyOn(component, 'getControlValue').and.returnValue(controlValue);
      const expectedSelectedLabels = [contentValue2.text, contentValue3.text];
      component.contentValues = contentValues as any;
      component.values = values;
      expect(component.selectedLabels).toEqual([]);
      expect(value1State.value).toBeFalse();
      expect(value2State.value).toBeFalse();
      expect(value3State.value).toBeFalse();
      component['updateValuesStateAndSelectedLabels']();
      expect(component.selectedLabels).toEqual(expectedSelectedLabels);
      expect(value1State.value).toBeFalse();
      expect(value2State.value).toBeTrue();
      expect(value3State.value).toBeTrue();
      expect(spyGetControl).toHaveBeenCalledTimes(3);
    });

    it('should update values state and selected labels list with selected content texts if content values are from complex types', () => {
      const contentValue1 = new CaepOptionComponent<any>(mockInjector);
      contentValue1.value = { name: 'Mario', surname: 'Bianchi' };
      contentValue1.text = `${contentValue1.value.name} ${contentValue1.value.surname}`;
      const contentValue2 = new CaepOptionComponent<any>(mockInjector);
      contentValue2.value = { name: 'Luca', surname: 'Rossi' };
      contentValue2.text = `${contentValue2.value.name} ${contentValue2.value.surname}`;
      const contentValue3 = new CaepOptionComponent<any>(mockInjector);
      contentValue3.value = { name: 'Francesco', surname: 'Verdi' };
      contentValue3.text = `${contentValue3.value.name} ${contentValue3.value.surname}`;
      const value1State = new CaepFormControl(false);
      const value2State = new CaepFormControl(false);
      const value3State = new CaepFormControl(false);
      const values: ICaepLookupMulti<string>[] = [
        { id: 'id-0', label: contentValue1.text, ref: contentValue1.value, formControl: value1State },
        { id: 'id-1', label: contentValue2.text, ref: contentValue2.value, formControl: value2State },
        { id: 'id-2', label: contentValue3.text, ref: contentValue3.value, formControl: value3State }
      ];
      const contentValues = [contentValue1, contentValue2, contentValue3];
      const controlValue = [contentValue2.value, contentValue3.value];
      const spyGetControl = spyOn(component, 'getControlValue').and.returnValue(controlValue);
      const expectedSelectedLabels = [contentValue2.text, contentValue3.text];
      component.contentValues = contentValues as any;
      component.values = values;
      expect(component.selectedLabels).toEqual([]);
      expect(value1State.value).toBeFalse();
      expect(value2State.value).toBeFalse();
      expect(value3State.value).toBeFalse();
      component['updateValuesStateAndSelectedLabels']();
      expect(component.selectedLabels).toEqual(expectedSelectedLabels);
      expect(value1State.value).toBeFalse();
      expect(value2State.value).toBeTrue();
      expect(value3State.value).toBeTrue();
      expect(spyGetControl).toHaveBeenCalledTimes(3);
    });

    it('should update values state and selected labels list with selected content texts if content values have unique key', () => {
      const key = 'name';
      const contentValue1 = new CaepOptionComponent<any>(mockInjector);
      contentValue1.value = { name: 'Mario', surname: 'Bianchi' };
      contentValue1.text = `${contentValue1.value.name} ${contentValue1.value.surname}`;
      contentValue1.key = key;
      const contentValue2 = new CaepOptionComponent<any>(mockInjector);
      contentValue2.value = { name: 'Luca', surname: 'Rossi' };
      contentValue2.text = `${contentValue2.value.name} ${contentValue2.value.surname}`;
      contentValue2.key = key;
      const contentValue3 = new CaepOptionComponent<any>(mockInjector);
      contentValue3.value = { name: 'Francesco', surname: 'Verdi' };
      contentValue3.text = `${contentValue3.value.name} ${contentValue3.value.surname}`;
      contentValue3.key = key;
      const value1State = new CaepFormControl(false);
      const value2State = new CaepFormControl(false);
      const value3State = new CaepFormControl(false);
      const values: ICaepLookupMulti<string>[] = [
        { id: 'id-0', label: contentValue1.text, ref: contentValue1.value, formControl: value1State },
        { id: 'id-1', label: contentValue2.text, ref: contentValue2.value, formControl: value2State },
        { id: 'id-2', label: contentValue3.text, ref: contentValue3.value, formControl: value3State }
      ];
      const contentValues = [contentValue1, contentValue2, contentValue3];
      const controlValue = [contentValue2.value, contentValue3.value];
      const spyGetControl = spyOn(component, 'getControlValue').and.returnValue(controlValue);
      const expectedSelectedLabels = [contentValue2.text, contentValue3.text];
      component.contentValues = contentValues as any;
      component.values = values;
      expect(component.selectedLabels).toEqual([]);
      expect(value1State.value).toBeFalse();
      expect(value2State.value).toBeFalse();
      expect(value3State.value).toBeFalse();
      component['updateValuesStateAndSelectedLabels']();
      expect(component.selectedLabels).toEqual(expectedSelectedLabels);
      expect(value1State.value).toBeFalse();
      expect(value2State.value).toBeTrue();
      expect(value3State.value).toBeTrue();
      expect(spyGetControl).toHaveBeenCalledTimes(3);
    });
  });
});

describe('BaseLookupMultiComponent', () => {
  let fixture: ComponentFixture<BaseLookupMultiChildFixtureWithoutOptionsComponent>,
    component: BaseLookupMultiChildFixtureWithoutOptionsComponent,
    mockPolicyEngineService,
    mockResourceService,
    mockIdSequenceService,
    mockFormHandlerService,
    mockAspectHelper,
    mockContextService,
    mockPipeMapperService;

  beforeEach(() => {
    mockPolicyEngineService = jasmine.createSpyObj('mockPolicyEngine', ['observePolicies']);
    mockResourceService = jasmine.createSpyObj('mockResource', ['getResource']);
    mockIdSequenceService = jasmine.createSpyObj('mockIdSequence', ['next']);
    mockIdSequenceService.next.and.returnValue('id-0');
    mockFormHandlerService = jasmine.createSpyObj('mockFormHandler', ['getControl', 'removeControl']);
    mockAspectHelper = jasmine.createSpyObj('mockAspectHelper', ['getLabel']);
    mockContextService = jasmine.createSpyObj('mockContext', {}, ['context']);
    mockPipeMapperService = jasmine.createSpyObj('mockPipeMapper', ['findPipeByName']);
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [BaseLookupMultiChildFixtureWithoutOptionsComponent],
      providers: [
        { provide: CaepIdSequenceService, useValue: mockIdSequenceService },
        { provide: PolicyEngineService, useValue: mockPolicyEngineService },
        { provide: ResourceService, useValue: mockResourceService },
        { provide: CaepFormHandlerService, useValue: mockFormHandlerService },
        { provide: AspectHelper, useValue: mockAspectHelper },
        { provide: ContextService, useValue: mockContextService },
        { provide: CaepPipeMapperService, useValue: mockPipeMapperService },
        provideZoneChangeDetection()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLookupMultiChildFixtureWithoutOptionsComponent);
    component = fixture.componentInstance;
  });

  it('should initialize only CaepBaseLookupMulti options', () => {
    expect(component).toBeTruthy();
    expect(component.options).toBeInstanceOf(CaepBaseLookupMultiOptions);
  });
});

describe('CaepBaseLookupMultiOptions', () => {
  let options: CaepBaseLookupMultiOptions<any, any>, inputOptions: ICaepBaseLookupMultiOptions<any, any>;

  describe('constructor', () => {
    it('should create options', () => {
      options = new CaepBaseLookupMultiOptions();
      expect(options).toBeDefined();
    });

    it('should set correct option default values', () => {
      const expectedValues = [];
      options = new CaepBaseLookupMultiOptions();
      expect(options.values).toEqual(expectedValues);
      expect(options.equalityFunc).toBeInstanceOf(Function);
      expect(options.equalityFunc('value1', 'value1')).toBeTrue();
      expect(options.equalityFunc('value1', 'value2')).toBeFalse();
      expect(options.transform).toBeInstanceOf(Function);
      expect(options.transform(['VALUE1'])).not.toEqual(['value1']);
      expect(options.transform(['value1'])).toEqual(['value1']);
    });

    it('should set correct option values', () => {
      inputOptions = {
        values: ['value1'],
        valuesPipe: 'pipe1',
        valuesPipeArgs: ['pipeArg1'],
        equalityFunc: (modelValue: any, lookupValue: any) => modelValue.toUpperCase() === lookupValue,
        transform: (lookupValues: any) => lookupValues && lookupValues.map(value => value.toLowerCase())
      };
      options = new CaepBaseLookupMultiOptions(inputOptions);
      expect(options.values).toEqual(inputOptions.values);
      expect(options.valuesPipe).toEqual(inputOptions.valuesPipe);
      expect(options.valuesPipeArgs).toEqual(inputOptions.valuesPipeArgs);
      expect(options.equalityFunc('value1', 'VALUE1')).toBeTrue();
      expect(options.equalityFunc('value1', 'value1')).toBeFalse();
      expect(options.transform(['VALUE1'])).toEqual(['value1']);
      expect(options.transform(['VALUE1'])).not.toEqual(['VALUE1']);
    });
  });
});

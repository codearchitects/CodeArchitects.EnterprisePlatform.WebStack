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
  CaepBaseLookupSingleComponent,
  CaepBaseLookupSingleOptions,
  ICaepBaseLookupSingleOptions,
  ICaepLookupSingle
} from './base-lookup-single.component';

class SamplePipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }
}

interface IBaseLookupSingleChildFixtureOptions extends PickAll<BaseLookupSingleChildFixtureOptions> {}

class BaseLookupSingleChildFixtureOptions extends CaepBaseLookupSingleOptions<string, string> {
  dropdownWidth?: string;

  constructor(options?: IBaseLookupSingleChildFixtureOptions) {
    super(options);
  }
}

@Component({
    template: '<span id="base-lookup-single-child">BaseLookupSingle Component Child Fixture</span>',
    standalone: false
})
class BaseLookupSingleChildFixtureComponent extends CaepBaseLookupSingleComponent<
  string,
  string,
  BaseLookupSingleChildFixtureOptions
> {
  constructor(injector: Injector) {
    super(injector, (value?: IBaseLookupSingleChildFixtureOptions) => new BaseLookupSingleChildFixtureOptions(value));
  }
}

@Component({
    template: '<span id="base-lookup-single-child">BaseLookupSingle Component Child Fixture</span>',
    standalone: false
})
class BaseLookupSingleChildFixtureWithoutOptionsComponent extends CaepBaseLookupSingleComponent<string, string> {
  constructor(injector: Injector) {
    super(injector);
  }
}

describe('BaseLookupSingleComponent', () => {
  let fixture: ComponentFixture<BaseLookupSingleChildFixtureComponent>,
    component: BaseLookupSingleChildFixtureComponent,
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
      declarations: [BaseLookupSingleChildFixtureComponent],
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
    fixture = TestBed.createComponent(BaseLookupSingleChildFixtureComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    debugEl = fixture.debugElement;
    rootControlElement = element.querySelector<HTMLSpanElement>('#base-lookup-single-child');
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
      expect(component.resetOptions$).toBeInstanceOf(Subject);
    });
  });

  describe('onControlValueChanges', () => {
    it("should call setModelValue with transform option's result if equalityFunc comparation returns false", () => {
      const modelValue = 'value1';
      const controlValue = 'VALUE2';
      const transformedValue = 'value2';
      const spySetModelValue = spyOn(component, 'setModelValue');
      const spyEqualityFunc = spyOn(component.options, 'equalityFunc').and.returnValue(false);
      const spyTransform = spyOn(component.options, 'transform').and.returnValue(transformedValue);
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      component.onControlValueChanges();
      expect(spyEqualityFunc).toHaveBeenCalledOnceWith(modelValue, controlValue);
      expect(spySetModelValue).toHaveBeenCalledOnceWith(transformedValue);
      expect(spyTransform).toHaveBeenCalledOnceWith(controlValue);
    });

    it('should not call setModelValue method if equalityFunc comparation returns true', () => {
      const modelValue = 'value1';
      const controlValue = 'VALUE1';
      const spySetModelValue = spyOn(component, 'setModelValue');
      const spyEqualityFunc = spyOn(component.options, 'equalityFunc').and.returnValue(true);
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      component.onControlValueChanges();
      expect(spyEqualityFunc).toHaveBeenCalledOnceWith(modelValue, controlValue);
      expect(spySetModelValue).not.toHaveBeenCalled();
    });
  });

  describe('modelValueChangesHandler', () => {
    it('should call setControlValue and onModelValueChanges handler if equalityFunc comparation returns false', () => {
      const modelValue = 'value2';
      const controlValue = 'VALUE1';
      const selectedValue = 'VALUE2';
      const spySetControlValue = spyOn(component, 'setControlValue');
      const spyEqualityFunc = spyOn(component.options, 'equalityFunc').and.returnValue(false);
      const spyGetSelectedValue = spyOn<any>(component, 'getSelectedValue').and.returnValue(selectedValue);
      const spyOnModelValueChanges = jasmine.createSpy();
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      component.onModelValueChanges = spyOnModelValueChanges;
      component.modelValueChangesHandler();
      expect(spyEqualityFunc).toHaveBeenCalledOnceWith(modelValue, controlValue);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(selectedValue);
      expect(spyOnModelValueChanges).toHaveBeenCalledOnceWith(controlValue, modelValue);
      expect(spyGetSelectedValue).toHaveBeenCalledTimes(1);
    });

    it('should not call setControlValue and onModelValueChanges handler if equalityFunc comparation returns true', () => {
      const modelValue = 'value1';
      const controlValue = 'VALUE1';
      const spySetControlValue = spyOn(component, 'setControlValue');
      const spyEqualityFunc = spyOn(component.options, 'equalityFunc').and.returnValue(true);
      const spyOnModelValueChanges = jasmine.createSpy();
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      component.onModelValueChanges = spyOnModelValueChanges;
      component.modelValueChangesHandler();
      expect(spyEqualityFunc).toHaveBeenCalledOnceWith(modelValue, controlValue);
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
      const values = [
        { name: 'Mario', surname: 'Rossi' },
        { name: 'Francesco', surname: 'Verdi' }
      ];
      const spySetValues = spyOn(component, 'setValues');
      const spySetControlValue = spyOn(component, 'setControlValue');
      const controlValue = { name: 'Luca', surname: 'Rossi' };
      const selectedValue = undefined;
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      spyOn<any>(component, 'getSelectedValue').and.returnValue(selectedValue);
      component.options.values = new BehaviorSubject<any>(values);
      component.formControl = formControl;
      component.extractValuesFromOptions();
      expect(spySetValues).toHaveBeenCalledOnceWith(values as any);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(selectedValue);
    });

    it('should set values if option values are an observable without calling setControlValue method if formControl is not defined', () => {
      const values = [
        { name: 'Mario', surname: 'Rossi' },
        { name: 'Francesco', surname: 'Verdi' }
      ];
      const spySetValues = spyOn(component, 'setValues');
      const spySetControlValue = spyOn(component, 'setControlValue');
      component.options.values = new BehaviorSubject<any>(values);
      component.formControl = undefined;
      component.extractValuesFromOptions();
      expect(spySetValues).toHaveBeenCalledOnceWith(values as any);
      expect(spySetControlValue).not.toHaveBeenCalled();
    });

    it('should set values if option values are an observable without calling setControlValue method if controlValue is equal to selectedValue', () => {
      const values = ['value1', 'value2'];
      const spySetValues = spyOn(component, 'setValues');
      const spySetControlValue = spyOn(component, 'setControlValue');
      const controlValue = values[1];
      const selectedValue = values[1];
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      spyOn<any>(component, 'getSelectedValue').and.returnValue(selectedValue);
      component.options.values = new BehaviorSubject<any>(values);
      component.formControl = formControl;
      component.extractValuesFromOptions();
      expect(spySetValues).toHaveBeenCalledOnceWith(values as any);
      expect(spySetControlValue).not.toHaveBeenCalled();
    });
  });

  it('should set values correctly', () => {
    const values = ['value1', 'value2'];
    const expectedLookups: ICaepLookupSingle<string>[] = [
      { id: 'id-0', label: values[0], ref: values[0] },
      { id: 'id-1', label: values[1], ref: values[1] }
    ];
    const spyConvertValues = spyOn(component, 'convertValue');
    spyConvertValues.and.returnValues(expectedLookups[0], expectedLookups[1]);
    component.setValues(values);
    expect(spyConvertValues).toHaveBeenCalledTimes(2);
    expect(component.values).toEqual(expectedLookups);
  });

  describe('getValues', () => {
    it('should return all values if index param is not passed', () => {
      const values: ICaepLookupSingle<string>[] = [
        { id: 'id-0', label: 'value1', ref: 'value1' },
        { id: 'id-1', label: 'value2', ref: 'value2' }
      ];
      component.values = values;
      const actualValues = component.getValues();
      expect(actualValues).toEqual(['value1', 'value2']);
    });

    it('should return specific value if index param is passed', () => {
      const values: ICaepLookupSingle<string>[] = [
        { id: 'id-0', label: 'value1', ref: 'value1' },
        { id: 'id-1', label: 'value2', ref: 'value2' }
      ];
      component.values = values;
      const actualValue = component.getValues(1);
      expect(actualValue).toEqual('value2');
    });

    it('should return undefined if index param is out of bound', () => {
      const values: ICaepLookupSingle<string>[] = [
        { id: 'id-0', label: 'value1', ref: 'value1' },
        { id: 'id-1', label: 'value2', ref: 'value2' }
      ];
      component.values = values;
      const actualValue = component.getValues(2);
      expect(actualValue).toBeUndefined();
    });

    it('should return empty array if index param is not passed and values are empty', () => {
      component.values = [];
      const actualValues = component.getValues();
      expect(actualValues).toEqual([]);
    });

    it('should return empty array if values are not defined', () => {
      component.values = undefined;
      expect(component.getValues()).toEqual([]);
    });
  });

  it('addValue should add value to lookup values array calling convertValue method', () => {
    const values: ICaepLookupSingle<string>[] = [
      { id: 'id-0', label: 'value1', ref: 'value1' },
      { id: 'id-1', label: 'value2', ref: 'value2' }
    ];
    const newValue = 'value3';
    const expectedLookup = { id: 'id-2', label: newValue, ref: newValue };
    const spyConvertValue = spyOn(component, 'convertValue').and.returnValue(expectedLookup);
    component.values = [...values];
    component.addValue(newValue);
    expect(component.values.length).toEqual(values.length + 1);
    expect(component.values[2]).toEqual(expectedLookup);
    expect(component.values).toEqual([...values, expectedLookup]);
    expect(spyConvertValue).toHaveBeenCalledOnceWith(newValue);
  });

  describe('setValueAtIndex', () => {
    it('setValueAtIndex should set control value with value at passed index', () => {
      const values: ICaepLookupSingle<string>[] = [
        { id: 'id-0', label: 'value1', ref: 'value1' },
        { id: 'id-1', label: 'value2', ref: 'value2' }
      ];
      const spySetControlValue = spyOn(component, 'setControlValue');
      component.values = values;
      component.setValueAtIndex(1);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(values[1].ref);
    });

    it('setValueAtIndex should not set control value if values are not defined', () => {
      const spySetControlValue = spyOn(component, 'setControlValue');
      spyOn(component, 'getValues').and.returnValue(undefined);
      component.setValueAtIndex(1);
      expect(spySetControlValue).not.toHaveBeenCalled();
    });

    it('setValueAtIndex should set control value to undefined if passed index is out of bound', () => {
      const values: ICaepLookupSingle<string>[] = [
        { id: 'id-0', label: 'value1', ref: 'value1' },
        { id: 'id-1', label: 'value2', ref: 'value2' }
      ];
      const spySetControlValue = spyOn(component, 'setControlValue');
      component.values = values;
      component.setValueAtIndex(2);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(undefined);
    });
  });

  describe('getSelectedIndex', () => {
    it('should return index of selected item calling getControlValue method', () => {
      const values: ICaepLookupSingle<string>[] = [
        { id: 'id-0', label: 'value1', ref: 'value1' },
        { id: 'id-1', label: 'value2', ref: 'value2' }
      ];
      const selectedValue = values[1].ref;
      const spyGetControlValue = spyOn(component, 'getControlValue').and.returnValue(selectedValue);
      component.values = values;
      const actualIndex = component.getSelectedIndex();
      expect(actualIndex).toEqual(1);
      expect(spyGetControlValue).toHaveBeenCalledTimes(1);
    });

    it('should return -1 if values are not defined', () => {
      const spyGetControlValue = spyOn(component, 'getControlValue');
      spyOn(component, 'getValues').and.returnValue(undefined);
      const actualIndex = component.getSelectedIndex();
      expect(actualIndex).toEqual(-1);
      expect(spyGetControlValue).not.toHaveBeenCalled();
    });
  });

  describe('isIndexSelected', () => {
    it('should return true if passed index matches the selected value', () => {
      const values: ICaepLookupSingle<string>[] = [
        { id: 'id-0', label: 'value1', ref: 'value1' },
        { id: 'id-1', label: 'value2', ref: 'value2' }
      ];
      const selectedValue = values[1].ref;
      const spyGetSelectedValue = spyOn<any>(component, 'getSelectedValue').and.returnValue(selectedValue);
      component.values = values;
      const actualResult = component.isIndexSelected(1);
      expect(actualResult).toBeTrue();
      expect(spyGetSelectedValue).toHaveBeenCalledTimes(1);
    });

    it('should return false if passed index does not match the selected value', () => {
      const values: ICaepLookupSingle<string>[] = [
        { id: 'id-0', label: 'value1', ref: 'value1' },
        { id: 'id-1', label: 'value2', ref: 'value2' }
      ];
      const selectedValue = values[1].ref;
      const spyGetSelectedValue = spyOn<any>(component, 'getSelectedValue').and.returnValue(selectedValue);
      component.values = values;
      const actualResult = component.isIndexSelected(0);
      expect(actualResult).toBeFalse();
      expect(spyGetSelectedValue).toHaveBeenCalledTimes(1);
    });

    it('should return false if values are not defined', () => {
      const spyGetSelectedValue = spyOn<any>(component, 'getSelectedValue');
      spyOn(component, 'getValues').and.returnValue(undefined);
      const actualResult = component.isIndexSelected(0);
      expect(actualResult).toBeFalse();
      expect(spyGetSelectedValue).not.toHaveBeenCalled();
    });
  });

  describe('convertValue', () => {
    it('should convert value correctly if it is not an CaepOptionComponent instance', () => {
      const value = 'value1';
      spyOn(component, 'getLabel').and.returnValue(value);
      const expectedLookup: ICaepLookupSingle<string> = { id: 'id-0', label: value, ref: value };
      const actualLookup = component.convertValue(value);
      expect(actualLookup).toEqual(expectedLookup);
    });

    it('should convert value correctly if it is an CaepOptionComponent instance', () => {
      const value = new CaepOptionComponent<string>(mockInjector);
      value.text = 'Zero';
      value.value = '0';
      const expectedLookup: ICaepLookupSingle<string> = { id: 'id-0', label: 'Zero', ref: '0' };
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

  describe('setControlValue', () => {
    it('should set control value and selected label calling updateSelectedLabel method', () => {
      const expectedValue = 'value1';
      const spyUpdateSelectedLabel = spyOn<any>(component, 'updateSelectedLabel');
      component.formControl = formControl;
      component.setControlValue(expectedValue);
      expect(component.formControl.value).toEqual(expectedValue);
      expect(spyUpdateSelectedLabel).toHaveBeenCalledTimes(1);
    });
  });

  it('getSelectedValue should retrieve correct selected value if values are defined', () => {
    const values: ICaepLookupSingle<string>[] = [
      { id: 'id-0', label: 'value1', ref: 'value1' },
      { id: 'id-1', label: 'value2', ref: 'value2' }
    ];
    const selectedValue = values[1].ref;
    const spyEqualityFunc = spyOn(component.options, 'equalityFunc').and.callFake(
      (modelValue: string, lookupValue: string) => modelValue === lookupValue
    );
    spyOn(component, 'getModelValue').and.returnValue(selectedValue);
    component.values = values;
    const actualSelectedValue = component['getSelectedValue']();
    expect(actualSelectedValue).toEqual(selectedValue);
    expect(spyEqualityFunc).toHaveBeenCalledTimes(2);
    expect(spyEqualityFunc).toHaveBeenCalledWith(selectedValue, values[0].ref);
    expect(spyEqualityFunc).toHaveBeenCalledWith(selectedValue, values[1].ref);
  });

  it('getSelectedValue should return undefined if there is not a match in the lookup values array', () => {
    const values: ICaepLookupSingle<string>[] = [
      { id: 'id-0', label: 'value1', ref: 'value1' },
      { id: 'id-1', label: 'value2', ref: 'value2' }
    ];
    const modelValue = 'value3';
    const spyEqualityFunc = spyOn(component.options, 'equalityFunc').and.callFake(
      (modelValue: string, lookupValue: string) => modelValue === lookupValue
    );
    spyOn(component, 'getModelValue').and.returnValue(modelValue);
    component.values = values;
    const actualSelectedValue = component['getSelectedValue']();
    expect(actualSelectedValue).toBeUndefined();
    expect(spyEqualityFunc).toHaveBeenCalledTimes(2);
    expect(spyEqualityFunc).toHaveBeenCalledWith(modelValue, values[0].ref);
    expect(spyEqualityFunc).toHaveBeenCalledWith(modelValue, values[1].ref);
  });

  it('getSelectedValue should return model value if values are not defined', () => {
    const modelValue = 'value3';
    spyOn(component, 'getModelValue').and.returnValue(modelValue);
    component.values = undefined;
    const actualSelectedValue = component['getSelectedValue']();
    expect(actualSelectedValue).toEqual(modelValue);
  });

  describe('setContentValues', () => {
    it('setContentValues should call setValues method', () => {
      const contentValue = new CaepOptionComponent<string>(mockInjector);
      const values = [contentValue];
      const spySetValues = spyOn(component, 'setValues');
      component['setContentValues'](values);
      expect(spySetValues).toHaveBeenCalledOnceWith(values);
    });

    it('setContentValues should setControlValue if selected value is different from model value', () => {
      const contentValue = new CaepOptionComponent<string>(mockInjector);
      const values = [contentValue];
      const modelValue = { name: 'Mario', surname: 'Rossi' };
      const selectedValue = { name: 'Mario', surname: 'Rossi' };
      const spySetControlValue = spyOn(component, 'setControlValue');
      const spyGetSelectedValue = spyOn<any>(component, 'getSelectedValue').and.returnValue(selectedValue);
      spyOn(component, 'getModelValue').and.returnValue(modelValue as any);
      component['setContentValues'](values);
      expect(spyGetSelectedValue).toHaveBeenCalledTimes(1);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(selectedValue);
    });

    it('setContentValues should call updateSelectedLabel method if form control value is defined', () => {
      const spyUpdateSelectedLabel = spyOn<any>(component, 'updateSelectedLabel');
      const contentValue = new CaepOptionComponent<string>(mockInjector);
      const values = [contentValue];
      const modelValue = { name: 'Mario', surname: 'Rossi' };
      const selectedValue = modelValue;
      const spyGetSelectedValue = spyOn<any>(component, 'getSelectedValue').and.returnValue(selectedValue);
      spyOn(component, 'getModelValue').and.returnValue(modelValue as any);
      spyOn(component, 'getControlValue').and.returnValue(selectedValue);
      component['setContentValues'](values);
      expect(spyUpdateSelectedLabel).toHaveBeenCalledTimes(1);
    });

    it('setContentValues should not call updateSelectedLabel method if form control/form control value is not defined', () => {
      const spyUpdateSelectedLabel = spyOn<any>(component, 'updateSelectedLabel');
      const contentValue = new CaepOptionComponent<string>(mockInjector);
      const values = [contentValue];
      const modelValue = undefined;
      const selectedValue = undefined;
      const spyGetSelectedValue = spyOn<any>(component, 'getSelectedValue').and.returnValue(selectedValue);
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      spyOn(component, 'getControlValue').and.returnValue(selectedValue);
      component['setContentValues'](values);
      expect(spyUpdateSelectedLabel).not.toHaveBeenCalled();
    });
  });

  describe('onLookupOptionsChange', () => {
    it('should call updateValuesPipe and extractValuesFromOptions methods if pipe name option has changed', () => {
      const oldOptions: IBaseLookupSingleChildFixtureOptions = { valuesPipe: 'pipe1' };
      const newOptions: IBaseLookupSingleChildFixtureOptions = { valuesPipe: 'pipe2' };
      const change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      const spyUpdateValuesPipe = spyOn<any>(component, 'updateValuesPipe');
      const spyExtractValuesFromOptions = spyOn(component, 'extractValuesFromOptions');
      component['onLookupOptionsChange'](change);
      expect(spyUpdateValuesPipe).toHaveBeenCalledTimes(1);
      expect(spyExtractValuesFromOptions).toHaveBeenCalledTimes(1);
    });

    it('should call updateSelectedLabel method if form control value is defined and pipe name option has changed', () => {
      const oldOptions: IBaseLookupSingleChildFixtureOptions = { valuesPipe: 'pipe1' };
      const newOptions: IBaseLookupSingleChildFixtureOptions = { valuesPipe: 'pipe2' };
      const change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      spyOn<any>(component, 'updateValuesPipe');
      spyOn(component, 'extractValuesFromOptions');
      const spyUpdateSelectedLabel = spyOn<any>(component, 'updateSelectedLabel');
      const expectedValue = 'value1';
      spyOn(component, 'getControlValue').and.returnValue(expectedValue);
      component['onLookupOptionsChange'](change);
      expect(spyUpdateSelectedLabel).toHaveBeenCalledTimes(1);
    });

    it('should not call updateSelectedLabel method if pipe name option has changed but form control/form control value is not defined', () => {
      const oldOptions: IBaseLookupSingleChildFixtureOptions = { valuesPipe: 'pipe1' };
      const newOptions: IBaseLookupSingleChildFixtureOptions = { valuesPipe: 'pipe2' };
      const change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      spyOn<any>(component, 'updateValuesPipe');
      spyOn(component, 'extractValuesFromOptions');
      const spyUpdateSelectedLabel = spyOn<any>(component, 'updateSelectedLabel');
      spyOn(component, 'getControlValue').and.returnValue(undefined);
      component['onLookupOptionsChange'](change);
      expect(spyUpdateSelectedLabel).not.toHaveBeenCalled();
    });

    it('should call extractValuesFromOptions method if values or pipe arg options have changed', () => {
      let oldOptions: IBaseLookupSingleChildFixtureOptions = { values: ['value1'] };
      let newOptions: IBaseLookupSingleChildFixtureOptions = { values: ['value1', 'value2'] };
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
      let oldOptions: IBaseLookupSingleChildFixtureOptions = { values: ['value1'] };
      let newOptions: IBaseLookupSingleChildFixtureOptions = { values: ['value1', 'value2'] };
      let change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      spyOn(component, 'extractValuesFromOptions');
      const spySetControlValue = spyOn<any>(component, 'setControlValue');
      const controlValue = 'value1';
      const selectedValue = undefined;
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      spyOn<any>(component, 'getSelectedValue').and.returnValue(selectedValue);
      component['onLookupOptionsChange'](change);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(selectedValue);
      spySetControlValue.calls.reset();
      oldOptions = { valuesPipeArgs: ['pipeArg1'] };
      newOptions = { valuesPipeArgs: ['pipeArg1', 'pipeArg2'] };
      change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      component['onLookupOptionsChange'](change);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(selectedValue);
    });

    it('should not call setControlValue method if values or pipe arg options have changed but form control/form control value is not defined', () => {
      let oldOptions: IBaseLookupSingleChildFixtureOptions = { values: ['value1'] };
      let newOptions: IBaseLookupSingleChildFixtureOptions = { values: ['value1', 'value2'] };
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

    it('should call extractValuesFromOptions and setControlValue methods only one time if values, pipe name and pipe arg options have all changed', () => {
      const oldOptions: IBaseLookupSingleChildFixtureOptions = {
        values: ['value1'],
        valuesPipe: 'pipe1',
        valuesPipeArgs: ['pipeArg1']
      };
      const newOptions: IBaseLookupSingleChildFixtureOptions = {
        values: ['value1', 'value2'],
        valuesPipe: 'pipe2',
        valuesPipeArgs: ['pipeArg1', 'pipeArg2']
      };
      const change = new CaepSimpleOptionsChange(oldOptions, newOptions);
      const spyExtractValuesFromOptions = spyOn(component, 'extractValuesFromOptions');
      const spyUpdateSelectedLabel = spyOn<any>(component, 'updateSelectedLabel');
      const spySetControlValue = spyOn(component, 'setControlValue');
      const controlValue = 'value1';
      const selectedValue = undefined;
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      spyOn<any>(component, 'getSelectedValue').and.returnValue(selectedValue);
      component['onLookupOptionsChange'](change);
      expect(spyExtractValuesFromOptions).toHaveBeenCalledTimes(1);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(selectedValue);
      expect(spyUpdateSelectedLabel).not.toHaveBeenCalled();
    });

    it('should not call updateValuesPipe and extractValuesFromOptions methods if values, pipe name and pipe arg options have not changed', () => {
      const options: IBaseLookupSingleChildFixtureOptions = {
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

    it('should not call setContentValues method if contentValues have length 0', () => {
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

  it('initializeSelectedLabel should call updateSelectedLabel method if form control value is defined', () => {
    const spyUpdateSelectedLabel = spyOn<any>(component, 'updateSelectedLabel');
    const expectedValue = 'value1';
    spyOn(component, 'getControlValue').and.returnValue(expectedValue);
    component['initializeSelectedLabel']();
    expect(spyUpdateSelectedLabel).toHaveBeenCalledTimes(1);
  });

  it('initializeSelectedLabel should not call updateSelectedLabel method if form control/form control value is not defined', () => {
    const spyUpdateSelectedLabel = spyOn<any>(component, 'updateSelectedLabel');
    spyOn(component, 'getControlValue').and.returnValue(undefined);
    component['initializeSelectedLabel']();
    expect(spyUpdateSelectedLabel).not.toHaveBeenCalled();
  });

  describe('updateSelectedLabel', () => {
    it('should set selected label calling getLabel if contentValues are not defined', () => {
      const expectedValue = 'value1';
      const spyGetLabel = spyOn(component, 'getLabel').and.returnValue(expectedValue);
      spyOn(component, 'getControlValue').and.returnValue(expectedValue);
      expect(component.selectedLabel).toBeUndefined();
      component['updateSelectedLabel']();
      expect(component.selectedLabel).toEqual(expectedValue);
      expect(spyGetLabel).toHaveBeenCalledOnceWith(expectedValue);
    });

    it('should set selected label to selected content text if content values are from primitive types', () => {
      const contentValue1 = new CaepOptionComponent<string>(mockInjector);
      contentValue1.text = 'One';
      contentValue1.value = '1';
      const contentValue2 = new CaepOptionComponent<string>(mockInjector);
      contentValue2.text = 'Two';
      contentValue2.value = '2';
      const contentValues = [contentValue1, contentValue2];
      component.contentValues = contentValues as any;
      spyOn(component, 'getControlValue').and.returnValue(contentValue2.value);
      expect(component.selectedLabel).toBeUndefined();
      component['updateSelectedLabel']();
      expect(component.selectedLabel).toEqual(contentValue2.text);
    });

    it('should set selected label to selected content text if content values are from complex types', () => {
      const contentValue1 = new CaepOptionComponent<any>(mockInjector);
      contentValue1.value = { name: 'Luca', surname: 'Rossi' };
      contentValue1.text = `${contentValue1.value.name} ${contentValue1.value.surname}`;
      const contentValue2 = new CaepOptionComponent<any>(mockInjector);
      contentValue2.value = { name: 'Mario', surname: 'Bianchi' };
      contentValue2.text = `${contentValue2.value.name} ${contentValue2.value.surname}`;
      const contentValues = [contentValue1, contentValue2];
      component.contentValues = contentValues as any;
      spyOn(component, 'getControlValue').and.returnValue(contentValue2.value);
      expect(component.selectedLabel).toBeUndefined();
      component['updateSelectedLabel']();
      expect(component.selectedLabel).toEqual(contentValue2.text);
    });

    it('should set selected label to selected content text if content values have unique key', () => {
      const key = 'name';
      const contentValue1 = new CaepOptionComponent<any>(mockInjector);
      contentValue1.value = { name: 'Luca', surname: 'Rossi' };
      contentValue1.key = key;
      contentValue1.text = `${contentValue1.value.name} ${contentValue1.value.surname}`;
      const contentValue2 = new CaepOptionComponent<any>(mockInjector);
      contentValue2.value = { name: 'Mario', surname: 'Bianchi' };
      contentValue2.key = key;
      contentValue2.text = `${contentValue2.value.name} ${contentValue2.value.surname}`;
      const contentValues = [contentValue1, contentValue2];
      component.contentValues = contentValues as any;
      spyOn(component, 'getControlValue').and.returnValue(contentValue2.value);
      expect(component.selectedLabel).toBeUndefined();
      component['updateSelectedLabel']();
      expect(component.selectedLabel).toEqual(contentValue2.text);
    });

    it('should set selected label to passed value even if passed value is not from content values', () => {
      const value = '3';
      const contentValue1 = new CaepOptionComponent<string>(mockInjector);
      contentValue1.text = 'One';
      contentValue1.value = '1';
      const contentValue2 = new CaepOptionComponent<string>(mockInjector);
      contentValue2.text = 'Two';
      contentValue2.value = '2';
      const contentValues = [contentValue1, contentValue2];
      component.contentValues = contentValues as any;
      spyOn(component, 'getControlValue').and.returnValue(value);
      expect(component.selectedLabel).toBeUndefined();
      component['updateSelectedLabel']();
      expect(component.selectedLabel).toEqual(value);
    });

    it('should set selected label to empty string if passed value is not defined', () => {
      const value = undefined;
      const contentValue1 = new CaepOptionComponent<string>(mockInjector);
      contentValue1.text = 'One';
      contentValue1.value = '1';
      const contentValue2 = new CaepOptionComponent<string>(mockInjector);
      contentValue2.text = 'Two';
      contentValue2.value = '2';
      const contentValues = [contentValue1, contentValue2];
      component.contentValues = contentValues as any;
      spyOn(component, 'getControlValue').and.returnValue(value);
      expect(component.selectedLabel).toBeUndefined();
      component['updateSelectedLabel']();
      expect(component.selectedLabel).toEqual('');
    });
  });
});

describe('BaseLookupSingleComponent', () => {
  let fixture: ComponentFixture<BaseLookupSingleChildFixtureWithoutOptionsComponent>,
    component: BaseLookupSingleChildFixtureWithoutOptionsComponent,
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
      declarations: [BaseLookupSingleChildFixtureWithoutOptionsComponent],
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
    fixture = TestBed.createComponent(BaseLookupSingleChildFixtureWithoutOptionsComponent);
    component = fixture.componentInstance;
  });

  it('should initialize only CaepBaseLookupSingle options', () => {
    expect(component).toBeTruthy();
    expect(component.options).toBeInstanceOf(CaepBaseLookupSingleOptions);
  });
});

describe('CaepBaseLookupSingleOptions', () => {
  let options: CaepBaseLookupSingleOptions<any, any>, inputOptions: ICaepBaseLookupSingleOptions<any, any>;

  describe('constructor', () => {
    it('should create options', () => {
      options = new CaepBaseLookupSingleOptions();
      expect(options).toBeDefined();
    });

    it('should set correct option default values', () => {
      const expectedValues = [];
      options = new CaepBaseLookupSingleOptions();
      expect(options.values).toEqual(expectedValues);
      expect(options.equalityFunc).toBeInstanceOf(Function);
      expect(options.equalityFunc('value1', 'value1')).toBeTrue();
      expect(options.equalityFunc('value1', 'value2')).toBeFalse();
      expect(options.transform).toBeInstanceOf(Function);
      expect(options.transform('VALUE1')).not.toEqual('value1');
      expect(options.transform('value1')).toEqual('value1');
    });

    it('should set correct option values', () => {
      inputOptions = {
        values: ['value1'],
        valuesPipe: 'pipe1',
        valuesPipeArgs: ['pipeArg1'],
        equalityFunc: (modelValue: any, lookupValue: any) => modelValue.toUpperCase() === lookupValue,
        transform: (lookupValue: any) => lookupValue.toLowerCase()
      };
      options = new CaepBaseLookupSingleOptions(inputOptions);
      expect(options.values).toEqual(inputOptions.values);
      expect(options.valuesPipe).toEqual(inputOptions.valuesPipe);
      expect(options.valuesPipeArgs).toEqual(inputOptions.valuesPipeArgs);
      expect(options.equalityFunc('value1', 'VALUE1')).toBeTrue();
      expect(options.equalityFunc('value1', 'value1')).toBeFalse();
      expect(options.transform('VALUE1')).toEqual('value1');
      expect(options.transform('VALUE1')).not.toEqual('VALUE1');
    });
  });
});

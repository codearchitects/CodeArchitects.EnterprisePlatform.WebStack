import { Component, DebugElement, EventEmitter, Injector, provideZoneChangeDetection, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AspectHelper, Context, ContextService } from '@ca-webstack/ng-aspects';
import { IResourceParams, PolicyEngineService, ResourceService } from '@ca-webstack/ng-policy-engine';
import { of } from 'rxjs';
import { CaepOption } from '../../decorators';
import { CaepFormHandlerService, CaepIdSequenceService, CaepPipeMapperService } from '../../services';
import { CaepFormControl, PickAll } from '../../utilities';
import { CaepBaseInputComponent, CaepBaseInputOptions, ICaepBaseInputOptions } from './base-input.component';

interface IBaseInputChildFixtureOptions extends PickAll<BaseInputChildFixtureOptions> {}

class BaseInputChildFixtureOptions extends CaepBaseInputOptions<string> {
  @CaepOption({ defaultValue: 'text' })
  type?: 'text' | 'password' | 'email';

  constructor(options?: IBaseInputChildFixtureOptions) {
    super(options);
  }
}

@Component({
    template: '<span id="base-input-child">BaseInput Component Child Fixture</span>',
    standalone: false
})
class BaseInputChildFixtureComponent extends CaepBaseInputComponent<string, BaseInputChildFixtureOptions> {
  constructor(injector: Injector) {
    super(injector, (value?: IBaseInputChildFixtureOptions) => new BaseInputChildFixtureOptions(value));
  }
}

@Component({
    template: '<span id="base-input-child">BaseInput Component Child Fixture</span>',
    standalone: false
})
class BaseInputChildFixtureWithoutOptionsComponent extends CaepBaseInputComponent<string> {
  constructor(injector: Injector) {
    super(injector);
  }
}

describe('BaseInputComponent', () => {
  let fixture: ComponentFixture<BaseInputChildFixtureComponent>,
    component: BaseInputChildFixtureComponent,
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
    mockPipeMapperService;
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
    mockPipeMapperService = jasmine.createSpy();
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [BaseInputChildFixtureComponent],
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
    fixture = TestBed.createComponent(BaseInputChildFixtureComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    debugEl = fixture.debugElement;
    rootControlElement = element.querySelector<HTMLSpanElement>('#base-input-child');
    //fixture.detectChanges();
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
    it('should intitialize service references', () => {
      expect(component.formHandler).toBeDefined();
      expect(component.formHandler).toEqual(mockFormHandlerService);
      expect(component['pipeMapper']).toBeDefined();
      expect(component['pipeMapper']).toEqual(mockPipeMapperService);
      expect(component['_aspectHelper']).toBeDefined();
      expect(component['_aspectHelper']).toEqual(mockAspectHelper);
      expect(component['_contextService']).toBeDefined();
      expect(component['_contextService']).toEqual(mockContextService);
    });
  });

  describe('createFormControl', () => {
    it("should call formHandlerService's getControl method with right parameters", () => {
      const model = { prop1: 'test' };
      const prop = 'prop1';
      const enable = true;
      component.model = model;
      component.prop = prop;
      component.enable = enable;
      expect(component.formControl).toBeUndefined();
      component.createFormControl();
      expect(mockFormHandlerService.getControl).toHaveBeenCalledOnceWith(model, prop, !enable);
      expect(component.formControl).toBe(formControl);
    });

    it('should subscribe to formControl value changes', () => {
      const emitter = new EventEmitter();
      expect(emitter.observed).toBeFalse();
      Object.defineProperty(formControl, 'valueChanges', {
        writable: true
      });
      (formControl as any).valueChanges = emitter;
      component.createFormControl();
      expect(emitter.observed).toBeTrue();
    });

    it('should call onControlValueChanges method on formControl value change', () => {
      const emitter = new EventEmitter();
      const spyOnControlValueChanges = spyOn(component, 'onControlValueChanges');
      Object.defineProperty(formControl, 'valueChanges', {
        writable: true
      });
      (formControl as any).valueChanges = emitter;
      component.createFormControl();
      (component.formControl.valueChanges as EventEmitter<any>).emit(jasmine.any(Object));
      expect(spyOnControlValueChanges).toHaveBeenCalledTimes(1);
    });

    it('should not subscribe to formControl value changes if it is not defined', () => {
      const emitter = new EventEmitter();
      Object.defineProperty(formControl, 'valueChanges', {
        writable: true
      });
      (formControl as any).valueChanges = emitter;
      mockFormHandlerService.getControl.and.returnValue(undefined);
      component.createFormControl();
      expect(component.formControl).toBeUndefined();
      expect(emitter.observed).toBeFalse();
    });
  });

  it('destroyFormControl should call removeControl method on formHandlerService with rigth parameters', () => {
    const model = { prop1: 'test' };
    const prop = 'prop1';
    component.model = model;
    component.prop = prop;
    component.destroyFormControl();
    expect(mockFormHandlerService.removeControl).toHaveBeenCalledOnceWith(model, prop);
  });

  describe('onControlValueChanges', () => {
    it('should call setModelValue method when control value changes', () => {
      const model = { prop1: 'test' };
      const prop = 'prop1';
      component.model = model;
      component.prop = prop;
      const newValue = 'test2';
      const spyGetControlValue = spyOn(component, 'getControlValue').and.returnValue(newValue);
      const spySetModelValue = spyOn(component, 'setModelValue');
      component.onControlValueChanges();
      expect(spyGetControlValue).toHaveBeenCalledTimes(1);
      expect(spySetModelValue).toHaveBeenCalledOnceWith(newValue);
    });

    it('should not call setModelValue method if control value is equal to model value', () => {
      const value = 'test';
      const model = { prop1: value };
      const prop = 'prop1';
      component.model = model;
      component.prop = prop;
      const spyGetControlValue = spyOn(component, 'getControlValue').and.returnValue(value);
      const spySetModelValue = spyOn(component, 'setModelValue');
      component.onControlValueChanges();
      expect(spyGetControlValue).toHaveBeenCalledTimes(1);
      expect(spySetModelValue).not.toHaveBeenCalled();
    });
  });

  describe('modelValueChangesHandler', () => {
    it('should call setControlValue method and onModelValueChanges handler when model value changes', () => {
      const oldValue = 'test';
      const newValue = 'test2';
      const model = { prop1: newValue };
      const prop = 'prop1';
      component.model = model;
      component.prop = prop;
      const spyGetControlValue = spyOn(component, 'getControlValue').and.returnValue(oldValue);
      const spySetControlValue = spyOn(component, 'setControlValue');
      const spyOnModelValueChanges = jasmine.createSpy();
      component.onModelValueChanges = spyOnModelValueChanges;
      component.modelValueChangesHandler();
      expect(spyGetControlValue).toHaveBeenCalledTimes(1);
      expect(spyOnModelValueChanges).toHaveBeenCalledOnceWith(oldValue, newValue);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(newValue);
    });

    it('should not call setControlValue method if model value is equal to control value', () => {
      const value = 'test';
      const model = { prop1: value };
      const prop = 'prop1';
      component.model = model;
      component.prop = prop;
      const spyGetControlValue = spyOn(component, 'getControlValue').and.returnValue(value);
      const spySetControlValue = spyOn(component, 'setControlValue');
      const spyOnModelValueChanges = jasmine.createSpy();
      component.onModelValueChanges = spyOnModelValueChanges;
      component.modelValueChangesHandler();
      expect(spyGetControlValue).toHaveBeenCalledTimes(1);
      expect(spyOnModelValueChanges).not.toHaveBeenCalled();
      expect(spySetControlValue).not.toHaveBeenCalled();
    });
  });

  describe('checkDisabling', () => {
    it('should call formControl enable method when component enable is true and formControl is disabled', fakeAsync(() => {
      const spyEnable = spyOn(formControl, 'enable');
      const options = { emitEvent: false };
      component.formControl = formControl;
      component.enable = true;
      Object.defineProperty(component.formControl, 'disabled', {
        writable: true
      });
      (component.formControl as any).disabled = true;
      component.checkDisabling();
      tick();
      expect(spyEnable).toHaveBeenCalledOnceWith(options);
    }));

    it('should not call formControl enable method if component enable is true and formControl is enabled', fakeAsync(() => {
      const spyEnable = spyOn(formControl, 'enable');
      component.formControl = formControl;
      component.enable = true;
      Object.defineProperty(component.formControl, 'disabled', {
        writable: true
      });
      (component.formControl as any).disabled = false;
      component.checkDisabling();
      tick();
      expect(spyEnable).not.toHaveBeenCalled();
    }));

    it('should call formControl disable method when component enable is false and formControl is enabled', fakeAsync(() => {
      const spyEnable = spyOn(formControl, 'disable');
      const options = { emitEvent: false };
      component.formControl = formControl;
      component.enable = false;
      Object.defineProperty(component.formControl, 'enabled', {
        writable: true
      });
      (component.formControl as any).enabled = true;
      component.checkDisabling();
      tick();
      expect(spyEnable).toHaveBeenCalledOnceWith(options);
    }));

    it('should not call formControl disable method when component enable is false and formControl is disabled', fakeAsync(() => {
      const spyEnable = spyOn(formControl, 'disable');
      const options = { emitEvent: false };
      component.formControl = formControl;
      component.enable = false;
      Object.defineProperty(component.formControl, 'enabled', {
        writable: true
      });
      (component.formControl as any).enabled = false;
      component.checkDisabling();
      tick();
      expect(spyEnable).not.toHaveBeenCalled();
    }));
  });

  it('getControlValue should return formControl value', () => {
    const expectedValue = 'Test';
    component.formControl = formControl;
    Object.defineProperty(component.formControl, 'value', {
      writable: true
    });
    (component.formControl as any).value = expectedValue;
    const actualValue = component.getControlValue();
    expect(actualValue).toEqual(expectedValue);
  });

  it('getControlValue should return undefined if formControl is not defined', () => {
    component.formControl = undefined;
    const actualValue = component.getControlValue();
    expect(actualValue).toBeUndefined();
  });

  it('setControlValue should set formControl value', () => {
    const expectedValue = 'Test';
    component.formControl = formControl;
    component.setControlValue(expectedValue);
    expect(component.formControl.value).toEqual(expectedValue);
  });

  it('setControlValue should call setValue method on formControl', () => {
    const spySetValue = spyOn(formControl, 'setValue');
    const expectedValue = 'Test';
    component.formControl = formControl;
    component.setControlValue(expectedValue);
    expect(spySetValue).toHaveBeenCalledOnceWith(expectedValue);
  });

  it('markAsDirty should call markAsDirty method on formControl if dirty property is false', () => {
    const spyMarkAsDirty = spyOn(formControl, 'markAsDirty');
    component.formControl = formControl;
    Object.defineProperty(component.formControl, 'dirty', {
      writable: true,
      value: false
    });
    component.markAsDirty();
    expect(spyMarkAsDirty).toHaveBeenCalledTimes(1);
  });

  it('markAsDirty should not call markAsDirty method on formControl if dirty property is true', () => {
    const spyMarkAsDirty = spyOn(formControl, 'markAsDirty');
    component.formControl = formControl;
    Object.defineProperty(component.formControl, 'dirty', {
      writable: true,
      value: true
    });
    component.markAsDirty();
    expect(spyMarkAsDirty).not.toHaveBeenCalled();
  });

  describe('initializeFormControl', () => {
    it('should call createFormControl method if formControl is undefiend', () => {
      const spyCreateFormControl = spyOn(component, 'createFormControl');
      component['initializeFormControl']();
      expect(spyCreateFormControl).toHaveBeenCalledTimes(1);
    });

    it('should not call createFormControl method if formControl is already defined', () => {
      const spyCreateFormControl = spyOn(component, 'createFormControl');
      component.formControl = formControl;
      component['initializeFormControl']();
      expect(spyCreateFormControl).not.toHaveBeenCalled();
    });

    it('should subscribe to enable changes', () => {
      expect(component['enableEmitter'].observed).toBeFalse();
      const spyCreateFormControl = spyOn(component, 'createFormControl');
      component['initializeFormControl']();
      expect(component['enableEmitter'].observed).toBeTrue();
    });

    it('should call checkDisabling method on enable changes', () => {
      const spyCheckDisabling = spyOn(component, 'checkDisabling');
      const spyCreateFormControl = spyOn(component, 'createFormControl');
      component['initializeFormControl']();
      component['enableEmitter'].emit(false);
      expect(spyCheckDisabling).toHaveBeenCalledTimes(1);
    });
  });

  describe('initializePlaceholder', () => {
    it('should not call aspectHelper if placeholder is already defined', () => {
      component.options.placeholder = 'placeholder';
      component['initializePlaceholder']();
      expect(mockAspectHelper.getLabel).not.toHaveBeenCalled();
    });

    it("should call aspectHelper's getLabel method with right parameter", () => {
      const model = { prop1: 'test' };
      const prop = 'prop1';
      component.model = model;
      component.prop = prop;
      component['initializePlaceholder']();
      expect(mockAspectHelper.getLabel).toHaveBeenCalledOnceWith(model, prop, mockContext);
    });

    it('should set placeholder if label from aspectHelper is defined', () => {
      component['initializePlaceholder']();
      expect(component.options.placeholder).toEqual(mockLabel);
    });

    it('should not set placeholder if label from aspectHelper is a falsy value', () => {
      mockAspectHelper.getLabel.and.returnValue(undefined);
      component['initializePlaceholder']();
      expect(component.options.placeholder).toEqual('');
    });
  });

  describe('onModelChange', () => {
    it('should not call formHandlerService removeControl method on change of another input property', () => {
      const change = new SimpleChange(true, false, false);
      const changes = { enable: change } as SimpleChanges;
      component['onModelChange'](changes);
      expect(mockFormHandlerService.removeControl).not.toHaveBeenCalled();
    });

    it('should not call formHandlerService removeControl method if change is equal', () => {
      const previousModel = { prop1: 'test' };
      const newModel = { prop1: 'test' };
      const change = new SimpleChange(previousModel, newModel, false);
      const changes = { model: change } as SimpleChanges;
      component['onModelChange'](changes);
      expect(mockFormHandlerService.removeControl).not.toHaveBeenCalled();
    });

    it('should delete formControl calling formHandlerService removeControl method and create a new one on model change', () => {
      const spyCreateFormControl = spyOn(component, 'createFormControl');
      const previousModel = { prop1: 'test' };
      const prop = 'prop1';
      component.model = previousModel;
      component.prop = prop;
      const newModel = { prop1: 'test2' };
      const change = new SimpleChange(previousModel, newModel, false);
      const changes = { model: change } as SimpleChanges;
      component['onModelChange'](changes);
      expect(mockFormHandlerService.removeControl).toHaveBeenCalledOnceWith(previousModel, prop);
      expect(spyCreateFormControl).toHaveBeenCalledTimes(1);
    });

    it("should not call createFormControl method if component's form control is already defined", () => {
      const spyCreateFormControl = spyOn(component, 'createFormControl');
      const change = new SimpleChange(true, false, false);
      const changes = { enable: change } as SimpleChanges;
      component.formControl = formControl;
      component['onModelChange'](changes);
      expect(spyCreateFormControl).not.toHaveBeenCalled();
    });
  });
});

describe('BaseInputComponent', () => {
  let fixture: ComponentFixture<BaseInputChildFixtureWithoutOptionsComponent>,
    component: BaseInputChildFixtureWithoutOptionsComponent,
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
    mockPipeMapperService = jasmine.createSpy();
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [BaseInputChildFixtureWithoutOptionsComponent],
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
    fixture = TestBed.createComponent(BaseInputChildFixtureWithoutOptionsComponent);
    component = fixture.componentInstance;
  });

  it('should initialize only CaepBaseInput options', () => {
    expect(component).toBeTruthy();
    expect(component.options).toBeInstanceOf(CaepBaseInputOptions);
  });
});

describe('CaepBaseInputOptions', () => {
  let options: CaepBaseInputOptions<any>, inputOptions: ICaepBaseInputOptions<any>;

  describe('constructor', () => {
    it('should create options', () => {
      options = new CaepBaseInputOptions();
      expect(options).toBeDefined();
    });

    it('should set correct option default values', () => {
      const expectedReadonly = false;
      const expectedPlaceholder = '';
      const expectedInputClass = '';
      options = new CaepBaseInputOptions();
      expect(options.isReadonly).toEqual(expectedReadonly);
      expect(options.placeholder).toEqual(expectedPlaceholder);
      expect(options.inputClass).toEqual(expectedInputClass);
    });

    it('should set correct option values', () => {
      inputOptions = {
        isReadonly: true,
        placeholder: 'Placeholder',
        maxLength: 30,
        inputClass: ['my-class1', 'my-class2'],
        icon: 'search'
      };
      options = new CaepBaseInputOptions(inputOptions);
      expect(options.isReadonly).toEqual(inputOptions.isReadonly);
      expect(options.placeholder).toEqual(inputOptions.placeholder);
      expect(options.maxLength).toEqual(inputOptions.maxLength);
      expect(options.inputClass).toEqual((inputOptions.inputClass as Array<string>).join(' '));
      expect(options.icon).toEqual(inputOptions.icon);
    });
  });
});

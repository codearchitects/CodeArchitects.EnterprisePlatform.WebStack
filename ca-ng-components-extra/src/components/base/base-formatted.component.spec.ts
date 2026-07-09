import { Component, DebugElement, Injector, provideZoneChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AspectHelper, Context, ContextService } from '@ca-webstack/ng-aspects';
import { IResourceParams, PolicyEngineService, ResourceService } from '@ca-webstack/ng-policy-engine';
import { of } from 'rxjs';
import { CaepCoercionType, CaepOption } from '../../decorators';
import { CaepPipeTransform } from '../../pipes';
import { CaepFormHandlerService, CaepIdSequenceService, CaepPipeMapperService } from '../../services';
import { CaepFormControl, CaepFormControlMode, PickAll } from '../../utilities';
import {
  CaepBaseFormattedComponent,
  CaepBaseFormattedOptions,
  ICaepBaseFormattedOptions
} from './base-formatted.component';

interface IFormattedArgs {
  arg1: string;
  arg2: string;
}

class BaseFormattedChildPipe extends CaepPipeTransform<number, string, IFormattedArgs> {
  constructor() {
    super();
  }

  transform(value: number, mode: CaepFormControlMode, args: IFormattedArgs): string {
    return '';
  }

  revert(value: string, mode: CaepFormControlMode, args: IFormattedArgs): number {
    return 0;
  }

  tolerantCheck(value: string, mode: CaepFormControlMode, args: IFormattedArgs): boolean {
    return true;
  }
}

interface IBaseFormattedChildFixtureOptions extends PickAll<BaseFormattedChildFixtureOptions> {}

class BaseFormattedChildFixtureOptions extends CaepBaseFormattedOptions<number, IFormattedArgs> {
  @CaepOption({ defaultValue: 1, coercionType: CaepCoercionType.Number })
  step?: number | string;

  constructor(options?: IBaseFormattedChildFixtureOptions) {
    super(options);
  }
}

@Component({
    template: '<span id="base-formatted-child">BaseFormatted Component Child Fixture</span>',
    standalone: false
})
class BaseFormattedChildFixtureComponent extends CaepBaseFormattedComponent<number, BaseFormattedChildFixtureOptions> {
  constructor(injector: Injector) {
    super(injector, (value?: IBaseFormattedChildFixtureOptions) => new BaseFormattedChildFixtureOptions(value));
  }
  public tolerantCheck(): boolean {
    return true;
  }
  public parseControlValue(): number {
    return 0;
  }
  public formatModelValue(): string {
    return '';
  }
}

@Component({
    template: '<span id="base-formatted-child">BaseFormatted Component Child Fixture</span>',
    standalone: false
})
class BaseFormattedChildFixtureWithoutOptionsComponent extends CaepBaseFormattedComponent<number> {
  constructor(injector: Injector) {
    super(injector);
  }
  public tolerantCheck(): boolean {
    return true;
  }
  public parseControlValue(): number {
    return 0;
  }
  public formatModelValue(): string {
    return '';
  }
}

describe('BaseFormattedComponent', () => {
  let fixture: ComponentFixture<BaseFormattedChildFixtureComponent>,
    component: BaseFormattedChildFixtureComponent,
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
    mockPipeMapperService = jasmine.createSpyObj('mockPipeMapper', ['findPipeByName']);
    mockPipeMapperService.findPipeByName.and.returnValue(BaseFormattedChildPipe);
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [BaseFormattedChildFixtureComponent],
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
    fixture = TestBed.createComponent(BaseFormattedChildFixtureComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    debugEl = fixture.debugElement;
    rootControlElement = element.querySelector<HTMLSpanElement>('#base-formatted-child');
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
      const expectedOldValue = '';
      expect(component.oldValue).toEqual(expectedOldValue);
    });
  });

  it('should return correct form control mode', () => {
    const expectedMode = CaepFormControlMode.Edit;
    component.formControl = formControl;
    expect(component.mode).not.toEqual(expectedMode);
    component.formControl.mode = expectedMode;
    expect(component.mode).toEqual(expectedMode);
  });

  describe('onControlValueChanges', () => {
    it("should call pipe's tolerantCheck method with right parameters if formatPipe is defined", () => {
      const expectedMode = CaepFormControlMode.Edit,
        expectedValue = '3.00',
        expectedTransformArgs = { arg1: 'arg1', arg2: 'arg2' } as IFormattedArgs;
      const pipe = new BaseFormattedChildPipe();
      const spyTolerantCheck = spyOn(pipe, 'tolerantCheck');
      spyOn(component, 'getControlValue').and.returnValue(expectedValue);
      component['formatPipe'] = pipe;
      component.formControl = formControl;
      component.formControl.mode = expectedMode;
      component.options.transformArgs = expectedTransformArgs;
      component.onControlValueChanges();
      expect(spyTolerantCheck).toHaveBeenCalledOnceWith(expectedValue, expectedMode, expectedTransformArgs);
    });

    it('should call tolerantCheck method if formatPipe is not defined', () => {
      const spyTolerantCheck = spyOn(component, 'tolerantCheck');
      component['formatPipe'] = undefined;
      component.formControl = formControl;
      component.formControl.mode = CaepFormControlMode.Edit;
      component.onControlValueChanges();
      expect(spyTolerantCheck).toHaveBeenCalledTimes(1);
    });

    it('should call commit method if tolerantCheck result is true', () => {
      const spyCommit = spyOn(component, 'commit');
      const spyRollback = spyOn(component, 'rollback');
      const pipe = new BaseFormattedChildPipe();
      spyOn(pipe, 'tolerantCheck').and.returnValue(true);
      component['formatPipe'] = pipe;
      component.formControl = formControl;
      component.formControl.mode = CaepFormControlMode.Edit;
      component.onControlValueChanges();
      expect(spyCommit).toHaveBeenCalledTimes(1);
      expect(spyRollback).not.toHaveBeenCalled();
    });

    it('should call rollback method if tolerantCheck result is false', () => {
      const spyCommit = spyOn(component, 'commit');
      const spyRollback = spyOn(component, 'rollback');
      const pipe = new BaseFormattedChildPipe();
      spyOn(pipe, 'tolerantCheck').and.returnValue(false);
      component['formatPipe'] = pipe;
      component.formControl = formControl;
      component.formControl.mode = CaepFormControlMode.Edit;
      component.onControlValueChanges();
      expect(spyRollback).toHaveBeenCalledTimes(1);
      expect(spyCommit).not.toHaveBeenCalled();
    });

    it('should not call tolerantCheck and commit/rollback methods if form control mode is not Edit', () => {
      const spyCommit = spyOn(component, 'commit');
      const spyRollback = spyOn(component, 'rollback');
      const pipe = new BaseFormattedChildPipe();
      const spyPipeTolerantCheck = spyOn(pipe, 'tolerantCheck');
      const spyComponentTolerantCheck = spyOn(component, 'tolerantCheck');
      component['formatPipe'] = pipe;
      component.formControl = formControl;
      component.formControl.mode = CaepFormControlMode.Browse;
      component.onControlValueChanges();
      expect(spyPipeTolerantCheck).not.toHaveBeenCalled();
      expect(spyComponentTolerantCheck).not.toHaveBeenCalled();
      expect(spyCommit).not.toHaveBeenCalled();
      expect(spyRollback).not.toHaveBeenCalled();
    });
  });

  it('modelValueChangesHandler should call updateControlValue method if form control mode is Browse', () => {
    const spyUpdateControlValue = spyOn(component, 'updateControlValue');
    component.formControl = formControl;
    component.formControl.mode = CaepFormControlMode.Browse;
    component.modelValueChangesHandler();
    expect(spyUpdateControlValue).toHaveBeenCalledTimes(1);
  });

  it('modelValueChangesHandler should not call updateControlValue method if form control mode is Edit', () => {
    const spyUpdateControlValue = spyOn(component, 'updateControlValue');
    component.formControl = formControl;
    component.formControl.mode = CaepFormControlMode.Edit;
    component.modelValueChangesHandler();
    expect(spyUpdateControlValue).not.toHaveBeenCalled();
  });

  it('commit should set oldValue and call updateModeValue method', () => {
    const expectedValue = '3.00';
    const spyUpdateModelValue = spyOn(component, 'updateModelValue');
    spyOn(component, 'getControlValue').and.returnValue(expectedValue);
    expect(component.oldValue).not.toEqual(expectedValue);
    component.commit();
    expect(component.oldValue).toEqual(expectedValue);
    expect(spyUpdateModelValue).toHaveBeenCalledTimes(1);
  });

  it('rollback should call setControlValue method if control value differs from oldValue', () => {
    const oldValue = '3.00';
    const spySetControlValue = spyOn(component, 'setControlValue');
    spyOn(component, 'getControlValue').and.returnValue('3.00a');
    component.oldValue = oldValue;
    component.rollback();
    expect(spySetControlValue).toHaveBeenCalledOnceWith(oldValue);
  });

  it('rollback should not call setControlValue method if control value equals to oldValue', () => {
    const oldValue = '3.00';
    const spySetControlValue = spyOn(component, 'setControlValue');
    spyOn(component, 'getControlValue').and.returnValue(oldValue);
    component.oldValue = oldValue;
    component.rollback();
    expect(spySetControlValue).not.toHaveBeenCalled();
  });

  describe('updateControlValue', () => {
    it("should call pipe's transform method with right parameters if formatPipe is defined", () => {
      const expectedMode = CaepFormControlMode.Edit,
        expectedModelValue = 3,
        expectedTransformArgs = { arg1: 'arg1', arg2: 'arg2' } as IFormattedArgs;
      const pipe = new BaseFormattedChildPipe();
      const spyTransform = spyOn(pipe, 'transform');
      spyOn(component, 'getModelValue').and.returnValue(expectedModelValue);
      component['formatPipe'] = pipe;
      component.formControl = formControl;
      component.formControl.mode = expectedMode;
      component.options.transformArgs = expectedTransformArgs;
      component.updateControlValue();
      expect(spyTransform).toHaveBeenCalledOnceWith(expectedModelValue, expectedMode, expectedTransformArgs);
    });

    it('should call formatModelValue method if formatPipe is not defined', () => {
      const expectedMode = CaepFormControlMode.Edit;
      const spyFormatModelValue = spyOn(component, 'formatModelValue');
      component['formatPipe'] = undefined;
      component.formControl = formControl;
      component.formControl.mode = expectedMode;
      component.updateControlValue();
      expect(spyFormatModelValue).toHaveBeenCalledTimes(1);
    });

    it('should update control value calling setControlValue with value resulting from formatting', () => {
      const expectedMode = CaepFormControlMode.Edit,
        expectedFormattedValue = '3.00',
        controlValue = '3.00 $';
      const spySetControlValue = spyOn(component, 'setControlValue');
      spyOn(component, 'formatModelValue').and.returnValue(expectedFormattedValue);
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      component['formatPipe'] = undefined;
      component.formControl = formControl;
      component.formControl.mode = expectedMode;
      component.updateControlValue();
      expect(spySetControlValue).toHaveBeenCalledOnceWith(expectedFormattedValue);
    });

    it('should not update control value if value resulting from formatting equals to control value', () => {
      const expectedMode = CaepFormControlMode.Edit,
        expectedValue = '3.00';
      const spySetControlValue = spyOn(component, 'setControlValue');
      spyOn(component, 'formatModelValue').and.returnValue(expectedValue);
      spyOn(component, 'getControlValue').and.returnValue(expectedValue);
      component['formatPipe'] = undefined;
      component.formControl = formControl;
      component.formControl.mode = expectedMode;
      component.updateControlValue();
      expect(spySetControlValue).not.toHaveBeenCalled();
    });

    it('should update control value calling setControlValue with passed value', () => {
      const expectedMode = CaepFormControlMode.Edit,
        expectedFormattedValue = '3.00',
        controlValue = '3.00 $';
      const spySetControlValue = spyOn(component, 'setControlValue');
      spyOn(component, 'getControlValue').and.returnValue(controlValue);
      component.formControl = formControl;
      component.formControl.mode = expectedMode;
      component.updateControlValue(expectedFormattedValue);
      expect(spySetControlValue).toHaveBeenCalledOnceWith(expectedFormattedValue);
    });
  });

  describe('updateModelValue', () => {
    it("should call pipe's revert method with right parameters if formatPipe is defined", () => {
      const expectedMode = CaepFormControlMode.Edit,
        expectedControlValue = '3.00',
        expectedTransformArgs = { arg1: 'arg1', arg2: 'arg2' } as IFormattedArgs;
      const pipe = new BaseFormattedChildPipe();
      const spyRevert = spyOn(pipe, 'revert');
      spyOn(component, 'getControlValue').and.returnValue(expectedControlValue);
      component['formatPipe'] = pipe;
      component.formControl = formControl;
      component.formControl.mode = expectedMode;
      component.options.transformArgs = expectedTransformArgs;
      component.updateModelValue();
      expect(spyRevert).toHaveBeenCalledOnceWith(expectedControlValue, expectedMode, expectedTransformArgs);
    });

    it('should call parseControlValue method if formatPipe is not defined', () => {
      const expectedMode = CaepFormControlMode.Edit;
      const spyParseControlValue = spyOn(component, 'parseControlValue');
      component['formatPipe'] = undefined;
      component.formControl = formControl;
      component.formControl.mode = expectedMode;
      component.updateModelValue();
      expect(spyParseControlValue).toHaveBeenCalledTimes(1);
    });

    it('should update model value calling setModelValue with value resulting from parsing', () => {
      const expectedMode = CaepFormControlMode.Edit,
        expectedParsedValue = 5,
        modelValue = 3;
      const spySetModelValue = spyOn(component, 'setModelValue');
      spyOn(component, 'parseControlValue').and.returnValue(expectedParsedValue);
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      component['formatPipe'] = undefined;
      component.formControl = formControl;
      component.formControl.mode = expectedMode;
      component.updateModelValue();
      expect(spySetModelValue).toHaveBeenCalledOnceWith(expectedParsedValue);
    });

    it('should not update model value if value resulting from parsing equals to model value', () => {
      const expectedMode = CaepFormControlMode.Edit,
        expectedValue = 3;
      const spySetModelValue = spyOn(component, 'setModelValue');
      spyOn(component, 'parseControlValue').and.returnValue(expectedValue);
      spyOn(component, 'getModelValue').and.returnValue(expectedValue);
      component['formatPipe'] = undefined;
      component.formControl = formControl;
      component.formControl.mode = expectedMode;
      component.updateModelValue();
      expect(spySetModelValue).not.toHaveBeenCalled();
    });

    it('should update model value calling setModelValue with passed value', () => {
      const expectedMode = CaepFormControlMode.Edit,
        expectedParsedValue = 5,
        modelValue = 3;
      const spySetModelValue = spyOn(component, 'setModelValue');
      spyOn(component, 'getModelValue').and.returnValue(modelValue);
      component.formControl = formControl;
      component.formControl.mode = expectedMode;
      component.updateModelValue(expectedParsedValue);
      expect(spySetModelValue).toHaveBeenCalledOnceWith(expectedParsedValue);
    });
  });

  describe('onFocusIn', () => {
    it('should set form control mode to Edit', () => {
      const expectedMode = CaepFormControlMode.Edit;
      component.formControl = formControl;
      expect(component.mode).not.toEqual(expectedMode);
      component.onFocusIn();
      expect(component.mode).toEqual(expectedMode);
    });

    it('should call updateControlValue method', () => {
      const spyUpdateControlValue = spyOn(component, 'updateControlValue');
      component.formControl = formControl;
      component.onFocusIn();
      expect(spyUpdateControlValue).toHaveBeenCalledTimes(1);
    });

    it('should trigger select event on event target', () => {
      const expectedEventName = 'select';
      const event = new FocusEvent('focusin');
      const element = { trigger: (eventName: string) => null };
      const spy$ = jasmine.createSpy('$').and.returnValue(element);
      (window as any).$ = spy$;
      const spyTrigger = spyOn(element, 'trigger');
      Object.defineProperty(event, 'target', {
        writable: true
      });
      (event as any).target = element;
      component.formControl = formControl;
      component.onFocusIn(event);
      expect(spy$).toHaveBeenCalledOnceWith(element);
      expect(spyTrigger).toHaveBeenCalledOnceWith(expectedEventName);
    });
  });

  describe('onFocusOut', () => {
    it('should set form control mode to Browse', () => {
      const expectedMode = CaepFormControlMode.Browse;
      component.formControl = formControl;
      component.formControl.mode = CaepFormControlMode.Edit;
      expect(component.mode).not.toEqual(expectedMode);
      component.onFocusOut();
      expect(component.mode).toEqual(expectedMode);
    });

    it('should call updateControlValue method', () => {
      const spyUpdateControlValue = spyOn(component, 'updateControlValue');
      component.formControl = formControl;
      component.onFocusOut();
      expect(spyUpdateControlValue).toHaveBeenCalledTimes(1);
    });
  });

  describe('initializeFormatPipe', () => {
    it('should create format pipe calling CaepPipeMapperService', () => {
      const pipeName = 'baseFormattedChild';
      component.options.transform = pipeName;
      expect(component['formatPipe']).toBeUndefined();
      component['initializeFormatPipe']();
      expect(mockPipeMapperService.findPipeByName).toHaveBeenCalledOnceWith(pipeName);
      expect(component['formatPipe']).toBeDefined();
      expect(component['formatPipe']).toBeInstanceOf(BaseFormattedChildPipe);
    });

    it('should not create format pipe if there is not a mapping for the given pipe name', () => {
      const pipeName = 'baseFormattedChild';
      component.options.transform = pipeName;
      mockPipeMapperService.findPipeByName.and.returnValue(undefined);
      component['initializeFormatPipe']();
      expect(mockPipeMapperService.findPipeByName).toHaveBeenCalledOnceWith(pipeName);
      expect(component['formatPipe']).toBeUndefined();
    });

    it('should not call CaepPipeMapperService if pipe name is not defined', () => {
      component.options.transform = undefined;
      component['initializeFormatPipe']();
      expect(mockPipeMapperService.findPipeByName).not.toHaveBeenCalled();
      expect(component['formatPipe']).toBeUndefined();
    });
  });
});

describe('BaseFormattedComponent', () => {
  let fixture: ComponentFixture<BaseFormattedChildFixtureWithoutOptionsComponent>,
    component: BaseFormattedChildFixtureWithoutOptionsComponent,
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
      declarations: [BaseFormattedChildFixtureWithoutOptionsComponent],
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
    fixture = TestBed.createComponent(BaseFormattedChildFixtureWithoutOptionsComponent);
    component = fixture.componentInstance;
  });

  it('should initialize only CaepBaseFormatted options', () => {
    expect(component).toBeTruthy();
    expect(component.options).toBeInstanceOf(CaepBaseFormattedOptions);
  });
});

describe('CaepBaseFormattedOptions', () => {
  let options: CaepBaseFormattedOptions<any>, inputOptions: ICaepBaseFormattedOptions<any>;

  describe('constructor', () => {
    it('should create options', () => {
      options = new CaepBaseFormattedOptions();
      expect(options).toBeDefined();
    });

    it('should set correct option values', () => {
      inputOptions = { transform: 'test', transformArgs: { arg1: 'arg1' } };
      options = new CaepBaseFormattedOptions(inputOptions);
      expect(options.transform).toEqual(inputOptions.transform);
      expect(options.transformArgs).toEqual(inputOptions.transformArgs);
    });
  });
});

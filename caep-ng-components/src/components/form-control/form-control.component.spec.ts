import {
  DebugElement,
  ElementRef,
  EventEmitter,
  NO_ERRORS_SCHEMA,
  SimpleChange,
  SimpleChanges,
  Type,
  provideZoneChangeDetection
} from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AspectHelper, Context, ContextService } from '@ca-webstack/ng-aspects';
import { IResourceParams, PolicyEngineService, ResourceService } from '@ca-webstack/ng-policy-engine';
import { Subject, of } from 'rxjs';
import { CaepValueChange } from '../../models';
import { CaepIdSequenceService } from '../../services';
import { CaepBaseOptions } from '../base';
import { CaepTemplateComponent } from '../template/template.component';
import { CaepFormControlComponent } from './form-control.component';

describe('CaepFormControlComponent', () => {
  let fixture: ComponentFixture<CaepFormControlComponent<string>>,
    component: CaepFormControlComponent<string>,
    element: HTMLElement,
    debugEl: DebugElement,
    mockContextChange$: Subject<Context>,
    mockPolicyEngineService,
    mockResourceService,
    mockIdSequenceService,
    mockAspectHelper,
    mockContextService,
    mockElementRef,
    mockInjector;
  const mockUri = 'mockUri',
    mockResource = { uri: mockUri } as IResourceParams,
    mockTemplate = 'mock-text',
    mockContext: Context = Context.edit;

  beforeEach(() => {
    mockContextChange$ = new Subject();
    mockPolicyEngineService = jasmine.createSpyObj('mockPolicyEngine', ['observePolicies']);
    mockPolicyEngineService.observePolicies.and.returnValue(of({}));
    mockResourceService = jasmine.createSpyObj('mockResource', ['getResource']);
    mockResourceService.getResource.and.returnValue(mockResource);
    mockIdSequenceService = jasmine.createSpyObj('mockIdSequence', ['next']);
    mockIdSequenceService.next.and.returnValue('id-0');
    mockAspectHelper = jasmine.createSpyObj('mockAspectHelper', ['getTemplate']);
    mockAspectHelper.getTemplate.and.returnValue(mockTemplate);
    mockContextService = jasmine.createSpyObj(
      'mockContext',
      {},
      { context: mockContext, contextChange: mockContextChange$ }
    );
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
      declarations: [CaepFormControlComponent, CaepTemplateComponent],
      providers: [
        { provide: CaepIdSequenceService, useValue: mockIdSequenceService },
        { provide: PolicyEngineService, useValue: mockPolicyEngineService },
        { provide: ResourceService, useValue: mockResourceService },
        { provide: AspectHelper, useValue: mockAspectHelper },
        { provide: ContextService, useValue: mockContextService },
        provideZoneChangeDetection()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<CaepFormControlComponent<string>>(CaepFormControlComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    debugEl = fixture.debugElement;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
    expect(element).toBeDefined();
    expect(element).not.toBeNull();
    expect(debugEl).toBeDefined();
  });

  describe('constructor', () => {
    it('should initialize service references', () => {
      expect(component['_aspectHelper']).toEqual(mockAspectHelper);
      expect(component['_contextService']).toEqual(mockContextService);
    });

    it('should initialize instance properties', () => {
      const expectedIsReady = true;
      expect(component.isReady).toEqual(expectedIsReady);
    });

    it('should initialize only default options', () => {
      expect(component.options).toBeDefined();
      expect(component.options).toBeInstanceOf(CaepBaseOptions);
    });

    it('should set isReady to false and call yieldFunc on contextChange', fakeAsync(() => {
      expect(mockContextChange$.observed).toBeTrue();
      expect(component.isReady).toBeTrue();
      mockContextChange$.next(Context.browse);
      expect(component.isReady).toBeFalse();
      tick();
      expect(component.isReady).toBeTrue();
    }));
  });

  it('giveFocus should call giveFocus method on template instance if defined', () => {
    const template = new CaepTemplateComponent(mockInjector);
    const spyGiveFocus = spyOn(template, 'giveFocus');
    component.controlRef = template as any;
    component.giveFocus();
    expect(spyGiveFocus).toHaveBeenCalledTimes(1);
  });

  it('giveFocus should not call giveFocus method on template instance if not defined', () => {
    const template = new CaepTemplateComponent(mockInjector);
    const spyGiveFocus = spyOn(template, 'giveFocus');
    component.controlRef = undefined;
    component.giveFocus();
    expect(spyGiveFocus).not.toHaveBeenCalled();
  });

  it('onCanValueChange should emit a valueChange request if there is at least one canValueChange observer', (done: Function) => {
    const newValue = 'test1.1';
    const model = { prop1: 'test1', prop2: 'test2' };
    const prop = 'prop1';
    const valueChange = new CaepValueChange(model, prop, newValue, new EventEmitter());
    component.canValueChange.subscribe((valueChange: CaepValueChange<string>) => {
      expect(valueChange).toBeInstanceOf(CaepValueChange);
      expect(valueChange.currentValue).toEqual(model.prop1);
      expect(valueChange.nextValue).toEqual(newValue);
      done();
    });
    component.onCanValueChange(valueChange);
  });

  it('onCanValueChange should call authorize method on valueChange if there are not canValueChange observers', () => {
    const newValue = 'test1.1';
    const model = { prop1: 'test1', prop2: 'test2' };
    const prop = 'prop1';
    const valueChange = new CaepValueChange(model, prop, newValue, new EventEmitter());
    const spyAuthorize = spyOn(valueChange, 'authorize');
    const spyEmit = spyOn(component.canValueChange, 'emit');
    component.onCanValueChange(valueChange);
    expect(spyAuthorize).toHaveBeenCalledTimes(1);
    expect(spyEmit).not.toHaveBeenCalled();
  });

  describe('onModelChange', () => {
    it('should not call aspectHelper getTemplate method on a change of another input property', () => {
      const change = new SimpleChange(true, false, false);
      const changes = { enable: change } as SimpleChanges;
      component['onModelChange'](changes);
      expect(mockAspectHelper.getTemplate).not.toHaveBeenCalled();
    });

    it('should not call aspectHelper getTemplate method if change is equal', () => {
      const previousModel = { prop1: 'test' };
      const newModel = { prop1: 'test' };
      const change = new SimpleChange(previousModel, newModel, false);
      const changes = { model: change } as SimpleChanges;
      component['onModelChange'](changes);
      expect(mockAspectHelper.getTemplate).not.toHaveBeenCalled();
    });

    it('should initialize isCaptionControl to false calling aspectHelper getTemplate method', () => {
      const previousModel = { prop1: 'test' };
      const prop = 'prop1';
      const newModel = { prop1: 'test2' };
      component.model = newModel;
      component.prop = prop;
      const change = new SimpleChange(previousModel, newModel, false);
      const changes = { model: change } as SimpleChanges;
      expect(component.isCaptionControl).toBeUndefined();
      component['onModelChange'](changes);
      expect(component.isCaptionControl).toBeFalse();
      expect(mockAspectHelper.getTemplate).toHaveBeenCalledOnceWith(newModel, prop, mockContextService.context);
    });

    it('should initialize isCaptionControl to false if aspectHelper getTemplate method returns falsy value', () => {
      const previousModel = { prop1: 'test' };
      const prop = 'prop1';
      const newModel = { prop1: 'test2' };
      component.model = newModel;
      component.prop = prop;
      const change = new SimpleChange(previousModel, newModel, false);
      const changes = { model: change } as SimpleChanges;
      mockAspectHelper.getTemplate.and.returnValue(undefined);
      expect(component.isCaptionControl).toBeUndefined();
      component['onModelChange'](changes);
      expect(component.isCaptionControl).toBeFalse();
      expect(mockAspectHelper.getTemplate).toHaveBeenCalledOnceWith(newModel, prop, mockContextService.context);
    });

    it('should initialize isCaptionControl to true calling aspectHelper getTemplate method', () => {
      const previousModel = { prop1: 'test' };
      const prop = 'prop1';
      const newModel = { prop1: 'test2' };
      component.model = newModel;
      component.prop = prop;
      const change = new SimpleChange(previousModel, newModel, false);
      const changes = { model: change } as SimpleChanges;
      mockAspectHelper.getTemplate.and.returnValue('caption');
      expect(component.isCaptionControl).toBeUndefined();
      component['onModelChange'](changes);
      expect(component.isCaptionControl).toBeTrue();
      expect(mockAspectHelper.getTemplate).toHaveBeenCalledOnceWith(newModel, prop, mockContextService.context);
    });
  });
});

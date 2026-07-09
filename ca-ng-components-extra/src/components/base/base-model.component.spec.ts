import { Component, DebugElement, EventEmitter, Injector, provideZoneChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IResourceParams, PolicyEngineService, ResourceService } from '@ca-webstack/ng-policy-engine';
import { of } from 'rxjs';
import { CaepValueChange } from '../../models';
import { CaepIdSequenceService } from '../../services';
import { CaepBaseModelComponent } from './base-model.component';

@Component({
    template: '<span id="base-model-child">BaseModel Component Child Fixture</span>',
    standalone: false
})
class BaseModelChildFixtureComponent extends CaepBaseModelComponent<string> {
  constructor(injector: Injector) {
    super(injector);
  }
}

describe('BaseModelComponent', () => {
  let fixture: ComponentFixture<BaseModelChildFixtureComponent>,
    component: BaseModelChildFixtureComponent,
    element: HTMLElement,
    rootControlElement: HTMLSpanElement,
    debugEl: DebugElement,
    mockPolicyEngineService,
    mockResourceService,
    mockIdSequenceService;
  const mockUri = 'mockUri',
    mockResource = { uri: mockUri } as IResourceParams;

  beforeEach(() => {
    mockPolicyEngineService = jasmine.createSpyObj('mockPolicyEngine', ['observePolicies']);
    mockPolicyEngineService.observePolicies.and.returnValue(of({}));
    mockResourceService = jasmine.createSpyObj('mockResource', ['getResource']);
    mockResourceService.getResource.and.returnValue(mockResource);
    mockIdSequenceService = jasmine.createSpyObj('mockIdSequence', ['next']);
    mockIdSequenceService.next.and.returnValue('id-0');
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [BaseModelChildFixtureComponent],
      providers: [
        { provide: CaepIdSequenceService, useValue: mockIdSequenceService },
        { provide: PolicyEngineService, useValue: mockPolicyEngineService },
        { provide: ResourceService, useValue: mockResourceService },
        provideZoneChangeDetection()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseModelChildFixtureComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    debugEl = fixture.debugElement;
    rootControlElement = element.querySelector<HTMLSpanElement>('#base-model-child');
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

  it('valueChanges should be an instance of EventEmitter', () => {
    expect(component.valueChanges).toBeDefined();
    expect(component.valueChanges).toBeInstanceOf(EventEmitter);
  });

  it('canValueChange should be an instance of EventEmitter', () => {
    expect(component.canValueChange).toBeDefined();
    expect(component.canValueChange).toBeInstanceOf(EventEmitter);
  });

  it('getModelValue should return the correct value if model property is already defined', () => {
    const model = { prop1: 'test1', prop2: 'test2' };
    const prop = 'prop1';
    component.model = model;
    component.prop = prop;
    const actualValue = component.getModelValue();
    expect(actualValue).toEqual(model.prop1);
  });

  it('getModelValue should return undefined if model property is not defined yet', () => {
    const model = { prop1: 'test1', prop2: 'test2' };
    const prop = 'prop3';
    component.model = model;
    component.prop = prop;
    const actualValue = component.getModelValue();
    expect(actualValue).toBeUndefined();
  });

  it('getModelValue should not return if model is a falsy value', () => {
    component.model = undefined;
    const actualValue = component.getModelValue();
    expect(actualValue).toBeUndefined();
  });

  describe('setModelValue', () => {
    it('should emit a valueChange request if there is at least one canValueChange observer', (done: Function) => {
      const newValue = 'test1.1';
      const model = { prop1: 'test1', prop2: 'test2' };
      const prop = 'prop1';
      component.model = model;
      component.prop = prop;
      component.canValueChange.subscribe((valueChange: CaepValueChange<string>) => {
        expect(valueChange).toBeInstanceOf(CaepValueChange);
        expect(valueChange.currentValue).toEqual(model.prop1);
        expect(valueChange.nextValue).toEqual(newValue);
        done();
      });
      component.setModelValue(newValue);
    });

    it('should set model value without emitting canValueChange request if there are not canValueChange observers', (done: Function) => {
      const newValue = 'test1.1';
      const model = { prop1: 'test1', prop2: 'test2' };
      const prop = 'prop1';
      component.model = model;
      component.prop = prop;
      component.valueChanges.subscribe((value: string) => {
        expect(model[prop]).toEqual(newValue);
        expect(value).toEqual(newValue);
        done();
      });
      component.setModelValue(newValue);
    });

    it('should not emit a valueChange request if model is a falsy value', () => {
      const newValue = 'test1.1';
      const spyCanValueChangeEmit = spyOn(component.canValueChange, 'emit');
      component.model = undefined;
      component.setModelValue(newValue);
      expect(spyCanValueChangeEmit).not.toHaveBeenCalled();
    });
  });

  describe('getResource', () => {
    it('should return resource if already set', () => {
      const resource = 'res';
      component.resource = resource;
      const actualValue = component.getResource();
      expect(actualValue).toEqual(resource);
    });

    it('should call ResourceService with right parameters and return the resource URI when resource is not set yet', () => {
      const model = { prop1: 'test1', prop2: 'test2' };
      const prop = 'prop1';
      component.model = model;
      component.prop = prop;
      //mockResourceService.getResource.calls.reset();
      const actualValue = component.getResource();
      expect(mockResourceService.getResource).toHaveBeenCalledOnceWith(model, prop);
      expect(actualValue).toEqual(mockUri);
    });

    it('should not return if resource from ResourceService is a falsy value', () => {
      const model = { prop1: 'test1', prop2: 'test2' };
      const prop = 'prop1';
      component.model = model;
      component.prop = prop;
      mockResourceService.getResource.and.returnValue(null);
      const actualValue = component.getResource();
      expect(actualValue).toBeUndefined();
    });
  });

  it('initializeResource should set resource calling getResource method', () => {
    const expectedResource = { uri: 'expectedUri' } as IResourceParams;
    const spyGetResource = spyOn(component, 'getResource');
    spyGetResource.and.returnValue(expectedResource.uri);
    component['initializeResource']();
    expect(spyGetResource).toHaveBeenCalledTimes(1);
    expect(component.resource).toEqual(expectedResource.uri);
  });
});

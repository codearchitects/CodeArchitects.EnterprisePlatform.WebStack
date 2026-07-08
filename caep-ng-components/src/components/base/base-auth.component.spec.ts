import { Component, DebugElement, Injector, provideZoneChangeDetection, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyEngineService, ResourceService } from '@ca-webstack/ng-policy-engine';
import { Subject } from 'rxjs';
import { CaepIdSequenceService } from '../../services';
import { CaepBaseAuthComponent, ICaepAuthorizationActions } from './base-auth.component';

@Component({
    template: '<span id="base-auth-child">BaseAuth Component Child Fixture</span>',
    standalone: false
})
class BaseAuthChildFixtureComponent extends CaepBaseAuthComponent {
  constructor(injector: Injector) {
    super(injector);
  }
}

describe('BaseAuthComponent', () => {
  let fixture: ComponentFixture<BaseAuthChildFixtureComponent>,
    component: BaseAuthChildFixtureComponent,
    element: HTMLElement,
    rootControlElement: HTMLSpanElement,
    debugEl: DebugElement,
    mockPolicyEngineService,
    mockResourceService,
    mockIdSequenceService,
    policies$: Subject<ICaepAuthorizationActions>;

  beforeEach(() => {
    policies$ = new Subject();
    mockPolicyEngineService = jasmine.createSpyObj('mockPolicyEngine', ['observePolicies']);
    mockPolicyEngineService.observePolicies.and.returnValue(policies$);
    mockResourceService = jasmine.createSpy();
    mockIdSequenceService = jasmine.createSpyObj('mockIdSequence', ['next']);
    mockIdSequenceService.next.and.returnValue('id-0');
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [BaseAuthChildFixtureComponent],
      providers: [
        { provide: CaepIdSequenceService, useValue: mockIdSequenceService },
        { provide: PolicyEngineService, useValue: mockPolicyEngineService },
        { provide: ResourceService, useValue: mockResourceService },
        provideZoneChangeDetection()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseAuthChildFixtureComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    debugEl = fixture.debugElement;
    rootControlElement = element.querySelector<HTMLSpanElement>('#base-auth-child');
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

  describe('Constructor', () => {
    it('should initialize service references', () => {
      expect(component.policyEngineService).toEqual(mockPolicyEngineService);
      expect(component.resourceService).toEqual(mockResourceService);
    });

    it('should initialize instance properties', () => {
      const expectedEnable = true;
      const expectedShow = true;
      const expectedSelectors = ['enable', 'show'];
      const expectedAuthorizations = { enable: true, show: true };
      const expectedLastMergedEnable = true;
      const expectedLastMergedShow = true;
      expect(component.enable).toEqual(expectedEnable);
      expect(component.show).toEqual(expectedShow);
      expect(component.selectors).toEqual(expectedSelectors);
      expect(component.authorizations).toEqual(expectedAuthorizations);
      expect(component['_lastMergedEnable']).toEqual(expectedLastMergedEnable);
      expect(component['_lastMergedShow']).toEqual(expectedLastMergedShow);
    });
  });

  describe('onPoliciesChanges', () => {
    it('should set authorization actions if new received policies are defined', () => {
      const newPolicies = { enable: false, show: true } as ICaepAuthorizationActions;
      expect(component.authorizations).not.toEqual(newPolicies);
      component.onPoliciesChanges(newPolicies);
      expect(component.authorizations).toEqual(newPolicies);
    });

    it('should set authorization actions to default true value if new received policies are undefined or null', () => {
      const newPolicies = { enable: undefined, show: null } as ICaepAuthorizationActions;
      const expectedAuthorizations = { enable: true, show: true } as ICaepAuthorizationActions;
      expect(component.authorizations).not.toEqual(newPolicies);
      component.onPoliciesChanges(newPolicies);
      expect(component.authorizations).toEqual(expectedAuthorizations);
    });

    it('should call mergeActions, emitEnableChange and setControlRefUpdate methods', () => {
      const spyMergeActions = spyOn<any>(component, 'mergeActions');
      const spyEmitEnableChange = spyOn<any>(component, 'emitEnableChange');
      const spySetControlRefUpdate = spyOn<any>(component, 'setControlRefUpdate');
      const newPolicies = { enable: false, show: true } as ICaepAuthorizationActions;
      component.onPoliciesChanges(newPolicies);
      expect(spyMergeActions).toHaveBeenCalledTimes(1);
      expect(spyEmitEnableChange).toHaveBeenCalledTimes(1);
      expect(spySetControlRefUpdate).toHaveBeenCalledTimes(1);
    });

    it('should set lastMergedEnable and lastMergedShow values to enable and show last values', () => {
      component.enable = true;
      component.show = true;
      component['_lastMergedEnable'] = component.enable;
      component['_lastMergedShow'] = component.show;
      const newPolicies = { enable: false, show: false } as ICaepAuthorizationActions;
      expect(component['_lastMergedEnable']).not.toBeFalse();
      expect(component['_lastMergedShow']).not.toBeFalse();
      component.onPoliciesChanges(newPolicies);
      expect(component['_lastMergedEnable']).toBeFalse();
      expect(component['_lastMergedShow']).toBeFalse();
    });

    it('should not update authorization actions and should not call mergeActions method if new received policies are a falsy value', () => {
      const spyMergeActions = spyOn<any>(component, 'mergeActions');
      const expectedAuthorizations = component.authorizations;
      const newPolicies = undefined;
      component.onPoliciesChanges(newPolicies);
      expect(component.authorizations).toEqual(expectedAuthorizations);
      expect(spyMergeActions).not.toHaveBeenCalled();
    });
  });

  describe('mergeActions', () => {
    it('should set enable to true if both local and authorization actions are true', () => {
      component.enable = true;
      component.authorizations.enable = true;
      component['mergeActions']();
      expect(component.enable).toBeTruthy();
    });

    it('should set enable to false if one of local or authorization action is false', () => {
      component.enable = true;
      component.authorizations.enable = false;
      component['mergeActions']();
      expect(component.enable).toBeFalsy();
      component.enable = false;
      component.authorizations.enable = true;
      component['mergeActions']();
      expect(component.enable).toBeFalsy();
    });

    it('should set enable to false if both local and authorization actions are false', () => {
      component.enable = false;
      component.authorizations.enable = false;
      component['mergeActions']();
      expect(component.enable).toBeFalsy();
    });

    it('should set show to true if both local and authorization actions are true', () => {
      component.show = true;
      component.authorizations.show = true;
      component['mergeActions']();
      expect(component.show).toBeTruthy();
    });

    it('should set show to false if one of local or authorization action is false', () => {
      component.show = true;
      component.authorizations.show = false;
      component['mergeActions']();
      expect(component.show).toBeFalsy();
      component.show = false;
      component.authorizations.show = true;
      component['mergeActions']();
      expect(component.show).toBeFalsy();
    });

    it('should set show to false if both local and authorization actions are false', () => {
      component.show = false;
      component.authorizations.show = false;
      component['mergeActions']();
      expect(component.show).toBeFalsy();
    });
  });

  describe('onAuthorizationActionChange', () => {
    it('should call mergeActions and emitEnableChange methods if enable property changes', () => {
      const spyMergeActions = spyOn<any>(component, 'mergeActions');
      const spyEmitEnableChange = spyOn<any>(component, 'emitEnableChange');
      const change = new SimpleChange(false, true, false);
      component['onAuthorizationActionChange']({ enable: change });
      expect(spyMergeActions).toHaveBeenCalledTimes(1);
      expect(spyEmitEnableChange).toHaveBeenCalledTimes(1);
    });

    it('should call mergeActions and setControlRefUpdate methods if show property changes', () => {
      const spyMergeActions = spyOn<any>(component, 'mergeActions');
      const spySetControlRefUpdate = spyOn<any>(component, 'setControlRefUpdate');
      const change = new SimpleChange(false, true, false);
      component['onAuthorizationActionChange']({ show: change });
      expect(spyMergeActions).toHaveBeenCalledTimes(1);
      expect(spySetControlRefUpdate).toHaveBeenCalledTimes(1);
    });

    it('should not call mergeActions if enable and show properties do not change', () => {
      const spyMergeActions = spyOn<any>(component, 'mergeActions');
      component['onAuthorizationActionChange']({ property: jasmine.any(Object) as any });
      expect(spyMergeActions).not.toHaveBeenCalled();
    });

    it('should not call emitEnableChange method on enable first change', () => {
      const spyEmitEnableChange = spyOn<any>(component, 'emitEnableChange');
      const change = new SimpleChange(undefined, true, true);
      component['onAuthorizationActionChange']({ enable: change });
      expect(spyEmitEnableChange).not.toHaveBeenCalled();
    });

    it('should not call setControlRefUpdate method on show first change', () => {
      const spySetControlRefUpdate = spyOn<any>(component, 'setControlRefUpdate');
      const change = new SimpleChange(undefined, true, true);
      component['onAuthorizationActionChange']({ show: change });
      expect(spySetControlRefUpdate).not.toHaveBeenCalled();
    });

    it('should set lastMergedEnable and lastMergedShow values to enable and show last values', () => {
      component.enable = false;
      component.show = false;
      const change = new SimpleChange(true, false, true);
      expect(component['_lastMergedEnable']).not.toBeFalse();
      expect(component['_lastMergedShow']).not.toBeFalse();
      component['onAuthorizationActionChange']({ show: change, enable: change });
      expect(component['_lastMergedEnable']).toBeFalse();
      expect(component['_lastMergedShow']).toBeFalse();
    });
  });

  describe('observePolicies', () => {
    it('should call observePolicies method from PolicyEngineService with right parameters', () => {
      //mockPolicyEngineService.observePolicies.calls.reset();
      component['observePolicies']();
      expect(mockPolicyEngineService.observePolicies).toHaveBeenCalledOnceWith(
        component.resource,
        ...component.selectors
      );
    });

    it('should subscribe to policy changes', () => {
      expect(policies$.observed).toBeFalse();
      component['observePolicies']();
      expect(policies$.observed).toBeTrue();
    });

    it('should call onPoliciesChanges when new policy is emitted', (done: Function) => {
      const spyOnPoliciesChanges = spyOn(component, 'onPoliciesChanges');
      let newPolicies = { enable: false, show: true } as ICaepAuthorizationActions;
      component['observePolicies']();
      policies$.next(newPolicies);
      expect(spyOnPoliciesChanges).toHaveBeenCalledOnceWith(newPolicies);
      setTimeout(() => {
        newPolicies = { enable: true, show: false } as ICaepAuthorizationActions;
        policies$.next(newPolicies);
        expect(spyOnPoliciesChanges).toHaveBeenCalledWith(newPolicies);
        done();
      });
    });
  });

  it('emitEnableChange should emit enable change event if current enable differs from old enable', (done: Function) => {
    component.enable = true;
    component['_lastMergedEnable'] = false;
    component['enableEmitter'].subscribe((value: boolean) => {
      expect(value).toBeTrue();
      done();
    });
    component['emitEnableChange']();
  });

  it('emitEnableChange should not emit enable change event if current enable equals to old enable', () => {
    const spyEmit = spyOn(component['enableEmitter'], 'emit');
    component.enable = true;
    component['_lastMergedEnable'] = true;
    component['emitEnableChange']();
    expect(spyEmit).not.toHaveBeenCalled();
  });

  it('setControlRefUpdate should set controlRefUpdate property if current show is true and differs from old show', () => {
    component['controlRefUpdate'] = false;
    component.show = true;
    component['_lastMergedShow'] = false;
    component['setControlRefUpdate']();
    expect(component['controlRefUpdate']).toBeTrue();
  });

  it('setControlRefUpdate should not set controlRefUpdate property if current show equals to old show', () => {
    component['controlRefUpdate'] = false;
    component.show = true;
    component['_lastMergedShow'] = true;
    component['setControlRefUpdate']();
    expect(component['controlRefUpdate']).toBeFalse();
  });

  it('setControlRefUpdate should not set controlRefUpdate property if current show is false', () => {
    component['controlRefUpdate'] = false;
    component.show = false;
    component['_lastMergedShow'] = true;
    component['setControlRefUpdate']();
    expect(component['controlRefUpdate']).toBeFalse();
  });
});

import { Subject } from 'rxjs';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { BaseAuthFixture } from '../../fixtures';
import { PolicyEngineService, ResourceService } from '@ca-webstack/ng-policy-engine';
import { SimpleChange } from '@angular/core';

describe('BaseAuth component', () => {
  let component: BaseAuthFixture;
  let fixture: ComponentFixture<BaseAuthFixture>;
  let htmlElement: HTMLSpanElement;

  const idSequenceServiceNext = jasmine.createSpy();
  const mockedIdSequenceService = {
    next: idSequenceServiceNext
  };

  const policies = new Subject();
  const observePolicies = jasmine.createSpy().and.returnValue(policies);
  const mockedPolicyEngineService = {
    observePolicies
  };

  const mockedResourceService = {
    getResource: () => null
  };

  const run = jasmine.createSpy().and.returnValue([{ event: { params: { name: 'show' } }, matched: false }, { event: { params: { name: 'enable' } }, matched: true }]);
  const observe = jasmine.createSpy().and.returnValue(new Subject());

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseAuthFixture],
      providers: [
        { provide: IdSequenceService, useValue: mockedIdSequenceService },
        { provide: PolicyEngineService, useValue: mockedPolicyEngineService },
        { provide: ResourceService, useValue: mockedResourceService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    idSequenceServiceNext.calls.reset();
    fixture = TestBed.createComponent(BaseAuthFixture);
    component = fixture.debugElement.componentInstance;
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector<HTMLSpanElement>('#base-auth-component');
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(htmlElement).toBeDefined();
    expect(htmlElement instanceof HTMLSpanElement).toBeTruthy();
  });
  describe('Constructor side effects', () => {
    it('should set services correctly', () => {
      expect(component['policyEngineService']).toEqual(mockedPolicyEngineService as any);
      expect(component['resourceService']).toEqual(mockedResourceService);
    });
  });
  describe('ngOnChanges side effects', () => {
    it('should call merge actions when enable has changed', () => {
      const spy = spyOn(component as any, 'mergeActions');
      spy.calls.reset();
      const change = new SimpleChange(false, true, false);
      component.ngOnChanges({ 'enable': change });
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call merge actions when show has changed', () => {
      const spy = spyOn(component as any, 'mergeActions');
      spy.calls.reset();
      const change = new SimpleChange(false, true, false);
      component.ngOnChanges({ 'show': change });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
  describe('ngOnInit side effects', () => {
    it('should call observePolicies and subscribe', () => {
      observePolicies.calls.reset();
      const observers = policies.observers.length;
      component.ngOnInit();

      expect(observePolicies).toHaveBeenCalledTimes(1);
      expect(observePolicies).toHaveBeenCalledWith(component.resource, ...component.selectors);
      expect(policies.observers.length).toEqual(observers + 1);
    });
  });
  describe('mergeActions', () => {
    describe('merge enable', () => {
      it('should be true when both local action and autorization action are true', () => {
        component.enable = true;
        component['authorizations'].enable = true;

        component['mergeActions']();

        expect(component.enable).toBeTruthy();
      });
      it('should be false when one of actions is false', () => {
        component.enable = true;
        component['authorizations'].enable = false;

        component['mergeActions']();

        expect(component.enable).toBeFalsy();

        component.enable = false;
        component['authorizations'].enable = true;

        component['mergeActions']();

        expect(component.enable).toBeFalsy();
      });
      it('should be false when both actions are false', () => {
        component.enable = false;
        component['authorizations'].enable = false;

        component['mergeActions']();

        expect(component.enable).toBeFalsy();
      });
    });
    describe('merge show', () => {
      it('should be true when both local action and autorization action are true', () => {
        component.show = true;
        component['authorizations'].show = true;

        component['mergeActions']();

        expect(component.show).toBeTruthy();
      });
      it('should be false when one of actions is false', () => {
        component.show = true;
        component['authorizations'].show = false;

        component['mergeActions']();

        expect(component.show).toBeFalsy();

        component.show = false;
        component['authorizations'].show = true;

        component['mergeActions']();

        expect(component.show).toBeFalsy();
      });
      it('should be false when both actions are false', () => {
        component.show = false;
        component['authorizations'].show = false;

        component['mergeActions']();

        expect(component.show).toBeFalsy();
      });
    });
  });
  describe('onPoliciesChange', () => {
    it('should set authorization actions', () => {
      const actions = { show: false, enable: true };
      expect(component['authorizations']).not.toEqual(actions);

      component['onPoliciesChanges'](actions);

      expect(component['authorizations']).toEqual(actions);
    });
    it('should set true by default if action is undefined', () => {
      const actions = { show: undefined, enable: null };
      const expectedDefaultActions = { show: true, enable: true };

      component['authorizations'] = { show: true, enable: false };
      expect(component['authorizations']).not.toEqual(expectedDefaultActions);

      component['onPoliciesChanges'](actions);

      expect(component['authorizations']).toEqual(expectedDefaultActions);
    });
    it('should call merge actions', () => {
      const spy = spyOn(component as any, 'mergeActions');
      spy.calls.reset();
      component.enable = false;
      component.show = true;
      const actions = { enable: true, show: false };

      component['onPoliciesChanges'](actions);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(component['authorizations']).toEqual(actions);
      expect(component.enable).toBeFalsy();
      expect(component.show).toBeTruthy();
    });
  });
});

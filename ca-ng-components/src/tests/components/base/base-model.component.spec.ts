import { ResourceService } from '@ca-webstack/ng-policy-engine';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { BaseModelFixture } from '../../fixtures';

describe('BaseModel component', () => {
  let component: BaseModelFixture;
  let fixture: ComponentFixture<BaseModelFixture>;
  let htmlElement: HTMLDivElement;

  const idSequenceServiceNext = jasmine.createSpy();
  const mockedIdSequenceService = {
    next: idSequenceServiceNext
  };

  const mockedResource = 'fooRes';
  const mockedGetResource = jasmine.createSpy().and.returnValue({ uri: mockedResource });
  const mockedResourceService = {
    getResource: mockedGetResource
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseModelFixture],
      providers: [
        { provide: IdSequenceService, useValue: mockedIdSequenceService },
        { provide: ResourceService, useValue: mockedResourceService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    idSequenceServiceNext.calls.reset();
    fixture = TestBed.createComponent(BaseModelFixture);
    component = fixture.debugElement.componentInstance;
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector<HTMLDivElement>('#base-model-component');
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });
  it('valueChanges should be an event emitter instance', () => {
    expect(component.valueChanges).toBeDefined();
    expect(component.valueChanges instanceof EventEmitter).toBeTruthy();
  });
  it('should subscribe to valueChanges emitter, calling handler when it emits', () => {
    const handler = jasmine.createSpy();
    const expectedValue = 10;

    component.controlChangeHandler = handler;
    expect(component.valueChanges.observers.length).toEqual(1);

    component.valueChanges.emit(expectedValue);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(expectedValue);
  });
  it('onInit should set resource calling getResource', () => {
    const expectedResource = { foo: 'sample' };
    const spy = spyOn(component as any, 'getResource').and.returnValue(expectedResource);
    spy.calls.reset();

    component.ngOnInit();
    expect(component.resource).toEqual(expectedResource as any);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('getModelValue should return correct value', () => {
    const model = { prop1: 'foo', prop2: 'sample' };
    const prop = 'prop2';
    component.model = model;
    component.prop = prop;

    expect(component['getModelValue']()).toEqual(model[prop]);
  });
  describe('setModelValue', () => {
    it('should set value and emit change', done => {
      const model = { prop1: 'a' };
      const prop = 'prop1';
      const newValue = 'b';
      component.model = model;
      component.prop = prop;
      const subscriber = component.valueChanges.subscribe(value => {
        expect(model.prop1).toEqual(newValue);
        expect(value).toEqual(newValue);
        subscriber.unsubscribe();
        done();
      });
      component['setModelValue'](newValue);
    });
    it('should not set value and emit change when can not change value', () => {
      const model = { prop1: 'a' };
      const prop = 'prop1';
      const newValue = 'b';
      component.model = model;
      component.prop = prop;
      component['internalOptions'].onCanValueChanges = () => false;

      const subscriber = component.valueChanges.subscribe(() => {
        subscriber.unsubscribe();
        throw new Error('not expecting value change');
      });
      component['setModelValue'](newValue);
      expect(component.model[prop]).toEqual('a');
    });
  });
  describe('getResource', () => {
    it('should return component resource if set', () => {
      const resource = 'myRes';
      component.resource = resource;

      expect(component['getResource']()).toEqual(resource);
    });
    it('should call service and return resource uri', () => {
      const model = { prop1: 'a' };
      const prop = 'prop1';
      component.model = model;
      component.prop = prop;
      mockedGetResource.calls.reset();

      const res = component['getResource']();

      expect(res).toEqual(mockedResource);
    });
  });
});

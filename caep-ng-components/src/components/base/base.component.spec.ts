import {
  Component,
  DebugElement,
  ElementRef,
  EventEmitter,
  Injector,
  provideZoneChangeDetection,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { CaepOption } from '../../decorators';
import { CaepHookManager, CaepSimpleOptionsChange } from '../../models';
import { CaepIdSequenceService } from '../../services';
import { PickAll } from '../../utilities';
import { CaepBaseComponent, CaepBaseOptions } from './base.component';

interface IBaseChildFixtureOptions extends PickAll<BaseChildFixtureOptions> {}

class BaseChildFixtureOptions extends CaepBaseOptions {
  @CaepOption({ defaultValue: 'blue' })
  color?: string;

  constructor(options?: IBaseChildFixtureOptions) {
    super(options);
  }
}

@Component({
    template: '<span [attr.tabindex]="tabindex" id="base-child" [ngStyle]="{ \'color\': options.color }">Base Component Child Fixture</span>',
    standalone: false
})
class BaseChildFixtureComponent extends CaepBaseComponent<BaseChildFixtureOptions> {
  constructor(injector: Injector) {
    super(injector, (value?: IBaseChildFixtureOptions) => new BaseChildFixtureOptions(value));
  }
}

@Component({
    template: '<span [attr.tabindex]="tabindex" id="base-child">Base Component Child Fixture</span>',
    standalone: false
})
class BaseChildFixtureWithoutOptionsComponent extends CaepBaseComponent {
  constructor(injector: Injector) {
    super(injector);
  }
}

describe('BaseComponent', () => {
  let fixture: ComponentFixture<BaseChildFixtureComponent>,
    component: BaseChildFixtureComponent,
    element: HTMLElement,
    rootControlElement: HTMLSpanElement,
    debugEl: DebugElement,
    mockIdSequenceService;

  beforeEach(() => {
    mockIdSequenceService = jasmine.createSpyObj('mockIdSequence', ['next']);
    mockIdSequenceService.next.and.returnValue('id-0');
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [BaseChildFixtureComponent],
      providers: [{ provide: CaepIdSequenceService, useValue: mockIdSequenceService }, provideZoneChangeDetection()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseChildFixtureComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    debugEl = fixture.debugElement;
    rootControlElement = element.querySelector<HTMLSpanElement>('#base-child');
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
    it('should call next method on CaepIdSequenceService', () => {
      expect(mockIdSequenceService.next).toHaveBeenCalledTimes(1);
      expect(component.id).toBe('id-0');
    });

    it('should initialize options', () => {
      expect(component.options).toBeDefined();
      expect(component.options).toBeInstanceOf(BaseChildFixtureOptions);
    });

    it('should initialize hook manager', () => {
      expect(component['_hookManager']).toBeDefined();
      expect(component['_hookManager']).toBeInstanceOf(CaepHookManager);
    });

    it('should set component reference on nativeElement', () => {
      expect(component['injector'].get(ElementRef).nativeElement.component).toBeDefined();
      expect(component['injector'].get(ElementRef).nativeElement.component).toBe(component);
    });

    it('should initialize instance properties', () => {
      const expectedTabindex = 0;
      const expectedAutofocus = false;
      const expectedContainerClass = '';
      const expectedControlRefUpdate = false;
      expect(component.tabindex).toEqual(expectedTabindex);
      expect(component.autofocus).toEqual(expectedAutofocus);
      expect(component.containerClass).toEqual(expectedContainerClass);
      expect(component['controlRefUpdate']).toEqual(expectedControlRefUpdate);
      expect(component.destroy$).toBeInstanceOf(Subject);
      expect(component['_afterContentInitCall$']).toBeInstanceOf(Subject);
    });
  });

  describe('hostOptions setter', () => {
    it('should not set options on options change if change is equal', () => {
      const previousOptions = new BaseChildFixtureOptions({ color: 'green' });
      const currrentOptions = { color: 'green' } as IBaseChildFixtureOptions;
      component.options = previousOptions;
      component.hostOptions = currrentOptions;
      expect(component.options).toBe(previousOptions);
    });

    it('should call areOptionsEqual method with right parameters', () => {
      const previousOptions = new BaseChildFixtureOptions({ color: 'green' });
      const currrentOptions = { color: 'green' } as IBaseChildFixtureOptions;
      const spyAreOptionsEqual = spyOn(component, 'areOptionsEqual');
      component.options = previousOptions;
      component.hostOptions = currrentOptions;
      expect(spyAreOptionsEqual).toHaveBeenCalledOnceWith(previousOptions, currrentOptions);
    });

    it('should set options creating a new BaseChildFixtureOptions instance if the passed value is a IBaseChildFixtureOptions object', () => {
      const previousOptions = new BaseChildFixtureOptions({ color: 'green' });
      const currrentOptions = { color: 'red' } as IBaseChildFixtureOptions;
      const expectedOptions = new BaseChildFixtureOptions(currrentOptions);
      const spyOptionsCtor = spyOn<any>(component, '_optionsCtor');
      spyOptionsCtor.and.returnValue(expectedOptions);
      component.options = previousOptions;
      component.hostOptions = currrentOptions;
      expect(spyOptionsCtor).toHaveBeenCalledOnceWith(currrentOptions);
      expect(component.options).toBe(expectedOptions);
    });

    it('should set options without creating a new BaseChildFixtureOptions instance if the passed value is a BaseChildFixtureOptions object', () => {
      const previousOptions = new BaseChildFixtureOptions({ color: 'green' });
      const currrentOptions = new BaseChildFixtureOptions({ color: 'red' });
      const spyOptionsCtor = spyOn<any>(component, '_optionsCtor');
      component.options = previousOptions;
      component.hostOptions = currrentOptions;
      expect(spyOptionsCtor).not.toHaveBeenCalled();
      expect(component.options).toBe(currrentOptions);
    });
  });

  it('keypressed should be an instance of EventEmitter', () => {
    expect(component.keypressed).toBeDefined();
    expect(component.keypressed).toBeInstanceOf(EventEmitter);
  });

  it('keydowned should be an instance of EventEmitter', () => {
    expect(component.keydowned).toBeDefined();
    expect(component.keydowned).toBeInstanceOf(EventEmitter);
  });

  it('keyupped should be an instance of EventEmitter', () => {
    expect(component.keyupped).toBeDefined();
    expect(component.keyupped).toBeInstanceOf(EventEmitter);
  });

  it('clicked should be an instance of EventEmitter', () => {
    expect(component.clicked).toBeDefined();
    expect(component.clicked).toBeInstanceOf(EventEmitter);
  });

  it('dblclicked should be an instance of EventEmitter', () => {
    expect(component.dblclicked).toBeDefined();
    expect(component.dblclicked).toBeInstanceOf(EventEmitter);
  });

  it('focused should be an instance of EventEmitter', () => {
    expect(component.focused).toBeDefined();
    expect(component.focused).toBeInstanceOf(EventEmitter);
  });

  it('blurred should be an instance of EventEmitter', () => {
    expect(component.blurred).toBeDefined();
    expect(component.blurred).toBeInstanceOf(EventEmitter);
  });

  it('mousemoved should be an instance of EventEmitter', () => {
    expect(component.mousemoved).toBeDefined();
    expect(component.mousemoved).toBeInstanceOf(EventEmitter);
  });

  describe('OnInit', () => {
    it('should call initialize method on the hook manager', () => {
      const spyInitialize = spyOn(component['_hookManager'], 'initialize');
      component.ngOnInit();
      expect(spyInitialize).toHaveBeenCalledTimes(1);
    });
  });

  describe('OnChanges', () => {
    it('should call change method on the hook manager with correct parameters', () => {
      const spyChange = spyOn(component['_hookManager'], 'change');
      const previousTooltip = undefined;
      const newTooltip = 'Test tooltip';
      const change = new SimpleChange(previousTooltip, newTooltip, true);
      const changes = { tooltip: change } as SimpleChanges;
      component.ngOnChanges(changes);
      expect(spyChange).toHaveBeenCalledOnceWith(changes);
    });
  });

  describe('AfterViewInit', () => {
    it('should call initializeAfterViewInit method on the hook manager', () => {
      const spyInitialize = spyOn(component['_hookManager'], 'initializeAfterViewInit');
      component.ngAfterViewInit();
      expect(spyInitialize).toHaveBeenCalledTimes(1);
    });
  });

  describe('AfterViewCheck', () => {
    it('should call initializeAfterViewCheck method on the hook manager', () => {
      const spyInitialize = spyOn(component['_hookManager'], 'initializeAfterViewCheck');
      component.ngAfterViewChecked();
      expect(spyInitialize).toHaveBeenCalledTimes(1);
    });
  });

  describe('DoCheck', () => {
    it('should call doCheck method on the hook manager', () => {
      const spyDoCheck = spyOn(component['_hookManager'], 'doCheck');
      component.ngDoCheck();
      expect(spyDoCheck).toHaveBeenCalledTimes(1);
    });
  });

  describe('AfterContentInit', () => {
    it('should call next method on afterContentInitCall subject', () => {
      const spyAfterContentInitCallNext = spyOn(component['_afterContentInitCall$'], 'next');
      component.ngAfterContentInit();
      expect(spyAfterContentInitCallNext).toHaveBeenCalledTimes(1);
    });

    it('should call initializeAfterContentInit method on the hook manager', () => {
      const spyInitialize = spyOn(component['_hookManager'], 'initializeAfterContentInit');
      component.ngAfterContentInit();
      expect(spyInitialize).toHaveBeenCalledTimes(1);
    });
  });

  describe('AfterContentCheck', () => {
    it('should call initializeAfterContentCheck method on the hook manager', () => {
      const spyInitialize = spyOn(component['_hookManager'], 'initializeAfterContentCheck');
      component.ngAfterContentChecked();
      expect(spyInitialize).toHaveBeenCalledTimes(1);
    });
  });

  describe('OnDestroy', () => {
    it('should call destroy method on the hook manager', () => {
      const spyDestroy = spyOn(component['_hookManager'], 'destroy');
      component.ngOnDestroy();
      expect(spyDestroy).toHaveBeenCalledTimes(1);
    });
  });

  describe('OnOptionsChanges', () => {
    it('should call optionsChange method on the hook manager', () => {
      const spyOptionsChange = spyOn(component['_hookManager'], 'optionsChange');
      const optionsChange = new CaepSimpleOptionsChange(null, null);
      component.caepOnOptionsChanges(optionsChange);
      expect(spyOptionsChange).toHaveBeenCalledOnceWith(optionsChange);
    });
  });

  describe('registerEvents', () => {
    it('should set control keypress handler if father component listens to keypress event', (done: Function) => {
      component.controlRef = { nativeElement: rootControlElement };
      component.keypressed.subscribe(ev => {
        expect(ev).toBe(event);
        done();
      });
      component['registerEvents']();
      const event = new KeyboardEvent('keypress');
      rootControlElement.dispatchEvent(event);
    });

    it('should set control keydown handler if father component listens to keydown event', (done: Function) => {
      component.controlRef = { nativeElement: rootControlElement };
      component.keydowned.subscribe(ev => {
        expect(ev).toBe(event);
        done();
      });
      component['registerEvents']();
      const event = new KeyboardEvent('keydown');
      rootControlElement.dispatchEvent(event);
    });

    it('should set control keyup handler if father component listens to keyup event', (done: Function) => {
      component.controlRef = { nativeElement: rootControlElement };
      component.keyupped.subscribe(ev => {
        expect(ev).toBe(event);
        done();
      });
      component['registerEvents']();
      const event = new KeyboardEvent('keyup');
      rootControlElement.dispatchEvent(event);
    });

    it('should set control click handler if father component listens to click event', (done: Function) => {
      component.controlRef = { nativeElement: rootControlElement };
      component.clicked.subscribe(ev => {
        expect(ev).toBe(event);
        done();
      });
      component['registerEvents']();
      const event = new MouseEvent('click');
      rootControlElement.dispatchEvent(event);
    });

    it('should set control double click handler if father component listens to dblclick event', (done: Function) => {
      component.controlRef = { nativeElement: rootControlElement };
      component.dblclicked.subscribe(ev => {
        expect(ev).toBe(event);
        done();
      });
      component['registerEvents']();
      const event = new MouseEvent('dblclick');
      rootControlElement.dispatchEvent(event);
    });

    it('should set control focus handler if father component listens to focus event', (done: Function) => {
      component.controlRef = { nativeElement: rootControlElement };
      component.focused.subscribe(ev => {
        expect(ev).toBe(event);
        done();
      });
      component['registerEvents']();
      const event = new FocusEvent('focus');
      rootControlElement.dispatchEvent(event);
    });

    it('should set control blur handler if father component listens to blur event', (done: Function) => {
      component.controlRef = { nativeElement: rootControlElement };
      component.blurred.subscribe(ev => {
        expect(ev).toBe(event);
        done();
      });
      component['registerEvents']();
      const event = new FocusEvent('blur');
      rootControlElement.dispatchEvent(event);
    });

    it('should set control mousemove handler if father component listens to mousemove event', (done: Function) => {
      component.controlRef = { nativeElement: rootControlElement };
      component.mousemoved.subscribe(ev => {
        expect(ev).toBe(event);
        done();
      });
      component['registerEvents']();
      const event = new MouseEvent('mousemove');
      rootControlElement.dispatchEvent(event);
    });

    it('should return the correct html element', () => {
      component.controlRef = { nativeElement: rootControlElement };
      const actualElement = component['registerEvents']();
      expect(actualElement).toBe(rootControlElement);
    });

    it('should not return html element if controlRef property is undefined', () => {
      component.controlRef = undefined;
      const actualElement = component['registerEvents']();
      expect(actualElement).not.toBe(rootControlElement);
      expect(actualElement).toBeUndefined();
    });
  });

  it('focusControl should call giveFocus method when autofocus is true', () => {
    const spyGiveFocus = spyOn(component, 'giveFocus');
    component.autofocus = true;
    component.focusControl();
    expect(spyGiveFocus).toHaveBeenCalledTimes(1);
  });

  it('focusControl should not call giveFocus method if autofocus is false', () => {
    const spyGiveFocus = spyOn(component, 'giveFocus');
    component.autofocus = false;
    component.focusControl();
    expect(spyGiveFocus).toHaveBeenCalledTimes(0);
  });

  it('giveFocus should focus the element', () => {
    fixture.detectChanges();
    component.controlRef = { nativeElement: rootControlElement };
    component.giveFocus();
    expect(document.activeElement).toEqual(rootControlElement);
  });

  it('giveFocus should not focus the element if controlRef property is undefined', () => {
    fixture.detectChanges();
    component.controlRef = undefined;
    const actualValue = component.giveFocus();
    expect(document.activeElement).not.toEqual(rootControlElement);
    expect(actualValue).toBeUndefined();
  });

  it('isChangeEqual should call lodash isEqualWith method with right parameters', () => {
    const spyEqualCustomizer = spyOn<any>(component, 'equalCustomizer').and.callThrough();
    const change = new SimpleChange({ autofocus: true }, { autofocus: false }, false);
    const result = component.isChangeEqual(change);
    expect(result).toBeFalse();
    expect(spyEqualCustomizer).toHaveBeenCalled();
  });

  describe('areOptionsEqual', () => {
    it('should return true if two BaseChildFixtureOptions objects have same property values', () => {
      const previousOptions = new BaseChildFixtureOptions({ color: 'blue' });
      const currrentOptions = new BaseChildFixtureOptions({ color: 'blue' });
      const actualResult = component.areOptionsEqual(previousOptions, currrentOptions);
      expect(actualResult).toBeTruthy();
    });

    it('should return false if two BaseChildFixtureOptions objects have different property values', () => {
      const previousOptions = new BaseChildFixtureOptions({ color: 'blue' });
      const currrentOptions = new BaseChildFixtureOptions({ color: 'green' });
      const actualResult = component.areOptionsEqual(previousOptions, currrentOptions);
      expect(actualResult).toBeFalsy();
    });

    it('should call lodash isEqualWith method with right parameters while comparing two BaseChildFixtureOptions objects', () => {
      const spyEqualCustomizer = spyOn<any>(component, 'equalCustomizer').and.callThrough();
      const previousOptions = new BaseChildFixtureOptions({ color: 'blue' });
      const currrentOptions = new BaseChildFixtureOptions({ color: 'green' });
      component.areOptionsEqual(previousOptions, currrentOptions);
      expect(spyEqualCustomizer).toHaveBeenCalled();
    });

    it('should return true if a BaseChildFixtureOptions instance and a IBaseChildFixtureOptions object have same property values', () => {
      const previousOptions = new BaseChildFixtureOptions({ color: 'blue' });
      const currrentOptions = { color: 'blue' } as IBaseChildFixtureOptions;
      const actualResult = component.areOptionsEqual(previousOptions, currrentOptions);
      expect(actualResult).toBeTruthy();
    });

    it('should return false if a BaseChildFixtureOptions instance and a IBaseChildFixtureOptions object have different property values', () => {
      const previousOptions = new BaseChildFixtureOptions({ color: 'blue' });
      const currrentOptions = { color: 'green' } as IBaseChildFixtureOptions;
      const actualResult = component.areOptionsEqual(previousOptions, currrentOptions);
      expect(actualResult).toBeFalsy();
    });

    it('should call lodash isEqualWith method with right parameters for every property while comparing BaseChildFixtureOptions and IBaseChildFixtureOptions objects', () => {
      const spyEqualCustomizer = spyOn<any>(component, 'equalCustomizer').and.callThrough();
      const previousOptions = new BaseChildFixtureOptions({ color: 'blue' });
      const currrentOptions = { color: 'green' } as IBaseChildFixtureOptions;
      component.areOptionsEqual(previousOptions, currrentOptions);
      expect(spyEqualCustomizer).toHaveBeenCalled();
    });
  });

  it('equalCustomizer should return true if compared functions have equal names', () => {
    const func1 = () => {};
    const actualValue = component['equalCustomizer'](func1, func1);
    expect(actualValue).toBeTrue();
  });

  it('equalCustomizer should return false if compared functions have different names', () => {
    const func1 = () => {};
    const func2 = () => {};
    const actualValue = component['equalCustomizer'](func1, func2);
    expect(actualValue).toBeFalse();
  });

  it('isAsync should return true if checked value is a BehaviourSubject', () => {
    const actualValue = component.isAsync(new BehaviorSubject('start'));
    expect(actualValue).toBeTrue();
  });

  it('isAsync should return false if checked value is not a BehaviourSubject', () => {
    const actualValue = component.isAsync('start');
    expect(actualValue).toBeFalse();
  });

  it('isObservable should return true if checked value is an Observable', () => {
    const actualValue = component.isObservable(new BehaviorSubject('start'));
    expect(actualValue).toBeTrue();
  });

  it('isObservable should return false if checked value is not an Observable', () => {
    const actualValue = component.isObservable('start');
    expect(actualValue).toBeFalse();
  });

  it('setupFocusControl should call focusControl method', fakeAsync(() => {
    const spyFocusControl = spyOn(component, 'focusControl');
    expect(spyFocusControl).toHaveBeenCalledTimes(0);
    component['setupFocusControl']();
    tick();
    expect(spyFocusControl).toHaveBeenCalledTimes(1);
  }));

  describe('setupTooltip', () => {
    it('should set control title', () => {
      const expectedTooltip = 'tooltip';
      component.controlRef = { nativeElement: rootControlElement };
      component.tooltip = expectedTooltip;
      component['setupTooltip']();
      expect(rootControlElement.title).toEqual(expectedTooltip);
    });

    it('should set control title to empty string if tooltip is undefined', () => {
      const expectedTooltip = '';
      component.controlRef = { nativeElement: rootControlElement };
      component.tooltip = undefined;
      component['setupTooltip']();
      expect(rootControlElement.title).toEqual(expectedTooltip);
    });

    it('should set control title to empty string if tooltip is null', () => {
      const expectedTooltip = '';
      component.controlRef = { nativeElement: rootControlElement };
      component.tooltip = null;
      component['setupTooltip']();
      expect(rootControlElement.title).toEqual(expectedTooltip);
    });

    it('should not set control title if controlRef is undefined', () => {
      const previousTooltip = 'Test tooltip 1';
      const newTooltip = 'Test tooltip 2';
      rootControlElement.title = previousTooltip;
      component.tooltip = newTooltip;
      component['setupTooltip']();
      expect(rootControlElement.title).not.toEqual(newTooltip);
      expect(rootControlElement.title).toEqual(previousTooltip);
    });
  });

  describe('OnTooltipChange', () => {
    it('should not set control title on tooltip change if firstChange is true', () => {
      const previousTooltip = undefined;
      const newTooltip = 'Test tooltip';
      component.controlRef = { nativeElement: rootControlElement };
      const change = new SimpleChange(previousTooltip, newTooltip, true);
      const changes = { tooltip: change } as SimpleChanges;
      component['onTooltipChange'](changes);
      expect(rootControlElement.title).not.toEqual(newTooltip);
    });

    it('should not set control title on tooltip change if change is equal', () => {
      const previousTooltip = 'Test tooltip 1';
      const newTooltip = 'Test tooltip 2';
      component.controlRef = { nativeElement: rootControlElement };
      rootControlElement.title = previousTooltip;
      const spyChangeEqual = spyOn(component, 'isChangeEqual');
      spyChangeEqual.and.returnValue(true);
      const change = new SimpleChange(previousTooltip, newTooltip, false);
      const changes = { tooltip: change } as SimpleChanges;
      component['onTooltipChange'](changes);
      expect(rootControlElement.title).not.toEqual(newTooltip);
      expect(rootControlElement.title).toEqual(previousTooltip);
    });

    it('should not set control title on change of another input property', () => {
      const tooltip = 'Test tooltip 1';
      component.controlRef = { nativeElement: rootControlElement };
      rootControlElement.title = tooltip;
      const change = new SimpleChange(true, false, false);
      const changes = { autofocus: change } as SimpleChanges;
      component['onTooltipChange'](changes);
      expect(rootControlElement.title).toEqual(tooltip);
    });

    it('should set control title if tooltip input property changes', () => {
      const previousTooltip = 'Test tooltip 1';
      const newTooltip = 'Test tooltip 2';
      component.controlRef = { nativeElement: rootControlElement };
      const change = new SimpleChange(previousTooltip, newTooltip, false);
      const changes = { tooltip: change } as SimpleChanges;
      component['onTooltipChange'](changes);
      expect(rootControlElement.title).toEqual(newTooltip);
    });

    it('should set control title to empty string if tooltip input property changes to undefined', () => {
      const expectedTooltip = '';
      component.controlRef = { nativeElement: rootControlElement };
      const previousTooltip = 'Test tooltip 1';
      const newTooltip = undefined;
      const change = new SimpleChange(previousTooltip, newTooltip, false);
      const changes = { tooltip: change } as SimpleChanges;
      component['onTooltipChange'](changes);
      expect(rootControlElement.title).toEqual(expectedTooltip);
    });

    it('should set control title to empty string if tooltip input property changes to null', () => {
      const expectedTooltip = '';
      component.controlRef = { nativeElement: rootControlElement };
      const previousTooltip = 'Test tooltip 1';
      const newTooltip = null;
      const change = new SimpleChange(previousTooltip, newTooltip, false);
      const changes = { tooltip: change } as SimpleChanges;
      component['onTooltipChange'](changes);
      expect(rootControlElement.title).toEqual(expectedTooltip);
    });

    it('should not set control title on tooltip change if controlRef is undefined', () => {
      const previousTooltip = 'Test tooltip 1';
      const newTooltip = 'Test tooltip 2';
      rootControlElement.title = previousTooltip;
      const change = new SimpleChange(previousTooltip, newTooltip, false);
      const changes = { tooltip: change } as SimpleChanges;
      component['onTooltipChange'](changes);
      expect(rootControlElement.title).not.toEqual(newTooltip);
      expect(rootControlElement.title).toEqual(previousTooltip);
    });
  });

  describe('onControlRefChange', () => {
    it('should call setupFocusControl, registerEvents and setupTooltip methods and set controlRefUpdate to false if controlRefUpdate is true', () => {
      const spySetupFocusControl = spyOn<any>(component, 'setupFocusControl');
      const spyRegisterEvents = spyOn<any>(component, 'registerEvents');
      const spySetupTooltip = spyOn<any>(component, 'setupTooltip');
      component['controlRefUpdate'] = true;
      component['onControlRefChange']();
      expect(spySetupFocusControl).toHaveBeenCalledTimes(1);
      expect(spyRegisterEvents).toHaveBeenCalledTimes(1);
      expect(spySetupTooltip).toHaveBeenCalledTimes(1);
      expect(component['controlRefUpdate']).toBeFalse();
    });

    it('should not call setupFocusControl, registerEvents and setupTooltip methods if controlRefUpdate is false', () => {
      const spySetupFocusControl = spyOn<any>(component, 'setupFocusControl');
      const spyRegisterEvents = spyOn<any>(component, 'registerEvents');
      const spySetupTooltip = spyOn<any>(component, 'setupTooltip');
      component['controlRefUpdate'] = false;
      component['onControlRefChange']();
      expect(spySetupFocusControl).not.toHaveBeenCalled();
      expect(spyRegisterEvents).not.toHaveBeenCalled();
      expect(spySetupTooltip).not.toHaveBeenCalled();
    });
  });

  it('emitDestroyEvent should call next method on destroy subject', () => {
    const spySubjectNext = spyOn(component.destroy$, 'next');
    component['emitDestroyEvent']();
    expect(spySubjectNext).toHaveBeenCalledTimes(1);
  });
});

describe('BaseComponent', () => {
  let fixture: ComponentFixture<BaseChildFixtureWithoutOptionsComponent>,
    component: BaseChildFixtureWithoutOptionsComponent,
    mockIdSequenceService;

  beforeEach(() => {
    mockIdSequenceService = jasmine.createSpyObj('mockIdSequence', ['next']);
    mockIdSequenceService.next.and.returnValue('id-0');
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [BaseChildFixtureWithoutOptionsComponent],
      providers: [{ provide: CaepIdSequenceService, useValue: mockIdSequenceService }, provideZoneChangeDetection()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseChildFixtureWithoutOptionsComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should initialize only CaepBase options', () => {
    expect(component.options).toBeDefined();
    expect(component.options).toBeInstanceOf(CaepBaseOptions);
  });
});

describe('CaepBaseOptions', () => {
  let options: BaseChildFixtureOptions, inputOptions: IBaseChildFixtureOptions;

  describe('constructor', () => {
    it('should create options', () => {
      options = new BaseChildFixtureOptions();
      expect(options).toBeDefined();
    });

    it('should not set option value if it is not defined', () => {
      const defaultColor = 'blue';
      inputOptions = { color: null };
      options = new BaseChildFixtureOptions(inputOptions);
      expect(options.color).toEqual(defaultColor);
    });
  });
});

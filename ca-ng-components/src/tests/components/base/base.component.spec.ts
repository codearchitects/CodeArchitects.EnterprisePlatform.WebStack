import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseFixture } from './../../fixtures';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { SimpleChange } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IShBaseOptions } from '../../../components/base/base.component';

describe('BaseComponent', () => {
  let component: BaseFixture;
  let fixture: ComponentFixture<BaseFixture>;
  let htmlElement: HTMLSpanElement;

  const idSequenceServiceNext = jasmine.createSpy();
  const mockedIdSequenceService = {
    next: idSequenceServiceNext
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseFixture],
      providers: [
        { provide: IdSequenceService, useValue: mockedIdSequenceService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    idSequenceServiceNext.calls.reset();
    fixture = TestBed.createComponent(BaseFixture);
    component = fixture.debugElement.componentInstance;
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector<HTMLSpanElement>('#base-component');
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement instanceof HTMLSpanElement).toBeTruthy();
  });
  describe('Constructor side effects', () => {
    it('should have called idSequence service next func', () => {
      expect(idSequenceServiceNext).toHaveBeenCalledTimes(1);
    });
  });
  describe('OnInit side effects', () => {
    it('should have called onOptionsChange', () => {
      const spy = spyOn(component as any, 'onOptionsChanges');
      expect(spy).toHaveBeenCalledTimes(0);
      component.ngOnInit();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should have called setupSize', () => {
      const spy = spyOn(component as any, 'setupSize');
      expect(spy).toHaveBeenCalledTimes(0);
      component.ngOnInit();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should have called focusControl', done => {
      const spy = spyOn(component as any, 'focusControl');
      spy.calls.reset();
      expect(spy).toHaveBeenCalledTimes(0);
      component.ngOnInit();
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        done();
      }, 1000);
    });
  });
  describe('Event handlers', () => {
    it('should set keypress handler', () => {
      const fn = jasmine.createSpy();
      component.controlKeyPressHandler = (fn as any);

      const event = new KeyboardEvent('keypress');
      htmlElement.dispatchEvent(event);

      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should set keydown handler', () => {
      const fn = jasmine.createSpy();
      component.controlKeyDownHandler = (fn as any);

      const event = new KeyboardEvent('keydown');
      htmlElement.dispatchEvent(event);

      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should set keyup handler', () => {
      const fn = jasmine.createSpy();
      component.controlKeyUpHandler = (fn as any);

      const event = new KeyboardEvent('keyup');
      htmlElement.dispatchEvent(event);

      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should set click handler', () => {
      const fn = jasmine.createSpy();
      component.controlClickHandler = (fn as any);

      const event = new MouseEvent('click');
      htmlElement.dispatchEvent(event);

      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should set double click handler', () => {
      const fn = jasmine.createSpy();
      component.controlDblClickHandler = (fn as any);

      const event = new MouseEvent('dblclick');
      htmlElement.dispatchEvent(event);

      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should set mouse move handler', () => {
      const fn = jasmine.createSpy();
      component.controlMouseMoveHandler = (fn as any);

      const event = new MouseEvent('mousemove');
      htmlElement.dispatchEvent(event);

      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should set focus handler', () => {
      const fn = jasmine.createSpy();
      component.controlFocusHandler = (fn as any);

      const event = new FocusEvent('focus');
      htmlElement.dispatchEvent(event);

      expect(fn).toHaveBeenCalledTimes(1);
    });
    it('should set focus out handler', () => {
      const fn = jasmine.createSpy();
      component.controlFocusOutHandler = (fn as any);

      const event = new FocusEvent('blur');
      htmlElement.dispatchEvent(event);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
  it('containerClass should return array of class as string', () => {
    component['internalOptions'].containerClass = ['class1', 'class2', 'class3'];
    expect(component.containerClass).toEqual('class1 class2 class3');
  });
  it('should next destroy on ngOnDestroy', done => {
    expect(component).toBeDefined();
    component['destroy$'].subscribe(() => done());
    component.ngOnDestroy();
  });
  it('should call onOptionsChanges', () => {
    component.options = { id: 'previousId' };
    const spy = spyOn(component as any, 'onOptionsChanges');
    spy.calls.reset();
    const newOptions = { id: 'newId' };
    const change = new SimpleChange(component.options, newOptions, false);
    component.ngOnChanges({ 'options': change });
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should set tooltip', () => {
    const expectedTooltip = 'myTooltip';
    component.tooltip = expectedTooltip;

    expect(htmlElement.title).toEqual(expectedTooltip);
  });
  it('should get tooltip', () => {
    const expectedTooltip = 'yourTooltip';
    htmlElement.title = expectedTooltip;

    expect(component.tooltip).toEqual(expectedTooltip);
  });
  it('giveFocus should focus the element', () => {
    if (document.activeElement) {
      document.activeElement.dispatchEvent(new FocusEvent('blur'));
    }
    htmlElement.tabIndex = 0;
    component.giveFocus();
    expect(document.activeElement).toEqual(htmlElement);
  });
  it('focusControl should call giveFocus when autofocus is set to true', () => {
    component['internalOptions'].autofocus = true;
    const spy = spyOn(component, 'giveFocus');
    spy.calls.reset();

    component['focusControl']();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('onOptionsChanges should call mergeOptions', () => {
    const spy = spyOn(component as any, 'mergeOptions');
    spy.calls.reset();

    component['onOptionsChanges']();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('getDefaultOptions should return default values for all options', () => {
    const expectedId = 'foo';
    const expectedTabIndex = 10;
    component['id'] = expectedId;
    component['tabIndex'] = expectedTabIndex;
    const options = component['getDefaultOptions']();
    expect(options.id).toEqual(expectedId);
    expect(options.tabindex).toEqual(expectedTabIndex);
    expect(options.autofocus).toBeFalsy();
    expect(options.containerClass).toEqual([]);
    expect(options.onCanValueChanges).toBeDefined();
    expect(options.onCanValueChanges instanceof Function).toBeTruthy();
    expect(() => options.onCanValueChanges(undefined, undefined)).not.toThrowError();
    expect(options.onCanValueChanges(undefined, undefined)).toBeTruthy();
  });
  it('isChangeEqual should call lodash isEqualWith with right parameters', () => {
    const spy = spyOn((window as any)._, 'isEqualWith');
    spy.calls.reset();
    const change = new SimpleChange({ a: 'b' }, { a: 'c' }, false);
    component['isChangeEqual'](change);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(change.previousValue, change.currentValue, component['equalCustomizer']);
  });
  describe('isAsync tests', () => {
    it('should not throw error', () => {
      expect(() => component['isAsync'](undefined)).not.toThrowError();
    });
    it('should return true when value is a behavior subject', () => {
      expect(component['isAsync'](new BehaviorSubject(null))).toBeTruthy();
    });
    it('should return false when value is a simple object or a primitive value', () => {
      expect(component['isAsync']({})).toBeFalsy();
      expect(component['isAsync']('sample')).toBeFalsy();
    });
  });
  it('equalCustomizer should compare function names when both object are functions', () => {
    function a() {
      // function a
    }
    function b() {
      // function b
    }
    expect(component['equalCustomizer'](a, b)).toBeFalsy();
    expect(component['equalCustomizer'](b, a)).toBeFalsy();
    expect(component['equalCustomizer'](a, a)).toBeTruthy();
    expect(component['equalCustomizer'](b, b)).toBeTruthy();
  });
  it('mergeOptions should call lodash mergeWith with right parameters', () => {
    const options: IShBaseOptions = { id: 'foo', tabindex: 2 };
    component.options = options;
    const spy = spyOn((window as any)._, 'mergeWith');
    spy.calls.reset();
    const prevInternalOptions = component['internalOptions'];
    component['mergeOptions']();
    expect(spy).toHaveBeenCalledTimes(1);
    const defaultOptions = component['getDefaultOptions']();
    const defaultOptionsArgs = spy.calls.argsFor(0)[0] as IShBaseOptions;
    expect(defaultOptions.id).toEqual(defaultOptionsArgs.id);
    expect(defaultOptions.tabindex).toEqual(defaultOptionsArgs.tabindex);
    expect(defaultOptions.autofocus).toEqual(defaultOptionsArgs.autofocus);
    expect(defaultOptions.height).toEqual(defaultOptionsArgs.height);
    expect(defaultOptions.width).toEqual(defaultOptionsArgs.width);
    expect(defaultOptions.containerClass).toEqual(defaultOptionsArgs.containerClass);
    const optionsArgs = spy.calls.argsFor(0)[1];
    expect(optionsArgs).toEqual(options);
    const customizerArgs = spy.calls.argsFor(0)[2];
    expect(customizerArgs).toEqual(component['mergeOptionsCustomizer']);
    component['internalOptions'] = prevInternalOptions;
  });
  describe('mergeOptionsCustomizer', () => {
    it('should concatenate when objects are both arrays', () => {
      const arr1 = [0, 1];
      const arr2 = [2, 3];
      expect(component['mergeOptionsCustomizer'](arr1, arr2, 'Class')).toEqual([2, 3, 0, 1]);
    });
    it('should return source value when object are not both arrays', () => {
      const obj1 = { a: 'b' };
      const arr1 = [0, 1];
      expect(component['mergeOptionsCustomizer'](obj1, arr1, 'Class')).toEqual(arr1);
    });
    it('should return source value when key does not end with class', () => {
      const arr1 = [0, 1];
      const arr2 = [2, 3];
      expect(component['mergeOptionsCustomizer'](arr1, arr2, 'somekey')).toEqual(arr2);
    });
  });
  describe('getFormattedSize', () => {
    it('should return value as it is', () => {
      expect(component['getFormattedSize'](undefined)).toEqual(undefined);
      expect(component['getFormattedSize']('10rem')).toEqual('10rem');
    });
    it('should return value suffixed by px when it is a number', () => {
      expect(component['getFormattedSize'](15)).toEqual('15px');
    });
  });
  describe('setupSize', () => {
    it('should set width calling getFormattedSize', () => {
      const spy = spyOn(component as any, 'getFormattedSize').and.returnValue('10px');
      spy.calls.reset();
      component['internalOptions'].width = 10;
      component['setupSize']();

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(10);
      expect(component.width).toEqual('10px');
    });
    it('should set height calling getFormattedSize', () => {
      const spy = spyOn(component as any, 'getFormattedSize').and.returnValue('15px');
      spy.calls.reset();
      component['internalOptions'].height = 15;
      component['setupSize']();

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(15);
      expect(component.width).toEqual('15px');
    });
    it('should subscribe subject and set width each time value changes', () => {
      const spy = spyOn(component as any, 'getFormattedSize').and.returnValues('10px', undefined, '20px');
      spy.calls.reset();
      const subject$ = new BehaviorSubject<string | number>(10);

      component['internalOptions'].width = subject$;
      component['setupSize']();
      expect(component.width).toEqual('10px');
      expect(subject$.observers.length).toEqual(1);
      subject$.next(20);
      expect(component.width).toEqual('20px');

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenCalledWith(10);
      expect(spy).toHaveBeenCalledWith(undefined);
      expect(spy).toHaveBeenCalledWith(20);
    });
    it('should subscribe subject and set height each time value changes', () => {
      const spy = spyOn(component as any, 'getFormattedSize').and.returnValues(undefined, '5px', '50px');
      spy.calls.reset();
      const subject$ = new BehaviorSubject<string | number>(5);

      component['internalOptions'].height = subject$;
      component['setupSize']();
      expect(component.height).toEqual('5px');
      expect(subject$.observers.length).toEqual(1);
      subject$.next(50);
      expect(component.height).toEqual('50px');

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenCalledWith(undefined);
      expect(spy).toHaveBeenCalledWith(5);
      expect(spy).toHaveBeenCalledWith(50);
    });
  });
});

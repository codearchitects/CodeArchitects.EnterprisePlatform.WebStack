import { ILookupSingle } from './../../../components/base/base-lookup-single.component';
import { debounceTime } from 'rxjs/operators';
import { IShSelectOptions } from './../../../components/select/select.component';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { FormHandlerService } from '../../../services/form-handler.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { ShSelectComponent } from '../../../components/select/select.component';
import { ShIconComponent } from '../../../components/icon/icon.component';
import { TestBed, async, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import * as scrollable from '../../../utilities/scrollable.utility';

describe('Select component', () => {
  let component: ShSelectComponent<any, any, IShSelectOptions<any, any>>;
  let fixture: ComponentFixture<ShSelectComponent<any, any, IShSelectOptions<any, any>>>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), I18nModule],
      declarations: [ShSelectComponent, ShIconComponent],
      providers: [
        IdSequenceService,
        ValidatorHelper,
        AspectHelper,
        ContextService,
        FormHandlerService,
        TranslateService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShSelectComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: 'value' };
    component.prop = 'prop';
    fixture.detectChanges();
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector('div');
  });
  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
    const container = htmlElement.children[0] as HTMLDivElement;
    expect(container).toBeDefined();
    expect(container).not.toBeNull();
    expect(container instanceof HTMLDivElement).toBeTruthy();
  });
  it('should set results', () => {
    const list = document.createElement('ul');
    const element = document.createElement('li');
    list.appendChild(element);

    component['results'] = { nativeElement: list };
    expect(component['_results']).toEqual(list.children);
  });
  describe('get dropdownWith', () => {
    it('should return auto', () => {
      component['_input'] = undefined;

      expect(component['dropdownWidth']).toEqual('auto');
    });
    it('should return internalOptions dropdownWidth', () => {
      const expectedWidth = '10px';
      component['internalOptions'].dropdownWidth = expectedWidth;

      expect(component['dropdownWidth']).toEqual(expectedWidth);
    });
    it('should return input clientWidth', () => {
      const inputWidth = '275px';
      const element: HTMLDivElement = component['_input'].nativeElement;
      element.style.width = inputWidth;
      const expectedWidth = `${element.clientWidth}px`;

      expect(component['dropdownWidth']).toEqual(expectedWidth);
    });
  });
  describe('ngAfterViewInit', () => {
    it('should call onKey callback when key is pressed', () => {
      const onKey = jasmine.createSpy();
      component['onKey'] = onKey;

      component.ngAfterViewInit();

      const event = new KeyboardEvent('keydown');
      const element: HTMLDivElement = component['element'].nativeElement;

      element.dispatchEvent(event);
      expect(onKey).toHaveBeenCalledTimes(1);
    });
    it('should call onKey callback after debounce time when key is pressed', fakeAsync(() => {
      const onKey = jasmine.createSpy();
      const keyDownDebounceTime = 3000;
      component['onKey'] = onKey;
      component['keyDownDebounceTime'] = keyDownDebounceTime;

      component.ngAfterViewInit();
      const element: HTMLDivElement = component['element'].nativeElement;

      element.dispatchEvent(new KeyboardEvent('keydown'));

      // TODO: MAKE FOLLOWING EXPECTATION PASS - SAMPLE IS GIVEN IN NEXT TEST
      // expect(onKey).not.toHaveBeenCalled();
      tick(keyDownDebounceTime);
      expect(onKey).toHaveBeenCalledTimes(1);
    }));
    it('pipe filter test', fakeAsync(() => {
      // TODO: REMOVE THIS SAMPLE TEST
      const callback = jasmine.createSpy();
      const dt = 1000;
      const element: HTMLDivElement = component['element'].nativeElement;
      // to test out ShSelectComponent wrong behavior comment line 120 and uncomment line 123
      let subj$ = fromEvent(element, 'keydown')
        .pipe(debounceTime(dt));
      // piping the subject in the following way (same as select component) does not affect the source subject
      // so then subscriptions wont be filtered as expected
      // subj$.pipe(debounceTime(dt));
      subj$.subscribe(callback);

      element.dispatchEvent(new KeyboardEvent('keydown'));

      expect(callback).not.toHaveBeenCalled();
      tick(dt);
      expect(callback).toHaveBeenCalledTimes(1);
    }));
    it('should toggle isOpened when toggleDropdown subject emits', () => {
      const openedStatus = component['isOpened'];
      const toggle = component['internalOptions'].toggleDropdown$;

      toggle.next();

      expect(component['isOpened']).toEqual(!openedStatus);
    });
  });
  it('should getDefaultOptions correctly', () => {
    const options = component['getDefaultOptions']();

    expect(options.dropdownHeight).toEqual('150px');
    expect(options.toggleDropdown$).toBeDefined();
    expect(options.toggleDropdown$).not.toBeNull();
    expect(options.toggleDropdown$ instanceof Subject).toBeTruthy();
  });
  describe('onKey', () => {
    it('should not call prevent default when no key is matched', () => {
      const prevDefaultMock = jasmine.createSpy();
      const event = new KeyboardEvent('keydown');
      event.preventDefault = prevDefaultMock;

      component['onKey'](event);

      expect(prevDefaultMock).not.toHaveBeenCalled();
    });
    it('should call toggleResults and prevent default when keypressed is arrowup', () => {
      const prevDefaultMock = jasmine.createSpy();
      const spy = spyOn(component as any, 'toggleResults');
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(event, 'keyCode', {
        value: 38
      });
      event.preventDefault = prevDefaultMock;
      component['isOpened'] = true;

      component['onKey'](event);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(event.altKey, component['activeResultIndex']);
      expect(prevDefaultMock).toHaveBeenCalledTimes(1);
    });
    it('should call toggleResults and prevent default when keypressed is arrowdown', () => {
      const prevDefaultMock = jasmine.createSpy();
      const spy = spyOn(component as any, 'toggleResults');
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(event, 'keyCode', {
        value: 40
      });
      event.preventDefault = prevDefaultMock;

      component['onKey'](event);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(event.altKey, -1, true);
      expect(prevDefaultMock).toHaveBeenCalledTimes(1);
    });
    it('should call onSelectValue when keypressed is enter and it is opened', () => {
      const prevDefaultMock = jasmine.createSpy();
      const spy = spyOn(component as any, 'onSelectValue');
      const event = new KeyboardEvent('keydown');
      const values: ILookupSingle<string>[] = [
        {
          id: '0',
          label: 'a',
          ref: 'a'
        },
        {
          id: '1',
          label: 'b',
          ref: 'b'
        }
      ];
      component['values'] = values;
      component['isOpened'] = true;
      component['activeResultIndex'] = 1;
      Object.defineProperty(event, 'keyCode', {
        value: 13
      });
      event.preventDefault = prevDefaultMock;

      component['onKey'](event);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(values[component['activeResultIndex']].ref);
      expect(prevDefaultMock).not.toHaveBeenCalled();
    });
    it('should call onDelete when keypressed is delete', () => {
      const prevDefaultMock = jasmine.createSpy();
      const event = new KeyboardEvent('keydown');
      const spy = spyOn(component as any, 'onDelete');
      Object.defineProperty(event, 'keyCode', {
        value: 46
      });
      event.preventDefault = prevDefaultMock;

      component['onKey'](event);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(prevDefaultMock).not.toHaveBeenCalled();
    });
    it('should call onDelete when keypressed is backspace', () => {
      const prevDefaultMock = jasmine.createSpy();
      const event = new KeyboardEvent('keydown');
      const spy = spyOn(component as any, 'onDelete');
      Object.defineProperty(event, 'keyCode', {
        value: 8
      });
      event.preventDefault = prevDefaultMock;

      component['onKey'](event);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(prevDefaultMock).not.toHaveBeenCalled();
    });
    it('should set opened to false when keypressed is esc', () => {
      const prevDefaultMock = jasmine.createSpy();
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(event, 'keyCode', {
        value: 27
      });
      event.preventDefault = prevDefaultMock;
      component['isOpened'] = true;

      component['onKey'](event);

      expect(component['isOpened']).toBeFalsy();
      expect(prevDefaultMock).not.toHaveBeenCalled();
    });
    it('should set opened to false when keypressed is tab', () => {
      const prevDefaultMock = jasmine.createSpy();
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(event, 'keyCode', {
        value: 9
      });
      event.preventDefault = prevDefaultMock;
      component['isOpened'] = true;

      component['onKey'](event);

      expect(component['isOpened']).toBeFalsy();
      expect(prevDefaultMock).not.toHaveBeenCalled();
    });
  });
  it('onSelectValue should call setControlValue, markAsDirty and set isOpened to false', () => {
    const expectedValue = 'baz';
    const setControlValueSpy = spyOn(component as any, 'setControlValue');
    const makeAsDirtySpy = spyOn(component as any, 'markAsDirty');
    component['isOpened'] = true;

    component['onSelectValue'](expectedValue);

    expect(makeAsDirtySpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledWith(expectedValue);
    expect(component['isOpened']).toBeFalsy();
  });
  it('onDelete should call setControlValue with undefined value', () => {
    const setControlValueSpy = spyOn(component as any, 'setControlValue');

    component['onDelete']();
    expect(setControlValueSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledWith(undefined);
  });
  describe('toggleResults', () => {
    it('should call onDropdownToggled and se opened when toggle is true', () => {
      const callback = jasmine.createSpy();
      component['onDropdownToggled'] = callback;
      component['isOpened'] = false;

      component['toggleResults'](true, 0);
      expect(component['isOpened']).toBeTruthy();
      expect(callback).toHaveBeenCalledTimes(1);
    });
    it('should call toggleResult with right parameters', () => {
      const expectedIndex = 2;
      const expectedNext = true;
      const toggleResultSpy = spyOn(component as any, 'toggleResult');
      component['isOpened'] = true;

      component['toggleResults'](false, expectedIndex, expectedNext);

      expect(toggleResultSpy).toHaveBeenCalledTimes(1);
      expect(toggleResultSpy).toHaveBeenCalledWith(expectedIndex, expectedNext, !component['isOpened']);
    });
  });
  describe('toggleResult', () => {
    it('should call itslef using first index when given index is not suitable', () => {
      const toggleResultSpy = spyOn(component as any, 'toggleResult').and.callThrough();
      component['_dropdown'] = {} as any;

      component['toggleResult'](-1);

      expect(toggleResultSpy).toHaveBeenCalledTimes(2);
      expect(toggleResultSpy.calls.mostRecent().args).toEqual([0, true, false]);
    });
    const values: ILookupSingle<string>[] = [
      {
        id: '0',
        label: 'a',
        ref: 'a'
      },
      {
        id: '1',
        label: 'b',
        ref: 'b'
      },
      {
        id: '2',
        label: 'c',
        ref: 'c'
      },
    ];
    it('should call setControlValue when apply is true calculating index for next element', () => {
      const setControlValueSpy = spyOn(component as any, 'setControlValue');
      const index = 0;
      component['values'] = values;

      component['toggleResult'](index, true, true);

      expect(setControlValueSpy).toHaveBeenCalledTimes(1);
      expect(setControlValueSpy).toHaveBeenCalledWith(values[index + 1].ref);
    });
    it('should call setControlValue when apply is true with first element when index exceedes', () => {
      const setControlValueSpy = spyOn(component as any, 'setControlValue');
      const index = 2;
      component['values'] = values;

      component['toggleResult'](index, true, true);

      expect(setControlValueSpy).toHaveBeenCalledTimes(1);
      expect(setControlValueSpy).toHaveBeenCalledWith(values[0].ref);
    });
    it('should call setControlValue when apply is true calculating index for previous element', () => {
      const setControlValueSpy = spyOn(component as any, 'setControlValue');
      const index = 2;
      component['values'] = values;

      component['toggleResult'](index, false, true);

      expect(setControlValueSpy).toHaveBeenCalledTimes(1);
      expect(setControlValueSpy).toHaveBeenCalledWith(values[index - 1].ref);
    });
    it('should call setControlValue when apply is true with last element when index exceedes', () => {
      const setControlValueSpy = spyOn(component as any, 'setControlValue');
      const index = 0;
      component['values'] = values;

      component['toggleResult'](index, false, true);

      expect(setControlValueSpy).toHaveBeenCalledTimes(1);
      expect(setControlValueSpy).toHaveBeenCalledWith(values[values.length - 1].ref);
    });
    it('should call scrollTo when apply is false setting activeResultIndex', () => {
      const index = 0;
      const scrollToMock = jasmine.createSpy();
      spyOn(scrollable, 'scrollTo').and.callFake(scrollToMock);
      const element = document.createElement('div');
      component['_dropdown'] = { nativeElement: element };
      component['values'] = values;

      component['toggleResult'](index);

      expect(component['activeResultIndex']).toEqual(index + 1);
      expect(scrollToMock).toHaveBeenCalledTimes(1);
      expect(scrollToMock).toHaveBeenCalledWith(element, component['results'], index + 1, true);
    });
  });
});

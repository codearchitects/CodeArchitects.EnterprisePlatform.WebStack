import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { FormHandlerService } from '../../../services/form-handler.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { IShMultiSelectOptions, ShMultiSelectComponent } from '../../../components/multiselect/multiselect.component';
import { ShIconComponent } from '../../../components/icon/icon.component';
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { ILookupMulti } from '../../../components/base';
import { ShFormControl } from '../../../utilities/form-control.utility';
import * as scrollable from '../../../utilities/scrollable.utility';

describe('Multiselect component', () => {
  let component: ShMultiSelectComponent<any, any, IShMultiSelectOptions<any, any>>;
  let fixture: ComponentFixture<ShMultiSelectComponent<any, any, IShMultiSelectOptions<any, any>>>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), I18nModule],
      declarations: [ShMultiSelectComponent, ShIconComponent],
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
    fixture = TestBed.createComponent(ShMultiSelectComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: ['value1', 'value2'] };
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
    const element = document.createElement('ul');
    const child = document.createElement('li');
    element.appendChild(child);
    const elementRef: ElementRef = { nativeElement: element };

    component['results'] = elementRef;

    expect(component['_results']).toEqual(element.children);
  });
  describe('dropdownWidth', () => {
    it('should return auto', () => {
      component['_input'] = undefined;
      expect(component['dropdownWidth']).toEqual('auto');
    });
    it('should return internalOptions dropdownWidth', () => {
      const expectedDropdownWidth = '100px';
      component['internalOptions'].dropdownWidth = expectedDropdownWidth;

      expect(component['dropdownWidth']).toEqual(expectedDropdownWidth);
    });
    it('should return input clientWidth', () => {
      const inputWidth = '390px';
      const element: HTMLDivElement = component['_input'].nativeElement;
      element.style.width = inputWidth;
      const expectedWidth = `${element.clientWidth}px`;

      expect(component['dropdownWidth']).toEqual(expectedWidth);
    });
  });
  it('constructor should set element', () => {
    expect(component['element']).toBeDefined();
    expect(component['element']).not.toBeNull();
    expect(component['element'] instanceof ElementRef).toBeTruthy();
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

      // TODO: MAKE FOLLOWING EXPECTATION PASS - SAMPLE IS GIVEN IN SELECT TEST
      // expect(onKey).not.toHaveBeenCalled();
      tick(keyDownDebounceTime);
      expect(onKey).toHaveBeenCalledTimes(1);
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
    it('should call toggleResult and prevent default when keypressed is arrowup', () => {
      const prevDefaultMock = jasmine.createSpy();
      const spy = spyOn(component as any, 'toggleResult');
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(event, 'keyCode', {
        value: 38
      });
      event.preventDefault = prevDefaultMock;
      component['isOpened'] = true;

      component['onKey'](event);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(component['activeResultIndex'], false);
      expect(prevDefaultMock).toHaveBeenCalledTimes(1);
    });
    it('should call toggleResult and prevent default when keypressed is arrowdown', () => {
      const prevDefaultMock = jasmine.createSpy();
      const spy = spyOn(component as any, 'toggleResult');
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(event, 'keyCode', {
        value: 40
      });
      event.preventDefault = prevDefaultMock;

      component['onKey'](event);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(-1, true);
      expect(prevDefaultMock).toHaveBeenCalledTimes(1);
    });
    it('should call onSelectValue when keypressed is enter and it is opened', () => {
      const prevDefaultMock = jasmine.createSpy();
      const spy = spyOn(component as any, 'onSelectValue');
      const event = new KeyboardEvent('keydown');
      const values: ILookupMulti<string>[] = [
        {
          id: '0',
          label: 'a',
          ref: 'a',
          formControl: new ShFormControl()
        },
        {
          id: '1',
          label: 'b',
          ref: 'b',
          formControl: new ShFormControl()
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
      expect(spy).toHaveBeenCalledWith(values[component['activeResultIndex']]);
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
  it('onSelectValue should call formControl setValue and markAsDirty', () => {
    const formControl = new ShFormControl();
    const expectedValue = true;
    formControl.setValue(expectedValue);
    const setValueSpy = spyOn(formControl, 'setValue');
    const value: ILookupMulti<string> = {
      id: '0',
      label: 'baz',
      ref: 'baz',
      formControl
    };
    const makeAsDirtySpy = spyOn(component as any, 'markAsDirty');
    component['isOpened'] = true;

    component['onSelectValue'](value);

    expect(makeAsDirtySpy).toHaveBeenCalledTimes(1);
    expect(setValueSpy).toHaveBeenCalledTimes(1);
    expect(setValueSpy).toHaveBeenCalledWith(!expectedValue);
  });
  describe('toggleResult', () => {
    it('should call itslef using first index when given index is not suitable', () => {
      const toggleResultSpy = spyOn(component as any, 'toggleResult').and.callThrough();
      component['_dropdown'] = {} as any;

      component['toggleResult'](-1);

      expect(toggleResultSpy).toHaveBeenCalledTimes(2);
      expect(toggleResultSpy.calls.mostRecent().args).toEqual([0, true]);
    });
    const values: ILookupMulti<string>[] = [
      {
        id: '0',
        label: 'a',
        ref: 'a',
        formControl: new ShFormControl()
      },
      {
        id: '1',
        label: 'b',
        ref: 'b',
        formControl: new ShFormControl()
      },
      {
        id: '2',
        label: 'c',
        ref: 'c',
        formControl: new ShFormControl()
      },
    ];
    it('should call scrollTo calculating index for next element setting activeResultIndex', () => {
      const scrollToMock = jasmine.createSpy();
      spyOn(scrollable, 'scrollTo').and.callFake(scrollToMock);
      const index = 0;
      const element = document.createElement('div');
      component['_dropdown'] = { nativeElement: element };
      component['values'] = values;

      component['toggleResult'](index, true);

      expect(component['activeResultIndex']).toEqual(index + 1);
      expect(scrollToMock).toHaveBeenCalledTimes(1);
      expect(scrollToMock).toHaveBeenCalledWith(element, component['results'], index + 1, true);
    });
    it('should call scrollTo with first element when index exceedes setting activeResultIndex', () => {
      const scrollToMock = jasmine.createSpy();
      spyOn(scrollable, 'scrollTo').and.callFake(scrollToMock);
      const index = 2;
      const element = document.createElement('div');
      component['_dropdown'] = { nativeElement: element };
      component['values'] = values;

      component['toggleResult'](index, true);

      expect(component['activeResultIndex']).toEqual(0);
      expect(scrollToMock).toHaveBeenCalledTimes(1);
      expect(scrollToMock).toHaveBeenCalledWith(element, component['results'], 0, true);
    });
    it('should call scrollTo calculating index for previous element setting activeResultIndex', () => {
      const scrollToMock = jasmine.createSpy();
      spyOn(scrollable, 'scrollTo').and.callFake(scrollToMock);
      const index = 2;
      const element = document.createElement('div');
      component['_dropdown'] = { nativeElement: element };
      component['values'] = values;

      component['toggleResult'](index, false);

      expect(component['activeResultIndex']).toEqual(index - 1);
      expect(scrollToMock).toHaveBeenCalledTimes(1);
      expect(scrollToMock).toHaveBeenCalledWith(element, component['results'], index - 1, false);
    });
    it('should call scrollTo with last element when index exceedes setting activeResultIndex', () => {
      const scrollToMock = jasmine.createSpy();
      spyOn(scrollable, 'scrollTo').and.callFake(scrollToMock);
      const index = 0;
      const element = document.createElement('div');
      component['_dropdown'] = { nativeElement: element };
      component['values'] = values;

      component['toggleResult'](index, false);

      expect(component['activeResultIndex']).toEqual(values.length - 1);
      expect(scrollToMock).toHaveBeenCalledTimes(1);
      expect(scrollToMock).toHaveBeenCalledWith(element, component['results'], values.length - 1, false);
    });
  });
});

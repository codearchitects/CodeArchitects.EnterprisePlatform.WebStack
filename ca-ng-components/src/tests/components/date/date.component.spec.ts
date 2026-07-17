import { SH_CHANGE_DETECTOR } from './../../../environments/change-detection-strategy';
import { ShIconComponent } from './../../../components/icon/icon.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { ShMinutesPipe } from './../../../pipes/minutes.pipe';
import { ShHourPipe } from './../../../pipes/hour.pipe';
import { ShYearPipe } from './../../../pipes/year.pipe';
import { ShMonthPipe } from './../../../pipes/month.pipe';
import { ShDayPipe } from './../../../pipes/day.pipe';
import { IShDate, IShDateRange, ShDateComponent, ShDateFormat } from '../../../components/date/date.component';
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { NgxMyDatePickerModule, NgxMyDatePickerConfig, IMyDayLabels, IMyMonthLabels } from 'ngx-mydatepicker';
import { FormHandlerService } from '../../../services/form-handler.service';
import { ChangeDetectionStrategy, ElementRef } from '@angular/core';
import * as commons from '../../../utilities/common.utility';
import { ShBaseInputComponent } from '../../../components/base';
import { KeyCode } from '../../../utilities/key-code.const';
import { of } from 'rxjs';

describe('Date component', () => {
  let component: ShDateComponent;
  let fixture: ComponentFixture<ShDateComponent>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, NgxMyDatePickerModule, I18nModule, TranslateModule.forRoot()],
      declarations: [ShDateComponent, ShDayPipe, ShMonthPipe, ShYearPipe, ShHourPipe, ShMinutesPipe, ShIconComponent],
      providers: [IdSequenceService, ValidatorHelper, AspectHelper, ContextService, FormHandlerService, NgxMyDatePickerConfig]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShDateComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: new Date() };
    component.prop = 'prop';
    component.show = true;
    component['format'] = ['day', 'month', 'year'];
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
  });

  describe('day property', () => {
    describe('getter', () => {
      it('should return 0 if zeroPressed is true', () => {
        component['_zeroPressed'].day = true;

        expect(component['day']).toEqual(0);
      });
      it('should return undefined when modelValue is not defined', () => {
        component.model.prop = undefined;

        expect(component['day']).toBeUndefined();
      });
      it('should return date value', () => {
        const date = new Date();
        component.model.prop = date;

        expect(component['day']).toEqual(date.getDate());
      });
    });
    describe('setter', () => {
      it('should call setDate with given day and call setModelValue with updated date', () => {
        const date = new Date();
        const day = 24;
        const setDateSpy = spyOn(date, 'setDate').and.callThrough();
        const setModelValueSpy = spyOn(component as any, 'setModelValue');
        spyOn(component as any, 'getModelValue').and.returnValue(date);

        component['day'] = day;

        expect(setDateSpy).toHaveBeenCalledOnceWith(day);
        expect(setModelValueSpy).toHaveBeenCalledOnceWith(date);
      });
      it('should use defaultDate as current date when model value is undefined', () => {
        const defaultDate = new Date();
        const setModelValueSpy = spyOn(component as any, 'setModelValue');
        Object.defineProperty(component, '_defaultDate', {
          value: defaultDate
        });
        component.model.prop = undefined;

        component['day'] = 10;

        expect(setModelValueSpy).toHaveBeenCalledOnceWith(defaultDate);
      });
    });
  });

  describe('month property', () => {
    describe('getter', () => {
      it('should return -1 if zeroPressed is true', () => {
        component['_zeroPressed'].month = true;

        expect(component['month']).toEqual(-1);
      });
      it('should return undefined when modelValue is not defined', () => {
        component.model.prop = undefined;

        expect(component['month']).toBeUndefined();
      });
      it('should return month value', () => {
        const date = new Date();
        component.model.prop = date;

        expect(component['month']).toEqual(date.getMonth());
      });
    });
    describe('setter', () => {
      it('should call setMonth with given month and call setModelValue with updated month', () => {
        const date = new Date();
        const month = 4;
        const setMonthSpy = spyOn(date, 'setMonth').and.callThrough();
        const setModelValueSpy = spyOn(component as any, 'setModelValue');
        spyOn(component as any, 'getModelValue').and.returnValue(date);

        component['month'] = month;

        expect(setMonthSpy).toHaveBeenCalledOnceWith(month);
        expect(setModelValueSpy).toHaveBeenCalledOnceWith(date);
      });
      it('should use defaultDate as current date when model value is undefined', () => {
        const defaultDate = new Date();
        const setModelValueSpy = spyOn(component as any, 'setModelValue');
        Object.defineProperty(component, '_defaultDate', {
          value: defaultDate
        });
        component.model.prop = undefined;

        component['month'] = 6;

        expect(setModelValueSpy).toHaveBeenCalledOnceWith(defaultDate);
      });
    });
  });

  describe('year property', () => {
    describe('getter', () => {
      it('should return undefined when modelValue is not defined', () => {
        component.model.prop = undefined;

        expect(component['year']).toBeUndefined();
      });
      it('should return year value', () => {
        const date = new Date();
        component.model.prop = date;

        expect(component['year']).toEqual(date.getFullYear());
      });
    });
    describe('setter', () => {
      it('should call setFullYear with given year and call setModelValue with updated year', () => {
        const date = new Date();
        const year = 2006;
        const setFullYearSpy = spyOn(date, 'setFullYear').and.callThrough();
        const setModelValueSpy = spyOn(component as any, 'setModelValue');
        spyOn(component as any, 'getModelValue').and.returnValue(date);

        component['year'] = year;

        expect(setFullYearSpy).toHaveBeenCalledOnceWith(year);
        expect(setModelValueSpy).toHaveBeenCalledOnceWith(date);
      });
      it('should use defaultDate as current date when model value is undefined', () => {
        const defaultDate = new Date();
        const setModelValueSpy = spyOn(component as any, 'setModelValue');
        Object.defineProperty(component, '_defaultDate', {
          value: defaultDate
        });
        component.model.prop = undefined;

        component['year'] = 2020;

        expect(setModelValueSpy).toHaveBeenCalledOnceWith(defaultDate);
      });
    });
  });

  describe('hour property', () => {
    describe('getter', () => {
      it('should return undefined when modelValue is not defined', () => {
        component.model.prop = undefined;

        expect(component['hour']).toBeUndefined();
      });
      it('should return hour value', () => {
        const date = new Date();
        component.model.prop = date;

        expect(component['hour']).toEqual(date.getHours());
      });
    });
    describe('setter', () => {
      it('should call setHours with given hour and call setModelValue with updated hour', () => {
        const date = new Date();
        const hour = 18;
        const setHoursSpy = spyOn(date, 'setHours').and.callThrough();
        const setModelValueSpy = spyOn(component as any, 'setModelValue');
        spyOn(component as any, 'getModelValue').and.returnValue(date);

        component['hour'] = hour;

        expect(setHoursSpy).toHaveBeenCalledOnceWith(hour);
        expect(setModelValueSpy).toHaveBeenCalledOnceWith(date);
      });
      it('should call setHours with 0 when hour is greater than 24 and call setModelValue with updated hour', () => {
        const date = new Date();
        const setHoursSpy = spyOn(date, 'setHours').and.callThrough();
        const setModelValueSpy = spyOn(component as any, 'setModelValue');
        spyOn(component as any, 'getModelValue').and.returnValue(date);

        component['hour'] = 25;

        expect(setHoursSpy).toHaveBeenCalledOnceWith(0);
        expect(setModelValueSpy).toHaveBeenCalledOnceWith(date);
      });
      it('should use defaultDate as current date when model value is undefined', () => {
        const defaultDate = new Date();
        const setModelValueSpy = spyOn(component as any, 'setModelValue');
        Object.defineProperty(component, '_defaultDate', {
          value: defaultDate
        });
        component.model.prop = undefined;

        component['hour'] = 5;

        expect(setModelValueSpy).toHaveBeenCalledOnceWith(defaultDate);
      });
    });
  });

  describe('minutes property', () => {
    describe('getter', () => {
      it('should return undefined when modelValue is not defined', () => {
        component.model.prop = undefined;

        expect(component['minutes']).toBeUndefined();
      });
      it('should return minutes value', () => {
        const date = new Date();
        component.model.prop = date;

        expect(component['minutes']).toEqual(date.getMinutes());
      });
    });
    describe('setter', () => {
      it('should call setMinutes with given minutes and call setModelValue with updated minutes', () => {
        const date = new Date();
        const minutes = 54;
        const setMinutesSpy = spyOn(date, 'setMinutes').and.callThrough();
        const setModelValueSpy = spyOn(component as any, 'setModelValue');
        spyOn(component as any, 'getModelValue').and.returnValue(date);

        component['minutes'] = minutes;

        expect(setMinutesSpy).toHaveBeenCalledOnceWith(minutes);
        expect(setModelValueSpy).toHaveBeenCalledOnceWith(date);
      });
      it('should use defaultDate as current date when model value is undefined', () => {
        const defaultDate = new Date();
        const setModelValueSpy = spyOn(component as any, 'setModelValue');
        Object.defineProperty(component, '_defaultDate', {
          value: defaultDate
        });
        component.model.prop = undefined;

        component['minutes'] = 32;

        expect(setModelValueSpy).toHaveBeenCalledOnceWith(defaultDate);
      });
    });
  });

  describe('seconds property', () => {
    describe('getter', () => {
      it('should return undefined when modelValue is not defined', () => {
        component.model.prop = undefined;

        expect(component['seconds']).toBeUndefined();
      });
      it('should return seconds value', () => {
        const date = new Date();
        component.model.prop = date;

        expect(component['seconds']).toEqual(date.getSeconds());
      });
    });
    describe('setter', () => {
      it('should call setSeconds with given seconds and call setModelValue with updated seconds', () => {
        const date = new Date();
        const seconds = 41;
        const setSecondsSpy = spyOn(date, 'setSeconds').and.callThrough();
        const setModelValueSpy = spyOn(component as any, 'setModelValue');
        spyOn(component as any, 'getModelValue').and.returnValue(date);

        component['seconds'] = seconds;

        expect(setSecondsSpy).toHaveBeenCalledOnceWith(seconds);
        expect(setModelValueSpy).toHaveBeenCalledOnceWith(date);
      });
      it('should use defaultDate as current date when model value is undefined', () => {
        const defaultDate = new Date();
        const setModelValueSpy = spyOn(component as any, 'setModelValue');
        Object.defineProperty(component, '_defaultDate', {
          value: defaultDate
        });
        component.model.prop = undefined;

        component['seconds'] = 59;

        expect(setModelValueSpy).toHaveBeenCalledOnceWith(defaultDate);
      });
    });
  });

  describe('defaultDate', () => {
    it('should return full internal options defaultDateTime', () => {
      const givenDate = {
        day: 10,
        month: 2,
        year: 2006,
        minutes: 23,
        hour: 12
      };
      component['internalOptions'].defaultDateTime = givenDate;

      const defaultDate = component['_defaultDate'];

      expect(defaultDate.getDate()).toEqual(givenDate.day);
      expect(defaultDate.getMonth()).toEqual(givenDate.month);
      expect(defaultDate.getFullYear()).toEqual(givenDate.year);
      expect(defaultDate.getHours()).toEqual(givenDate.hour);
      expect(defaultDate.getMinutes()).toEqual(givenDate.minutes);
    });
    it('should fill internal options defaultDateTime undefined values', () => {
      const givenDate = {
        day: 10,
        month: 2,
        year: undefined,
        minutes: 23,
        hour: undefined
      };
      component['internalOptions'].defaultDateTime = givenDate;

      const defaultDate = component['_defaultDate'];

      expect(defaultDate.getDate()).toEqual(givenDate.day);
      expect(defaultDate.getMonth()).toEqual(givenDate.month);
      expect(defaultDate.getMinutes()).toEqual(givenDate.minutes);
      const year = defaultDate.getFullYear();
      expect(year).toBeDefined();
      expect(year).not.toBeNull();
      expect(year).toBeGreaterThan(-1);
      const hours = defaultDate.getHours();
      expect(hours).toBeDefined();
      expect(hours).not.toBeNull();
      expect(hours).toBeGreaterThan(-1);
    });
    it('should use now date to fill internal options defaultDateTime undefined values', () => {
      const now = new Date();
      const givenDate = {
        day: undefined,
        month: undefined,
        year: undefined,
        minutes: undefined,
        hour: undefined
      };
      component['internalOptions'].defaultDateTime = givenDate;

      const defaultDate = component['_defaultDate'];

      expect(defaultDate.getDate()).toEqual(now.getDate());
      expect(defaultDate.getMonth()).toEqual(now.getMonth());
      expect(defaultDate.getFullYear()).toEqual(now.getFullYear());
      expect(defaultDate.getHours()).toEqual(now.getHours());
      expect(defaultDate.getMinutes()).toEqual(now.getMinutes());
    });
  });

  it('datePickerRef should return controller cRef', () => {
    const cRef = 'foo';
    const fakeController: any = { cRef };
    component['datePickerController'] = fakeController;

    expect(component['_datePickerRef']).toEqual(cRef);
  });

  it('datePickerElement should return jquery date picker element', () => {
    const fakeElement = document.createElement('div');
    const expectedElement = $(fakeElement);
    component['datePickerController'] = {
      cRef: { _component: { elem: { nativeElement: fakeElement } } }
    } as any;
    document.body.appendChild(fakeElement);

    expect(component['_datePickerElement']).toEqual(expectedElement);
  });

  it('inputElement should return jquery input element', () => {
    const fakeInput = document.createElement('div');
    fakeInput.className = 'input';
    const expectedElement = $(fakeInput);
    const fakeNative = document.createElement('div');
    component['_element'].nativeElement = fakeNative;
    fakeNative.appendChild(fakeInput);
    document.body.appendChild(fakeNative);

    expect(component['_inputElement'][0]).toEqual(expectedElement[0]);
  });

  it('datePicker should return datePickerRef instance', () => {
    const fakeInstance = { prop: 'val' };
    Object.defineProperty(component, '_datePickerRef', {
      value: { instance: fakeInstance },
      writable: false
    });

    expect(component['_datePicker']).toEqual(fakeInstance);
  });

  describe('constructor', () => {
    it('should set translateService', () => {
      expect(component['translateService']).toBeDefined();
      expect(component['translateService']).not.toBeNull();
      expect(component['translateService']).toBeInstanceOf(TranslateService);
    });
    it('should set element', () => {
      expect(component['_element']).toBeDefined();
      expect(component['_element']).not.toBeNull();
      expect(component['_element']).toBeInstanceOf(ElementRef);
    });
    it('should set change detector', () => {
      expect(component['changeDetection']).toBeDefined();
      expect(component['changeDetection']).not.toBeNull();
    });
  });

  describe('ngOnInit', () => {
    it('should call setup', async () => {
      await fixture.whenStable();
      const setupSpy = spyOn(component as any, 'setup');
      setupSpy.calls.reset();

      await component.ngOnInit();

      expect(setupSpy).toHaveBeenCalledTimes(1);
    });
    it('should subscribe to onLangChange', async () => {
      await fixture.whenStable();
      const subscribers = component['translateService'].onLangChange.observers.length;

      await component.ngOnInit();

      expect(component['translateService'].onLangChange.observers.length).toEqual(subscribers + 1);
    });
  });

  describe('setup', () => {
    it('should initially set ready to false', async () => {
      await fixture.whenStable();
      spyOn(commons, 'yieldFunc');
      component['isReady'] = true;

      await component['setup']();

      expect(component['isReady']).toBeFalsy();
    });
    it('should call setupPickerOptions', async () => {
      await fixture.whenStable();
      const setupPickerOptionsSpy = spyOn(component as any, 'setupPickerOptions');

      await component['setup']();

      expect(setupPickerOptionsSpy).toHaveBeenCalledTimes(1);
    });
    it('should call setupFormat', async () => {
      await fixture.whenStable();
      const setupFormatSpy = spyOn(component as any, 'setupFormat');

      await component['setup']();

      expect(setupFormatSpy).toHaveBeenCalledTimes(1);
    });
    it('should call setupFlag', async () => {
      await fixture.whenStable();
      const setupFlagSpy = spyOn(component as any, 'setupFlag');

      await component['setup']();

      expect(setupFlagSpy).toHaveBeenCalledTimes(1);
    });
    it('should call yield func', async () => {
      await fixture.whenStable();
      const yieldFuncSpy = spyOn(commons, 'yieldFunc');

      await component['setup']();

      expect(yieldFuncSpy).toHaveBeenCalledTimes(1);
    });
    it('yield func should set is ready to true', async () => {
      jasmine.clock().uninstall();
      jasmine.clock().install();
      await fixture.whenStable();
      const yieldFuncSpy = spyOn(commons, 'yieldFunc').and.callThrough();

      await component['setup']();

      jasmine.clock().tick(1);

      expect(yieldFuncSpy).toHaveBeenCalledTimes(1);
      expect(component['isReady']).toBeTruthy();
      jasmine.clock().uninstall();
    });
    it('yield func should call markForCheck if change detection strategy is onPush', async () => {
      jasmine.clock().uninstall();
      jasmine.clock().install();
      await fixture.whenStable();
      const yieldFuncSpy = spyOn(commons, 'yieldFunc').and.callThrough();
      const markForCheckSpy = spyOn(component['changeDetection'], 'markForCheck');
      Object.defineProperty(SH_CHANGE_DETECTOR, 'STRATEGY', {
        value: ChangeDetectionStrategy.OnPush
      });
      markForCheckSpy.calls.reset();

      await component['setup']();

      jasmine.clock().tick(1);

      expect(yieldFuncSpy).toHaveBeenCalledTimes(1);
      expect(markForCheckSpy).toHaveBeenCalledTimes(2);
      jasmine.clock().uninstall();
    });
  });

  describe('touch', () => {
    it('should not call markAsTouched if control is already touched', () => {
      const markAsTouchedSpy = spyOn(component['formControl'], 'markAsTouched');
      Object.defineProperty(component['formControl'], 'touched', {
        value: true
      });

      component['touch']();

      expect(markAsTouchedSpy).not.toHaveBeenCalled();
    });
    it('should call markAsTouched', () => {
      const markAsTouchedSpy = spyOn(component['formControl'], 'markAsTouched');
      Object.defineProperty(component['formControl'], 'touched', {
        value: false
      });

      component['touch']();

      expect(markAsTouchedSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('getDefaultOptions should return defaults correctly', () => {
    const opts = component['getDefaultOptions']();

    expect(opts.defaultDateTime).toEqual({ day: 1, month: 0 } as any);
    expect(opts.disableDates).toEqual([]);
    expect(opts.disableDateRanges).toEqual([]);
    expect(opts.allowZeroDigits).toBeTruthy();
  });

  it('setModelValue should call super setModelValue and markAsDirty', () => {
    const expectedValue = new Date('2010-10-10');
    const superSpy = spyOn(ShBaseInputComponent.prototype as any, 'setModelValue');
    const markAsDirtySpy = spyOn(component as any, 'markAsDirty');

    component['setModelValue'](expectedValue);

    expect(superSpy).toHaveBeenCalledOnceWith(expectedValue);
    expect(markAsDirtySpy).toHaveBeenCalledTimes(1);
  });

  describe('dateChanged', () => {
    it('should call setModelValue with correct merged date', () => {
      const setModelValueSpy = spyOn(component as any, 'setModelValue');
      const date = new Date('2011-11-11');
      const modelDate = new Date('2010-10-10');
      const hours = 10;
      const minutes = 32;
      const expectedDate = new Date(date);
      modelDate.setHours(hours);
      modelDate.setMinutes(minutes);
      expectedDate.setHours(hours);
      expectedDate.setMinutes(minutes);
      component['model'][component['prop']] = modelDate;

      component['dateChanged'](date);

      expect(setModelValueSpy).toHaveBeenCalledOnceWith(expectedDate);
    });
    it('should call setModelValue with given date if model value is not defined', () => {
      const date = new Date('2011-11-11');
      const setModelValueSpy = spyOn(component as any, 'setModelValue');
      component['model'][component['prop']] = undefined;

      component['dateChanged'](date);

      expect(setModelValueSpy).toHaveBeenCalledOnceWith(date);
    });
    it('should focus input element', () => {
      const focusSpy = jasmine.createSpy();
      const fakeElement = { focus: focusSpy };
      Object.defineProperty(component, '_inputElement', {
        value: fakeElement
      });

      component['dateChanged'](new Date());

      expect(focusSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('increaseDay', () => {
    it('should call preventDefault and stopPropagation on event', () => {
      const event = new KeyboardEvent('keydown');
      const prevDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropSpy = spyOn(event, 'stopPropagation');

      component['increaseDay'](undefined, event);

      expect(prevDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropSpy).toHaveBeenCalledTimes(1);
    });
    it('should set day as increased day', () => {
      const event = new KeyboardEvent('keydown');
      const day = 11;
      component['day'] = day;

      component['increaseDay'](false, event);

      expect(component['day']).toEqual(day + 1);
    });
    it('should set day as decreased day', () => {
      const event = new KeyboardEvent('keydown');
      const day = 10;
      component['day'] = day;

      component['increaseDay'](true, event);

      expect(component['day']).toEqual(day - 1);
    });
    it('should set day as 31 when decrease is true and current day is not defined or 0', () => {
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(component, 'day', {
        value: 0,
        writable: true
      });

      component['increaseDay'](true, event);

      expect(component['day']).toEqual(31);
    });
    it('should set day as 1 when decrease is false and current day is not defined or 0', () => {
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(component, 'day', {
        value: undefined,
        writable: true
      });

      component['increaseDay'](false, event);

      expect(component['day']).toEqual(1);
    });
  });

  describe('increaseMonth', () => {
    it('should call preventDefault and stopPropagation on event', () => {
      const event = new KeyboardEvent('keydown');
      const prevDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropSpy = spyOn(event, 'stopPropagation');

      component['increaseMonth'](undefined, event);

      expect(prevDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropSpy).toHaveBeenCalledTimes(1);
    });
    it('should set month as increased month', () => {
      const event = new KeyboardEvent('keydown');
      const month = 10;
      component['month'] = month;

      component['increaseMonth'](false, event);

      expect(component['month']).toEqual(month + 1);
    });
    it('should set month as decreased month', () => {
      const event = new KeyboardEvent('keydown');
      const month = 10;
      component['month'] = month;

      component['increaseMonth'](true, event);

      expect(component['month']).toEqual(month - 1);
    });
    it('should set month as 11 when decrease is true and current month is not defined', () => {
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(component, 'month', {
        value: undefined,
        writable: true
      });

      component['increaseMonth'](true, event);

      expect(component['month']).toEqual(11);
    });
    it('should set day as 1 when decrease is false and current day is not defined or 0', () => {
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(component, 'month', {
        value: undefined,
        writable: true
      });

      component['increaseMonth'](false, event);

      expect(component['month']).toEqual(0);
    });
  });

  describe('increaseYear', () => {
    it('should call preventDefault and stopPropagation on event', () => {
      const event = new KeyboardEvent('keydown');
      const prevDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropSpy = spyOn(event, 'stopPropagation');

      component['increaseYear'](undefined, event);

      expect(prevDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropSpy).toHaveBeenCalledTimes(1);
    });
    it('should set year as increased year', () => {
      const event = new KeyboardEvent('keydown');
      const year = 2006;
      component['year'] = year;

      component['increaseYear'](false, event);

      expect(component['year']).toEqual(year + 1);
    });
    it('should set year as decreased year', () => {
      const event = new KeyboardEvent('keydown');
      const year = 2020;
      component['year'] = year;

      component['increaseYear'](true, event);

      expect(component['year']).toEqual(year - 1);
    });
    it('should set year as default date year when current year is not defined', () => {
      const event = new KeyboardEvent('keydown');
      const defaultDate = new Date('2010-01-01');
      const expectedYear = defaultDate.getFullYear();
      Object.defineProperty(component, 'year', {
        value: undefined,
        writable: true
      });
      Object.defineProperty(component, '_defaultDate', {
        value: defaultDate,
        writable: true
      });

      component['increaseYear'](true, event);

      expect(component['year']).toEqual(expectedYear);
    });
  });

  describe('setupFormat', () => {
    it('should set format based on lang when iternal format is not given using default', () => {
      const expectedDefaultFormat: ShDateFormat = ['year', 'month', 'day'];
      component['internalOptions'].format = undefined;
      component['translateService'].currentLang = 'es';

      component['setupFormat']();

      expect(component['format']).toEqual(expectedDefaultFormat);
    });
    it('should set format based on lang when iternal format is not given using italian format', () => {
      const expectedItalianFormat: ShDateFormat = ['day', 'month', 'year'];
      component['internalOptions'].format = undefined;
      component['translateService'].currentLang = 'it';

      component['setupFormat']();

      expect(component['format']).toEqual(expectedItalianFormat);
    });
    it('should set format based on lang when iternal format is not given using english format', () => {
      const expectedEnglishFormat: ShDateFormat = ['month', 'day', 'year'];
      component['internalOptions'].format = undefined;
      component['translateService'].currentLang = 'en';

      component['setupFormat']();

      expect(component['format']).toEqual(expectedEnglishFormat);
    });
    it('should set format as given internal options format', () => {
      const expectedFormat: ShDateFormat = ['day', 'month', 'year'];
      component['internalOptions'].format = expectedFormat;

      component['setupFormat']();

      expect(component['format']).toEqual(expectedFormat);
    });
    it('should set internal options format replacing hour in hh when language is english', () => {
      const givenFormat: ShDateFormat = ['day', 'month', 'year', 'hour'];
      const expectedFormat: ShDateFormat = ['day', 'month', 'year', 'hh'];
      component['internalOptions'].format = givenFormat;
      component['translateService'].currentLang = 'en';

      component['setupFormat']();

      expect(component['format']).toEqual(expectedFormat);
    });
    it('should set internal options format replacing hour in HH when language is not english', () => {
      const givenFormat: ShDateFormat = ['day', 'month', 'year', 'hour'];
      const expectedFormat: ShDateFormat = ['day', 'month', 'year', 'HH'];
      component['internalOptions'].format = givenFormat;
      component['translateService'].currentLang = 'it';

      component['setupFormat']();

      expect(component['format']).toEqual(expectedFormat);
    });
  });

  describe('reset', () => {
    it('should do nothing if allowZeroDigits is false', () => {
      const expectedDay = 10;
      const expectedMonth = 2;
      component['day'] = expectedDay;
      component['month'] = expectedMonth;
      component['internalOptions'].allowZeroDigits = false;

      component['reset']();

      expect(component['day']).toEqual(expectedDay);
      expect(component['month']).toEqual(expectedMonth);
    });
    it('should set day to 1 when zero pressed day is true and set it to false', () => {
      component['day'] = 21;
      component['_zeroPressed'].day = true;
      component['internalOptions'].allowZeroDigits = true;

      component['reset']();

      expect(component['day']).toEqual(1);
      expect(component['_zeroPressed'].day).toBeFalsy();
    });
    it('should set month to 0 when zero pressed month is true and set it to false', () => {
      component['month'] = 3;
      component['_zeroPressed'].month = true;
      component['internalOptions'].allowZeroDigits = true;

      component['reset']();

      expect(component['month']).toEqual(0);
      expect(component['_zeroPressed'].month).toBeFalsy();
    });
  });

  describe('onDateKey', () => {
    it('should do nothing if it is not enabled', () => {
      const event = new KeyboardEvent('keydown');
      const touchSpy = spyOn(component as any, 'touch');
      component.enable = false;

      component['onDateKey'](event);

      expect(touchSpy).not.toHaveBeenCalled();
    });
    it('should do nothing if it is readonly', () => {
      const event = new KeyboardEvent('keydown');
      const touchSpy = spyOn(component as any, 'touch');
      component.enable = true;
      component['internalOptions'].isReadonly = true;

      component['onDateKey'](event);

      expect(touchSpy).not.toHaveBeenCalled();
    });
    it('should call touch', () => {
      const event = new KeyboardEvent('keydown');
      const touchSpy = spyOn(component as any, 'touch');

      component['onDateKey'](event);

      expect(touchSpy).toHaveBeenCalledTimes(1);
    });
    it('should call preventDefault, stopPropagation and showPicker if keycode is arrow up and alt is pressed', () => {
      const event = new KeyboardEvent('keydown');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const showPickerSpy = spyOn(component as any, 'showPicker');
      Object.defineProperty(event, 'altKey', {
        value: true
      });
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_UP
      });

      component['onDateKey'](event);

      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(showPickerSpy).toHaveBeenCalledTimes(1);
    });
    it('should call preventDefault, stopPropagation and showPicker if keycode is arrow down and alt is pressed', () => {
      const event = new KeyboardEvent('keydown');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const showPickerSpy = spyOn(component as any, 'showPicker');
      Object.defineProperty(event, 'altKey', {
        value: true
      });
      Object.defineProperty(event, 'which', {
        value: KeyCode.ARROW_DOWN
      });

      component['onDateKey'](event);

      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(showPickerSpy).toHaveBeenCalledTimes(1);
    });
    it('should do nothing if keycode is arrow up and alt is not pressed when target has meridian', () => {
      const fakeTarget = document.createElement('div');
      const event = new KeyboardEvent('keydown');
      const forwardEventSpy = spyOn(component as any, 'forwardEvent');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_UP
      });
      Object.defineProperty(event, 'target', {
        value: fakeTarget
      });
      fakeTarget.className = 'meridian';

      component['onDateKey'](event);

      expect(forwardEventSpy).not.toHaveBeenCalled();
    });

    it('should do nothing if keycode is arrow down and alt is not pressed when target has meridian', () => {
      const fakeTarget = document.createElement('div');
      const event = new KeyboardEvent('keydown');
      const forwardEventSpy = spyOn(component as any, 'forwardEvent');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_DOWN
      });
      Object.defineProperty(event, 'target', {
        value: fakeTarget
      });
      fakeTarget.className = 'meridian';

      component['onDateKey'](event);

      expect(forwardEventSpy).not.toHaveBeenCalled();
    });
    it('should call forwardEvent if keycode is arrow up and alt is not pressed when target has not meridian', () => {
      const fakeTarget = document.createElement('div');
      const event = new KeyboardEvent('keydown');
      const forwardEventSpy = spyOn(component as any, 'forwardEvent');
      const expectedDaySpan = { nativeElement: document.createElement('span') };
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_UP
      });
      Object.defineProperty(event, 'target', {
        value: fakeTarget
      });
      component['daySpan'] = expectedDaySpan;

      component['onDateKey'](event);

      expect(forwardEventSpy).toHaveBeenCalledOnceWith(event, expectedDaySpan);
    });
    it('should call forwardEvent if keycode is arrow down and alt is not pressed when target has not meridian', () => {
      const fakeTarget = document.createElement('div');
      const event = new KeyboardEvent('keydown');
      const forwardEventSpy = spyOn(component as any, 'forwardEvent');
      const expectedHourSpan = { nativeElement: document.createElement('span') };
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_DOWN
      });
      Object.defineProperty(event, 'target', {
        value: fakeTarget
      });
      component['hourSpan'] = expectedHourSpan;
      component['daySpan'] = undefined;

      component['onDateKey'](event);

      expect(forwardEventSpy).toHaveBeenCalledOnceWith(event, expectedHourSpan);
    });
    it('should call setModelValue with undefined if keyCode is delete', () => {
      const event = new KeyboardEvent('keydown');
      const setModelValueSpy = spyOn(component as any, 'setModelValue');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.DELETE
      });

      component['onDateKey'](event);

      expect(setModelValueSpy).toHaveBeenCalledOnceWith(undefined);
    });
    it('should call setModelValue with undefined if keyCode is backspace', () => {
      const event = new KeyboardEvent('keydown');
      const setModelValueSpy = spyOn(component as any, 'setModelValue');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.BACKSPACE
      });

      component['onDateKey'](event);

      expect(setModelValueSpy).toHaveBeenCalledOnceWith(undefined);
    });
    it('should call forwardEvent with daySpan if keyCode is arrow right', () => {
      const event = new KeyboardEvent('keydown');
      const forwardEventSpy = spyOn(component as any, 'forwardEvent');
      const expectedDaySpan = { nativeElement: document.createElement('span') };
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_RIGHT
      });
      component['daySpan'] = expectedDaySpan;

      component['onDateKey'](event);

      expect(forwardEventSpy).toHaveBeenCalledOnceWith(undefined, expectedDaySpan);
    });
    it('should call forwardEvent with hourSpan if keyCode is arrow right and daySpan is undefined', () => {
      const event = new KeyboardEvent('keydown');
      const forwardEventSpy = spyOn(component as any, 'forwardEvent');
      const expectedHourSpan = { nativeElement: document.createElement('span') };
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_RIGHT
      });
      component['daySpan'] = undefined;
      component['hourSpan'] = expectedHourSpan;

      component['onDateKey'](event);

      expect(forwardEventSpy).toHaveBeenCalledOnceWith(undefined, expectedHourSpan);
    });
    it('should call forwardEvent with minutesSpan if keyCode is arrow left', () => {
      const event = new KeyboardEvent('keydown');
      const forwardEventSpy = spyOn(component as any, 'forwardEvent');
      const expectedMinutesSpan = { nativeElement: document.createElement('span') };
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_LEFT
      });
      component['minutesSpan'] = expectedMinutesSpan;

      component['onDateKey'](event);

      expect(forwardEventSpy).toHaveBeenCalledOnceWith(undefined, expectedMinutesSpan);
    });
    it('should call forwardEvent with yearSpan if keyCode is arrow left', () => {
      const event = new KeyboardEvent('keydown');
      const forwardEventSpy = spyOn(component as any, 'forwardEvent');
      const expectedYearSpan = { nativeElement: document.createElement('span') };
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_LEFT
      });
      component['minutesSpan'] = undefined;
      component['yearSpan'] = expectedYearSpan;

      component['onDateKey'](event);

      expect(forwardEventSpy).toHaveBeenCalledOnceWith(undefined, expectedYearSpan);
    });
    describe('default case', () => {
      it('should do nothing if keyCode is not a number', () => {
        const event = new KeyboardEvent('keydown');
        const forwardEventSpy = spyOn(component as any, 'forwardEvent');
        Object.defineProperty(event, 'keyCode', {
          value: KeyCode.B
        });

        component['onDateKey'](event);

        expect(forwardEventSpy).not.toHaveBeenCalled();
      });
      it('should call forwardEvent if keyCode is a number', () => {
        const event = new KeyboardEvent('keydown');
        const forwardEventSpy = spyOn(component as any, 'forwardEvent');
        Object.defineProperty(event, 'keyCode', {
          value: KeyCode.NUMPAD1
        });

        component['onDateKey'](event);

        expect(forwardEventSpy).toHaveBeenCalledTimes(1);
      });
      it('should call forwardEvent with daySpan if keyCode is number and first format element is day', () => {
        const event = new KeyboardEvent('keydown');
        const forwardEventSpy = spyOn(component as any, 'forwardEvent');
        const fakeDaySpan = { nativeElement: document.createElement('span') };
        Object.defineProperty(event, 'keyCode', {
          value: KeyCode.NUMPAD1
        });
        component['daySpan'] = fakeDaySpan;
        component['format'] = ['day', 'month', 'year'];

        component['onDateKey'](event);

        expect(forwardEventSpy).toHaveBeenCalledOnceWith(event, fakeDaySpan, jasmine.any(Function));
      });
      it('should call forwardEvent with monthSpan if keyCode is number and first format element is month', () => {
        const event = new KeyboardEvent('keydown');
        const forwardEventSpy = spyOn(component as any, 'forwardEvent');
        const fakeMonthSpan = { nativeElement: document.createElement('span') };
        Object.defineProperty(event, 'keyCode', {
          value: KeyCode.NUMPAD1
        });
        component['monthSpan'] = fakeMonthSpan;
        component['format'] = ['month', 'day', 'year'];

        component['onDateKey'](event);

        expect(forwardEventSpy).toHaveBeenCalledOnceWith(event, fakeMonthSpan, jasmine.any(Function));
      });
      it('should call forwardEvent with yearSpan if keyCode is number and first format element is year', () => {
        const event = new KeyboardEvent('keydown');
        const forwardEventSpy = spyOn(component as any, 'forwardEvent');
        const fakeYearSpan = { nativeElement: document.createElement('span') };
        Object.defineProperty(event, 'keyCode', {
          value: KeyCode.NUMPAD1
        });
        component['yearSpan'] = fakeYearSpan;
        component['format'] = ['year', 'month', 'day'];

        component['onDateKey'](event);

        expect(forwardEventSpy).toHaveBeenCalledOnceWith(event, fakeYearSpan, jasmine.any(Function));
      });
      it('should call forwardEvent with hourSpan if keyCode is number and first format element is hour', () => {
        const event = new KeyboardEvent('keydown');
        const forwardEventSpy = spyOn(component as any, 'forwardEvent');
        const fakeHourSpan = { nativeElement: document.createElement('span') };
        Object.defineProperty(event, 'keyCode', {
          value: KeyCode.NUMPAD1
        });
        component['hourSpan'] = fakeHourSpan;
        component['format'] = ['hour', 'minutes'];

        component['onDateKey'](event);

        expect(forwardEventSpy).toHaveBeenCalledOnceWith(event, fakeHourSpan, jasmine.any(Function));
      });
      it('should call forwardEvent with hourSpan if keyCode is number and first format element is hh', () => {
        const event = new KeyboardEvent('keydown');
        const forwardEventSpy = spyOn(component as any, 'forwardEvent');
        const fakeHourSpan = { nativeElement: document.createElement('span') };
        Object.defineProperty(event, 'keyCode', {
          value: KeyCode.NUMPAD1
        });
        component['hourSpan'] = fakeHourSpan;
        component['format'] = ['hh', 'minutes'];

        component['onDateKey'](event);

        expect(forwardEventSpy).toHaveBeenCalledOnceWith(event, fakeHourSpan, jasmine.any(Function));
      });
      it('should call forwardEvent with hourSpan if keyCode is number and first format element is HH', () => {
        const event = new KeyboardEvent('keydown');
        const forwardEventSpy = spyOn(component as any, 'forwardEvent');
        const fakeHourSpan = { nativeElement: document.createElement('span') };
        Object.defineProperty(event, 'keyCode', {
          value: KeyCode.NUMPAD1
        });
        component['hourSpan'] = fakeHourSpan;
        component['format'] = ['HH', 'minutes'];

        component['onDateKey'](event);

        expect(forwardEventSpy).toHaveBeenCalledOnceWith(event, fakeHourSpan, jasmine.any(Function));
      });
    });
  });

  describe('onDayKey', () => {
    it('should call handleKey with right parameters', () => {
      const event = new KeyboardEvent('keydown');
      const fakeDaySpan = { nativeElement: document.createElement('span') };
      const handleKeySpy = spyOn(component as any, 'handleKey');
      component['daySpan'] = fakeDaySpan;

      component['onDayKey'](event);
      expect(handleKeySpy).toHaveBeenCalledOnceWith(event, 'day', 1, fakeDaySpan, jasmine.any(Function), jasmine.any(Function));
    });
    describe('handleKey value callback', () => {
      const getCallback = () => {
        const event = new KeyboardEvent('keydown');
        const handleKeySpy = spyOn(component as any, 'handleKey');
        component['onDayKey'](event);
        const call = handleKeySpy.calls.first();
        return (call.args[call.args.length - 1] as Function).bind(component);
      };
      it('should call focusSibling with daySpan if allowZeroDigits is true and isValueAfterZero returns true', () => {
        const callback = getCallback();
        const isValueAfterZeroSpy = spyOn(component as any, 'isValueAfterZero').and.returnValue(true);
        const focusSiblingSpy = spyOn(component as any, 'focusSibling');
        const fakeDaySpan = { nativeElement: document.createElement('span') };
        const value = 10;
        component['internalOptions'].allowZeroDigits = true;
        component['daySpan'] = fakeDaySpan;

        callback(value);

        expect(isValueAfterZeroSpy).toHaveBeenCalledOnceWith('day', value);
        expect(focusSiblingSpy).toHaveBeenCalledOnceWith(fakeDaySpan);
      });
      it('should call adaptFormat with empty string if day is null or undefined', () => {
        const callback = getCallback();
        const value = 2;
        const adaptFormatSpy = spyOn(component as any, 'adaptFormat');
        Object.defineProperty(component, 'day', {
          value: undefined,
          writable: true
        });

        callback(value);

        expect(adaptFormatSpy).toHaveBeenCalledOnceWith('', value);
      });
      it('should call adaptFormat with empty string if day is greater than 3', () => {
        const callback = getCallback();
        const value = 2;
        const adaptFormatSpy = spyOn(component as any, 'adaptFormat');
        component['day'] = 4;

        callback(value);

        expect(adaptFormatSpy).toHaveBeenCalledOnceWith('', value);
      });
      it('should set day correctly', () => {
        const callback = getCallback();
        const value = 3;
        const day = 2;
        const expectedFormat = '3';
        const adaptFormatSpy = spyOn(component as any, 'adaptFormat').and.returnValue(expectedFormat);
        component['day'] = day;

        callback(value);

        expect(adaptFormatSpy).toHaveBeenCalledOnceWith(day.toString(), value);
        // tslint:disable-next-line: radix
        expect(component['day']).toEqual(parseInt(expectedFormat));
      });
      it('should set day correctly and call focusSibling with daySpan if day is greater or equal than 4', () => {
        const callback = getCallback();
        const value = 6;
        const day = 3;
        const expectedFormat = '4';
        const fakeDaySpan = { nativeElement: document.createElement('span') };
        const focusSiblingSpy = spyOn(component as any, 'focusSibling');
        spyOn(component as any, 'adaptFormat').and.returnValue(expectedFormat);
        component['daySpan'] = fakeDaySpan;
        component['day'] = day;

        callback(value);

        // tslint:disable-next-line: radix
        expect(component['day']).toEqual(parseInt(expectedFormat));
        expect(focusSiblingSpy).toHaveBeenCalledOnceWith(fakeDaySpan);
      });
      it('should set zeroPressed day to true if format is 0', () => {
        const callback = getCallback();
        spyOn(component as any, 'adaptFormat').and.returnValue('0');
        component['_zeroPressed'].day = false;

        callback(2);

        expect(component['_zeroPressed'].day).toBeTruthy();
      });
    });
  });

  describe('onHourKey', () => {
    it('should call handleKey with right parameters', () => {
      const event = new KeyboardEvent('keydown');
      const fakeHourSpan = { nativeElement: document.createElement('span') };
      const handleKeySpy = spyOn(component as any, 'handleKey');
      component['hourSpan'] = fakeHourSpan;

      component['onHourKey'](event);
      expect(handleKeySpy).toHaveBeenCalledOnceWith(event, 'hour', 0, fakeHourSpan, jasmine.any(Function), jasmine.any(Function));
    });
    describe('handle key value callback', () => {
      const getCallback = () => {
        const event = new KeyboardEvent('keydown');
        const handleKeySpy = spyOn(component as any, 'handleKey');
        component['onHourKey'](event);
        const call = handleKeySpy.calls.first();
        return (call.args[call.args.length - 1] as Function).bind(component);
      };
      it('should call adapt format with actual hour', () => {
        const callback = getCallback();
        const value = 2;
        const hour = 4;
        const adaptFormatSpy = spyOn(component as any, 'adaptFormat');
        component['hour'] = hour;

        callback(value);

        expect(adaptFormatSpy).toHaveBeenCalledOnceWith(hour.toString(), value);
      });
      it('should call adapt format with empty string if hour is null or undefined', () => {
        const callback = getCallback();
        const value = 2;
        const adaptFormatSpy = spyOn(component as any, 'adaptFormat');
        Object.defineProperty(component, 'hour', {
          value: undefined,
          writable: true
        });

        callback(value);

        expect(adaptFormatSpy).toHaveBeenCalledOnceWith('', value);
      });
      it('should set hour correctly', () => {
        const callback = getCallback();
        const expectedFormat = '1';
        spyOn(component as any, 'adaptFormat').and.returnValue(expectedFormat);

        callback(2);

        expect(component['hour']).toEqual(parseInt(expectedFormat, 10));
      });
      it('should call focusSibling if set hour is greater than 1 and isTwelveHourNotation is true', () => {
        const callback = getCallback();
        const expectedFormat = '2';
        const focusSiblingSpy = spyOn(component as any, 'focusSibling');
        const fakeHourSpan = { nativeElement: document.createElement('span') };
        spyOn(component as any, 'adaptFormat').and.returnValue(expectedFormat);
        component['isTwelveHourNotation'] = true;
        component['hourSpan'] = fakeHourSpan;

        callback(2);

        expect(focusSiblingSpy).toHaveBeenCalledOnceWith(fakeHourSpan);
      });
      it('should call focusSibling if set hour is greater than 2 and isTwelveHourNotation is false', () => {
        const callback = getCallback();
        const expectedFormat = '3';
        const focusSiblingSpy = spyOn(component as any, 'focusSibling');
        const fakeHourSpan = { nativeElement: document.createElement('span') };
        spyOn(component as any, 'adaptFormat').and.returnValue(expectedFormat);
        component['isTwelveHourNotation'] = false;
        component['hourSpan'] = fakeHourSpan;

        callback(2);

        expect(focusSiblingSpy).toHaveBeenCalledOnceWith(fakeHourSpan);
      });
    });
  });

  describe('onMinutesKey', () => {
    it('should call handleKey with right parameters', () => {
      const event = new KeyboardEvent('keydown');
      const fakeMinutesSpan = { nativeElement: document.createElement('span') };
      const handleKeySpy = spyOn(component as any, 'handleKey');
      component['minutesSpan'] = fakeMinutesSpan;

      component['onMinutesKey'](event);
      expect(handleKeySpy).toHaveBeenCalledOnceWith(event, 'minutes', 0, fakeMinutesSpan, jasmine.any(Function), jasmine.any(Function));
    });
    describe('handle key value callback', () => {
      const getCallback = () => {
        const event = new KeyboardEvent('keydown');
        const handleKeySpy = spyOn(component as any, 'handleKey');
        component['onMinutesKey'](event);
        const call = handleKeySpy.calls.first();
        return (call.args[call.args.length - 1] as Function).bind(component);
      };
      it('should call adapt format with actual minutes', () => {
        const callback = getCallback();
        const value = 2;
        const minutes = 30;
        const adaptFormatSpy = spyOn(component as any, 'adaptFormat');
        component['minutes'] = minutes;

        callback(value);

        expect(adaptFormatSpy).toHaveBeenCalledOnceWith(minutes.toString(), value);
      });
      it('should call adapt format with empty string if minutes is null or undefined', () => {
        const callback = getCallback();
        const value = 2;
        const adaptFormatSpy = spyOn(component as any, 'adaptFormat');
        Object.defineProperty(component, 'minutes', {
          value: undefined,
          writable: true
        });

        callback(value);

        expect(adaptFormatSpy).toHaveBeenCalledOnceWith('', value);
      });
      it('should set minutes correctly', () => {
        const callback = getCallback();
        const expectedFormat = '5';
        spyOn(component as any, 'adaptFormat').and.returnValue(expectedFormat);

        callback(2);

        expect(component['minutes']).toEqual(parseInt(expectedFormat, 10));
      });
      it('should call focusSibling if set minutes is greater than 5', () => {
        const callback = getCallback();
        const expectedFormat = '20';
        const focusSiblingSpy = spyOn(component as any, 'focusSibling');
        const fakeMinutesSpan = { nativeElement: document.createElement('span') };
        spyOn(component as any, 'adaptFormat').and.returnValue(expectedFormat);
        component['minutesSpan'] = fakeMinutesSpan;

        callback(2);

        expect(focusSiblingSpy).toHaveBeenCalledOnceWith(fakeMinutesSpan);
      });
    });
  });

  describe('onSecondsKey', () => {
    it('should call handleKey with right parameters', () => {
      const event = new KeyboardEvent('keydown');
      const fakeSecondsSpan = { nativeElement: document.createElement('span') };
      const handleKeySpy = spyOn(component as any, 'handleKey');
      component['secondsSpan'] = fakeSecondsSpan;

      component['onSecondsKey'](event);
      expect(handleKeySpy).toHaveBeenCalledOnceWith(event, 'seconds', 0, fakeSecondsSpan, jasmine.any(Function), jasmine.any(Function));
    });
    describe('handle key value callback', () => {
      const getCallback = () => {
        const event = new KeyboardEvent('keydown');
        const handleKeySpy = spyOn(component as any, 'handleKey');
        component['onSecondsKey'](event);
        const call = handleKeySpy.calls.first();
        return (call.args[call.args.length - 1] as Function).bind(component);
      };
      it('should call adapt format with actual seconds', () => {
        const callback = getCallback();
        const value = 2;
        const seconds = 30;
        const adaptFormatSpy = spyOn(component as any, 'adaptFormat');
        component['seconds'] = seconds;

        callback(value);

        expect(adaptFormatSpy).toHaveBeenCalledOnceWith(seconds.toString(), value);
      });
      it('should call adapt format with empty string if seconds is null or undefined', () => {
        const callback = getCallback();
        const value = 2;
        const adaptFormatSpy = spyOn(component as any, 'adaptFormat');
        Object.defineProperty(component, 'seconds', {
          value: undefined,
          writable: true
        });

        callback(value);

        expect(adaptFormatSpy).toHaveBeenCalledOnceWith('', value);
      });
      it('should set seconds correctly', () => {
        const callback = getCallback();
        const expectedFormat = '5';
        spyOn(component as any, 'adaptFormat').and.returnValue(expectedFormat);

        callback(2);

        expect(component['seconds']).toEqual(parseInt(expectedFormat, 10));
      });
      it('should call focusSibling if set seconds is greater than 5', () => {
        const callback = getCallback();
        const expectedFormat = '20';
        const focusSiblingSpy = spyOn(component as any, 'focusSibling');
        const fakeSecondsSpan = { nativeElement: document.createElement('span') };
        spyOn(component as any, 'adaptFormat').and.returnValue(expectedFormat);
        component['secondsSpan'] = fakeSecondsSpan;

        callback(2);

        expect(focusSiblingSpy).toHaveBeenCalledOnceWith(fakeSecondsSpan);
      });
    });
  });

  describe('onMonthKey', () => {
    it('should call handleKey with right parameters', () => {
      const event = new KeyboardEvent('keydown');
      const fakeMonthSpan = { nativeElement: document.createElement('span') };
      const handleKeySpy = spyOn(component as any, 'handleKey');
      component['monthSpan'] = fakeMonthSpan;

      component['onMonthKey'](event);
      expect(handleKeySpy).toHaveBeenCalledOnceWith(event, 'month', 0, fakeMonthSpan, jasmine.any(Function), jasmine.any(Function));
    });
    describe('handle key value callback', () => {
      const getCallback = () => {
        const event = new KeyboardEvent('keydown');
        const handleKeySpy = spyOn(component as any, 'handleKey');
        component['onMonthKey'](event);
        const call = handleKeySpy.calls.first();
        return (call.args[call.args.length - 1] as Function).bind(component);
      };
      it('should call focusSibling with monthSpan if allowZeroDigits is true and isValueAfterZero returns true', () => {
        const callback = getCallback();
        const isValueAfterZeroSpy = spyOn(component as any, 'isValueAfterZero').and.returnValue(true);
        const focusSiblingSpy = spyOn(component as any, 'focusSibling');
        const fakeMonthSpan = { nativeElement: document.createElement('span') };
        const value = 10;
        component['internalOptions'].allowZeroDigits = true;
        component['monthSpan'] = fakeMonthSpan;

        callback(value);

        expect(isValueAfterZeroSpy).toHaveBeenCalledOnceWith('month', value, jasmine.any(Function));
        expect(focusSiblingSpy).toHaveBeenCalledOnceWith(fakeMonthSpan);

        // value callback should return given value -1
        const v = 4;
        const call = isValueAfterZeroSpy.calls.first();
        const valueCallback = call.args[2] as Function;
        expect(valueCallback(v)).toEqual(v - 1);
      });
      it('should call focusSibling and set month as value -1 if canOverWrite is true', () => {
        const callback = getCallback();
        const value = 10;
        const fakeMonthSpan = { nativeElement: document.createElement('span') };
        const focusSiblingSpy = spyOn(component as any, 'focusSibling');
        component['monthSpan'] = fakeMonthSpan;
        component['canOverwrite'] = true;

        callback(value);

        expect(component['month']).toEqual(value - 1);
        expect(component['canOverwrite']).toBeFalsy();
        expect(focusSiblingSpy).toHaveBeenCalledOnceWith(fakeMonthSpan);
      });
      it('should set month as value -1 if current month is not defined', () => {
        const callback = getCallback();
        const value = 10;
        const fakeMonthSpan = { nativeElement: document.createElement('span') };
        Object.defineProperty(component, 'month', {
          value: undefined,
          writable: true
        });
        component['monthSpan'] = fakeMonthSpan;
        component['canOverwrite'] = false;

        callback(value);

        expect(component['month']).toEqual(value - 1);
      });
      it('should set month as value -1 if current month is greater than 0', () => {
        const callback = getCallback();
        const value = 10;
        const fakeMonthSpan = { nativeElement: document.createElement('span') };
        Object.defineProperty(component, 'month', {
          value: 1,
          writable: true
        });
        component['monthSpan'] = fakeMonthSpan;
        component['canOverwrite'] = false;

        callback(value);

        expect(component['month']).toEqual(value - 1);
      });
      it('should set month to value +9 if it is lower than 12 and if actual month is 0', () => {
        const callback = getCallback();
        const value = 1;
        const fakeMonthSpan = { nativeElement: document.createElement('span') };
        Object.defineProperty(component, 'month', {
          value: 0,
          writable: true
        });
        component['monthSpan'] = fakeMonthSpan;

        callback(value);

        expect(component['month']).toEqual(value + 9);
      });
      it('should set month to given value -1 if value +10 is greater than 11 and if actual month is 0', () => {
        const callback = getCallback();
        const value = 3;
        const fakeMonthSpan = { nativeElement: document.createElement('span') };
        Object.defineProperty(component, 'month', {
          value: 0,
          writable: true
        });
        component['monthSpan'] = fakeMonthSpan;

        callback(value);

        expect(component['month']).toEqual(value - 1);
      });
      it('should set zeroPressed month to true if allowZeroDigits is true and current month and value are 0 and canOverwrite is true', () => {
        const callback = getCallback();
        const fakeMonthSpan = { nativeElement: document.createElement('span') };
        Object.defineProperty(component, 'month', {
          value: 0,
          writable: true
        });
        component['internalOptions'].allowZeroDigits = true;
        component['canOverwrite'] = true;
        component['_zeroPressed'].month = false;
        component['monthSpan'] = fakeMonthSpan;

        callback(0);

        expect(component['_zeroPressed'].month).toBeTruthy();
      });
    });
  });

  describe('onYearKey', () => {
    it('should call handleKey with right parameters', () => {
      const event = new KeyboardEvent('keydown');
      const fakeYearSpan = { nativeElement: document.createElement('span') };
      const handleKeySpy = spyOn(component as any, 'handleKey');
      component['yearSpan'] = fakeYearSpan;

      component['onYearKey'](event);
      expect(handleKeySpy).toHaveBeenCalledOnceWith(event, 'year', 0, fakeYearSpan, jasmine.any(Function), jasmine.any(Function));
    });
    describe('handle key value callback', () => {
      const eventKey = 3;
      const getCallback = () => {
        const event = new KeyboardEvent('keydown');
        Object.defineProperty(event, 'key', {
          value: eventKey
        });
        const handleKeySpy = spyOn(component as any, 'handleKey');
        component['onYearKey'](event);
        const call = handleKeySpy.calls.first();
        return (call.args[call.args.length - 1] as Function).bind(component);
      };
      it('should set year to event key if canOverwrite is true', () => {
        const callback = getCallback();

        component['canOverwrite'] = true;

        callback(5);

        expect(component['year']).toEqual(eventKey);
        expect(component['canOverwrite']).toBeFalsy();
      });
      it('should set year to event key if current year is not defined', () => {
        const callback = getCallback();
        Object.defineProperty(component, 'year', {
          value: undefined,
          writable: true
        });

        callback(5);

        expect(component['year']).toEqual(eventKey);
      });
      it('should set year to event key if current year is 4 digits', () => {
        const callback = getCallback();
        Object.defineProperty(component, 'year', {
          value: 1980,
          writable: true
        });

        callback(5);

        expect(component['year']).toEqual(eventKey);
      });
      it('should append to current year value the given value', () => {
        const callback = getCallback();
        const value = 6;
        const currentYear = 200;
        component['yearSpan'] = { nativeElement: document.createElement('span') };
        component['year'] = currentYear;

        callback(value);

        // tslint:disable-next-line: radix
        expect(component['year']).toEqual(parseInt(`${currentYear}${value}`));
      });
      it('should call focusSibling if calculated year has more than 3 digits', () => {
        const callback = getCallback();
        const fakeYearSpan = { nativeElement: document.createElement('span') };
        const focusSiblingSpy = spyOn(component as any, 'focusSibling');
        component['year'] = 195;
        component['yearSpan'] = fakeYearSpan;

        callback(4);

        expect(focusSiblingSpy).toHaveBeenCalledOnceWith(fakeYearSpan);
      });
    });
  });

  describe('handleKey', () => {
    it('should do nothing if enable is false', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      Object.defineProperty(event, 'which', {
        value: KeyCode.ARROW_UP
      });
      component.enable = false;

      component['handleKey'](event, '', 0, { nativeElement: document.createElement('span') }, () => null, () => null);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
    it('should do nothing if isReadonly is true', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      Object.defineProperty(event, 'which', {
        value: KeyCode.ARROW_UP
      });
      component['internalOptions'].isReadonly = true;

      component['handleKey'](event, '', 0, { nativeElement: document.createElement('span') }, () => null, () => null);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
    it('should call preventDefault and stopPropagation and onIncrease callback with false when keyCode is arrow up and alt key is not pressed', () => {
      const event = new KeyboardEvent('keydown');
      const fakeSpanRef = { nativeElement: document.createElement('span') };
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const onIncreaseCallback = jasmine.createSpy();
      Object.defineProperty(event, 'which', {
        value: KeyCode.ARROW_UP
      });

      component['handleKey'](event, '', 0, fakeSpanRef, onIncreaseCallback, () => null);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(onIncreaseCallback).toHaveBeenCalledOnceWith(false, event);
    });
    it('should call preventDefault and stopPropagation and showPicker when keyCode is arrow up and alt key is pressed', () => {
      const event = new KeyboardEvent('keydown');
      const fakeSpanRef = { nativeElement: document.createElement('span') };
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const showPickerSpy = spyOn(component as any, 'showPicker');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_UP
      });
      Object.defineProperty(event, 'altKey', {
        value: true
      });

      component['handleKey'](event, '', 0, fakeSpanRef, () => null, () => null);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(showPickerSpy).toHaveBeenCalledTimes(1);
    });
    it('should call preventDefault and stopPropagation and onIncrease callback with true when keyCode is arrow down and alt key is not pressed', () => {
      const event = new KeyboardEvent('keydown');
      const fakeSpanRef = { nativeElement: document.createElement('span') };
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const onIncreaseCallback = jasmine.createSpy();
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_DOWN
      });

      component['handleKey'](event, '', 0, fakeSpanRef, onIncreaseCallback, () => null);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(onIncreaseCallback).toHaveBeenCalledOnceWith(true, event);
    });
    it('should call preventDefault and stopPropagation and showPicker when keyCode is arrow down and alt key is pressed', () => {
      const event = new KeyboardEvent('keydown');
      const fakeSpanRef = { nativeElement: document.createElement('span') };
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const showPickerSpy = spyOn(component as any, 'showPicker');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_DOWN
      });
      Object.defineProperty(event, 'altKey', {
        value: true
      });

      component['handleKey'](event, '', 0, fakeSpanRef, () => null, () => null);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(showPickerSpy).toHaveBeenCalledTimes(1);
    });
    it('should call preventDefault and stopPropagation and set resetValue on propertyName when keyCode is delete', () => {
      const event = new KeyboardEvent('keydown');
      const fakeSpanRef = { nativeElement: document.createElement('span') };
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const propertyName = 'foo';
      const expectedValue = 324;
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.DELETE
      });

      component['handleKey'](event, propertyName, expectedValue, fakeSpanRef, () => null, () => null);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(component[propertyName]).toEqual(expectedValue);
    });
    it('should call preventDefault and stopPropagation and set resetValue on propertyName when keyCode is backspace', () => {
      const event = new KeyboardEvent('keydown');
      const fakeSpanRef = { nativeElement: document.createElement('span') };
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const propertyName = 'foo';
      const expectedValue = 324;
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.BACKSPACE
      });

      component['handleKey'](event, propertyName, expectedValue, fakeSpanRef, () => null, () => null);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(component[propertyName]).toEqual(expectedValue);
    });
    it('should call preventDefault and stopPropagation and focusSibling with given span when keyCode is arrow right', () => {
      const event = new KeyboardEvent('keydown');
      const fakeSpanRef = { nativeElement: document.createElement('span') };
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const focusSiblingSpy = spyOn(component as any, 'focusSibling');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_RIGHT
      });

      component['handleKey'](event, '', 0, fakeSpanRef, () => null, () => null);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(focusSiblingSpy).toHaveBeenCalledOnceWith(fakeSpanRef);
    });
    it('should call preventDefault and stopPropagation and focusSibling with given span and true when keyCode is arrow left', () => {
      const event = new KeyboardEvent('keydown');
      const fakeSpanRef = { nativeElement: document.createElement('span') };
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const focusSiblingSpy = spyOn(component as any, 'focusSibling');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_LEFT
      });

      component['handleKey'](event, '', 0, fakeSpanRef, () => null, () => null);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(focusSiblingSpy).toHaveBeenCalledOnceWith(fakeSpanRef, true);
    });
    it('should call inputElement focus when keyCode is esc without preventing default or stop propagating', () => {
      const event = new KeyboardEvent('keydown');
      const fakeSpanRef = { nativeElement: document.createElement('span') };
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const fakeInputElement = $('<div></div>');
      const focusSpy = spyOn(fakeInputElement, 'focus');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ESC
      });
      Object.defineProperty(component, '_inputElement', {
        value: fakeInputElement
      });

      component['handleKey'](event, '', 0, fakeSpanRef, () => null, () => null);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(stopPropagationSpy).not.toHaveBeenCalled();
      expect(focusSpy).toHaveBeenCalledTimes(1);
    });
    it('should call preventDefault and stopPropagation and onNumber callback with eventKey if keyCode is any number', () => {
      const eventKey = '3';
      const event = new KeyboardEvent('keydown');
      const fakeSpanRef = { nativeElement: document.createElement('span') };
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const onNumberCallback = jasmine.createSpy();
      Object.defineProperties(event, {
        keyCode: {
          value: KeyCode.NUMPAD3
        },
        key: {
          value: eventKey
        }
      });

      component['handleKey'](event, '', 0, fakeSpanRef, () => null, onNumberCallback);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(onNumberCallback).toHaveBeenCalledOnceWith(Number(eventKey));
    });
    it('should do nothing if keyCode is not a number', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.C
      });

      component['handleKey'](event, '', 0, { nativeElement: document.createElement('span') }, () => null, () => null);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
    it('should do nothing if keyCode is number but shift is pressed', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      Object.defineProperties(event, {
        keyCode: {
          value: KeyCode.NUMPAD2
        },
        shiftKey: {
          value: true
        }
      });

      component['handleKey'](event, '', 0, { nativeElement: document.createElement('span') }, () => null, () => null);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('forwardEvent', () => {
    it('should call focus on given span element ref', () => {
      const spanElementRef = { nativeElement: document.createElement('span') };
      const focusSpy = spyOn(spanElementRef.nativeElement, 'focus');

      component['forwardEvent'](undefined, spanElementRef, undefined);

      expect(focusSpy).toHaveBeenCalled();
    });
    it('should not throw error if callback is not defined', () => {
      expect(() => component['forwardEvent'](new KeyboardEvent('keydown'), { nativeElement: document.createElement('span') }, undefined)).not.toThrowError();
    });
    it('should invoke callback if event is not defined', () => {
      const callback = jasmine.createSpy();

      component['forwardEvent'](undefined, { nativeElement: document.createElement('span') }, callback);

      expect(callback).not.toHaveBeenCalled();
    });
    it('should invoke callback with event as argument', () => {
      const event = new KeyboardEvent('keydown');
      const callback = jasmine.createSpy();

      component['forwardEvent'](event, { nativeElement: document.createElement('span') }, callback);

      expect(callback).toHaveBeenCalledOnceWith(event);
    });
  });

  describe('focusSibling', () => {
    const container = document.createElement('div');
    const child0 = document.createElement('span');
    const child1 = document.createElement('span');
    const child2 = document.createElement('span');
    container.append(child0, child1, child2);
    document.body.appendChild(container);
    it('should call focus on next item', () => {
      const focusSpy = spyOn(child2, 'focus');

      component['focusSibling']({ nativeElement: child1 });

      expect(focusSpy).toHaveBeenCalled();
    });
    it('should call focus on previous item', () => {
      const focusSpy = spyOn(child0, 'focus');

      component['focusSibling']({ nativeElement: child1 }, true);

      expect(focusSpy).toHaveBeenCalled();
    });
    it('should not throw error if desired sibling does not exist', () => {
      expect(() => component['focusSibling']({ nativeElement: child0 }, true)).not.toThrowError();
      expect(() => component['focusSibling']({ nativeElement: child2 })).not.toThrowError();
    });
  });

  describe('showPicker', () => {
    it('should do nothing if isReadonly is true', () => {
      const bindPickerSpy = spyOn(component as any, 'bindPicker');
      component['internalOptions'].isReadonly = true;

      component['showPicker']();

      expect(bindPickerSpy).not.toHaveBeenCalled();
    });
    it('should do nothing if showDate is false', () => {
      const bindPickerSpy = spyOn(component as any, 'bindPicker');
      component['internalOptions'].isReadonly = false;
      component['showDate'] = false;

      component['showPicker']();

      expect(bindPickerSpy).not.toHaveBeenCalled();
    });
    it('should call controller openCalendar and bindPicker', () => {
      const bindPickerSpy = spyOn(component as any, 'bindPicker');
      const openCalendarSpy = spyOn(component['datePickerController'], 'openCalendar');
      component['internalOptions'].isReadonly = false;
      component['showDate'] = true;

      component['showPicker']();

      expect(bindPickerSpy).toHaveBeenCalledTimes(1);
      expect(openCalendarSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('hidePicker', () => {
    it('should call controller closeCalendar', () => {
      const closeCalendarSpy = spyOn(component['datePickerController'], 'closeCalendar');
      Object.defineProperty(component, '_datePickerRef', {
        value: undefined
      });

      component['hidePicker']();

      expect(closeCalendarSpy).toHaveBeenCalledTimes(1);
    });
    it('should set onCellKeyDown to false on pickerRef when defined', async () => {
      await fixture.whenStable();
      const fakePicker = { onCellKeyDown: () => null };
      Object.defineProperties(component, {
        _datePickerRef: {
          value: {}
        },
        _datePicker: {
          value: fakePicker
        }
      });

      component['hidePicker']();

      expect(fakePicker.onCellKeyDown).toBeUndefined();
    });
  });

  describe('togglePicker', () => {
    it('should call touch and toggleCalendar', () => {
      const touchSpy = spyOn(component as any, 'touch');
      const toggleCalendarSpy = spyOn(component['datePickerController'], 'toggleCalendar');

      component['togglePicker']();

      expect(touchSpy).toHaveBeenCalledTimes(1);
      expect(toggleCalendarSpy).toHaveBeenCalledTimes(1);
    });
    it('should call bindPicker ', () => {
      const bindPickerSpy = spyOn(component as any, 'bindPicker');

      component['togglePicker']();

      expect(bindPickerSpy).toHaveBeenCalledTimes(1);
    });
    it('should call detectChanges when change detection strategy is onPush', () => {
      const detectChangesSpy = spyOn(component['changeDetection'], 'detectChanges');
      Object.defineProperty(SH_CHANGE_DETECTOR, 'STRATEGY', {
        value: ChangeDetectionStrategy.OnPush
      });

      component['togglePicker']();

      expect(detectChangesSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('setupFlag', () => {
    it('should set isTwelveHourNotation to true if format includes hh', () => {
      component['isTwelveHourNotation'] = false;
      component['format'] = ['hh'];

      component['setupFlag']();

      expect(component['isTwelveHourNotation']).toBeTruthy();
    });
    it('should set isTwelveHourNotation to false if format does not include hh', () => {
      component['isTwelveHourNotation'] = true;
      component['format'] = ['year', 'hour'];

      component['setupFlag']();

      expect(component['isTwelveHourNotation']).toBeFalsy();
    });
    it('should set show date to true if format contains day', () => {
      component['showDate'] = false;
      component['format'] = ['day'];

      component['setupFlag']();

      expect(component['showDate']).toBeTruthy();
    });
    it('should set show date to true if format contains month', () => {
      component['showDate'] = false;
      component['format'] = ['month'];

      component['setupFlag']();

      expect(component['showDate']).toBeTruthy();
    });
    it('should set show date to true if format contains year', () => {
      component['showDate'] = false;
      component['format'] = ['year'];

      component['setupFlag']();

      expect(component['showDate']).toBeTruthy();
    });
    it('should set show date to false if format does not contain day, month nor year', () => {
      component['showDate'] = true;
      component['format'] = ['hour', 'minutes'];

      component['setupFlag']();

      expect(component['showDate']).toBeFalsy();
    });
  });

  describe('adaptFormat', () => {
    it('should return value appended to format', () => {
      const value = 5;
      const format = '198';

      expect(component['adaptFormat'](format, value)).toEqual(`${format}${value}`);
    });
    it('should return value as string and set canOverwrite to false if given format is empty string', () => {
      const value = 10;
      const format = '';
      component['canOverwrite'] = true;

      expect(component['adaptFormat'](format, value)).toEqual(`${value}`);
      expect(component['canOverwrite']).toBeFalsy();
    });
    it('should return value as string and set canOverwrite to false if given format length is 2', () => {
      const value = 10;
      const format = '11';
      component['canOverwrite'] = true;

      expect(component['adaptFormat'](format, value)).toEqual(`${value}`);
      expect(component['canOverwrite']).toBeFalsy();
    });
    it('should return value as string and set canOverwrite to false if canOverwrite is true', () => {
      const value = 10;
      const format = '198';
      component['canOverwrite'] = true;

      expect(component['adaptFormat'](format, value)).toEqual(`${value}`);
      expect(component['canOverwrite']).toBeFalsy();
    });
  });

  describe('isValueAfterZero', () => {
    it('should return false if zeroPressed day is false', () => {
      component['_zeroPressed'].day = false;

      expect(component['isValueAfterZero']('day', 2)).toBeFalsy();
    });
    it('should return false if zeroPressed month is false', () => {
      component['_zeroPressed'].month = false;

      expect(component['isValueAfterZero']('month', 7)).toBeFalsy();
    });
    it('should return true and set zeroPressed day to false and set day if value is not 0', () => {
      const value = 3;
      component['_zeroPressed'].day = true;

      expect(component['isValueAfterZero']('day', value)).toBeTruthy();
      expect(component['day']).toEqual(value);
      expect(component['_zeroPressed'].day).toBeFalsy();
    });
    it('should return true and set zeroPressed day to false and set day through callback if value is not 0', () => {
      const expectedDay = 2;
      const value = 3;
      const callback = jasmine.createSpy().and.returnValue(expectedDay);
      component['_zeroPressed'].day = true;

      expect(component['isValueAfterZero']('day', value, callback)).toBeTruthy();
      expect(component['day']).toEqual(expectedDay);
      expect(component['_zeroPressed'].day).toBeFalsy();
    });
    it('should return true and set zeroPressed month to false and set month if value is not 0', () => {
      const value = 3;
      component['_zeroPressed'].month = true;

      expect(component['isValueAfterZero']('month', value)).toBeTruthy();
      expect(component['month']).toEqual(value);
      expect(component['_zeroPressed'].month).toBeFalsy();
    });
    it('should return true and set zeroPressed month to false and set month through callback if value is not 0', () => {
      const expectedMonth = 2;
      const value = 3;
      const callback = jasmine.createSpy().and.returnValue(expectedMonth);
      component['_zeroPressed'].month = true;

      expect(component['isValueAfterZero']('month', value, callback)).toBeTruthy();
      expect(component['month']).toEqual(expectedMonth);
      expect(component['_zeroPressed'].month).toBeFalsy();
    });
    it('should return true and set zeroPressed to false without setting day if value is 0', () => {
      const expectedDay = 10;
      component['day'] = expectedDay;
      component['_zeroPressed'].day = true;

      expect(component['isValueAfterZero']('day', 0)).toBeTruthy();
      expect(component['day']).toEqual(expectedDay);
      expect(component['_zeroPressed'].day).toBeFalsy();
    });
    it('should return true and set zeroPressed to false without setting month if value is 0', () => {
      const expectedMonth = 5;
      component['month'] = expectedMonth;
      component['_zeroPressed'].month = true;

      expect(component['isValueAfterZero']('month', 0)).toBeTruthy();
      expect(component['month']).toEqual(expectedMonth);
      expect(component['_zeroPressed'].month).toBeFalsy();
    });
  });

  describe('increaseHour', () => {
    it('should call preventDefault and stopPropagation on event', () => {
      const event = new KeyboardEvent('keydown');
      const prevDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropSpy = spyOn(event, 'stopPropagation');

      component['increaseHour'](undefined, event);

      expect(prevDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropSpy).toHaveBeenCalledTimes(1);
    });
    it('should set hour as increased hour', () => {
      const event = new KeyboardEvent('keydown');
      const hour = 10;
      component['hour'] = hour;

      component['increaseHour'](false, event);

      expect(component['hour']).toEqual(hour + 1);
    });
    it('should set hour as decreased hour', () => {
      const event = new KeyboardEvent('keydown');
      const hour = 8;
      component['hour'] = hour;

      component['increaseHour'](true, event);

      expect(component['hour']).toEqual(hour - 1);
    });
    it('should set hour as 1 if it is undefined', () => {
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(component, 'hour', {
        value: undefined,
        writable: true
      });
      component['hour'] = undefined;

      component['increaseHour'](false, event);

      expect(component['hour']).toEqual(1);
    });
    it('should set hour as 23 if it is undefined and decrease is true and it is twelve hour notation', () => {
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(component, 'hour', {
        value: undefined,
        writable: true
      });
      component['hour'] = undefined;
      component['isTwelveHourNotation'] = true;

      component['increaseHour'](true, event);

      expect(component['hour']).toEqual(13);
    });
    it('should set hour as 23 if it is undefined and decrease is true and it is not twelve hour notation', () => {
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(component, 'hour', {
        value: undefined,
        writable: true
      });
      component['hour'] = undefined;
      component['isTwelveHourNotation'] = false;

      component['increaseHour'](true, event);

      expect(component['hour']).toEqual(23);
    });
  });

  describe('increaseMinutes', () => {
    it('should call preventDefault and stopPropagation on event', () => {
      const event = new KeyboardEvent('keydown');
      const prevDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropSpy = spyOn(event, 'stopPropagation');

      component['increaseMinutes'](undefined, event);

      expect(prevDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropSpy).toHaveBeenCalledTimes(1);
    });
    it('should set hour as increased hour', () => {
      const event = new KeyboardEvent('keydown');
      const minutes = 10;
      component['minutes'] = minutes;

      component['increaseMinutes'](false, event);

      expect(component['minutes']).toEqual(minutes + 1);
    });
    it('should set minutes as decreased minutes', () => {
      const event = new KeyboardEvent('keydown');
      const minutes = 8;
      component['minutes'] = minutes;

      component['increaseMinutes'](true, event);

      expect(component['minutes']).toEqual(minutes - 1);
    });
    it('should set minutes as 1 if it is undefined', () => {
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(component, 'minutes', {
        value: undefined,
        writable: true
      });
      component['minutes'] = undefined;

      component['increaseMinutes'](false, event);

      expect(component['minutes']).toEqual(1);
    });
    it('should set minutes as 59 if it is undefined and decrease is true', () => {
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(component, 'minutes', {
        value: undefined,
        writable: true
      });
      component['minutes'] = undefined;

      component['increaseMinutes'](true, event);

      expect(component['minutes']).toEqual(59);
    });
  });

  describe('increaseSeconds', () => {
    it('should call preventDefault and stopPropagation on event', () => {
      const event = new KeyboardEvent('keydown');
      const prevDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropSpy = spyOn(event, 'stopPropagation');

      component['increaseSeconds'](undefined, event);

      expect(prevDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropSpy).toHaveBeenCalledTimes(1);
    });
    it('should set hour as increased hour', () => {
      const event = new KeyboardEvent('keydown');
      const seconds = 10;
      component['seconds'] = seconds;

      component['increaseSeconds'](false, event);

      expect(component['seconds']).toEqual(seconds + 1);
    });
    it('should set seconds as decreased seconds', () => {
      const event = new KeyboardEvent('keydown');
      const seconds = 8;
      component['seconds'] = seconds;

      component['increaseSeconds'](true, event);

      expect(component['seconds']).toEqual(seconds - 1);
    });
    it('should set seconds as 1 if it is undefined', () => {
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(component, 'seconds', {
        value: undefined,
        writable: true
      });
      component['seconds'] = undefined;

      component['increaseSeconds'](false, event);

      expect(component['seconds']).toEqual(1);
    });
    it('should set seconds as 59 if it is undefined and decrease is true', () => {
      const event = new KeyboardEvent('keydown');
      Object.defineProperty(component, 'seconds', {
        value: undefined,
        writable: true
      });
      component['seconds'] = undefined;

      component['increaseSeconds'](true, event);

      expect(component['seconds']).toEqual(59);
    });
  });

  describe('bindPicker', () => {
    it('should set onCellKeyDown callback', () => {
      spyOn(component as any, 'getModelValue').and.returnValue(undefined);
      Object.defineProperty(component, '_datePicker', {
        value: {
          onCellKeyDown: undefined
        }
      });

      component['bindPicker']();

      expect(component['_datePicker'].onCellKeyDown).toBeDefined();
      expect(component['_datePicker'].onCellKeyDown).not.toBeNull();
      expect(component['_datePicker'].onCellKeyDown).toEqual(jasmine.any(Function));
    });
    it('should call focusDayCell', () => {
      const focusDayCellSpy = spyOn(component as any, 'focusDayCell');
      spyOn(component as any, 'getModelValue').and.returnValue(undefined);
      Object.defineProperty(component, '_datePicker', {
        value: {}
      });

      component['bindPicker']();
      expect(focusDayCellSpy).toHaveBeenCalledTimes(1);
    });
    it('should set selectedDate on picker if modelValue is defined and call setVisibleMonth', () => {
      const expectedDay = 3;
      const expectedMonth = 4;
      const expectedYear = 2006;
      const setVisibleMonth = jasmine.createSpy();
      spyOn(component as any, 'getModelValue').and.returnValue({});
      Object.defineProperties(component, {
        _datePicker: {
          value: {
            setVisibleMonth
          }
        },
        day: {
          value: expectedDay,
          writable: true
        },
        month: {
          value: expectedMonth,
          writable: true
        },
        year: {
          value: expectedYear,
          writable: true
        },
      });

      component['bindPicker']();

      expect(component['_datePicker'].selectedDate).toEqual({ day: expectedDay, month: expectedMonth + 1, year: expectedYear });
      expect(setVisibleMonth).toHaveBeenCalledTimes(1);
    });
  });

  describe('getNextCell', () => {
    const cell0 = document.createElement('td');
    Object.defineProperty(cell0, 'cellIndex', {
      value: 0
    });
    cell0.className = 'cell0';
    const cell1 = document.createElement('td');
    Object.defineProperty(cell1, 'cellIndex', {
      value: 1
    });
    cell1.className = 'cell1';
    const cell2 = document.createElement('td');
    Object.defineProperty(cell2, 'cellIndex', {
      value: 2
    });
    cell2.className = 'cell2';
    const cell20 = document.createElement('td');
    Object.defineProperty(cell20, 'cellIndex', {
      value: 0
    });
    cell20.className = 'cell20';
    const cell21 = document.createElement('td');
    Object.defineProperty(cell21, 'cellIndex', {
      value: 1
    });
    cell21.className = 'cell21';
    const cell22 = document.createElement('td');
    Object.defineProperty(cell22, 'cellIndex', {
      value: 2
    });
    cell22.className = 'cell22';
    const row1 = document.createElement('tr');
    Object.defineProperty(row1, 'rowIndex', {
      value: 1
    });
    const row2 = document.createElement('tr');
    Object.defineProperty(row2, 'rowIndex', {
      value: 2
    });
    row1.append(cell0, cell1, cell2);
    row2.append(cell20, cell21, cell22);
    const rows: any = [row1, row2];

    it('should return next cell', () => {
      expect(component['getNextCell'](cell1, row1, rows)).toEqual(cell2);
    });
    it('should return next row first cell', () => {
      expect(component['getNextCell'](cell2, row1, rows)).toEqual(cell20);
    });
    it('should return next row same cell', () => {
      expect(component['getNextCell'](cell2, row1, rows, true)).toEqual(cell22);
    });
  });

  describe('getPrevCell', () => {
    const cell0 = document.createElement('td');
    Object.defineProperty(cell0, 'cellIndex', {
      value: 0
    });
    cell0.className = 'cell0';
    const cell1 = document.createElement('td');
    Object.defineProperty(cell1, 'cellIndex', {
      value: 1
    });
    cell1.className = 'cell1';
    const cell2 = document.createElement('td');
    Object.defineProperty(cell2, 'cellIndex', {
      value: 2
    });
    cell2.className = 'cell2';
    const cell20 = document.createElement('td');
    Object.defineProperty(cell20, 'cellIndex', {
      value: 0
    });
    cell20.className = 'cell20';
    const cell21 = document.createElement('td');
    Object.defineProperty(cell21, 'cellIndex', {
      value: 1
    });
    cell21.className = 'cell21';
    const cell22 = document.createElement('td');
    Object.defineProperty(cell22, 'cellIndex', {
      value: 2
    });
    cell22.className = 'cell22';
    const row1 = document.createElement('tr');
    Object.defineProperty(row1, 'rowIndex', {
      value: 1
    });
    const row2 = document.createElement('tr');
    Object.defineProperty(row2, 'rowIndex', {
      value: 2
    });
    row1.append(cell0, cell1, cell2);
    row2.append(cell20, cell21, cell22);
    const rows: any = [row1, row2];

    it('should return previous cell', () => {
      expect(component['getPrevCell'](cell2, row1, rows)).toEqual(cell1);
    });
    it('should return prev row last cell', () => {
      expect(component['getPrevCell'](cell20, row2, rows)).toEqual(cell2);
    });
    it('should return prev row same cell', () => {
      expect(component['getPrevCell'](cell22, row2, rows, true)).toEqual(cell2);
    });
  });

  describe('focusDayCell', () => {
    it('should call yield function', () => {
      const yieldFuncSpy = spyOn(commons, 'yieldFunc');

      component['focusDayCell']();

      expect(yieldFuncSpy).toHaveBeenCalledTimes(1);
    });
    describe('yield function callback', () => {
      it('should call focus on selectedDay cell', fakeAsync(() => {
        const element = document.createElement('div');
        const selectedDay = document.createElement('div');
        const focusSpy = spyOn(selectedDay, 'focus');
        selectedDay.className = 'selectedday';
        element.appendChild(selectedDay);
        Object.defineProperty(component, '_datePickerElement', {
          value: $(element)
        });

        component['focusDayCell']();
        tick(1);

        expect(focusSpy).toHaveBeenCalled();
      }));
      it('should call focus on dayCell', fakeAsync(() => {
        const element = document.createElement('div');
        const dayCell = document.createElement('div');
        const focusSpy = spyOn(dayCell, 'focus');
        dayCell.className = 'daycell';
        element.appendChild(dayCell);
        Object.defineProperty(component, '_datePickerElement', {
          value: $(element)
        });

        component['focusDayCell']();
        tick(1);

        expect(focusSpy).toHaveBeenCalled();
      }));
    });
  });

  it('setupPickerOptions should set options correctly', async () => {
    const expectedDayLabels: IMyDayLabels = { 'foo': 'bar' };
    const expectedMonthLabels: IMyMonthLabels = { 0: 'baz' };
    const expectedTodayBtnTxt = 'sample';
    const expectedDisableDateRanges: IShDateRange[] = [{ begin: { year: 1000, day: 10, month: 2 }, end: { year: 1001, day: 5, month: 3 } }];
    const expectedDisableDates: IShDate[] = [{ year: 2000, day: 10, month: 2 }, { year: 2000, day: 10, month: 3 }];
    const expectedMaxYear = 3000;
    const expectedMinYear = 1000;
    component['internalOptions'].disableDateRanges = expectedDisableDateRanges;
    component['internalOptions'].disableDates = expectedDisableDates;
    component['internalOptions'].maxYear = expectedMaxYear;
    component['internalOptions'].minYear = expectedMinYear;
    spyOn(component['translateService'], 'get').and.callFake(value =>
      of(value === 'day-labels' ? expectedDayLabels : value === 'month-labels' ? expectedMonthLabels : expectedTodayBtnTxt)
    );

    await component['setupPickerOptions']();

    const options = component['pickerOptions'];
    expect(options.focusInputOnDateSelect).toBeTruthy();
    expect(options.markCurrentDay).toBeTruthy();
    expect(options.markCurrentMonth).toBeTruthy();
    expect(options.disableDateRanges).toBeTruthy(expectedDisableDateRanges);
    expect(options.disableDates).toBeTruthy(expectedDisableDates);
    expect(options.maxYear).toBeTruthy(expectedMaxYear);
    expect(options.minYear).toBeTruthy(expectedMinYear);
    expect(options.dayLabels).toEqual(expectedDayLabels);
    expect(options.monthLabels).toEqual(expectedMonthLabels);
    expect(options.todayBtnTxt).toEqual(expectedTodayBtnTxt);
  });

  describe('changeMeridian', () => {
    it('should not set hour if enable is false', () => {
      const prevHour = 3;
      component['hour'] = prevHour;
      component.enable = false;

      component['changeMeridian']();

      expect(component['hour']).toEqual(prevHour);
    });
    it('should not set hour if isReadonly is true', () => {
      const prevHour = 3;
      component['hour'] = prevHour;
      component.enable = true;
      component['internalOptions'].isReadonly = true;

      component['changeMeridian']();

      expect(component['hour']).toEqual(prevHour);
    });
    it('should set hour changing meridian to AM if event is MouseEvent', () => {
      const event = new MouseEvent('click');
      const hour = 14;
      component['hour'] = hour;

      component.changeMeridian(event);

      expect(component['hour']).toEqual(hour - 12);
    });
    it('should set hour changing meridian to PM if event is MouseEvent', () => {
      const event = new MouseEvent('click');
      const hour = 7;
      component['hour'] = hour;

      component.changeMeridian(event);

      expect(component['hour']).toEqual(hour + 12);
    });
    it('should set hour to meridian value if current hour is undefined', () => {
      const event = new MouseEvent('click');
      Object.defineProperty(component, 'hour', {
        value: undefined,
        writable: true
      });

      component.changeMeridian(event);

      expect(component['hour']).toEqual(12);
    });
    it('should call stopPropagation and preventDefault and change meridian if keyCode is arrow up', () => {
      const event = new KeyboardEvent('keydown');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const hour = 16;
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_UP
      });
      component['hour'] = hour;

      component.changeMeridian(event);

      expect(component['hour']).toEqual(hour - 12);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    });
    it('should call stopPropagation and preventDefault and change meridian if keyCode is arrow down', () => {
      const event = new KeyboardEvent('keydown');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const hour = 8;
      Object.defineProperty(event, 'which', {
        value: KeyCode.ARROW_DOWN
      });
      component['hour'] = hour;

      component.changeMeridian(event);

      expect(component['hour']).toEqual(hour + 12);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    });
    it('should call stopPropagation and preventDefault and change meridian if keyCode is enter', () => {
      const event = new KeyboardEvent('keydown');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const hour = 16;
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ENTER
      });
      component['hour'] = hour;

      component.changeMeridian(event);

      expect(component['hour']).toEqual(hour - 12);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    });
    it('should not change hour if keycode is arrow left', () => {
      const event = new KeyboardEvent('keydown');
      const hour = 16;
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_LEFT
      });

      component['hour'] = hour;

      component.changeMeridian(event);

      expect(component['hour']).toEqual(hour);
    });
    it('should not change hour if keycode is arrow right', () => {
      const event = new KeyboardEvent('keydown');
      const hour = 16;
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_RIGHT
      });

      component['hour'] = hour;

      component.changeMeridian(event);

      expect(component['hour']).toEqual(hour);
    });
    it('should change hour if keyCode is A and actual hour is greater than meridian value', () => {
      const event = new KeyboardEvent('keydown');
      const hour = 16;
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.A
      });
      component['hour'] = hour;

      component.changeMeridian(event);

      expect(component['hour']).toEqual(hour - 12);
    });
    it('should not change hour if keyCode is A and actual hour is less than meridian value', () => {
      const event = new KeyboardEvent('keydown');
      const hour = 8;
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.A
      });
      component['hour'] = hour;

      component.changeMeridian(event);

      expect(component['hour']).toEqual(hour);
    });
    it('should change hour if keyCode is P and actual hour is less than meridian value', () => {
      const event = new KeyboardEvent('keydown');
      const hour = 8;
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.P
      });
      component['hour'] = hour;

      component.changeMeridian(event);

      expect(component['hour']).toEqual(hour + 12);
    });
    it('should not change hour if keyCode is P and actual hour is greater than meridian value', () => {
      const event = new KeyboardEvent('keydown');
      const hour = 13;
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.P
      });
      component['hour'] = hour;

      component.changeMeridian(event);

      expect(component['hour']).toEqual(hour);
    });
  });

  describe('onPickerKeyDown', () => {
    const cell0 = document.createElement('td');
    Object.defineProperty(cell0, 'cellIndex', {
      value: 0
    });
    cell0.className = 'cell0';
    const cell1 = document.createElement('td');
    Object.defineProperty(cell1, 'cellIndex', {
      value: 1
    });
    cell1.className = 'cell1';
    const cell2 = document.createElement('td');
    Object.defineProperty(cell2, 'cellIndex', {
      value: 2
    });
    cell2.className = 'cell2';
    const cell10 = document.createElement('td');
    Object.defineProperty(cell10, 'cellIndex', {
      value: 0
    });
    cell10.className = 'cell10';
    const cell11 = document.createElement('td');
    Object.defineProperty(cell11, 'cellIndex', {
      value: 1
    });
    cell11.className = 'cell11';
    const cell12 = document.createElement('td');
    Object.defineProperty(cell12, 'cellIndex', {
      value: 2
    });
    cell12.className = 'cell12';

    const row1 = document.createElement('tr');
    Object.defineProperty(row1, 'rowIndex', {
      value: 1
    });
    const row2 = document.createElement('tr');
    Object.defineProperty(row2, 'rowIndex', {
      value: 2
    });
    const table = document.createElement('table');
    row1.appendChild(cell0);
    row1.appendChild(cell1);
    row1.appendChild(cell2);
    row2.appendChild(cell10);
    row2.appendChild(cell11);
    row2.appendChild(cell12);
    table.appendChild(row1);
    table.appendChild(row2);
    it('should do nothing if keyCode is not given', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      Object.defineProperties(event, {
        currentTarget: {
          value: cell0
        }
      });

      component['onPickerKeyDown'](event, null);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
    it('should do nothing if keyCode is not one of desired', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      Object.defineProperties(event, {
        currentTarget: {
          value: cell0
        },
        keyCode: {
          value: KeyCode.A
        }
      });

      component['onPickerKeyDown'](event, null);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
    it('should call preventDefault and stopPropagation and focus on next cell if keycode is arrow right', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const cell1FocusSpy = spyOn(cell1, 'focus');
      Object.defineProperties(event, {
        currentTarget: {
          value: cell0
        },
        which: {
          value: KeyCode.ARROW_RIGHT
        }
      });

      component['onPickerKeyDown'](event, null);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(cell1FocusSpy).toHaveBeenCalled();
    });
    it('should call preventDefault and stopPropagation and focus on previous cell if keycode is arrow left', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const cell0FocusSpy = spyOn(cell0, 'focus');
      Object.defineProperties(event, {
        currentTarget: {
          value: cell1
        },
        keyCode: {
          value: KeyCode.ARROW_LEFT
        }
      });

      component['onPickerKeyDown'](event, null);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(cell0FocusSpy).toHaveBeenCalled();
    });
    it('should call preventDefault and stopPropagation and focus on next row cell if keycode is arrow down', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const cell10FocusSpy = spyOn(cell10, 'focus');
      Object.defineProperties(event, {
        currentTarget: {
          value: cell0
        },
        keyCode: {
          value: KeyCode.ARROW_DOWN
        }
      });

      component['onPickerKeyDown'](event, null);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(cell10FocusSpy).toHaveBeenCalled();
    });
    it('should call preventDefault and stopPropagation and focus on previous row cell if keycode is arrow up', () => {
      const event = new KeyboardEvent('keydown');
      const jqElement = $(cell0);
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const cell1FocusSpy = spyOn(jqElement, 'focus');
      spyOn((window as any), '$').and.callFake(v => v === cell0 ? jqElement : undefined);
      Object.defineProperties(event, {
        currentTarget: {
          value: cell10
        },
        keyCode: {
          value: KeyCode.ARROW_UP
        }
      });

      component['onPickerKeyDown'](event, null);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(cell1FocusSpy).toHaveBeenCalledTimes(1);
    });
    it('should call stopPropagation and preventDefault and datePicker onNextMonth and focusDayCell if keyCode is pageDown', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const focusDayCellSpy = spyOn(component as any, 'focusDayCell');
      const onNextMonthSpy = jasmine.createSpy();
      const fakePicker = { onNextMonth: onNextMonthSpy };
      Object.defineProperty(component, '_datePicker', {
        value: fakePicker
      });
      Object.defineProperties(event, {
        currentTarget: {
          value: cell0
        },
        keyCode: {
          value: KeyCode.PAGE_DOWN
        }
      });

      component['onPickerKeyDown'](event, null);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(focusDayCellSpy).toHaveBeenCalledTimes(1);
      expect(onNextMonthSpy).toHaveBeenCalledTimes(1);
    });
    it('should call stopPropagation and preventDefault and datePicker onPrevMonth and focusDayCell if keyCode is pageUp', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const focusDayCellSpy = spyOn(component as any, 'focusDayCell');
      const onPrevMonthSpy = jasmine.createSpy();
      const fakePicker = { onPrevMonth: onPrevMonthSpy };
      Object.defineProperty(component, '_datePicker', {
        value: fakePicker
      });
      Object.defineProperties(event, {
        currentTarget: {
          value: cell0
        },
        keyCode: {
          value: KeyCode.PAGE_UP
        }
      });

      component['onPickerKeyDown'](event, null);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(focusDayCellSpy).toHaveBeenCalledTimes(1);
      expect(onPrevMonthSpy).toHaveBeenCalledTimes(1);
    });
    it('should call preventDefault and stopPropagation if keyCode is enter', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      Object.defineProperties(event, {
        currentTarget: {
          value: cell0
        },
        keyCode: {
          value: KeyCode.ENTER
        }
      });

      component['onPickerKeyDown'](event, { disabled: true });

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
    });
    it('should call preventDefault and stopPropagation if keyCode is space', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      Object.defineProperties(event, {
        currentTarget: {
          value: cell0
        },
        keyCode: {
          value: KeyCode.SPACE
        }
      });

      component['onPickerKeyDown'](event, { disabled: true });

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
    });
    it('should call onCellClicked and focusDayCell if keyCode is enter and sender is not disabled', () => {
      const event = new KeyboardEvent('keydown');
      const focusDayCellSpy = spyOn(component as any, 'focusDayCell');
      const onCellClickedSpy = jasmine.createSpy();
      const fakePicker = { onCellClicked: onCellClickedSpy };
      const sender = { disabled: false };
      Object.defineProperty(component, '_datePicker', {
        value: fakePicker
      });
      Object.defineProperties(event, {
        currentTarget: {
          value: cell0
        },
        keyCode: {
          value: KeyCode.ENTER
        }
      });

      component['onPickerKeyDown'](event, sender);

      expect(onCellClickedSpy).toHaveBeenCalledOnceWith(sender);
      expect(focusDayCellSpy).toHaveBeenCalledTimes(1);
    });
    it('should call onCellClicked and focusDayCell if keyCode is space and sender is not disabled', () => {
      const event = new KeyboardEvent('keydown');
      const focusDayCellSpy = spyOn(component as any, 'focusDayCell');
      const onCellClickedSpy = jasmine.createSpy();
      const fakePicker = { onCellClicked: onCellClickedSpy };
      const sender = { disabled: false };
      Object.defineProperty(component, '_datePicker', {
        value: fakePicker
      });
      Object.defineProperties(event, {
        currentTarget: {
          value: cell0
        },
        keyCode: {
          value: KeyCode.SPACE
        }
      });

      component['onPickerKeyDown'](event, sender);

      expect(onCellClickedSpy).toHaveBeenCalledOnceWith(sender);
      expect(focusDayCellSpy).toHaveBeenCalledTimes(1);
    });
    it('should call hidePicker and inputElement focus if keyCode is esc', () => {
      const event = new KeyboardEvent('keydown');
      const fakeInputElement = $('<div></div>');
      const focusSpy = spyOn(fakeInputElement, 'focus');
      const hidePickerSpy = spyOn(component as any, 'hidePicker');
      Object.defineProperties(event, {
        currentTarget: {
          value: cell0
        },
        keyCode: {
          value: KeyCode.ESC
        }
      });
      Object.defineProperty(component, '_inputElement', {
        value: fakeInputElement
      });

      component['onPickerKeyDown'](event, null);

      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(hidePickerSpy).toHaveBeenCalledTimes(1);
    });
  });
});

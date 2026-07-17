import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { INgxMyDpOptions, NgxMyDatePickerDirective } from 'ngx-mydatepicker';
import { takeUntil } from 'rxjs/operators';
import { FormDesignerControl } from 'src/decorators';
import { SH_CHANGE_DETECTOR } from 'src/environments/change-detection-strategy';
import { isNoU, yieldFunc } from '../../utilities/common.utility';
import { KeyCode, keyIsNumber } from '../../utilities/key-code.const';
import { IShBaseInputOptions, ShBaseInputComponent } from '../base/index';
/**
 * Date organized by year, day and month
 */
export interface IShDate {
  /**
   * Date's year
   */
  year: number;
  /**
   * Date's day
   */
  day: number;
  /**
   * Date's month
   * NOTE: it's 0 based
   */
  month: number;
}

/**
 * Date organized by year, month, day, hour and minutes
 */
export interface IShDateTime extends IShDate {
  /**
   * Date's hour
   */
  hour: number;
  /**
   * Date's minutes
   */
  minutes: number;
}

/**
 * Range of IShDate
 */
export interface IShDateRange {
  /**
   * Start date
   */
  begin: IShDate;
  /**
   * End date
   */
  end: IShDate;
}
/**
 * Type hour in DateFormat
 */
export type ShHourKey = 'HH' | 'hh' | 'hour';
/**
 * Type minutes in DateFormat
 */
export type ShMinutesKey = 'minutes';
/**
 * Type seconds in DateFormat
 */
export type ShSecondsKey = 'seconds';
/**
 * Type day month year in DateFormat
 */
export type ShDateKey = 'day' | 'month' | 'year';
/**
 * ShDate Format
 */
export type ShDateFormat =
  [ShDateKey, ShDateKey, ShDateKey] | [ShDateKey, ShDateKey] | [ShDateKey] |
  [ShHourKey, ShMinutesKey] | [ShHourKey] | [ShMinutesKey] |
  [ShDateKey, ShDateKey, ShDateKey, ShHourKey, ShMinutesKey] | [ShDateKey, ShDateKey, ShDateKey, ShHourKey, ShMinutesKey, ShSecondsKey] | [ShDateKey, ShDateKey, ShDateKey, ShHourKey] |
  [ShDateKey, ShDateKey, ShHourKey, ShMinutesKey] | [ShDateKey, ShDateKey, ShHourKey] |
  [ShDateKey, ShHourKey, ShMinutesKey] | [ShDateKey, ShHourKey];

/**
 * Base Date Component options contract
 */
export interface IShDateOptions extends IShBaseInputOptions<Date> {
  /**
   * Minimum year reachable from picker
   */
  minYear?: number;
  /**
   * Maximum year reachable from picker
   */
  maxYear?: number;
  /**
   * List of disabled picker's dates
   */
  disableDates?: IShDate[];
  /**
   * List of disabled picker's date ranges
   */
  disableDateRanges?: IShDateRange[];
  /**
   * The default starting date preferences
   */
  defaultDateTime?: IShDateTime;
  /**
   * Date format
   * @default Based on locale
   */
  format?: ShDateFormat;
  /**
   * Allows zero digits for day and month
   * @default true
   */
  allowZeroDigits?: boolean;
}

@FormDesignerControl({
  name: 'date',
  shortDescription: 'Date Control'
})
@Component({
  selector: 'sh-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  changeDetection: SH_CHANGE_DETECTOR.STRATEGY
})
/**
 * Base Date Component
 */
export class ShDateComponent extends ShBaseInputComponent<Date, IShDateOptions> implements OnInit {
  /**
   * Date Picker Controller
   */
  @ViewChild('dp', { static: false }) protected datePickerController: NgxMyDatePickerDirective;
  /**
   * Element reference to day span element
   */
  @ViewChild('daySpan', { static: false }) protected daySpan: ElementRef<HTMLSpanElement>;
  /**
   * Element reference to month span element
   */
  @ViewChild('monthSpan', { static: false }) protected monthSpan: ElementRef<HTMLSpanElement>;
  /**
   * Element reference to year span element
   */
  @ViewChild('yearSpan', { static: false }) protected yearSpan: ElementRef<HTMLSpanElement>;
  /**
   * Element reference to hour span element
   */
  @ViewChild('hourSpan', { static: false }) public hourSpan: ElementRef<HTMLSpanElement>;
  /**
   * Element reference to minutes span element
   */
  @ViewChild('minutesSpan', { static: false }) public minutesSpan: ElementRef<HTMLSpanElement>;
  /**
   * Element reference to seconds span element
   */
  @ViewChild('secondsSpan', { static: false }) public secondsSpan: ElementRef<HTMLSpanElement>;
  /**
   * References to control HTML element
   */
  @ViewChild('input', { static: false }) protected controlRef: ElementRef;
  /**
   * Picker Configuration
   */
  protected pickerOptions: INgxMyDpOptions;
  /**
   * Specifies whether component is ready to be used
   */
  protected isReady = false;
  /**
   * Date control format definition
   */
  public format: ShDateFormat;
  /**
   * Translate service
   */
  protected translateService: TranslateService;
  /**
   * Component element reference
   */
  private _element: ElementRef;

  /**
   * Twelve Hour Notation
   */
  protected isTwelveHourNotation: boolean;

  /**
   * Specifies whether component show the date
   */
  protected showDate: boolean;
  /**
   * Specifies when overwrite
   */
  protected canOverwrite: boolean;
  /**
  * Change detector references
  */
  protected changeDetection: ChangeDetectorRef;
  /**
   * Notifies when a 0 is pressed for day or month span
   */
  private _zeroPressed = {
    day: false,
    month: false
  };
  /**
   * Date's day
   */
  protected get day() {
    const value = this.getModelValue();
    return this._zeroPressed.day ? 0 : (value ? value.getDate() : undefined);
  }
  protected set day(day: number) {
    let date = this.getModelValue();
    if (!date) {
      date = this._defaultDate;
    }
    date.setDate(day);
    this.setModelValue(date);
  }
  /**
   * Date's month
   */
  protected get month() {
    const value = this.getModelValue();
    return this._zeroPressed.month ? -1 : (value ? value.getMonth() : undefined);
  }
  protected set month(month: number) {
    let date = this.getModelValue();
    if (!date) {
      date = this._defaultDate;
    }
    date.setMonth(month);
    this.setModelValue(date);
  }
  /**
   * Date's year
   */
  protected get year() {
    const value = this.getModelValue();
    return value ? value.getFullYear() : undefined;
  }
  protected set year(year: number) {
    let date = this.getModelValue();
    if (!date) {
      date = this._defaultDate;
    }
    date.setFullYear(year);
    this.setModelValue(date);
  }

  /**
  * Date's hour
  */
  protected get hour() {
    const value = this.getModelValue();
    return value ? value.getHours() : undefined;
  }
  protected set hour(hour: number) {
    let date = this.getModelValue();
    if (!date) {
      date = this._defaultDate;
    }
    date.setHours(hour >= 24 ? 0 : hour);
    this.setModelValue(date);
  }

  /**
   * Date's minutes
   */
  protected get minutes() {
    const value = this.getModelValue();
    return value ? value.getMinutes() : undefined;
  }
  protected set minutes(minutes: number) {
    let date = this.getModelValue();
    if (!date) {
      date = this._defaultDate;
    }
    date.setMinutes(minutes);
    this.setModelValue(date);
  }

  /**
   * Date's seconds
   */
  protected get seconds() {
    const value = this.getModelValue();
    return value ? value.getSeconds() : undefined;
  }
  protected set seconds(seconds: number) {
    let date = this.getModelValue();
    if (!date) {
      date = this._defaultDate;
    }
    date.setSeconds(seconds);
    this.setModelValue(date);
  }

  /**
   * The default starting date
   */
  private get _defaultDate() {
    const { defaultDateTime } = this.internalOptions;
    const now = new Date();
    return new Date(
      isNoU(defaultDateTime.year) ? now.getFullYear() : defaultDateTime.year,
      isNoU(defaultDateTime.month) ? now.getMonth() : defaultDateTime.month,
      isNoU(defaultDateTime.day) ? now.getDate() : defaultDateTime.day,
      isNoU(defaultDateTime.hour) ? now.getHours() : defaultDateTime.hour,
      isNoU(defaultDateTime.minutes) ? now.getMinutes() : defaultDateTime.minutes
    );
  }

  /**
   * Date Picker component reference
   */
  private get _datePickerRef() {
    return this.datePickerController['cRef'];
  }

  /**
   * Date Picker JQ-Element
   */
  private get _datePickerElement() {
    return $(this._datePickerRef && this._datePickerRef._component.elem.nativeElement);
  }

  /**
   * Date Input JQ-Element
   */
  private get _inputElement() {
    return $(this._element.nativeElement).find('.input');
  }

  /**
   * Date Picker instance
   */
  private get _datePicker() {
    return this._datePickerRef && this._datePickerRef.instance;
  }

  /**
   * Base Date Component
   */
  constructor(injector: Injector) {
    super(injector);
    this.translateService = injector.get(TranslateService);
    this._element = injector.get(ElementRef);
    this.changeDetection = injector.get(ChangeDetectorRef);
  }

  //#region COMPONENT

  public async ngOnInit() {
    super.ngOnInit();
    await this.setup();
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.setup.bind(this));
  }

  /**
   * Configures the components
   */
  protected async setup() {
    this.isReady = false;
    await this.setupPickerOptions();
    this.setupFormat();
    this.setupFlag();
    yieldFunc(() => {
      this.isReady = true;
      if (SH_CHANGE_DETECTOR.STRATEGY === ChangeDetectionStrategy.OnPush) {
        this.changeDetection.markForCheck();
      }
    });
  }

  /**
   * Marks form control as touched
   */
  protected touch() {
    if (!this.formControl.touched) {
      this.formControl.markAsTouched();
    }
  }

  protected getDefaultOptions() {
    return _.merge(super.getDefaultOptions(), <IShDateOptions>{
      defaultDateTime: {
        day: 1,
        month: 0
      },
      disableDates: [],
      disableDateRanges: [],
      allowZeroDigits: true
    });
  }

  protected setModelValue(value: Date) {
    super.setModelValue(value);
    this.markAsDirty();
  }

  //#endregion COMPONENT

  //#region CONTROL
  /**
   * Date Changed from picker without change time
   * @param date selected date
   */
  protected dateChanged(date: Date) {
    const value = this.getModelValue();
    if (value) {
      date.setHours(value.getHours());
      date.setMinutes(value.getMinutes());
    }
    this.setModelValue(date);
    this._inputElement.focus();
  }

  /**
   * Increases/decreases date's day
   * @param decrease Specifies whether to decrease the day
   * @param event Keyboard event
   */
  protected increaseDay(decrease = false, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    let day = this.day;
    if (!day) {
      day = decrease ? 31 : 1;
    } else {
      day = decrease ? --day : ++day;
    }
    this.day = day;
  }

  /**
   * Increases/decreases date's month
   * @param decrease Specifies whether to decrease the month
   * @param event Keyboard event
   */
  protected increaseMonth(decrease = false, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    let month = this.month;
    if (isNoU(month)) {
      month = decrease ? 11 : 0;
    } else {
      month = decrease ? --month : ++month;
    }
    this.month = month;
  }

  /**
   * Increases/decreases date's year
   * @param decrease Specifies whether to decrease the year
   * @param event Keyboard event
   */
  protected increaseYear(decrease = false, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    let year = this.year;
    if (!year) {
      year = this._defaultDate.getFullYear();
    } else {
      year = decrease ? --year : ++year;
    }
    this.year = year;
  }

  protected setupFormat() {
    const lang = this.translateService.currentLang;
    if (!(this.internalOptions.format && this.internalOptions.format.length)) {
      switch (lang) {
        case 'it':
          this.format = ['day', 'month', 'year'];
          break;
        case 'en':
          this.format = ['month', 'day', 'year'];
          break;
        default:
          this.format = ['year', 'month', 'day'];
          break;
      }
    } else {
      this.format = [...this.internalOptions.format] as ShDateFormat;
      const index = this.format.findIndex(f => f === 'hour');
      if (index > -1) {
        this.format[index] = lang.includes('en') ? 'hh' : 'HH';
      }
    }
  }
  //#endregion CONTROL

  //#region KEYBOARD

  protected reset() {
    if (this.internalOptions.allowZeroDigits) {
      if (this._zeroPressed.day) {
        this.day = 1;
        this._zeroPressed.day = false;
      }
      if (this._zeroPressed.month) {
        this.month = 0;
        this._zeroPressed.month = false;
      }
    }
  }

  /**
   * Event fired on key pressed on date control field
   * @param event Keyboard event
   */
  protected onDateKey(event: KeyboardEvent) {
    if (this.enable && !this.internalOptions.isReadonly) {
      const keyCode = event.keyCode || event.which;
      switch (keyCode) {
        case KeyCode.ARROW_UP:
        case KeyCode.ARROW_DOWN:
          if (event.altKey) {
            event.preventDefault();
            event.stopPropagation();
            this.showPicker();
          } else {
            const target = event.target as HTMLElement;
            const hasMeridian = target && target.className.includes('meridian');
            if (!hasMeridian) {
              this.forwardEvent(event, this.daySpan || this.hourSpan);
            }
          }
          break;

        case KeyCode.DELETE:
        case KeyCode.BACKSPACE:
          this.setModelValue(undefined);
          break;

        case KeyCode.ARROW_RIGHT:
          this.forwardEvent(undefined, this.daySpan || this.hourSpan);
          break;

        case KeyCode.ARROW_LEFT:
          this.forwardEvent(undefined, this.minutesSpan || this.yearSpan);
          break;

        default:
          if (keyIsNumber(keyCode)) {
            let span: ElementRef<HTMLSpanElement>;
            let callback: (event: KeyboardEvent) => void;
            switch (this.format[0]) {
              case 'day':
              default:
                span = this.daySpan;
                callback = this.onDayKey;
                break;
              case 'month':
                span = this.monthSpan;
                callback = this.onMonthKey;
                break;
              case 'year':
                span = this.yearSpan;
                callback = this.onYearKey;
                break;
              case 'HH':
              case 'hh':
              case 'hour':
                span = this.hourSpan;
                callback = this.onHourKey;
                break;
            }
            this.forwardEvent(event, span, callback.bind(this));
          }
          break;
      }
      this.touch();
    }
  }

  /**
   * Event fired on key pressed on day control field
   * @param event Keyboard event
   */
  protected onDayKey(event: KeyboardEvent) {
    this.handleKey(
      event,
      'day',
      1,
      this.daySpan,
      this.increaseDay.bind(this),
      value => {
        if (this.internalOptions.allowZeroDigits && this.isValueAfterZero('day', value)) {
          this.focusSibling(this.daySpan);
          return;
        }
        const day = this.day;
        let format = isNoU(day) ? '' : day.toString();
        if (day > 3) {
          format = '';
        }
        format = this.adaptFormat(format, value);
        if (format !== '0') {
          // tslint:disable-next-line: radix
          this.day = parseInt(format);
          if (this.day >= 4) {
            this.focusSibling(this.daySpan);
          }
        } else if (this.internalOptions.allowZeroDigits) {
          this._zeroPressed.day = true;
        }
      });
  }

  /**
  * Event fired on key pressed on hour control field
  * @param event Keyboard event
  */
  public onHourKey(evt: KeyboardEvent) {
    this.handleKey(evt, 'hour', 0, this.hourSpan, this.increaseHour.bind(this), value => {
      const hour = this.hour;
      let format = isNoU(hour) ? '' : hour.toString();
      format = this.adaptFormat(format, value);
      this.hour = parseInt(format, 10);
      if (this.hour > (this.isTwelveHourNotation ? 1 : 2)) {
        this.focusSibling(this.hourSpan);
      }
    });
  }

  /**
  * Event fired on key pressed on minutes control field
  * @param event Keyboard event
  */
  public onMinutesKey(evt: KeyboardEvent) {
    this.handleKey(evt, 'minutes', 0, this.minutesSpan, this.increaseMinutes.bind(this), value => {
      const minutes = this.minutes;
      let format = isNoU(minutes) ? '' : minutes.toString();
      format = this.adaptFormat(format, value);
      this.minutes = parseInt(format, 10);
      if (this.minutes > 5) {
        this.focusSibling(this.minutesSpan);
      }
    });
  }

  /**
  * Event fired on key pressed on minutes control field
  * @param event Keyboard event
  */
  public onSecondsKey(evt: KeyboardEvent) {
    this.handleKey(evt, 'seconds', 0, this.secondsSpan, this.increaseSeconds.bind(this), value => {
      const seconds = this.seconds;
      let format = isNoU(seconds) ? '' : seconds.toString();
      format = this.adaptFormat(format, value);
      this.seconds = parseInt(format, 10);
      if (this.seconds > 5) {
        this.focusSibling(this.secondsSpan);
      }
    });
  }

  /**
   * Event fired on key pressed on month control field
   * @param event Keyboard event
   */
  protected onMonthKey(event: KeyboardEvent) {
    this.handleKey(
      event,
      'month',
      0,
      this.monthSpan,
      this.increaseMonth.bind(this),
      value => {
        if (this.internalOptions.allowZeroDigits && this.isValueAfterZero('month', value, value => value - 1)) {
          this.focusSibling(this.monthSpan);
          return;
        }
        let month = this.month;
        if (!isNoU(month)) {
          month--;
        }
        let format = '';
        value--;
        format = isNoU(month) ? '' : month.toString();
        if ((month > -1 || format.length === 0 || this.canOverwrite)) {
          format = `${value}`;
          this.canOverwrite = false;
        } else if (month === -1) {
          const calculatedMonth = 10 + (value);
          format = `${calculatedMonth < 12 ? calculatedMonth : value}`;
        }
        // tslint:disable-next-line: radix
        this.month = parseInt(format === '-1' ? '0' : format);
        if (this.internalOptions.allowZeroDigits && format === '-1') {
          this._zeroPressed.month = true;
        } else if (this.month > 0) {
          this.focusSibling(this.monthSpan);
        }
      });
  }

  /**
   * Event fired on key pressed on year control field
   * @param event Keyboard event
   */
  protected onYearKey(event: KeyboardEvent) {
    this.handleKey(
      event,
      'year',
      0,
      this.yearSpan,
      this.increaseYear.bind(this),
      value => {
        const year = this.year;
        let format = isNoU(year) ? '' : year.toString();
        if (format.length === 0 || format.length === 4 || this.canOverwrite) {
          format = event.key;
          this.canOverwrite = false;
        } else {
          format = `${format}${value}`;
        }
        // tslint:disable-next-line: radix
        this.year = parseInt(format);
        if (this.year > 999) {
          this.focusSibling(this.yearSpan);
        }
      });
  }

  /**
   * Handles keyboard event basing on specific features
   * @param event Keyboard Event
   * @param propretyName Name of the property of control to handle
   * @param resetValue Value to be assigned in case of value canceling
   * @param span Reference to control span element
   * @param onIncrease Event fired when pressed key matches an increaser/decreaser action
   * @param onNumber Event fired when pressed key matches a number
   */
  protected handleKey(
    event: KeyboardEvent,
    propretyName: string,
    resetValue: number,
    span: ElementRef<HTMLSpanElement>,
    onIncrease: (decrease: boolean, event: Event) => void,
    onNumber: (value: number) => void) {
    if (this.enable && !this.internalOptions.isReadonly) {
      let prevent = false;
      const keyCode = event.keyCode || event.which;
      switch (keyCode) {
        case KeyCode.ARROW_UP:
          prevent = true;
          if (event.altKey) {
            this.showPicker();
          } else {
            onIncrease(false, event);
          }
          break;

        case KeyCode.ARROW_DOWN:
          prevent = true;
          if (event.altKey) {
            this.showPicker();
          } else {
            onIncrease(true, event);
          }
          break;

        case KeyCode.DELETE:
        case KeyCode.BACKSPACE:
          prevent = true;
          (<any>this)[propretyName] = resetValue;
          break;

        case KeyCode.ARROW_RIGHT:
          prevent = true;
          this.focusSibling(span);
          break;

        case KeyCode.ARROW_LEFT:
          prevent = true;
          this.focusSibling(span, true);
          break;

        case KeyCode.ESC:
          this._inputElement.focus();
          break;

        default:
          if (keyIsNumber(keyCode) && !event.shiftKey) {
            prevent = true;
            // tslint:disable-next-line: radix
            onNumber(parseInt(event.key));
          }
          break;
      }
      if (prevent) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  /**
   * Forwards a specific event to day control element
   * @param event Keyboard event
   */
  protected forwardEvent(event: KeyboardEvent, span: ElementRef<HTMLSpanElement>, callback?: (event: KeyboardEvent) => void) {
    $(span.nativeElement).focus();
    if (event && callback) {
      callback(event);
    }
  }

  /**
   * Focuses sibling control value
   * @param span Reference to date specific control (day, month or year span element)
   * @param prev Specifies whether to focus previous sibling control
   */
  protected focusSibling(span: ElementRef<HTMLSpanElement>, prev = false) {
    const control = $(span.nativeElement);
    const sibling = prev ? control.prev() : control.next();
    if (sibling.length) {
      sibling.focus();
    }
  }

  //#region KEYBOARD

  //#region PICKER

  /**
   * Shows picker
   */
  protected showPicker() {
    if (!this.internalOptions.isReadonly && this.showDate) {
      this.datePickerController.openCalendar();
      this.bindPicker();
    }
  }

  /**
   * Hides picker
   */
  protected hidePicker() {
    if (this._datePickerRef) {
      this._datePicker.onCellKeyDown = undefined;
    }
    this.datePickerController.closeCalendar();
  }

  /**
   * Shows or hides picker
   */
  protected togglePicker() {
    this.touch();
    this.datePickerController.toggleCalendar();
    if (SH_CHANGE_DETECTOR.STRATEGY === ChangeDetectionStrategy.OnPush) {
      this.changeDetection.detectChanges();
    }
    if (this._datePickerRef) {
      this.bindPicker();
    }
  }

  /**
  * Event fired on key or click press on meridian
  * @param event Keyboard event
  */
  public changeMeridian(evt?: KeyboardEvent | MouseEvent) {
    if (this.enable && !this.internalOptions.isReadonly) {
      let switchHour = false;
      if (evt instanceof KeyboardEvent) {
        const keyCode = evt.keyCode || evt.which;
        switch (keyCode) {
          case KeyCode.ARROW_UP:
          case KeyCode.ARROW_DOWN:
          case KeyCode.ENTER: {
            evt.preventDefault();
            evt.stopPropagation();
            switchHour = true;
            break;
          }
          case KeyCode.ARROW_LEFT:
          case KeyCode.ARROW_RIGHT: {
            switchHour = false;
            break;
          }
          case KeyCode.P: {
            if (this.hour <= 12) {
              switchHour = true;
            }
            break;
          }
          case KeyCode.A: {
            if (this.hour > 12) {
              switchHour = true;
            }
            break;
          }
        }
      } else {
        switchHour = true;
      }
      if (isNoU(this.hour)) {
        this.hour = 0;
      }
      if (switchHour) {
        this.hour = this.hour >= 12 ? this.hour -= 12 : this.hour += 12;
      }
    }
  }

  /**
   * Configures flags based on format
   */
  private setupFlag() {
    this.isTwelveHourNotation = !!this.format.find(e => e === 'hh');
    this.showDate = this.format.findIndex(e => e === 'day' || e === 'year' || e === 'month') !== -1;
  }

  /**
   * Adapts format for visualization
   */
  private adaptFormat(format: string, value: number) {
    if (format.length === 0 || format.length === 2 || this.canOverwrite) {
      format = `${value}`;
      this.canOverwrite = false;
    } else {
      format = `${format}${value}`;
    }
    return format;
  }

  /**
   * Define when then new pressed value is after zero key
   * @param prop the name of the prop to update
   * @param value the new key pressed
   * @param getValue callback to handle value to set
   */
  private isValueAfterZero(prop: 'day' | 'month', value: number, getValue = (value: number) => value) {
    if (this._zeroPressed[prop]) {
      if (value !== 0) {
        this[prop] = getValue(value);
      }
      this._zeroPressed[prop] = false;
      return true;
    }
    return false;
  }

  /**
   * Increases/decreases date's hour
   * @param decrease Specifies whether to decrease the hour
   * @param event Keyboard event
   */
  private increaseHour(decrease = false, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    let hour = this.hour;
    if (isNoU(hour)) {
      hour = decrease ? (this.isTwelveHourNotation ? 13 : 23) : 1;
    } else {
      hour = decrease ? --hour : ++hour;
    }
    this.hour = hour;
  }

  /**
   * Increases/decreases date's minutes
   * @param decrease Specifies whether to decrease the minutes
   * @param event Keyboard event
   */
  private increaseMinutes(decrease = false, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    let minutes = this.minutes;
    if (isNoU(minutes)) {
      minutes = decrease ? 59 : 1;
    } else {
      minutes = decrease ? --minutes : ++minutes;
    }
    this.minutes = minutes;
  }

  /**
   * Increases/decreases date's seconds
   * @param decrease Specifies whether to decrease the seconds
   * @param event Keyboard event
   */
  private increaseSeconds(decrease = false, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    let seconds = this.seconds;
    if (isNoU(seconds)) {
      seconds = decrease ? 59 : 1;
    } else {
      seconds = decrease ? --seconds : ++seconds;
    }
    this.seconds = seconds;
  }

  /**
   * Creates picker binding
   */
  private bindPicker() {
    if (this.getModelValue()) {
      this._datePicker.selectedDate = {
        day: this.day,
        month: this.month + 1,
        year: this.year
      };
      this._datePicker.setVisibleMonth();
    }
    this._datePicker.onCellKeyDown = this.onPickerKeyDown.bind(this);
    this.focusDayCell();
  }

  /**
   * Fired when a key is pressed
   * when calendar-picker has focus
   * @param e The keyboard event
   */
  private onPickerKeyDown(event: KeyboardEvent, sender: { disabled: boolean }) {
    const key = event.keyCode || event.which;
    const dayCell = event.currentTarget as HTMLTableCellElement;
    const weekRow = dayCell.parentElement as HTMLTableRowElement;
    const picker = weekRow.parentElement as HTMLTableElement;
    const monthRows = picker.rows;
    let nextCell: HTMLTableCellElement;
    let prevent = false;
    switch (key) {
      case KeyCode.ARROW_RIGHT:
        nextCell = this.getNextCell(dayCell, weekRow, monthRows);
        prevent = true;
        break;
      case KeyCode.ARROW_LEFT:
        nextCell = this.getPrevCell(dayCell, weekRow, monthRows);
        prevent = true;
        break;
      case KeyCode.ARROW_DOWN:
        nextCell = this.getNextCell(dayCell, weekRow, monthRows, true);
        prevent = true;
        break;
      case KeyCode.ARROW_UP:
        nextCell = this.getPrevCell(dayCell, weekRow, monthRows, true);
        prevent = true;
        break;
      case KeyCode.PAGE_DOWN:
        this._datePicker.onNextMonth();
        this.focusDayCell();
        prevent = true;
        break;
      case KeyCode.PAGE_UP:
        this._datePicker.onPrevMonth();
        this.focusDayCell();
        prevent = true;
        break;
      case KeyCode.ENTER:
      case KeyCode.SPACE:
        if (!sender.disabled) {
          this._datePicker.onCellClicked(sender);
          this.focusDayCell();
        }
        prevent = true;
        break;
      case KeyCode.ESC:
        this.hidePicker();
        this._inputElement.focus();
        break;
      default:
        break;
    }
    if (prevent) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (nextCell) {
      $(nextCell).focus();
    }
  }

  /**
   * Retrieves next cell
   * @param cell Day Cell
   * @param row Day Row
   * @param rows Month Rows
   * @param nextWeek Specifies if it must jump a week
   */
  private getNextCell(cell: HTMLTableCellElement, row: HTMLTableRowElement, rows: HTMLCollectionOf<HTMLTableRowElement>, nextWeek = false) {
    let nextCell: HTMLTableDataCellElement;
    const cellIndex = cell.cellIndex;
    const rowIndex = row.rowIndex - 1;
    const cells = row.cells;
    if (nextWeek && rows.length - 1 > rowIndex) {
      const nextRow = rows[rowIndex + 1];
      nextCell = nextRow.cells.item(cellIndex);
    } else if (!nextWeek) {
      if (cells.length - 1 > cellIndex) {
        nextCell = cells.item(cellIndex + 1);
      } else if (rows.length - 1 > rowIndex) {
        nextCell = rows[rowIndex + 1].cells[0];
      }
    }
    return nextCell;
  }

  /**
   * Retrieves previous cell
   * @param cell Day Cell
   * @param row Day Row
   * @param rows Month Rows
   * @param nextWeek Specifies if it must jump a week
   */
  private getPrevCell(cell: HTMLTableCellElement, row: HTMLTableRowElement, rows: HTMLCollectionOf<HTMLTableRowElement>, prevWeek = false) {
    let prevCell: HTMLTableDataCellElement;
    const cellIndex = cell.cellIndex;
    const rowIndex = row.rowIndex - 1;
    if (prevWeek && rowIndex > 0) {
      const prevRow = rows[rowIndex - 1];
      if (prevRow) {
        prevCell = prevRow.cells.item(cellIndex);
      }
    } else if (!prevWeek) {
      if (cellIndex > 0) {
        prevCell = row.cells.item(cellIndex - 1);
      } else if (rowIndex > 0) {
        const prevRow = rows[rowIndex - 1];
        if (prevRow) {
          prevCell = prevRow.cells[prevRow.cells.length - 1];
        }
      }
    }
    return prevCell;
  }

  /**
   * Focus selected day cell or
   * first available day cell
   */
  private focusDayCell() {
    yieldFunc(() => {
      let cell: JQuery;
      const selectedDay = this._datePickerElement.find('.selectedday');
      if (selectedDay.length) {
        cell = selectedDay.first();
      } else {
        cell = this._datePickerElement.find('.daycell').first();
      }
      if (cell) {
        cell.focus();
      }
    });
  }

  /**
   * Configures picker
   */
  private async setupPickerOptions() {
    const dayLabels = await this.translateService.get('day-labels').toPromise();
    const monthLabels = await this.translateService.get('month-labels').toPromise();
    const todayBtnTxt = await this.translateService.get('today').toPromise();
    this.pickerOptions = {
      focusInputOnDateSelect: true,
      markCurrentDay: true,
      markCurrentMonth: true,
      disableDateRanges: this.internalOptions.disableDateRanges,
      disableDates: this.internalOptions.disableDates,
      maxYear: this.internalOptions.maxYear,
      minYear: this.internalOptions.minYear
    };
    if (dayLabels) {
      this.pickerOptions.dayLabels = dayLabels;
    }
    if (monthLabels) {
      this.pickerOptions.monthLabels = monthLabels;
    }
    if (todayBtnTxt) {
      this.pickerOptions.todayBtnTxt = todayBtnTxt;
    }
  }

  //#endregion PICKER
}

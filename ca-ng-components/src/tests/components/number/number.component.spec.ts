import { NumberParserService } from './../../../services/number-parser.service';
import { ShIconComponent } from './../../../components/icon/icon.component';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IShNumberOptions, ShNumberComponent } from '../../../components/number/number.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { Observable, Subject } from 'rxjs';
import { KeyCode } from '../../../utilities/key-code.const';
import { ShBaseInputComponent } from '../../../components/base/base-input.component';
import { ShFormControlMode } from '../../../utilities/form-control.utility';

describe('Number component', () => {
  let component: ShNumberComponent<IShNumberOptions>;
  let fixture: ComponentFixture<ShNumberComponent<IShNumberOptions>>;
  let htmlElement: HTMLDivElement;

  const mockedTranslateService = {
    addLangs: () => null,
    setDefaultLang: () => null,
    use: () => new Observable(),
    currentLang: '',
    get: () => new Observable(),
    onLangChange: new Subject(),
    getTranslation: () => new Observable(),
    stream: () => new Observable(),
    reloadLang: () => new Observable(),
    onTranslationChange: new Observable(),
    onDefaultLangChange: new Observable()
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), I18nModule],
      declarations: [ShNumberComponent, ShIconComponent],
      providers: [
        IdSequenceService,
        ValidatorHelper,
        AspectHelper,
        ContextService,
        NumberParserService,
        { provide: TranslateService, useValue: mockedTranslateService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShNumberComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: 1 };
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
    const input = htmlElement.querySelector('input');
    expect(input).not.toBeNull();
  });

  it('constructor should get NumberParserService from injector', () => {
    expect(component['numberParser']).toBeDefined();
    expect(component['numberParser']).not.toBeNull();
    expect(component['numberParser']).toBeInstanceOf(NumberParserService);
  });

  describe('allowNegative', () => {
    it('should return true if min is undefined', () => {
      component['internalOptions'].min = undefined;

      expect(component['allowNegative']).toBeTruthy();
    });
    it('should return true if min is less than 0', () => {
      component['internalOptions'].min = -50;

      expect(component['allowNegative']).toBeTruthy();
    });
    it('should return false if minimum is greater than -1', () => {
      component['internalOptions'].min = 0;

      expect(component['allowNegative']).toBeFalsy();
    });
  });

  describe('maximumFractionDigits', () => {
    it('should return 0 if format has no dot', () => {
      component['internalOptions'].format = '0011';

      expect(component['maximumFractionDigits']).toEqual(0);
    });
    it('should return correct number of digits if format has dot', () => {
      component['internalOptions'].format = '0.012';

      expect(component['maximumFractionDigits']).toEqual(3);
    });
  });

  describe('onKeyDown', () => {
    it('should do nothing if component is not enabled', () => {
      const event = new KeyboardEvent('keydown');
      const prevDefaultSpy = spyOn(event, 'preventDefault');
      component.enable = false;

      component['onKeyDown'](event);

      expect(prevDefaultSpy).not.toHaveBeenCalled();
    });
    it('should do nothing if component is readonly', () => {
      const event = new KeyboardEvent('keydown');
      const prevDefaultSpy = spyOn(event, 'preventDefault');
      component.enable = true;
      component['internalOptions'].isReadonly = true;

      component['onKeyDown'](event);

      expect(prevDefaultSpy).not.toHaveBeenCalled();
    });
    it('should do nothing if keyCode is not arrowUp or arrowDown', () => {
      const event = new KeyboardEvent('keydown');
      const prevDefaultSpy = spyOn(event, 'preventDefault');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.B
      });

      component['onKeyDown'](event);

      expect(prevDefaultSpy).not.toHaveBeenCalled();
    });
    it('should call increase and preventDefault when keycode is arrowUp', () => {
      const event = new KeyboardEvent('keydown');
      const prevDefaultSpy = spyOn(event, 'preventDefault');
      const increaseSpy = spyOn(component as any, 'increase');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_UP
      });

      component['onKeyDown'](event);

      expect(prevDefaultSpy).toHaveBeenCalledTimes(1);
      expect(increaseSpy).toHaveBeenCalledTimes(1);
    });
    it('should call decrease and preventDefault when keycode is arrowDown', () => {
      const event = new KeyboardEvent('keydown');
      const prevDefaultSpy = spyOn(event, 'preventDefault');
      const decreaseSpy = spyOn(component as any, 'decrease');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_DOWN
      });

      component['onKeyDown'](event);

      expect(prevDefaultSpy).toHaveBeenCalledTimes(1);
      expect(decreaseSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('increase should call updateValue with increased value by one step', () => {
    const step = 2;
    const currentValue = 4;
    const updateValueSpy = spyOn(component as any, 'updateValue');
    spyOn(component as any, 'getModelValue').and.returnValue(currentValue);
    component['internalOptions'].step = step;

    component['increase']();

    expect(updateValueSpy).toHaveBeenCalledOnceWith(currentValue + (step * 1));
  });

  it('decrease should call updateValue with decreased value by one step', () => {
    const step = 3;
    const currentValue = 6;
    const updateValueSpy = spyOn(component as any, 'updateValue');
    spyOn(component as any, 'getModelValue').and.returnValue(currentValue);
    component['internalOptions'].step = step;

    component['decrease']();

    expect(updateValueSpy).toHaveBeenCalledOnceWith(currentValue - (step * 1));
  });

  describe('checkLimits', () => {
    it('should return undefined if value is less than minimum', () => {
      component['internalOptions'].min = 10;

      expect(component['checkLimits'](1)).toBeUndefined();
    });
    it('should return undefined if value is greater than maximum', () => {
      component['internalOptions'].max = 50;

      expect(component['checkLimits'](60)).toBeUndefined();
    });
    it('should return given value if it is between minimum and maximum', () => {
      const value = 21;
      component['internalOptions'].min = 20;
      component['internalOptions'].max = 22;

      expect(component['checkLimits'](value)).toEqual(value);
    });
  });

  describe('getEditFormat', () => {
    it('should return 0 if format is 0,0', () => {
      component['internalOptions'].format = '0,0';

      expect(component['getEditFormat']()).toEqual('0');
    });
    it('should remove all commas from format', () => {
      component['internalOptions'].format = '1,2,3,456,7';

      expect(component['getEditFormat']()).toEqual('1234567');
    });
  });

  describe('createFormControl', () => {
    it('should not throw error if super does not create formControl', () => {
      spyOn(ShBaseInputComponent.prototype as any, 'createFormControl').and.callFake(() => component['formControl'] = undefined);

      expect(() => component['createFormControl']()).not.toThrowError();
    });
    it('should set formControl browseFormat to given format', () => {
      const expectedFormat = '00.00';
      component['internalOptions'].format = expectedFormat;

      component['createFormControl']();

      expect(component['formControl'].browseFormat).toEqual(expectedFormat);
    });
    it('should set formControl editFormat to given format', () => {
      const expectedFormat = '00.00';
      spyOn(component as any, 'getEditFormat').and.returnValue(expectedFormat);

      component['createFormControl']();

      expect(component['formControl'].editFormat).toEqual(expectedFormat);
    });
  });

  it('tolerantCheck should call numberParser service tolerantCheck and return its value', () => {
    const expectedValue = false;
    const controlValue = '10';
    const tolerantCheckSpy = spyOn(component['numberParser'], 'tolerantCheck').and.returnValue(expectedValue);
    spyOn(component as any, 'getControlValue').and.returnValue(controlValue);

    expect(component['tolerantCheck']()).toEqual(expectedValue);
    expect(tolerantCheckSpy).toHaveBeenCalledOnceWith(controlValue, true, 0);
  });

  describe('parseControlValue', () => {
    it('should return modelValue if mode is browse', () => {
      const expectedValue = 21;
      Object.defineProperty(component, 'mode', {
        value: ShFormControlMode.Browse
      });
      spyOn(component as any, 'getModelValue').and.returnValue(expectedValue);

      expect(component['parseControlValue']()).toEqual(expectedValue);
    });
    it('should call parseValue and return its result with given value when mode is edit', () => {
      const givenValue = 10;
      const expectedValue = 100;
      const parseValueSpy = spyOn(component as any, 'parseValue').and.returnValue(expectedValue);
      Object.defineProperty(component, 'mode', {
        value: ShFormControlMode.Edit
      });

      expect(component['parseControlValue'](givenValue)).toEqual(expectedValue);
      expect(parseValueSpy).toHaveBeenCalledOnceWith(givenValue);
    });
    it('should call parseValue and return its result with control value when mode is edit', () => {
      const controlValue = 10;
      const expectedValue = 100;
      const parseValueSpy = spyOn(component as any, 'parseValue').and.returnValue(expectedValue);
      const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(controlValue);
      Object.defineProperty(component, 'mode', {
        value: ShFormControlMode.Edit
      });

      expect(component['parseControlValue']()).toEqual(expectedValue);
      expect(parseValueSpy).toHaveBeenCalledOnceWith(controlValue);
      expect(getControlValueSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('formatModelValue', () => {
    it('should return undefined when model value is undefined', () => {
      const getModelValueSpy = spyOn(component as any, 'getModelValue').and.returnValue(undefined);

      expect(component['formatModelValue']()).toEqual(undefined);
      expect(getModelValueSpy).toHaveBeenCalledTimes(1);
    });
    it('should return value formatted with internalOptions format when mode is browse', () => {
      component['internalOptions'].format = '0.0';
      Object.defineProperty(component, 'mode', {
        value: ShFormControlMode.Browse
      });

      expect(component['formatModelValue'](10.15)).toEqual('10.2');
    });
    it('should return value formatted with editFormat when mode is edit', () => {
      const getEditFormatSpy = spyOn(component as any, 'getEditFormat').and.returnValue('0.00');
      Object.defineProperty(component, 'mode', {
        value: ShFormControlMode.Edit
      });

      expect(component['formatModelValue'](11.123)).toEqual('11.12');
      expect(getEditFormatSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('getDefaultOptions should return defaults correctly', () => {
    const opts = component['getDefaultOptions']();
    expect(opts.format).toEqual('0,0');
    expect(opts.step).toEqual(1);
  });

  describe('updateValue', () => {
    it('should call updateModelValue with normalized value when mode is browse', () => {
      const value = 10.13;
      const expectedValue = 10.1;
      const normalizeSpy = spyOn(component as any, 'normalize').and.returnValue(expectedValue);
      const updateModelValueSpy = spyOn(component as any, 'updateModelValue');
      Object.defineProperty(component, 'mode', {
        value: ShFormControlMode.Browse
      });

      component['updateValue'](value);

      expect(normalizeSpy).toHaveBeenCalledOnceWith(value);
      expect(updateModelValueSpy).toHaveBeenCalledOnceWith(expectedValue);
    });
    it('should call updateControlValue with normalized and formatted value when mode is edit', () => {
      const value = 10.13;
      const normalizedValue = 10.1;
      const expectedValue = 10;
      const normalizeSpy = spyOn(component as any, 'normalize').and.returnValue(normalizedValue);
      const formatModelValueSpy = spyOn(component as any, 'formatModelValue').and.returnValue(expectedValue);
      const updateControlValueSpy = spyOn(component as any, 'updateControlValue');
      Object.defineProperty(component, 'mode', {
        value: ShFormControlMode.Edit
      });

      component['updateValue'](value);

      expect(normalizeSpy).toHaveBeenCalledOnceWith(value);
      expect(formatModelValueSpy).toHaveBeenCalledOnceWith(normalizedValue);
      expect(updateControlValueSpy).toHaveBeenCalledOnceWith(expectedValue);
    });
  });

  describe('parseValue', () => {
    it('should return undefined if value does not pass strictCheck', () => {
      const givenValue = '45';
      const strictCheckSpy = spyOn(component['numberParser'], 'strictCheck').and.returnValue(false);

      expect(component['parseValue'](givenValue)).toBeUndefined();
      expect(strictCheckSpy).toHaveBeenCalledOnceWith(givenValue, component['allowNegative'], component['maximumFractionDigits']);
    });
    it('should return modelValue from strictParse and checkLimits', () => {
      const controlValue = '31.51';
      const strictParsed = 31.50;
      const expectedValue = 31.5;
      const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(controlValue);
      const strictParseSpy = spyOn(component['numberParser'], 'strictParse').and.returnValue(strictParsed);
      const checkLimitsSpy = spyOn(component as any, 'checkLimits').and.returnValue(expectedValue);
      spyOn(component['numberParser'], 'strictCheck').and.returnValue(true);

      expect(component['parseValue']('8')).toEqual(expectedValue);
      expect(getControlValueSpy).toHaveBeenCalledTimes(1);
      expect(strictParseSpy).toHaveBeenCalledOnceWith(controlValue, component['allowNegative'], component['maximumFractionDigits']);
      expect(checkLimitsSpy).toHaveBeenCalledOnceWith(strictParsed);
    });
  });

  it('normalize should return value calling normalizeInvalid, normalizeMin and normalizeMax', () => {
    const givenValue = 10.51;
    const normalizedInvalid = 10.51;
    const normalizedMin = 10.40;
    const normalizedMax = 10.45;
    const normalizeInvalidSpy = spyOn(component as any, 'normalizeInvalid').and.returnValue(normalizedInvalid);
    const normalizedMinSpy = spyOn(component as any, 'normalizeMin').and.returnValue(normalizedMin);
    const normalizedMaxSpy = spyOn(component as any, 'normalizeMax').and.returnValue(normalizedMax);

    expect(component['normalize'](givenValue)).toEqual(normalizedMax);
    expect(normalizeInvalidSpy).toHaveBeenCalledOnceWith(givenValue);
    expect(normalizedMinSpy).toHaveBeenCalledOnceWith(normalizedInvalid);
    expect(normalizedMaxSpy).toHaveBeenCalledOnceWith(normalizedMin);
  });

  describe('normalizedInvalid', () => {
    it('should return 0 if value isNaN', () => {
      expect(component['normalizeInvalid'](NaN)).toEqual(0);
    });
    it('should return value if it is a number', () => {
      const value = 129380;
      expect(component['normalizeInvalid'](value)).toEqual(value);
    });
  });

  describe('normalizeMin', () => {
    it('should return minimum value if given value is less than minimum', () => {
      const value = 1;
      const minimum = 10;
      component['internalOptions'].min = minimum;

      expect(component['normalizeMin'](value)).toEqual(minimum);
    });
    it('should return value if given value is greater than minimum', () => {
      const value = 12;
      const minimum = 10;
      component['internalOptions'].min = minimum;

      expect(component['normalizeMin'](value)).toEqual(value);
    });
    it('should return value if minimum is not defined', () => {
      const value = 0;
      component['internalOptions'].min = undefined;

      expect(component['normalizeMin'](value)).toEqual(value);
    });
  });

  describe('normalizeMax', () => {
    it('should return maximum value if given value is greater than maximum', () => {
      const value = 15;
      const maximum = 10;
      component['internalOptions'].max = maximum;

      expect(component['normalizeMax'](value)).toEqual(maximum);
    });
    it('should return value if given value is less than maximum', () => {
      const value = 6;
      const maximum = 10;
      component['internalOptions'].max = maximum;

      expect(component['normalizeMax'](value)).toEqual(value);
    });
    it('should return value if maximum is not defined', () => {
      const value = 0;
      component['internalOptions'].max = undefined;

      expect(component['normalizeMax'](value)).toEqual(value);
    });
  });

});

import { NumberParserService } from '../../../services/number-parser.service';
import { ShIconComponent } from '../../../components/icon/icon.component';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ShPercentComponent } from '../../../components/percent/percent.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { Observable, Subject } from 'rxjs';
import { ShNumberComponent } from '../../../components/number/number.component';
import { ShFormControlMode } from '../../../utilities/form-control.utility';

describe('Percent component', () => {
  let component: ShPercentComponent;
  let fixture: ComponentFixture<ShPercentComponent>;
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
      declarations: [ShPercentComponent, ShIconComponent],
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
    fixture = TestBed.createComponent(ShPercentComponent);
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

  describe('formatModelValue', () => {
    it('should call super formatModelValue with given value', () => {
      const value = 20;
      const mockedValue = '20%';
      const superSpy = spyOn(ShNumberComponent.prototype as any, 'formatModelValue').and.returnValue(mockedValue);
      Object.defineProperty(component, 'mode', {
        value: ShFormControlMode.Browse
      });

      expect(component['formatModelValue'](value)).toEqual(mockedValue);
      expect(superSpy).toHaveBeenCalledOnceWith(value);
    });
    it('should call super formatModelValue with value multiplied by 100 if mode is edit', () => {
      const value = 10;
      const expectedCall = 1000;
      const expectedValue = '1000%';
      const superSpy = spyOn(ShNumberComponent.prototype as any, 'formatModelValue').and.returnValue(expectedValue);
      spyOn(component as any, 'getModelValue').and.returnValue(value);
      Object.defineProperty(component, 'mode', {
        value: ShFormControlMode.Edit
      });

      expect(component['formatModelValue']()).toEqual(expectedValue);
      expect(superSpy).toHaveBeenCalledOnceWith(expectedCall);
    });
  });

  describe('parseControlValue', () => {
    it('should call super parseControlValue with given value and return its result', () => {
      const value = 20;
      const mockedValue = 30;
      const superSpy = spyOn(ShNumberComponent.prototype as any, 'parseControlValue').and.returnValue(mockedValue);
      Object.defineProperty(component, 'mode', {
        value: ShFormControlMode.Browse
      });

      expect(component['parseControlValue'](value)).toEqual(mockedValue);
      expect(superSpy).toHaveBeenCalledOnceWith(value);
    });
    it('should call super parseControlValue with value divided by 100 if mode is edit', () => {
      const value = '1000';
      const parsed = 1000;
      const expectedValue = 10;
      const superSpy = spyOn(ShNumberComponent.prototype as any, 'parseControlValue').and.returnValue(parsed);
      spyOn(component as any, 'getControlValue').and.returnValue(value);
      Object.defineProperty(component, 'mode', {
        value: ShFormControlMode.Edit
      });

      expect(component['parseControlValue']()).toEqual(expectedValue);
      expect(superSpy).toHaveBeenCalledOnceWith(value);
    });
  });

  describe('checkLimits', () => {
    it('should call super checkLimits with standard values and return its result when it is in browse mode', () => {
      const value = 10;
      const min = 0;
      const max = 20;
      const expectedCheck = undefined;
      const superSpy = spyOn(ShNumberComponent.prototype as any, 'checkLimits').and.returnValue(expectedCheck);
      Object.defineProperty(component, 'mode', {
        value: ShFormControlMode.Browse
      });

      expect(component['checkLimits'](value, min, max)).toEqual(expectedCheck);
      expect(superSpy).toHaveBeenCalledOnceWith(value, min, max);
    });
    it('should call super checkLimits with min and max multiplied by 100 and return its result when it is in edit mode', () => {
      const value = 150;
      const min = 10;
      const max = 20;
      const expectedMin = min * 100;
      const expectedMax = max * 100;
      const expectedCheck = value;
      const superSpy = spyOn(ShNumberComponent.prototype as any, 'checkLimits').and.returnValue(expectedCheck);
      component['internalOptions'].min = min;
      component['internalOptions'].max = max;
      Object.defineProperty(component, 'mode', {
        value: ShFormControlMode.Edit
      });

      expect(component['checkLimits'](value)).toEqual(expectedCheck);
      expect(superSpy).toHaveBeenCalledOnceWith(value, expectedMin, expectedMax);
    });
  });

  it('getDefaultOptions should return options correctly', () => {
    const opts = component['getDefaultOptions']();
    expect(opts.format).toEqual('0 %');
    expect(opts.step).toEqual(0.01);
  });

  it('getEditFormat should return super getEditFormat replacing all spaces and %', () => {
    const superFormat = '00 % ';
    const superSpy = spyOn(ShNumberComponent.prototype as any, 'getEditFormat').and.returnValue(superFormat);

    expect(component['getEditFormat']()).toEqual('00');
    expect(superSpy).toHaveBeenCalledTimes(1);
  });

});

import { ShIconComponent } from '../../../components/icon/icon.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { ShMinutesPipe } from '../../../pipes/minutes.pipe';
import { ShHourPipe } from '../../../pipes/hour.pipe';
import { ShYearPipe } from '../../../pipes/year.pipe';
import { ShMonthPipe } from '../../../pipes/month.pipe';
import { ShDayPipe } from '../../../pipes/day.pipe';
import { ShDateTimeComponent } from '../../../components/date-time/date-time.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { NgxMyDatePickerModule, NgxMyDatePickerConfig } from 'ngx-mydatepicker';
import { FormHandlerService } from '../../../services/form-handler.service';
import { ShDateFormat } from '../../../components/date/date.component';
import { Observable, Subject } from 'rxjs';

describe('Date component', () => {
  let component: ShDateTimeComponent;
  let fixture: ComponentFixture<ShDateTimeComponent>;
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
      imports: [FormsModule, ReactiveFormsModule, NgxMyDatePickerModule, I18nModule, TranslateModule.forRoot()],
      declarations: [ShDateTimeComponent, ShDayPipe, ShMonthPipe, ShYearPipe, ShHourPipe, ShMinutesPipe, ShIconComponent],
      providers: [
        IdSequenceService,
        ValidatorHelper,
        AspectHelper,
        ContextService,
        FormHandlerService,
        NgxMyDatePickerConfig,
        { provide: TranslateService, useValue: mockedTranslateService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShDateTimeComponent);
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

  describe('setupFormat', () => {
    it('should set format as internalOptions format', () => {
      const internalFormat: ShDateFormat = ['day', 'month'];
      component['internalOptions'].format = internalFormat;
      component['translateService'].currentLang = 'it';

      component['setupFormat']();

      expect(component['format']).toEqual(internalFormat);
    });
    it('should transform hour to hh if lang is en', () => {
      const internalFormat: ShDateFormat = ['hour'];
      component['internalOptions'].format = internalFormat;
      component['translateService'].currentLang = 'en';

      component['setupFormat']();

      expect(component['format']).toEqual(['hh']);
    });
    it('should transform hour to HH if lang is not en', () => {
      const internalFormat: ShDateFormat = ['hour'];
      component['internalOptions'].format = internalFormat;
      component['translateService'].currentLang = 'it';

      component['setupFormat']();

      expect(component['format']).toEqual(['HH']);
    });
    it('should set format as default italian format if lang is it and internal format is not given', () => {
      component['translateService'].currentLang = 'it';

      component['setupFormat']();

      expect(component['format']).toEqual(['day', 'month', 'year', 'HH', 'minutes', 'seconds']);
    });
    it('should set format as default english format if lang is en and internal format is not given', () => {
      component['translateService'].currentLang = 'en';

      component['setupFormat']();

      expect(component['format']).toEqual(['month', 'day', 'year', 'hh', 'minutes', 'seconds']);
    });
    it('should set format as default global format if lang is neither en or it and internal format is not given', () => {
      component['translateService'].currentLang = 'de';

      component['setupFormat']();

      expect(component['format']).toEqual(['year', 'month', 'day', 'HH', 'minutes', 'seconds']);
    });
  });

});

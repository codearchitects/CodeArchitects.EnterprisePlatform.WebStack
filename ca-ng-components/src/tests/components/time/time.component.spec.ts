import { NgxMyDatePickerConfig, NgxMyDatePickerDirective } from 'ngx-mydatepicker';
import { ShComponentsModule } from './../../../components/components.module';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { FormHandlerService } from '../../../services/form-handler.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { ShTimeComponent } from '../../../components/time/time.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { Observable, Subject } from 'rxjs';

describe('Time component', () => {
  let component: ShTimeComponent;
  let fixture: ComponentFixture<ShTimeComponent>;

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
      imports: [ShComponentsModule, TranslateModule.forRoot(), I18nModule],
      providers: [
        IdSequenceService,
        ValidatorHelper,
        AspectHelper,
        ContextService,
        FormHandlerService,
        NgxMyDatePickerDirective,
        NgxMyDatePickerConfig,
        { provide: TranslateService, useValue: mockedTranslateService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShTimeComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: new Date() };
    component.prop = 'prop';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  it('getDefaultOptions should set default format', () => {
    const options = component['getDefaultOptions']();

    expect(options).toBeDefined();
    expect(options).not.toBeNull();
    expect(options.format).toEqual(['hour', 'minutes']);
  });

});

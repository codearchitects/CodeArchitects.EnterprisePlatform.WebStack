import { I18nModule } from '@ca-webstack/ng-i18n';
import { ShCurrencyComponent } from './../../../components/currency/currency.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShIconComponent, ShNumberComponent } from '../../../components';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormHandlerService, IdSequenceService, NumberParserService } from '../../../services';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { Observable, Subject } from 'rxjs';

describe('Currency component', () => {
  let component: ShCurrencyComponent;
  let fixture: ComponentFixture<ShCurrencyComponent>;
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
      declarations: [ShCurrencyComponent, ShIconComponent, ShNumberComponent],
      providers: [IdSequenceService, FormHandlerService, ValidatorHelper, AspectHelper, ContextService, NumberParserService,
        { provide: TranslateService, useValue: mockedTranslateService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShCurrencyComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: 10 };
    component.prop = 'prop';
    fixture.detectChanges();
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector('div');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
    const input = htmlElement.children[0] as HTMLInputElement;
    expect(input).toBeDefined();
    expect(input).not.toBeNull();
    expect(input instanceof HTMLInputElement).toBeTruthy();
    expect(input.type).toEqual('text');
  });

  it('getDefaultOptions should return options correctly', () => {
    const options = component['getDefaultOptions']();

    expect(options.format).toBeDefined();
    expect(options.format).not.toBeNull();
    expect(options.format).toEqual('0,0.00 $');
  });
  describe('getEditFormat', () => {
    it('should call super getEditFormat', () => {
      const editFormatSpy = spyOn(ShNumberComponent.prototype as any, 'getEditFormat').and.returnValue('');
      editFormatSpy.calls.reset();

      component['getEditFormat']();

      expect(editFormatSpy).toHaveBeenCalledTimes(1);
    });
    it('should remove any $', () => {
      spyOn(ShNumberComponent.prototype as any, 'getEditFormat').and.returnValue('10 $');

      const result = component['getEditFormat']();

      expect(result).toEqual('10');
    });
  });
});

import { RouterTestingModule } from '@angular/router/testing';
import { ShBreadcrumbComponent } from './../../../components/breadcrumb/breadcrumb.component';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ShIconComponent } from './../../../components/icon/icon.component';
import { ShToolbarComponent } from '../../../components/toolbar/toolbar.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IdSequenceService, ShButtonComponent, ShSelectComponent } from '../../..';
import { ShBreadcrumbPipe } from '../../../pipes/breadcrumb.pipe';
import { Subject } from 'rxjs';

describe('Toolbar component', () => {
  let component: ShToolbarComponent;
  let fixture: ComponentFixture<ShToolbarComponent>;
  let htmlElements: HTMLCollection;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), I18nModule, RouterTestingModule],
      declarations: [ShToolbarComponent, ShSelectComponent, ShButtonComponent, ShIconComponent, ShBreadcrumbComponent, ShBreadcrumbPipe],
      providers: [IdSequenceService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShToolbarComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    htmlElements = fixture.debugElement.nativeElement.querySelectorAll('div');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElements).toBeDefined();
    expect(htmlElements).not.toBeNull();
    expect(htmlElements.length).toEqual(2);
    expect(htmlElements[0] instanceof HTMLDivElement).toBeTruthy();
    expect(htmlElements[1] instanceof HTMLDivElement).toBeTruthy();
  });

  it('should initialize properties correctly', () => {
    expect(component.showBackButton).toBeTruthy();
    expect(component.showBreadcrumb).toBeTruthy();
    expect(component.showLangControl).toBeTruthy();
  });

  it('constructor should set translateService', () => {
    expect(component['_translateService']).toBeDefined();
    expect(component['_translateService']).not.toBeNull();
    expect(component['_translateService']).toBeInstanceOf(TranslateService);
  });

  describe('ngOnInit', () => {
    it('should set currentLang, langs and subscribe to onLangChange', () => {
      const prevObservers = component['_translateService'].onLangChange.observers.length;
      const expectedLang = 'gb';
      const expectedLangs = ['gb', 'it', 'de'];
      Object.defineProperty(component['_translateService'], 'currentLang', {
        value: expectedLang
      });
      Object.defineProperty(component['_translateService'], 'langs', {
        value: expectedLangs
      });

      component.ngOnInit();

      expect(component['currentLang']).toEqual(expectedLang);
      expect(component['langs']).toEqual(expectedLangs);
      expect(component['_translateService'].onLangChange.observers.length).toEqual(prevObservers + 1);
    });
    it('onLangChange subscription should set currentLanguage to emit language', () => {
      const newLanguage: any = { lang: 'it' };

      component['_translateService'].onLangChange.next(newLanguage);

      expect(component['currentLang']).toEqual(newLanguage.lang);
    });
  });

  it('onLangChanges should call use and set currentLang', () => {
    const useSpy = spyOn(component['_translateService'], 'use').and.callFake(lang => {
      Object.defineProperty(component['_translateService'], 'currentLang', {
        value: lang
      });
      return new Subject();
    });
    const expectedLang = 'es';

    component['onLangChanges'](expectedLang);

    expect(useSpy).toHaveBeenCalledOnceWith(expectedLang);
    expect(component['currentLang']).toEqual(expectedLang);
  });

});

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ShUserPopover } from '../../../components/user-popover/user-popover.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { ValidatorHelper, AspectHelper, ContextService } from '@ca-webstack/ng-aspects';
import { ShIconComponent, ShSelectComponent } from '../../..';
import { ShPopoverCountrySelect } from '../../../components/user-popover/popover-country-select/popover-country-select.component';
import { ExtendedCountryPipe } from '../../../pipes/extended-country.pipe';
import { ISOCountryPipe } from '../../../pipes/iso-country.pipe';
import { InitialsPipe } from '../../../pipes/initials.pipe';
import { ShCommandsBarComponent } from '../../../components/commands-bar/commands-bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommandDispatcherService } from '@ca-webstack/ng-command-dispatcher';

describe('UserPopover component', () => {
  let component: ShUserPopover;
  let fixture: ComponentFixture<ShUserPopover>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), I18nModule, FormsModule, ReactiveFormsModule],
      declarations: [ShUserPopover, ShPopoverCountrySelect, ISOCountryPipe, ExtendedCountryPipe, ShIconComponent, InitialsPipe, ShSelectComponent, ShCommandsBarComponent],
      providers: [IdSequenceService, ValidatorHelper, AspectHelper, ContextService, CommandDispatcherService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShUserPopover);
    component = fixture.debugElement.componentInstance;
    component.model = { name: 'foo bar', email: 'sample' };
    fixture.detectChanges();
    htmlElement = fixture.debugElement.nativeElement.querySelector('div');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement).toBeInstanceOf(HTMLDivElement);
  });

  it('should initialize values correctly', () => {
    expect(component.isDetailShown).toBeFalsy();
    expect(component.colorPalette).toEqual(['#E12019', '#E77514', '#A8CB4A', '#9FD5EA', '#5A8AC2', '#1D4795']);
  });

  it('constructor should set translate service', () => {
    expect(component['_translateService']).toBeDefined();
    expect(component['_translateService']).not.toBeNull();
    expect(component['_translateService']).toBeInstanceOf(TranslateService);
  });

  describe('ngOnInit', () => {
    it('should set avatarColor calling computeColor through initial pipe', () => {
      const model = { name: 'bar sample', email: 'baz' };
      const initials = 'BS';
      const expectedColor = 'green';
      const initalPipeSpy = spyOn(component['_initialsPipe'], 'transform').and.returnValue(initials);
      const computeColorSpy = spyOn(component as any, 'computeColor').and.returnValue(expectedColor);
      component.avatarColor = undefined;
      component.model = model;

      component.ngOnInit();

      expect(initalPipeSpy).toHaveBeenCalledOnceWith(model.name);
      expect(computeColorSpy).toHaveBeenCalledOnceWith(initials);
      expect(component.avatarColor).toEqual(expectedColor);
    });
    it('should set current language and languages correctly, and subscribe to onLangChange', () => {
      const expectedLang = 'de';
      const previousSubscribers = component['_translateService'].onLangChange.observers.length;
      const langs = ['de', 'en', 'it'];
      component['_translateService'].currentLang = expectedLang;
      component['_translateService'].langs = langs;
      component.currentLang = undefined;
      component.langs = [];

      component.ngOnInit();

      expect(component.currentLang).toEqual(expectedLang);
      expect(component['_translateService'].onLangChange.observers.length).toEqual(previousSubscribers + 1);
      expect(component.langs).toEqual(langs.filter(lang => lang !== expectedLang));
    });
    it('onLangChange subscription should update current lang and list of languages', () => {
      const expectedLang = 'de';
      const langs = ['de', 'en', 'it'];
      component['_translateService'].langs = langs;
      component.currentLang = undefined;
      component.langs = [];

      component['_translateService'].onLangChange.emit({ lang: expectedLang, translations: undefined });

      expect(component.currentLang).toEqual(expectedLang);
      expect(component.langs).toEqual(langs.filter(lang => lang !== expectedLang));
    });
  });

  describe('document mousedown behavior', () => {
    it('should set isDetailShown to false when click is outside user popover detail panel', () => {
      const elementOutsideDetailPanel = document.body.firstChild;
      const event = new MouseEvent('mousedown');
      Object.defineProperty(event, 'target', {
        value: elementOutsideDetailPanel
      });
      component.isDetailShown = true;
      fixture.detectChanges();

      document.body.dispatchEvent(event);

      expect(component.isDetailShown).toBeFalsy();
    });

    it('should do nothing when click is inside user popover detail panel', () => {
      component.isDetailShown = true;
      fixture.detectChanges();
      const elementInsideDetailPanel = fixture.debugElement.nativeElement.querySelector('#user-popover>.detail>div');
      const event = new MouseEvent('mousedown');
      Object.defineProperty(event, 'target', {
        value: elementInsideDetailPanel
      });

      document.body.dispatchEvent(event);

      expect(component.isDetailShown).toBeTruthy();
    });
    it('should do nothing if isDetailShown is already false', () => {
      const elementOutsideDetailPanel = document.body.firstChild;
      component.isDetailShown = false;
      fixture.detectChanges();
      const event = new MouseEvent('mousedown');
      Object.defineProperty(event, 'target', {
        value: elementOutsideDetailPanel
      });

      document.body.dispatchEvent(event);

      expect(component.isDetailShown).toBeFalsy();
    });
    it('should not throw error if isDetailShown is true but panel has not been found', () => {
      const event = new MouseEvent('mousedown');
      component.isDetailShown = true;

      expect(() => document.body.dispatchEvent(event)).not.toThrowError();
    });
  });

  describe('ngOnChanges', () => {
    it('should set avatar color calling computeColor through initial pipe', () => {
      const model = { name: 'bar sample', email: 'baz' };
      const initials = 'BS';
      const expectedColor = 'green';
      const initalPipeSpy = spyOn(component['_initialsPipe'], 'transform').and.returnValue(initials);
      const computeColorSpy = spyOn(component as any, 'computeColor').and.returnValue(expectedColor);
      component.avatarColor = undefined;
      component.model = model;

      component.ngOnChanges({});

      expect(initalPipeSpy).toHaveBeenCalledOnceWith(model.name);
      expect(computeColorSpy).toHaveBeenCalledOnceWith(initials);
      expect(component.avatarColor).toEqual(expectedColor);
    });
    it('should set avatarIconStyle background-color correctly', () => {
      const expectedColor = 'cyan';
      spyOn(component as any, 'computeColor').and.returnValue(expectedColor);
      component.avatarIconStyle = undefined;

      component.ngOnChanges({});

      expect(component.avatarIconStyle['background-color']).toEqual(expectedColor);
    });
    it('should set avatarIconStyle background-image to empty string when showImage is falsy', () => {
      component.showImage = false;

      component.ngOnChanges({});

      expect(component.avatarIconStyle['background-image']).toEqual('');
    });
    it('should set avatarIconStyle background-image to model imageUrl when showImage is truthy', () => {
      const imgUrl = 'http://foo.bar/sample.png';
      component.model.imageUrl = imgUrl;
      component.showImage = true;

      component.ngOnChanges({});

      expect(component.avatarIconStyle['background-image']).toEqual(`url('${imgUrl}')`);
    });
  });

  describe('toggleDetailPanel', () => {
    it('should set isDetailShown to true when it is false', () => {
      component.isDetailShown = false;

      component.toggleDetailPanel();

      expect(component.isDetailShown).toBeTruthy();
    });
    it('should set isDetailShown to false when it is true', () => {
      component.isDetailShown = true;

      component.toggleDetailPanel();

      expect(component.isDetailShown).toBeFalsy();
    });
  });

  describe('computeColor', () => {
    it('should pick color from colorPalette using initials char codes', () => {
      const initials = 'AB';
      const codes = `${initials.charCodeAt(0)}${initials.charCodeAt(1)}`;

      expect(component['computeColor'](initials)).toEqual(component.colorPalette[coerceNumberProperty(codes) % component.colorPalette.length]);
    });
    it('should pick color from colorPalette using initials char codes', () => {
      const initials = 'ZC';
      const codes = `${initials.charCodeAt(0)}${initials.charCodeAt(1)}`;

      expect(component['computeColor'](initials)).toEqual(component.colorPalette[coerceNumberProperty(codes) % component.colorPalette.length]);
    });
    it('should pick color from colorPalette using initials char codes', () => {
      const initials = 'HF';
      const codes = `${initials.charCodeAt(0)}${initials.charCodeAt(1)}`;

      expect(component['computeColor'](initials)).toEqual(component.colorPalette[coerceNumberProperty(codes) % component.colorPalette.length]);
    });
    it('should pick color from colorPalette using initials char codes', () => {
      const initials = 'RA';
      const codes = `${initials.charCodeAt(0)}${initials.charCodeAt(1)}`;

      expect(component['computeColor'](initials)).toEqual(component.colorPalette[coerceNumberProperty(codes) % component.colorPalette.length]);
    });
    it('should pick color from colorPalette using initials char codes', () => {
      const initials = 'BJ';
      const codes = `${initials.charCodeAt(0)}${initials.charCodeAt(1)}`;

      expect(component['computeColor'](initials)).toEqual(component.colorPalette[coerceNumberProperty(codes) % component.colorPalette.length]);
    });
  });

  it('onCompanyChange should emit event', () => {
    const event = new MouseEvent('click');
    const emitSpy = spyOn(component.companyChanged, 'emit');

    component.onCompanyChange(event);

    expect(emitSpy).toHaveBeenCalledOnceWith(event);
  });

  it('onProfileClick should emit event', () => {
    const event = new MouseEvent('click');
    const emitSpy = spyOn(component.profileClicked, 'emit');

    component.onProfileClick(event);

    expect(emitSpy).toHaveBeenCalledOnceWith(event);
  });

  it('onRoleChange should emit new role', () => {
    const expectedRole = 'foo';
    const emitSpy = spyOn(component.roleChanged, 'emit');

    component.onRoleChange(expectedRole);

    expect(emitSpy).toHaveBeenCalledOnceWith(expectedRole);
  });

  it('onImageChange should emit new file', () => {
    const expectedFile = new File([], 'sampleFile');
    const fileList = { item: (index: number) => null };
    spyOn(fileList, 'item').and.callFake(index => index === 0 ? expectedFile : undefined);
    const emitSpy = spyOn(component.imageChanged, 'emit');

    component.onImageChange(fileList as any);

    expect(emitSpy).toHaveBeenCalledOnceWith(expectedFile);
  });

  it('onLangChanges should call service use and set current lang', () => {
    const expectedLang = 'ru';
    const useSpy = spyOn(component['_translateService'], 'use').and.callFake(lang => {
      component['_translateService'].currentLang = lang;
      return null;
    });
    component.currentLang = undefined;

    component.onLangChanges(expectedLang);

    expect(useSpy).toHaveBeenCalledOnceWith(expectedLang);
    expect(component.currentLang).toEqual(expectedLang);
  });

  describe('showFileChooser', () => {
    it('should not throw error if input has not been found', () => {
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'currentTarget', {
        value: htmlElement.firstChild
      });

      expect(() => component.showFileChooser(event)).not.toThrowError();
    });
    it('should dispatch a click event on the file input', () => {
      component.isDetailShown = true;
      component.showImage = true;
      component.canChangeImage = true;
      fixture.detectChanges();
      const imgChangeButton: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector('#user-popover>.detail>div>button');
      const input = imgChangeButton.querySelector('input');
      const dispatchSpy = spyOn(input, 'dispatchEvent');
      const event = new MouseEvent('mousedown');
      Object.defineProperty(event, 'currentTarget', {
        value: imgChangeButton
      });

      component.showFileChooser(event);

      const eventDispatched = dispatchSpy.calls.first().args[0] as MouseEvent;
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(eventDispatched).toBeInstanceOf(MouseEvent);
      expect(eventDispatched.view).toEqual(window);
      expect(eventDispatched.bubbles).toBeFalse();
      expect(eventDispatched.cancelable).toBeFalse();
    });
  });

});

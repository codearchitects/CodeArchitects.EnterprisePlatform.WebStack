import { SH_CHANGE_DETECTOR } from './../../../environments/change-detection-strategy';
import { ShFormControl } from './../../../utilities/form-control.utility';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { ShValidationMessageComponent } from './../../../components/validation-message/validation-message.component';
import { ShButtonComponent } from './../../../components/button/button.component';
import { ShCommandsBarComponent } from './../../../components/commands-bar/commands-bar.component';
import { ShIconComponent } from './../../../components/icon/icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { ShFormComponent } from './../../../components/form/form.component';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ShCardComponent } from '../../../components/card/card.component';
import { FormHandlerService } from '../../../services/form-handler.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorMessagePipe, WarningMessagePipe } from '../../../components/pipes';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { CommandDispatcherService } from '@ca-webstack/ng-command-dispatcher';
import { ComplexTypeList } from '../../../utilities/complex-type.list';
import { ChangeDetectionStrategy } from '@angular/core';
import * as commons from '../../../utilities/common.utility';
import * as $ from 'jquery';
import { BehaviorSubject } from 'rxjs';

describe('Card component', () => {
  let component: ShCardComponent<any>;
  let fixture: ComponentFixture<ShCardComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), I18nModule, FormsModule, ReactiveFormsModule],
      declarations: [ShCardComponent, ShFormComponent, ShIconComponent, ShCommandsBarComponent, ShButtonComponent, ShValidationMessageComponent, ErrorMessagePipe, WarningMessagePipe],
      providers: [IdSequenceService, AspectHelper, ValidatorHelper, ContextService, CommandDispatcherService, ComplexTypeList]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShCardComponent);
    component = fixture.debugElement.componentInstance;
    component.model = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    component['isReady'] = true;
    fixture.detectChanges();
    const html: HTMLElement = fixture.debugElement.nativeElement;
    const htmlElement = html.querySelector('div');
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });

  it('should initialize values properly', () => {
    expect(component.model).toEqual({});
    expect(component.commands).toEqual([]);
    expect(component.hasConfirmButton).toBeTruthy();
    expect(component.hasCancelButton).toBeTruthy();
    expect(component.hasIndentedContent).toBeTruthy();
    expect(component.isScrollable).toBeTruthy();
    expect(component.cancelText).toEqual('cancel');
    expect(component.confirmText).toEqual('confirm');
    expect(component.commandsFamily).toEqual('card');
  });

  describe('constructor', () => {
    it('should set formHandler', () => {
      expect(component['formHandler']).toBeDefined();
      expect(component['formHandler']).not.toBeNull();
      expect(component['formHandler']).toBeInstanceOf(FormHandlerService);
    });
    it('should set changeDetection', () => {
      expect(component['changeDetection']).toBeDefined();
      expect(component['changeDetection']).not.toBeNull();
    });
  });

  describe('ngOnInit', () => {
    it('should set formGroup', () => {
      const model = { myProp: 'value' };
      const fakeGroup: any = { group: 'myGroup' };
      const getGroupSpy = spyOn(component['formHandler'], 'getGroup').and.returnValue(fakeGroup);
      component.model = model;

      component.ngOnInit();

      expect(getGroupSpy).toHaveBeenCalledOnceWith(model);
    });
    it('should not call validityChanges if formGroup is not set', () => {
      spyOn(component['formHandler'], 'getGroup').and.returnValue(null);
      const validityChangesSpy = spyOn(component as any, 'validityChanges');

      component.ngOnInit();

      expect(validityChangesSpy).not.toHaveBeenCalled();
    });
    it('should call validityChanges', () => {
      const expectedValue = true;
      const fakeGroup: any = { valid: expectedValue };
      const validityChangesSpy = spyOn(component as any, 'validityChanges');
      spyOn(component['formHandler'], 'getGroup').and.returnValue(fakeGroup);

      component.ngOnInit();

      expect(validityChangesSpy).toHaveBeenCalledOnceWith(expectedValue);
    });
    it('should subscribe formGroup valueChanges and call valueChanges emit', () => {
      component.valueChanges.subscribe(() => null);
      const emitSpy = spyOn(component.valueChanges, 'emit');
      const expectedValue = { foo: 'baz' };
      component['formGroup']
        .addControl('foo', new ShFormControl());

      component.ngOnInit();

      component['formGroup'].setValue(expectedValue);

      expect(emitSpy).toHaveBeenCalledOnceWith(expectedValue);
    });
    it('should call a yieldFunc', async(() => {
      fixture.whenStable().then(() => {
        const yieldFuncSpy = spyOn(commons, 'yieldFunc');
        spyOn(component as any, 'validityChanges');
        yieldFuncSpy.calls.reset();

        component.ngOnInit();

        // it should have ben called one time only, but when component is gen before this onInit call, validityChanges is being called in which another yieldFunc is triggered
        expect(yieldFuncSpy).toHaveBeenCalledTimes(2);
      });
    }));
    describe('yield function callback', () => {
      it('should set isReady to true', async(() => {
        jasmine.clock().uninstall();
        fixture.whenStable().then(() => {
          jasmine.clock().install();
          component['isReady'] = false;

          component.ngOnInit();
          jasmine.clock().tick(1);

          expect(component['isReady']).toBeTruthy();
          jasmine.clock().uninstall();
        });
      }));
      it('should call markForCheck when detection strategy is OnPush', async(() => {
        jasmine.clock().uninstall();
        fixture.whenStable().then(() => {
          const markForcheckSpy = spyOn(component['changeDetection'], 'markForCheck');
          Object.defineProperty(SH_CHANGE_DETECTOR, 'STRATEGY', {
            value: ChangeDetectionStrategy.OnPush
          });
          jasmine.clock().install();

          component.ngOnInit();
          jasmine.clock().tick(1);

          expect(markForcheckSpy).toHaveBeenCalledTimes(1);
          jasmine.clock().uninstall();
        });
      }));
    });
  });

  describe('ngAfterViewInit', () => {
    let scrollToSpy: jasmine.Spy<any>;
    beforeEach(() => {
      scrollToSpy = spyOn(component, 'scrollTo');
      scrollToSpy.calls.reset();
    });
    it('should do nothing if component is not scrollable', () => {
      component.isScrollable = false;

      component.ngAfterViewInit();

      expect(scrollToSpy).not.toHaveBeenCalled();
    });
    it('should do nothing if scrollElement is not set', () => {
      component.isScrollable = true;
      component.scrollElement = undefined;

      component.ngAfterViewInit();

      expect(scrollToSpy).not.toHaveBeenCalled();
    });
    it('should call scrollTo with scrollElement', () => {
      const fakeScrollElement: any = { myElement: 'foo' };
      component.isScrollable = true;
      component.scrollElement = fakeScrollElement;

      component.ngAfterViewInit();

      expect(scrollToSpy).toHaveBeenCalledOnceWith(fakeScrollElement);
    });
  });

  describe('scrollTo', () => {
    it('should call a yieldFunc', async(() => {
      fixture.whenStable().then(() => {
        const yieldFuncSpy = spyOn(commons, 'yieldFunc');
        yieldFuncSpy.calls.reset();

        component.scrollTo(null);

        expect(yieldFuncSpy).toHaveBeenCalledTimes(1);
      });
    }));
    describe('yield function callback', () => {
      (window as any).$ = $;
      it('should not throw error if element is null or undefined', () => {
        const yieldFuncSpy = spyOn(commons, 'yieldFunc').and.callThrough();
        component.scrollTo(null);

        expect(yieldFuncSpy.calls.mostRecent().args[0]).not.toThrowError();
      });
      it('should call jquery animate to given target when target is an html element', fakeAsync(() => {
        const offsetTop = 25;
        const element = document.createElement('p');
        const mockedJQueryContainer = $('<p></p>');
        const animateSpy = spyOn(mockedJQueryContainer, 'animate');
        const jQueryElement = $(element);
        spyOn(jQueryElement, 'offset').and.returnValue({ top: offsetTop, left: 0 });
        const jQuerySpy = spyOn(window as any, '$').and.callFake((selector) => typeof selector === 'string' ? mockedJQueryContainer : jQueryElement);

        component.scrollTo(element);
        tick();

        expect(jQuerySpy).toHaveBeenCalledTimes(2);
        expect(jQuerySpy).toHaveBeenCalledWith(`#${component['internalOptions'].id}>.card-body`);
        expect(animateSpy).toHaveBeenCalledTimes(1);
        expect(animateSpy).toHaveBeenCalledWith({
          scrollTop: offsetTop
        }, 'slow');
      }));
      it('should call jquery animate to given target when target is a string selector', fakeAsync(() => {
        const offsetTop = 50;
        const element = document.createElement('p');
        const fakeId = 'foo';
        element.id = fakeId;
        const mockedJQueryContainer = $('<p></p>');
        const jQueryElement = $(element);
        spyOn(jQueryElement, 'offset').and.returnValue({ top: offsetTop, left: 0 });
        const jQuerySpy = spyOn(window as any, '$').and.callFake((selector) => selector === fakeId ? jQueryElement : mockedJQueryContainer);
        const animateSpy = spyOn(mockedJQueryContainer, 'animate');

        component.scrollTo(fakeId);
        tick();

        expect(jQuerySpy).toHaveBeenCalledTimes(2);
        expect(jQuerySpy).toHaveBeenCalledWith(`#${component['internalOptions'].id}>.card-body`);
        expect(animateSpy).toHaveBeenCalledTimes(1);
        expect(animateSpy).toHaveBeenCalledWith({
          scrollTop: offsetTop
        }, 'slow');
      }));
      it('should call jquery animate to given target when target is a jquery element', fakeAsync(() => {
        const offsetTop = 50;
        const element = $('<p></p>');
        const mockedJQueryContainer = $('<p></p>');
        const jQuerySpy = spyOn(window as any, '$').and.returnValue(mockedJQueryContainer);
        const animateSpy = spyOn(mockedJQueryContainer, 'animate');
        spyOn(element, 'offset').and.returnValue({ top: offsetTop, left: 0 });

        component.scrollTo(element);
        tick();

        expect(jQuerySpy).toHaveBeenCalledTimes(1);
        expect(jQuerySpy).toHaveBeenCalledWith(`#${component['internalOptions'].id}>.card-body`);
        expect(animateSpy).toHaveBeenCalledTimes(1);
        expect(animateSpy).toHaveBeenCalledWith({
          scrollTop: offsetTop
        }, 'slow');
      }));
    });
  });

  describe('validityChanges', () => {
    it('should call a yieldFunc', async(() => {
      fixture.whenStable().then(() => {
        const yieldFuncSpy = spyOn(commons, 'yieldFunc');
        yieldFuncSpy.calls.reset();

        component['validityChanges'](null);

        expect(yieldFuncSpy).toHaveBeenCalledTimes(1);
      });
    }));
    describe('yield function callback', () => {
      it('should set isValid to given value', async(() => {
        jasmine.clock().uninstall();
        fixture.whenStable().then(() => {
          jasmine.clock().install();
          const expectedValue = true;
          component.isValid = !expectedValue;

          component['validityChanges'](expectedValue);
          jasmine.clock().tick(1);

          expect(component.isValid).toEqual(expectedValue);
          jasmine.clock().uninstall();
        });
      }));
      it('should set isValid$ when undefined correctly', async(() => {
        jasmine.clock().uninstall();
        fixture.whenStable().then(() => {
          jasmine.clock().install();
          const expectedValue = false;
          component.isValid$ = undefined;

          component['validityChanges'](expectedValue);
          jasmine.clock().tick(1);

          expect(component.isValid$).toBeDefined();
          expect(component.isValid$).toBeInstanceOf(BehaviorSubject);
          expect(component.isValid$.value).toEqual(expectedValue);
          jasmine.clock().uninstall();
        });
      }));
      it('should next isValid$ when defined', async(() => {
        jasmine.clock().uninstall();
        fixture.whenStable().then(() => {
          jasmine.clock().install();
          const expectedValue = false;
          component.isValid$ = new BehaviorSubject<boolean>(true);
          const nextSpy = spyOn(component.isValid$, 'next').and.callThrough();

          component['validityChanges'](expectedValue);
          jasmine.clock().tick(1);

          expect(nextSpy).toHaveBeenCalledOnceWith(expectedValue);
          jasmine.clock().uninstall();
        });
      }));
    });
  });

});

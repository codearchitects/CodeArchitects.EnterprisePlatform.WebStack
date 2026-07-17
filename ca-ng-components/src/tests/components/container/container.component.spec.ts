import { RouterTestingModule } from '@angular/router/testing';
import { ShComponentsModule } from './../../../components/components.module';
import { PolicyEngineService, ResourceService } from '@ca-webstack/ng-policy-engine';
import { ShContainerComponent } from './../../../components/container/container.component';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AssetsService, IdSequenceService } from '../../../services';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as utilities from '../../../utilities/common.utility';
import * as $ from 'jquery';

describe('Container component', () => {
  let component: ShContainerComponent;
  let fixture: ComponentFixture<ShContainerComponent>;
  let htmlElement: HTMLDivElement;

  const mockedAssetsService = {
    get: jasmine.createSpy()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ShComponentsModule, RouterTestingModule],
      providers: [
        { provide: AssetsService, useValue: mockedAssetsService },
        PolicyEngineService,
        ResourceService,
        IdSequenceService,
        TranslateService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShContainerComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    htmlElement = fixture.debugElement.nativeElement.querySelector('div');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });
  describe('initialization', () => {
    it('should set showBackButton to true by default', () => {
      expect(component.showBackButton).toBeTruthy();
    });
    it('should set showBreadcrumb to true by default', () => {
      expect(component.showBreadcrumb).toBeTruthy();
    });
    it('should set showSearchbar to true by default', () => {
      expect(component.showSearchbar).toBeTruthy();
    });
    it('should set showLangControl to true by default', () => {
      expect(component.showLangControl).toBeTruthy();
    });
    it('should set isSidebarExpanded to false by default', () => {
      expect(component['isSidebarExpanded']).toBeFalsy();
    });
  });
  describe('scrollTo', () => {
    it('should call yieldFunc', () => {
      const yieldFuncSpy = spyOn(utilities, 'yieldFunc');

      ShContainerComponent.scrollTo(null);

      expect(yieldFuncSpy).toHaveBeenCalledTimes(1);
    });
    describe('yieldFunc callback', () => {
      it('should not throw error if element is null or undefined', () => {
        const yieldFuncSpy = spyOn(utilities, 'yieldFunc').and.callThrough();
        ShContainerComponent.scrollTo(null);

        expect(yieldFuncSpy.calls.mostRecent().args[0]).not.toThrowError();
      });
      it('should call jquery animate to given target when target is an html element', fakeAsync(() => {
        const offsetTop = 25;
        const element = document.createElement('div');
        const mockedJQueryContainer = $('<div></div>');
        const jQuerySpy = spyOn(window as any, '$').and.callFake((selector) => typeof selector === 'string' ? mockedJQueryContainer : $(element));
        const animateSpy = spyOn(mockedJQueryContainer, 'animate');
        Object.defineProperty(element, 'offsetTop', {
          value: offsetTop
        });

        ShContainerComponent.scrollTo(element);
        tick();

        expect(jQuerySpy).toHaveBeenCalledTimes(2);
        expect(jQuerySpy).toHaveBeenCalledWith('#container');
        expect(animateSpy).toHaveBeenCalledTimes(1);
        expect(animateSpy).toHaveBeenCalledWith({
          scrollTop: offsetTop
        }, 'slow');
      }));
      it('should call jquery animate to given target when target is a string selector', fakeAsync(() => {
        const offsetTop = 50;
        const element = document.createElement('div');
        const fakeId = 'foo';
        element.id = fakeId;
        const mockedJQueryContainer = $('<div></div>');
        const jQuerySpy = spyOn(window as any, '$').and.callFake((selector) => selector === fakeId ? $(element) : mockedJQueryContainer);
        const animateSpy = spyOn(mockedJQueryContainer, 'animate');
        Object.defineProperty(element, 'offsetTop', {
          value: offsetTop
        });

        ShContainerComponent.scrollTo(fakeId);
        tick();

        expect(jQuerySpy).toHaveBeenCalledTimes(2);
        expect(jQuerySpy).toHaveBeenCalledWith('#container');
        expect(animateSpy).toHaveBeenCalledTimes(1);
        expect(animateSpy).toHaveBeenCalledWith({
          scrollTop: offsetTop
        }, 'slow');
      }));
      it('should call jquery animate to given target when target is a jquery element', fakeAsync(() => {
        const offsetTop = 50;
        const element = $('<div></div>');
        const mockedJQueryContainer = $('<div></div>');
        const jQuerySpy = spyOn(window as any, '$').and.returnValue(mockedJQueryContainer);
        const animateSpy = spyOn(mockedJQueryContainer, 'animate');
        Object.defineProperty(element[0], 'offsetTop', {
          value: offsetTop
        });

        ShContainerComponent.scrollTo(element);
        tick();

        expect(jQuerySpy).toHaveBeenCalledTimes(1);
        expect(jQuerySpy).toHaveBeenCalledWith('#container');
        expect(animateSpy).toHaveBeenCalledTimes(1);
        expect(animateSpy).toHaveBeenCalledWith({
          scrollTop: offsetTop
        }, 'slow');
      }));
    });
  });
});

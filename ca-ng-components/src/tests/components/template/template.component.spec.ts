import { TranslateModule } from '@ngx-translate/core';
import { ShComponentsModule } from './../../../components/components.module';
import { AspectHelper, ContextService } from '@ca-webstack/ng-aspects';
import { ShTemplateComponent } from '../../../components/template/template.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { TemplateMapperService } from '../../../services/template-mapper.service';
import { ComponentRef, ElementRef, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';

describe('Template component', () => {
  let component: ShTemplateComponent<any, any>;
  let fixture: ComponentFixture<ShTemplateComponent<any, any>>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ShComponentsModule, TranslateModule.forRoot()],
      providers: [ContextService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShTemplateComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: 'value' };
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
  });

  describe('constructor', () => {
    it('should set aspectHelper', () => {
      expect(component['_aspectHelper']).toBeDefined();
      expect(component['_aspectHelper']).not.toBeNull();
      expect(component['_aspectHelper']).toBeInstanceOf(AspectHelper);
    });
    it('should set resolver', () => {
      expect(component['_resolver']).toBeDefined();
      expect(component['_resolver']).not.toBeNull();
    });
    it('should set templateMapper', () => {
      expect(component['_templateMapper']).toBeDefined();
      expect(component['_templateMapper']).not.toBeNull();
      expect(component['_templateMapper']).toBeInstanceOf(TemplateMapperService);
    });
    it('should set contextService', () => {
      expect(component['_contextService']).toBeDefined();
      expect(component['_contextService']).not.toBeNull();
      expect(component['_contextService']).toBeInstanceOf(ContextService);
    });
    it('should set element', () => {
      expect(component['_element']).toBeDefined();
      expect(component['_element']).not.toBeNull();
      expect(component['_element']).toBeInstanceOf(ElementRef);
    });
  });

  it('ngOnChanges should call updateParams and component ngOnChanges if componentRef is set', () => {
    const instanceChangesSpy = jasmine.createSpy();
    const componentRef: any = {
      instance: {
        ngOnChanges: instanceChangesSpy
      }
    };
    const updateParamsSpy = spyOn(component as any, 'updateParams');
    const changes: SimpleChanges = {
      'myChange': new SimpleChange(undefined, null, false)
    };
    component['_componentRef'] = componentRef;

    component.ngOnChanges(changes);

    expect(updateParamsSpy).toHaveBeenCalledTimes(1);
    expect(instanceChangesSpy).toHaveBeenCalledOnceWith(changes);
  });

  describe('ngOnInit', () => {
    it('should call markContainer with right templateName', () => {
      const context: any = { myContext: 'val' };
      const model = { myModelProp: 'value' };
      const prop = 'myModelProp';
      const expectedName = 'fooTemplate';
      const getTemplateSpy = spyOn(component['_aspectHelper'], 'getTemplate').and.returnValue(expectedName);
      const markContainerSpy = spyOn(component as any, 'markContainer');
      component.model = model;
      component.prop = prop;
      Object.defineProperty(component['_contextService'], 'context', {
        value: context
      });

      component.ngOnInit();

      expect(getTemplateSpy).toHaveBeenCalledOnceWith(model, prop, context);
      expect(markContainerSpy).toHaveBeenCalledTimes(1);
    });
    it('should set componentRef correctly', () => {
      const fakeTemplateName = 'sampleTemplate';
      const fakeTemplate: any = { prop: 'value' };
      const fakeFactory: any = { prop1: 'value1' };
      const fakeRef: any = { ref: 'refValue', instance: {} };
      const findTemplateByNameSpy = spyOn(component['_templateMapper'], 'findTemplateByName').and.returnValue(fakeTemplate);
      const resolveComponentFactorySpy = spyOn(component['_resolver'], 'resolveComponentFactory').and.returnValue(fakeFactory);
      const createComponentSpy = spyOn(component['_target'], 'createComponent').and.returnValue(fakeRef);
      spyOn(component['_aspectHelper'], 'getTemplate').and.returnValue(fakeTemplateName);

      component.ngOnInit();

      expect(findTemplateByNameSpy).toHaveBeenCalledOnceWith(fakeTemplateName);
      expect(resolveComponentFactorySpy).toHaveBeenCalledOnceWith(fakeTemplate);
      expect(createComponentSpy).toHaveBeenCalledOnceWith(fakeFactory);
      expect(component['_componentRef']).toEqual(fakeRef);
    });
    it('should call updateParams', () => {
      const updateParamsSpy = spyOn(component as any, 'updateParams');

      component.ngOnInit();

      expect(updateParamsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateParams', () => {
    it('should set instance model', () => {
      const model = { myProp: 'value' };
      const instance = {};
      component.model = model;
      component['_componentRef'] = { instance } as any;

      component['updateParams']();

      expect(component['_componentRef'].instance.model).toEqual(model);
    });
    it('should set instance prop', () => {
      const prop = 'value';
      const instance = {};
      component.prop = prop;
      component['_componentRef'] = { instance } as any;

      component['updateParams']();

      expect(component['_componentRef'].instance.prop).toEqual(prop);
    });
    it('should set instance enable', () => {
      const enable = false;
      const instance = {};
      component.enable = enable;
      component['_componentRef'] = { instance } as any;

      component['updateParams']();

      expect(component['_componentRef'].instance.enable).toEqual(enable);
    });
    it('should set instance show', () => {
      const show = false;
      const instance = {};
      component.show = show;
      component['_componentRef'] = { instance } as any;

      component['updateParams']();

      expect(component['_componentRef'].instance.show).toEqual(show);
    });
    it('should set instance valueChanges', () => {
      const valueChanges = new EventEmitter();
      const instance = {};
      component.valueChanges = valueChanges;
      component['_componentRef'] = { instance } as any;

      component['updateParams']();

      expect(component['_componentRef'].instance.valueChanges).toEqual(valueChanges);
    });
    it('should set instance options', () => {
      const options: any = 'value';
      const instance = {};
      component['internalOptions'] = options;
      component['_componentRef'] = { instance } as any;

      component['updateParams']();

      expect(component['_componentRef'].instance.options).toEqual(options);
    });
  });

  describe('markContainer', () => {
    it('should not throw error if container is not found', () => {
      Object.defineProperty(component['_element'].nativeElement, 'parentElement', {
        value: null
      });

      expect(() => component['markContainer']('')).not.toThrowError();
    });
    it('should not throw error if container has not the attribute', () => {
      Object.defineProperty(component['_element'].nativeElement, 'parentElement', {
        value: { hasAttribute: () => null }
      });

      expect(() => component['markContainer']('')).not.toThrowError();
    });
    it('should call container setAttribute with given templateName', () => {
      const mockedSetAttribute = jasmine.createSpy();
      const templateName = 'sampleTemplate';
      Object.defineProperty(component['_element'].nativeElement, 'parentElement', {
        value: {
          hasAttribute: () => true,
          setAttribute: mockedSetAttribute
        }
      });

      component['markContainer'](templateName);

      expect(mockedSetAttribute).toHaveBeenCalledOnceWith('component', templateName);
    });
  });

});

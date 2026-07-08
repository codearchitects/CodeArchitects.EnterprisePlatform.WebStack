import {
  Component,
  ComponentRef,
  DebugElement,
  ElementRef,
  Injector,
  provideZoneChangeDetection,
  QueryList,
  SimpleChange,
  SimpleChanges,
  Type
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AspectHelper, Context, ContextService } from '@ca-webstack/ng-aspects';
import { IResourceParams, PolicyEngineService, ResourceService } from '@ca-webstack/ng-policy-engine';
import { of, Subject } from 'rxjs';
import { CaepContentChild, CaepContentChildren } from '../../decorators';
import { CaepIdSequenceService } from '../../services';
import { CaepTemplateMapperService } from '../../services/template-mapper.service';
import { CaepBaseInputOptions } from '../base';
import { CaepTemplateComponent } from './template.component';

class FirstDummyClass {
  constructor(public id: string) {}
}

class SecondDummyClass {
  constructor(public id: string) {}
}

class ThirdDummyClass {
  constructor(public id: string) {}
}

@Component({
    template: '',
    standalone: false
})
class DummyComponent {
  @CaepContentChild(FirstDummyClass)
  public firstDummyRef: FirstDummyClass;

  @CaepContentChild(SecondDummyClass)
  public secondDummyRef: SecondDummyClass;

  @CaepContentChild(ThirdDummyClass)
  public thirdDummyRef: ThirdDummyClass = null;

  @CaepContentChildren(FirstDummyClass)
  public firstDummyRefs: QueryList<FirstDummyClass> = new QueryList();

  @CaepContentChildren(SecondDummyClass, { descendants: true })
  public secondDummyRefs: QueryList<SecondDummyClass> = new QueryList();

  @CaepContentChildren(ThirdDummyClass)
  public thirdDummyRefs: QueryList<ThirdDummyClass> = new QueryList();
}

describe('CaepTemplateComponent', () => {
  let fixture: ComponentFixture<CaepTemplateComponent<string, any>>,
    component: CaepTemplateComponent<string, any>,
    element: HTMLElement,
    debugEl: DebugElement,
    mockPolicyEngineService,
    mockResourceService,
    mockIdSequenceService,
    mockAspectHelper,
    mockContextService,
    mockTemplateMapperService;
  const mockUri = 'mockUri',
    mockResource = { uri: mockUri } as IResourceParams,
    mockTemplate = 'mock-text',
    mockContext: Context = Context.edit;

  beforeEach(() => {
    mockPolicyEngineService = jasmine.createSpyObj('mockPolicyEngine', ['observePolicies']);
    mockPolicyEngineService.observePolicies.and.returnValue(of({}));
    mockResourceService = jasmine.createSpyObj('mockResource', ['getResource']);
    mockResourceService.getResource.and.returnValue(mockResource);
    mockIdSequenceService = jasmine.createSpyObj('mockIdSequence', ['next']);
    mockIdSequenceService.next.and.returnValue('id-0');
    mockAspectHelper = jasmine.createSpyObj('mockAspectHelper', ['getTemplate']);
    mockAspectHelper.getTemplate.and.returnValue(mockTemplate);
    mockContextService = jasmine.createSpyObj('mockContext', {}, { context: mockContext });
    mockTemplateMapperService = jasmine.createSpyObj('mockTemplateMapper', ['findTemplateByName']);
    mockTemplateMapperService.findTemplateByName.and.returnValue(DummyComponent);
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CaepTemplateComponent],
      providers: [
        { provide: CaepIdSequenceService, useValue: mockIdSequenceService },
        { provide: PolicyEngineService, useValue: mockPolicyEngineService },
        { provide: ResourceService, useValue: mockResourceService },
        { provide: AspectHelper, useValue: mockAspectHelper },
        { provide: ContextService, useValue: mockContextService },
        { provide: CaepTemplateMapperService, useValue: mockTemplateMapperService },
        provideZoneChangeDetection()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<CaepTemplateComponent<string, any>>(CaepTemplateComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    debugEl = fixture.debugElement;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
    expect(element).toBeDefined();
    expect(element).not.toBeNull();
    expect(debugEl).toBeDefined();
  });

  describe('constructor', () => {
    it('should initialize service references', () => {
      expect(component['_element']).toBeDefined();
      expect(component['_element']).toBeInstanceOf(ElementRef);
      expect(component['_aspectHelper']).toEqual(mockAspectHelper);
      expect(component['_contextService']).toEqual(mockContextService);
      expect(component['_templateMapper']).toEqual(mockTemplateMapperService);
    });

    it('should initialize instance properties', () => {
      const expectedContentNodes = [];
      const expectedFirstChange = true;
      expect(component['_firstChange']).toEqual(expectedFirstChange);
      expect(component['_contentNodes']).toEqual(expectedContentNodes);
    });
  });

  it('giveFocus should call giveFocus method on componentRef instance', () => {
    const mockInstance = jasmine.createSpyObj('mockInstance', ['giveFocus']);
    const mockComponentRef = jasmine.createSpyObj('mockComponentRef', {}, { instance: mockInstance });
    component['_componentRef'] = mockComponentRef;
    component.giveFocus();
    expect(mockInstance.giveFocus).toHaveBeenCalledTimes(1);
  });

  describe('updateTemplate', () => {
    it('should call createTemplate method and set firstChange to false if firstChange is true', () => {
      const mockCreateTemplate = spyOn<any>(component, 'createTemplate');
      const change = new SimpleChange(true, false, false);
      const changes = { enable: change } as SimpleChanges;
      const mockInstance = jasmine.createSpyObj('mockInstance', ['ngOnChanges']);
      const mockComponentRef = jasmine.createSpyObj('mockComponentRef', {}, { instance: mockInstance });
      component['_firstChange'] = true;
      component['_componentRef'] = mockComponentRef;
      expect(component['_firstChange']).toBeTrue();
      component['updateTemplate'](changes);
      expect(mockCreateTemplate).toHaveBeenCalledTimes(1);
      expect(component['_firstChange']).toBeFalse();
    });

    it('should call updateParams method if firstChange is false', () => {
      const mockUpdateParams = spyOn<any>(component, 'updateParams');
      const change = new SimpleChange(true, false, false);
      const changes = { enable: change } as SimpleChanges;
      const mockInstance = jasmine.createSpyObj('mockInstance', ['ngOnChanges']);
      const mockComponentRef = jasmine.createSpyObj('mockComponentRef', {}, { instance: mockInstance });
      component['_firstChange'] = false;
      component['_componentRef'] = mockComponentRef;
      component['updateTemplate'](changes);
      expect(mockUpdateParams).toHaveBeenCalledTimes(1);
    });

    it('should call ngOnChanges method with right parameters on componentRef instance', () => {
      const mockInstance = jasmine.createSpyObj('mockInstance', ['ngOnChanges']);
      const mockComponentRef = jasmine.createSpyObj('mockComponentRef', {}, { instance: mockInstance });
      const change = new SimpleChange(true, false, false);
      const changes = { enable: change } as SimpleChanges;
      spyOn<any>(component, 'createTemplate');
      component['_componentRef'] = mockComponentRef;
      component['updateTemplate'](changes);
      expect(mockInstance.ngOnChanges).toHaveBeenCalledOnceWith(changes);
    });
  });

  it('initializeTemplate should call createTemplate method and set firstChange to false if firstChange is true', () => {
    const mockCreateTemplate = spyOn<any>(component, 'createTemplate');
    component['_firstChange'] = true;
    expect(component['_firstChange']).toBeTrue();
    component['initializeTemplate']();
    expect(mockCreateTemplate).toHaveBeenCalledTimes(1);
    expect(component['_firstChange']).toBeFalse();
  });

  it('initializeTemplate should not call createTemplate method if firstChange is false', () => {
    const mockCreateTemplate = spyOn<any>(component, 'createTemplate');
    component['_firstChange'] = false;
    expect(component['_firstChange']).toBeFalse();
    component['initializeTemplate']();
    expect(mockCreateTemplate).not.toHaveBeenCalled();
    expect(component['_firstChange']).toBeFalse();
  });

  describe('createTemplate', () => {
    it('should set componentRef and contentSelectors correctly', () => {
      const expectedContentSelectors = ['footer'];
      const expectedProjectableNodes = [[jasmine.any(Object)]];
      const prop = 'prop1';
      const model = { [prop]: 'test' };
      const expectedMirror = { ngContentSelectors: expectedContentSelectors };
      const mockComponentMirrorGetter = spyOn<any>(component, 'getComponentMirror').and.returnValue(expectedMirror);
      const mockComponentRef = jasmine.createSpyObj(
        'mockComponentRef',
        {},
        { instance: { afterContentInitCall$: new Subject() } }
      );
      const mockCreateComponent: jasmine.Spy<{
        (componentType: Type<DummyComponent>, options?: {
          index?: number;
          injector?: Injector;
          projectableNodes?: Node[][];
        }): ComponentRef<DummyComponent>}> = spyOn(component['_target'], 'createComponent').and.returnValue(mockComponentRef);
      const mockGetProjectableNodes = spyOn<any>(component, 'getProjectableNodes').and.returnValue(
        expectedProjectableNodes
      );
      spyOn<any>(component, 'markContainer');
      spyOn<any>(component, 'updateParams');
      component.prop = prop;
      component.model = model;
      component['createTemplate']();
      expect(mockAspectHelper.getTemplate).toHaveBeenCalledOnceWith(model, prop, mockContextService.context);
      expect(mockTemplateMapperService.findTemplateByName).toHaveBeenCalledOnceWith(mockTemplate);
      expect(mockComponentMirrorGetter).toHaveBeenCalledOnceWith(DummyComponent);
      expect(mockGetProjectableNodes).toHaveBeenCalledTimes(1);
      expect(mockCreateComponent).toHaveBeenCalledOnceWith(DummyComponent, { index: 0, injector: component['injector'], projectableNodes: expectedProjectableNodes});
      expect(component['_contentSelectors']).toEqual(expectedContentSelectors);
      expect(component['_componentRef']).toEqual(mockComponentRef);
    });

    it('should call markContainer method with right parameters', () => {
      const spyMarkContainer = spyOn<any>(component, 'markContainer');
      const mockComponentRef = jasmine.createSpyObj(
        'mockComponentRef',
        {},
        { instance: { afterContentInitCall$: new Subject() } }
      );
      spyOn(component['_target'], 'createComponent').and.returnValue(mockComponentRef);
      spyOn<any>(component, 'getProjectableNodes').and.returnValue([]);
      spyOn<any>(component, 'updateParams');
      component.prop = 'prop1';
      component.model = { prop1: 'test' };
      component['createTemplate']();
      expect(spyMarkContainer).toHaveBeenCalledOnceWith(mockTemplate);
    });

    it('should call updateParams method', () => {
      const spyUpdateParams = spyOn<any>(component, 'updateParams');
      const mockComponentRef = jasmine.createSpyObj(
        'mockComponentRef',
        {},
        { instance: { afterContentInitCall$: new Subject() } }
      );
      spyOn(component['_target'], 'createComponent').and.returnValue(mockComponentRef);
      spyOn<any>(component, 'getProjectableNodes').and.returnValue([]);
      spyOn<any>(component, 'markContainer');
      component.prop = 'prop1';
      component.model = { prop1: 'test' };
      component['createTemplate']();
      expect(spyUpdateParams).toHaveBeenCalledTimes(1);
    });

    it('should subscribe to afterContentInitCall$ on componentRef instance and call updateContentChildReferences and updateContentChildrenReferences methods when event is emitted', (done: Function) => {
      const mockAfterContentInitCall$ = new Subject<void>();
      const mockUpdateContentChildReferences = spyOn<any>(component, 'updateContentChildReferences');
      const mockUpdateContentChildrenReferences = spyOn<any>(component, 'updateContentChildrenReferences');
      const expectedMirror = { ngContentSelectors: ['footer'] };
      const mockComponentMirrorGetter = spyOn<any>(component, 'getComponentMirror').and.returnValue(expectedMirror);
      const mockComponentRef = jasmine.createSpyObj(
        'mockComponentRef',
        {},
        { instance: { afterContentInitCall$: mockAfterContentInitCall$ } }
      );
      spyOn(component['_target'], 'createComponent').and.returnValue(mockComponentRef);
      spyOn<any>(component, 'getProjectableNodes').and.returnValue([]);
      spyOn<any>(component, 'markContainer');
      spyOn<any>(component, 'updateParams');
      component.prop = 'prop1';
      component.model = { prop1: 'test' };
      expect(mockAfterContentInitCall$.observed).toBeFalse();
      component['createTemplate']();
      expect(mockAfterContentInitCall$.observed).toBeTrue();
      expect(mockUpdateContentChildReferences).not.toHaveBeenCalled();
      expect(mockUpdateContentChildrenReferences).not.toHaveBeenCalled();
      setTimeout(() => {
        mockAfterContentInitCall$.next();
        expect(mockUpdateContentChildReferences).toHaveBeenCalledTimes(1);
        expect(mockUpdateContentChildrenReferences).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should not subscribe to afterContentInitCall$ on componentRef instance if contentSelectors length is 0', () => {
      const mockAfterContentInitCall$ = new Subject<void>();
      const mockUpdateContentChildReferences = spyOn<any>(component, 'updateContentChildReferences');
      const mockUpdateContentChildrenReferences = spyOn<any>(component, 'updateContentChildrenReferences');
      const mockComponentRef = jasmine.createSpyObj(
        'mockComponentRef',
        {},
        { instance: { afterContentInitCall$: mockAfterContentInitCall$ } }
      );
      spyOn(component['_target'], 'createComponent').and.returnValue(mockComponentRef);
      spyOn<any>(component, 'getProjectableNodes').and.returnValue([]);
      spyOn<any>(component, 'markContainer');
      spyOn<any>(component, 'updateParams');
      component.prop = 'prop1';
      component.model = { prop1: 'test' };
      expect(mockAfterContentInitCall$.observed).toBeFalse();
      component['createTemplate']();
      expect(mockAfterContentInitCall$.observed).toBeFalse();
      expect(mockUpdateContentChildReferences).not.toHaveBeenCalled();
      expect(mockUpdateContentChildrenReferences).not.toHaveBeenCalled();
    });
  });

  describe('updateContentNodes', () => {
    it('should not call createEmbeddedView method on template ref if contentSelectors length is 0', () => {
      const mockTemplateRef = jasmine.createSpyObj('mockTemplateRef', ['createEmbeddedView']);
      component['_content'] = mockTemplateRef;
      component['_contentSelectors'] = [];
      component['updateContentNodes']();
      expect(mockTemplateRef.createEmbeddedView).not.toHaveBeenCalled();
    });

    it("should not call updateContentChildReferences and updateContentChildrenReferences methods if embedded view's nodes are equal to contentNodes", () => {
      const nodes = [jasmine.any(Object)];
      const mockEmbeddedView = { rootNodes: nodes };
      const mockTemplateRef = jasmine.createSpyObj('mockTemplateRef', ['createEmbeddedView']);
      mockTemplateRef.createEmbeddedView.and.returnValue(mockEmbeddedView);
      const mockUpdateContentChildReferences = spyOn<any>(component, 'updateContentChildReferences');
      const mockUpdateContentChildrenReferences = spyOn<any>(component, 'updateContentChildrenReferences');
      component['_content'] = mockTemplateRef;
      component['_contentSelectors'] = ['footer'];
      component['_contentNodes'] = nodes;
      component['updateContentNodes']();
      expect(mockTemplateRef.createEmbeddedView).toHaveBeenCalledOnceWith(null);
      expect(mockUpdateContentChildReferences).not.toHaveBeenCalled();
      expect(mockUpdateContentChildrenReferences).not.toHaveBeenCalled();
    });

    it("should set contentNodes and call updateContentChildReferences and updateContentChildrenReferences methods if embedded view's nodes are different from contentNodes", () => {
      const nodes = [{ prop1: 'test' }];
      const mockEmbeddedView = { rootNodes: [] };
      const mockTemplateRef = jasmine.createSpyObj('mockTemplateRef', ['createEmbeddedView']);
      mockTemplateRef.createEmbeddedView.and.returnValue(mockEmbeddedView);
      const mockUpdateContentChildReferences = spyOn<any>(component, 'updateContentChildReferences');
      const mockUpdateContentChildrenReferences = spyOn<any>(component, 'updateContentChildrenReferences');
      component['_content'] = mockTemplateRef;
      component['_contentSelectors'] = ['footer'];
      component['_contentNodes'] = nodes;
      component['updateContentNodes']();
      expect(mockTemplateRef.createEmbeddedView).toHaveBeenCalledOnceWith(null);
      expect(component['_contentNodes']).toEqual([]);
      expect(mockUpdateContentChildReferences).toHaveBeenCalledTimes(1);
      expect(mockUpdateContentChildrenReferences).toHaveBeenCalledTimes(1);
      mockEmbeddedView.rootNodes = [{ prop2: 'test' }];
      component['_contentNodes'] = nodes;
      component['updateContentNodes']();
      expect(component['_contentNodes']).toEqual(mockEmbeddedView.rootNodes);
      expect(mockUpdateContentChildReferences).toHaveBeenCalledTimes(2);
      expect(mockUpdateContentChildrenReferences).toHaveBeenCalledTimes(2);
      expect(mockUpdateContentChildrenReferences).toHaveBeenCalledWith(true);
    });
  });

  describe('updateParams', () => {
    it('should set componentRef model property', () => {
      const model = { prop1: 'test' };
      component.model = model;
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.model).toEqual(model);
    });

    it('should set componentRef prop property', () => {
      const prop = 'prop1';
      component.prop = prop;
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.prop).toEqual(prop);
    });

    it('should set componentRef enable property', () => {
      const enable = false;
      component.enable = enable;
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.enable).toEqual(enable);
    });

    it('should set componentRef show property', () => {
      const show = false;
      component.show = show;
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.show).toEqual(show);
    });

    it('should set componentRef hostOptions property', () => {
      const inputOptions = {
        maxLength: '30',
        placeholder: 'Sample placeholder',
        inputClass: ['my-class1', 'myclass2']
      };
      const expectedHostOptions = {
        __maxLength: 30,
        __placeholder: 'Sample placeholder',
        __inputClass: 'my-class1 myclass2'
      };
      const options = new CaepBaseInputOptions(inputOptions);
      component.options = options;
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.hostOptions).toEqual(expectedHostOptions);
    });

    it('should set componentRef id property', () => {
      const id = 'id-1';
      component.id = id;
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.id).toEqual(id);
    });

    it('should set componentRef tabindex property', () => {
      const tabindex = 0;
      component.tabindex = tabindex;
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.tabindex).toEqual(tabindex);
    });

    it('should set componentRef autofocus property', () => {
      const autofocus = true;
      component.autofocus = autofocus;
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.autofocus).toEqual(autofocus);
    });

    it('should set componentRef label property', () => {
      const label = 'test';
      component.label = label;
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.label).toEqual(label);
    });

    it('should set componentRef width property', () => {
      const width = '250px';
      component.width = width;
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.width).toEqual(width);
    });

    it('should set componentRef height property', () => {
      const height = '250px';
      component.height = height;
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.height).toEqual(height);
    });

    it('should set componentRef containerClass property', () => {
      const containerClass = 'myclass1 myclass2';
      component.containerClass = containerClass;
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.containerClass).toEqual(containerClass);
    });

    it('should set componentRef tooltip property', () => {
      const tooltip = 'test-tooltip';
      component.tooltip = tooltip;
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.tooltip).toEqual(tooltip);
    });

    it('should set componentRef resource property', () => {
      const resource = 'test-resource';
      component.resource = resource;
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.resource).toEqual(resource);
    });

    it('should set componentRef selectors property', () => {
      const selectors = ['enable'];
      component.selectors = selectors;
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.selectors).toEqual(selectors);
    });

    it('should set componentRef valueChanges property', () => {
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.valueChanges).toBe(component.valueChanges);
    });

    it('should set componentRef canValueChange property', () => {
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.canValueChange).toBe(component.canValueChange);
    });

    it('should set componentRef keypressed property', () => {
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.keypressed).toBe(component.keypressed);
    });

    it('should set componentRef keydowned property', () => {
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.keydowned).toBe(component.keydowned);
    });

    it('should set componentRef keyupped property', () => {
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.keyupped).toBe(component.keyupped);
    });

    it('should set componentRef clicked property', () => {
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.clicked).toBe(component.clicked);
    });

    it('should set componentRef dblclicked property', () => {
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.dblclicked).toBe(component.dblclicked);
    });

    it('should set componentRef focused property', () => {
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.focused).toBe(component.focused);
    });

    it('should set componentRef blurred property', () => {
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.blurred).toBe(component.blurred);
    });

    it('should set componentRef mousemoved property', () => {
      component['_componentRef'] = { instance: {} } as any;
      component['updateParams']();
      expect(component['_componentRef'].instance.mousemoved).toBe(component.mousemoved);
    });
  });

  describe('markContainer', () => {
    it('should not throw error if parent element is not defined', () => {
      const mockElementRef = jasmine.createSpyObj('mockElementRef', {}, { nativeElement: {} });
      component['_element'] = mockElementRef;
      expect(() => component['markContainer'](mockTemplate)).not.toThrowError();
    });

    it("should not call setAttribute method on container element if it has not 'component' attribute", () => {
      const mockSetAttribute = spyOn(component['_element'].nativeElement.parentElement, 'setAttribute');
      const mockHasAttribute = spyOn(component['_element'].nativeElement.parentElement, 'hasAttribute').and.returnValue(
        false
      );
      component['markContainer'](mockTemplate);
      expect(mockHasAttribute).toHaveBeenCalledOnceWith('component');
      expect(mockSetAttribute).not.toHaveBeenCalled();
    });

    it("should call setAttribute method on container element with the given template name if it has 'component' attribute", () => {
      const mockSetAttribute = spyOn(component['_element'].nativeElement.parentElement, 'setAttribute');
      spyOn(component['_element'].nativeElement.parentElement, 'hasAttribute').and.returnValue(true);
      component['markContainer'](mockTemplate);
      expect(mockSetAttribute).toHaveBeenCalledOnceWith('component', mockTemplate);
    });
  });

  describe('getProjectableNodes', () => {
    it('should return an empty array if contentSelectors length is 0', () => {
      component['_contentSelectors'] = [];
      const actualProjectableNodes = component['getProjectableNodes']();
      expect(actualProjectableNodes).toEqual([]);
    });

    it('should return correct projectableNodes setting contentNodes property when there is not the default slot', () => {
      const node1 = document.createElement('div');
      const node2 = document.createElement('p');
      spyOn(node1, 'matches').and.returnValue(false);
      spyOn(node2, 'matches').and.returnValue(true);
      const nodes = [node1, node2, jasmine.any(Object)];
      const mockEmbeddedView = { rootNodes: nodes };
      const mockTemplateRef = jasmine.createSpyObj('mockTemplateRef', ['createEmbeddedView']);
      mockTemplateRef.createEmbeddedView.and.returnValue(mockEmbeddedView);
      const expectedProjectableNodes = [[node2]];
      component['_contentSelectors'] = ['footer'];
      component['_content'] = mockTemplateRef;
      const actualProjectableNodes = component['getProjectableNodes']();
      expect(mockTemplateRef.createEmbeddedView).toHaveBeenCalledOnceWith(null);
      expect(actualProjectableNodes.length).toEqual(expectedProjectableNodes.length);
      expect(actualProjectableNodes).toEqual(expectedProjectableNodes);
      expect(component['_contentNodes']).toEqual(nodes);
    });

    it('should return correct projectableNodes setting contentNodes property when there is the default slot', () => {
      const node1 = document.createElement('div');
      const node2 = document.createElement('p');
      const nodes = [node1, node2, jasmine.any(Object)];
      const mockEmbeddedView = { rootNodes: nodes };
      const mockTemplateRef = jasmine.createSpyObj('mockTemplateRef', ['createEmbeddedView']);
      mockTemplateRef.createEmbeddedView.and.returnValue(mockEmbeddedView);
      const expectedProjectableNodes = [[node1, node2, jasmine.any(Object)]];
      component['_contentSelectors'] = ['*'];
      component['_content'] = mockTemplateRef;
      const actualProjectableNodes = component['getProjectableNodes']();
      expect(mockTemplateRef.createEmbeddedView).toHaveBeenCalledOnceWith(null);
      expect(actualProjectableNodes.length).toEqual(expectedProjectableNodes.length);
      expect(actualProjectableNodes).toEqual(expectedProjectableNodes);
      expect(component['_contentNodes']).toEqual(nodes);
    });
  });

  describe('updateContentChildReferences', () => {
    it('should not throw error if content child metadata are not defined', () => {
      const mockComponentRef = { instance: new FirstDummyClass('first-1') };
      component['_componentRef'] = mockComponentRef as any;
      expect(() => component['updateContentChildReferences']()).not.toThrowError();
    });

    it("should set properties marked with CaepContentChild correctly calling getComponentFromDescendants method if root node has not 'component' property", () => {
      const mockComponentRef = { instance: new DummyComponent() };
      const firstDummyInstance1 = new FirstDummyClass('first-1'),
        firstDummyInstance2 = new FirstDummyClass('first-2');
      const secondDummyInstance1 = new SecondDummyClass('second-1'),
        secondDummyInstance2 = new SecondDummyClass('second-2');
      const node1 = document.createElement('div'),
        node2 = document.createElement('div'),
        node3 = document.createElement('p'),
        node4 = document.createElement('p');
      (node1 as any).component = firstDummyInstance1;
      (node3 as any).component = firstDummyInstance2;
      (node4 as any).component = secondDummyInstance2;
      const nodes = [node1, node2, node3, jasmine.any(Object), node4];
      const mockGetComponentFromDescendants = spyOn<any>(component, 'getComponentFromDescendants').and.returnValue(
        secondDummyInstance1
      );
      component['_componentRef'] = mockComponentRef as any;
      component['_contentNodes'] = nodes;
      component['updateContentChildReferences']();
      expect(mockComponentRef.instance.firstDummyRef).toBe(firstDummyInstance1);
      expect(mockComponentRef.instance.secondDummyRef).toBe(secondDummyInstance1);
      expect(mockComponentRef.instance.thirdDummyRef).toBeUndefined();
      expect(mockGetComponentFromDescendants).toHaveBeenCalledTimes(2);
      expect(mockGetComponentFromDescendants).toHaveBeenCalledWith(node2);
    });
  });

  describe('updateContentChildrenReferences', () => {
    it('should not throw error if content children metadata are not defined', () => {
      const mockComponentRef = { instance: new FirstDummyClass('first-1') };
      component['_componentRef'] = mockComponentRef as any;
      expect(() => component['updateContentChildrenReferences']()).not.toThrowError();
    });

    it("should set properties marked with CaepContentChildren correctly calling getComponentFromDescendants method if root nodes have not 'component' property and descendant option metadata is true", () => {
      const mockComponentRef = { instance: new DummyComponent() };
      const expectedThirdDummyRefsLength = mockComponentRef.instance.thirdDummyRefs.length;
      const firstDummyInstance1 = new FirstDummyClass('first-1'),
        firstDummyInstance2 = new FirstDummyClass('first-2');
      const secondDummyInstance1 = new SecondDummyClass('second-1'),
        secondDummyInstance2 = new SecondDummyClass('second-2');
      const node1 = document.createElement('div'),
        node2 = document.createElement('div'),
        node3 = document.createElement('p'),
        node4 = document.createElement('p');
      (node1 as any).component = firstDummyInstance1;
      (node3 as any).component = firstDummyInstance2;
      (node4 as any).component = secondDummyInstance2;
      const nodes = [node1, node2, node3, jasmine.any(Object), node4];
      const mockGetComponentFromDescendants = spyOn<any>(component, 'getComponentFromDescendants').and.returnValue(
        secondDummyInstance1
      );
      component['_componentRef'] = mockComponentRef as any;
      component['_contentNodes'] = nodes;
      component['updateContentChildrenReferences']();
      expect(mockComponentRef.instance.firstDummyRefs.toArray()).toEqual([firstDummyInstance1, firstDummyInstance2]);
      expect(mockComponentRef.instance.secondDummyRefs.toArray()).toEqual([secondDummyInstance1, secondDummyInstance2]);
      expect(mockComponentRef.instance.thirdDummyRefs.length).toEqual(expectedThirdDummyRefsLength);
      expect(mockComponentRef.instance.thirdDummyRefs.length).toEqual(0);
      expect(mockGetComponentFromDescendants).toHaveBeenCalledTimes(1);
      expect(mockGetComponentFromDescendants).toHaveBeenCalledWith(node2);
    });

    it("should set properties marked with CaepContentChildren correctly if root nodes have not 'component' property and descendant option metadata is false", () => {
      const mockComponentRef = { instance: new DummyComponent() };
      const expectedThirdDummyRefsLength = mockComponentRef.instance.thirdDummyRefs.length;
      const firstDummyInstance1 = new FirstDummyClass('first-1'),
        firstDummyInstance2 = new FirstDummyClass('first-2');
      const secondDummyInstance1 = new SecondDummyClass('second-1'),
        secondDummyInstance2 = new SecondDummyClass('second-2');
      const node1 = document.createElement('div'),
        node2 = document.createElement('div'),
        node3 = document.createElement('p'),
        node4 = document.createElement('p');
      (node2 as any).component = secondDummyInstance1;
      (node3 as any).component = firstDummyInstance2;
      (node4 as any).component = secondDummyInstance2;
      const nodes = [node1, node2, node3, jasmine.any(Object), node4];
      const mockGetComponentFromDescendants = spyOn<any>(component, 'getComponentFromDescendants').and.returnValue(
        firstDummyInstance1
      );
      component['_componentRef'] = mockComponentRef as any;
      component['_contentNodes'] = nodes;
      component['updateContentChildrenReferences']();
      expect(mockComponentRef.instance.firstDummyRefs.toArray()).toEqual([firstDummyInstance2]);
      expect(mockComponentRef.instance.secondDummyRefs.toArray()).toEqual([secondDummyInstance1, secondDummyInstance2]);
      expect(mockComponentRef.instance.thirdDummyRefs.length).toEqual(expectedThirdDummyRefsLength);
      expect(mockComponentRef.instance.thirdDummyRefs.length).toEqual(0);
      expect(mockGetComponentFromDescendants).toHaveBeenCalledTimes(1);
      expect(mockGetComponentFromDescendants).toHaveBeenCalledWith(node1);
    });

    it('should call notifyOnChanges on query lists while setting properties marked with CaepContentChildren', () => {
      const mockComponentRef = { instance: new DummyComponent() };
      const mockFirstDummyRefsNotifyOnChanges = spyOn(mockComponentRef.instance.firstDummyRefs, 'notifyOnChanges');
      const mockSecondDummyRefsNotifyOnChanges = spyOn(mockComponentRef.instance.secondDummyRefs, 'notifyOnChanges');
      const mockThirdDummyRefsNotifyOnChanges = spyOn(mockComponentRef.instance.thirdDummyRefs, 'notifyOnChanges');
      const firstDummyInstance1 = new FirstDummyClass('first-1'),
        firstDummyInstance2 = new FirstDummyClass('first-2');
      const secondDummyInstance1 = new SecondDummyClass('second-1'),
        secondDummyInstance2 = new SecondDummyClass('second-2');
      const node1 = document.createElement('div'),
        node2 = document.createElement('div'),
        node3 = document.createElement('p'),
        node4 = document.createElement('p');
      (node1 as any).component = firstDummyInstance1;
      (node2 as any).component = secondDummyInstance1;
      (node3 as any).component = firstDummyInstance2;
      (node4 as any).component = secondDummyInstance2;
      const nodes = [node1, node2, node3, node4];
      component['_componentRef'] = mockComponentRef as any;
      component['_contentNodes'] = nodes;
      component['updateContentChildrenReferences'](true);
      expect(mockFirstDummyRefsNotifyOnChanges).toHaveBeenCalledTimes(1);
      expect(mockSecondDummyRefsNotifyOnChanges).toHaveBeenCalledTimes(1);
      expect(mockThirdDummyRefsNotifyOnChanges).toHaveBeenCalledTimes(1);
      expect(mockComponentRef.instance.firstDummyRefs.toArray()).toEqual([firstDummyInstance1, firstDummyInstance2]);
      expect(mockComponentRef.instance.secondDummyRefs.toArray()).toEqual([secondDummyInstance1, secondDummyInstance2]);
      expect(mockComponentRef.instance.thirdDummyRefs.length).toEqual(0);
    });
  });

  it('getComponentFromDescendants should return undefined if passed element has not children', () => {
    const element = document.createElement('div');
    const actualComponent = component['getComponentFromDescendants'](element);
    expect(actualComponent).toBeUndefined();
  });

  it('getComponentFromDescendants should return undefined if component property is not defined on passed element and its children', () => {
    const element = document.createElement('div');
    const nested1 = element.appendChild(document.createElement('p'));
    const actualComponent = component['getComponentFromDescendants'](element);
    expect(actualComponent).toBeUndefined();
  });

  it('getComponentFromDescendants should return component instance searching from children of passed element', () => {
    const element = document.createElement('div');
    const nested1 = element.appendChild(document.createElement('p'));
    const firstDummyInstance = new FirstDummyClass('first-1');
    (nested1 as any).component = firstDummyInstance;
    const actualComponent = component['getComponentFromDescendants'](element);
    expect(actualComponent).toBe(firstDummyInstance);
  });

  it('getComponentFromDescendants should return component instance searching recursively from children of passed element', () => {
    const element = document.createElement('div');
    const nested1 = element.appendChild(document.createElement('div'));
    nested1.appendChild(document.createElement('p'));
    const nested2 = element.appendChild(document.createElement('div'));
    const nested3 = nested2.appendChild(document.createElement('p'));
    const firstDummyInstance = new FirstDummyClass('first-1');
    (nested3 as any).component = firstDummyInstance;
    const actualComponent = component['getComponentFromDescendants'](element);
    expect(actualComponent).toBe(firstDummyInstance);
  });
});

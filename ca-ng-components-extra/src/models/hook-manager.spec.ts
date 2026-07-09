import { Component, Directive, ElementRef, Input, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaepHook, CaepHookType } from '../decorators';
import { ICaepHookHandler } from './hook-handler.interface';
import { CaepHookManager } from './hook-manager';
import { CaepSimpleOptionsChange } from './options-changes.interface';

class DummyService {
  constructor() {}

  observeDummy() {}
}

@Directive()
class DummyComponent {
  @Input() public prop: string;
  @ViewChild('controlRef') public controlRef: ElementRef;
  private _id: number;
  private _counter = 0;

  constructor(public dummyService: DummyService) {}

  @CaepHook({ type: CaepHookType.Init, priority: 1 })
  private initializationMethod() {
    this._id = 0;
  }

  @CaepHook({ type: CaepHookType.Init, priority: -1 })
  @CaepHook({ type: CaepHookType.Change })
  public startCounter(changes: SimpleChanges) {
    this._counter++;
  }

  @CaepHook({ type: CaepHookType.Init, priority: 0 })
  private maxPriorityMethod() {}

  @CaepHook({ type: CaepHookType.AfterViewInit })
  public giveFocus() {
    const element = this.controlRef?.nativeElement as HTMLElement;
    element?.focus();
  }

  @CaepHook({ type: CaepHookType.Init, priority: 2 })
  protected overriddenMethodWithoutDecorator() {}

  @CaepHook({ type: CaepHookType.Change })
  protected overriddenMethodWithDifferentDecorator(changes: SimpleChanges) {}

  protected overriddenMethod(changes: SimpleChanges) {}
}

@Component({
    template: '<input #controlRef type="text" autofocus="true" autocomplete="off" id="dummy" placeholder="Input" title="Tooltip example!"/>',
    standalone: false
})
class DummyChildComponent extends DummyComponent {
  constructor(public dummyService: DummyService) {
    super(dummyService);
  }

  @CaepHook({ type: CaepHookType.Change, priority: 2 })
  protected overriddenMethod(changes: SimpleChanges) {
    super.overriddenMethod(changes);
    this.dummyService.observeDummy();
  }

  @CaepHook({ type: CaepHookType.AfterViewInit, runBeforeSuper: true })
  public setupBeforeSuper() {
    const element = this.controlRef?.nativeElement as HTMLElement;
    if (element) element.title = 'Tooltip!';
  }

  @CaepHook({ type: CaepHookType.AfterViewInit, priority: 1, runBeforeSuper: true })
  public testBeforeSuper() {}

  @CaepHook({ type: CaepHookType.Init, priority: 0, runBeforeSuper: true })
  public initBeforeSuper() {}

  @CaepHook({ type: CaepHookType.Init })
  protected overriddenMethodWithDifferentDecorator(changes: SimpleChanges) {
    this.dummyService.observeDummy();
  }

  @CaepHook({ type: CaepHookType.Init, priority: 2 })
  private localMethod() {}

  @CaepHook({ type: CaepHookType.Init, priority: 2 })
  private localMethod2() {}

  protected overriddenMethodWithoutDecorator() {
    super.overriddenMethodWithoutDecorator();
    this.dummyService.observeDummy();
  }

  @CaepHook({ type: CaepHookType.Change })
  private localMethod3(changes: SimpleChanges) {}

  @CaepHook({ type: CaepHookType.Change })
  private localMethod4(changes: SimpleChanges) {}

  @CaepHook({ type: CaepHookType.Change, priority: 0, runBeforeSuper: true })
  public changeBeforeSuper(changes: SimpleChanges) {}
}

describe('Hook Manager', () => {
  let fixture: ComponentFixture<DummyChildComponent>,
    component: DummyChildComponent,
    hookManager: CaepHookManager,
    mockService;

  beforeEach(() => {
    mockService = jasmine.createSpyObj('MockService', ['observeDummy']);
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [DummyChildComponent],
      providers: [{ provide: DummyService, useValue: mockService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyChildComponent);
    component = fixture.componentInstance;
    hookManager = new CaepHookManager(component);
  });

  it('should create manager instance', () => {
    expect(hookManager).toBeDefined();
    expect(hookManager).toBeInstanceOf(CaepHookManager);
    expect(hookManager['_component']).toBe(component);
  });

  it('initialize should call runHookHandlers method with right parameters', () => {
    const spyRunHookHandlers = spyOn<any>(hookManager, 'runHookHandlers');
    hookManager.initialize();
    expect(spyRunHookHandlers).toHaveBeenCalledOnceWith(CaepHookType.Init, undefined);
  });

  it('change should call runHookHandlers method with right parameters and save hook handlers', () => {
    const expectedHandlers = [] as Array<ICaepHookHandler[]>;
    const spyRunHookHandlers = spyOn<any>(hookManager, 'runHookHandlers');
    spyRunHookHandlers.and.returnValue(expectedHandlers);
    const change = new SimpleChange('', 'test', false);
    const changes = { prop: change } as SimpleChanges;
    hookManager.change(changes);
    expect(spyRunHookHandlers).toHaveBeenCalledWith(CaepHookType.Change, undefined, changes);
    expect(hookManager['_onChangeHandlersGroups']).toEqual(expectedHandlers);
    hookManager.change(changes);
    expect(spyRunHookHandlers).toHaveBeenCalledTimes(2);
    expect(spyRunHookHandlers).toHaveBeenCalledWith(CaepHookType.Change, expectedHandlers, changes);
  });

  it('initializeAfterViewInit should call runHookHandlers method with right parameters', () => {
    const spyRunHookHandlers = spyOn<any>(hookManager, 'runHookHandlers');
    hookManager.initializeAfterViewInit();
    expect(spyRunHookHandlers).toHaveBeenCalledOnceWith(CaepHookType.AfterViewInit, undefined);
  });

  it('initializeAfterViewCheck should call runHookHandlers method with right parameters and save hook handlers', () => {
    const expectedHandlers = [] as Array<ICaepHookHandler[]>;
    const spyRunHookHandlers = spyOn<any>(hookManager, 'runHookHandlers');
    spyRunHookHandlers.and.returnValue(expectedHandlers);
    hookManager.initializeAfterViewCheck();
    expect(spyRunHookHandlers).toHaveBeenCalledWith(CaepHookType.AfterViewChecked, undefined);
    expect(hookManager['_afterViewChekHandlersGroups']).toEqual(expectedHandlers);
    hookManager.initializeAfterViewCheck();
    expect(spyRunHookHandlers).toHaveBeenCalledTimes(2);
    expect(spyRunHookHandlers).toHaveBeenCalledWith(CaepHookType.AfterViewChecked, expectedHandlers);
  });

  it('initializeAfterContentInit should call runHookHandlers method with right parameters', () => {
    const spyRunHookHandlers = spyOn<any>(hookManager, 'runHookHandlers');
    hookManager.initializeAfterContentInit();
    expect(spyRunHookHandlers).toHaveBeenCalledOnceWith(CaepHookType.AfterContentInit, undefined);
  });

  it('initializeAfterContentCheck should call runHookHandlers method with right parameters and save hook handlers', () => {
    const expectedHandlers = [] as Array<ICaepHookHandler[]>;
    const spyRunHookHandlers = spyOn<any>(hookManager, 'runHookHandlers');
    spyRunHookHandlers.and.returnValue(expectedHandlers);
    hookManager.initializeAfterContentCheck();
    expect(spyRunHookHandlers).toHaveBeenCalledWith(CaepHookType.AfterContentChecked, undefined);
    expect(hookManager['_afterContentCheckHandlersGroups']).toEqual(expectedHandlers);
    hookManager.initializeAfterContentCheck();
    expect(spyRunHookHandlers).toHaveBeenCalledTimes(2);
    expect(spyRunHookHandlers).toHaveBeenCalledWith(CaepHookType.AfterContentChecked, expectedHandlers);
  });

  it('doCheck should call runHookHandlers method with right parameters and save hook handlers', () => {
    const expectedHandlers = [] as Array<ICaepHookHandler[]>;
    const spyRunHookHandlers = spyOn<any>(hookManager, 'runHookHandlers');
    spyRunHookHandlers.and.returnValue(expectedHandlers);
    hookManager.doCheck();
    expect(spyRunHookHandlers).toHaveBeenCalledWith(CaepHookType.DoCheck, undefined);
    expect(hookManager['_doCheckHandlersGroups']).toEqual(expectedHandlers);
    hookManager.doCheck();
    expect(spyRunHookHandlers).toHaveBeenCalledTimes(2);
    expect(spyRunHookHandlers).toHaveBeenCalledWith(CaepHookType.DoCheck, expectedHandlers);
  });

  it('destroy should call runHookHandlers method with right parameters', () => {
    const spyRunHookHandlers = spyOn<any>(hookManager, 'runHookHandlers');
    hookManager.destroy();
    expect(spyRunHookHandlers).toHaveBeenCalledOnceWith(CaepHookType.Destroy, undefined);
  });

  it('optionsChange should call runHookHandlers method with right parameters and save hook handlers', () => {
    const expectedHandlers = [] as Array<ICaepHookHandler[]>;
    const spyRunHookHandlers = spyOn<any>(hookManager, 'runHookHandlers');
    spyRunHookHandlers.and.returnValue(expectedHandlers);
    const optionsChange = new CaepSimpleOptionsChange(null, null);
    hookManager.optionsChange(optionsChange);
    expect(spyRunHookHandlers).toHaveBeenCalledWith(CaepHookType.OptionsChanges, undefined, optionsChange);
    expect(hookManager['_onOptionsChangesHandlersGroups']).toEqual(expectedHandlers);
    hookManager.optionsChange(optionsChange);
    expect(spyRunHookHandlers).toHaveBeenCalledTimes(2);
    expect(spyRunHookHandlers).toHaveBeenCalledWith(CaepHookType.OptionsChanges, expectedHandlers, optionsChange);
  });

  describe('getHookHandlers', () => {
    it("should return an ICaepHookHandler array with handlers' metadata of a specific hook type", () => {
      const expectedHandlers: ICaepHookHandler[] = [
        {
          type: CaepHookType.AfterViewInit,
          runBeforeSuper: true,
          className: 'DummyChildComponent',
          handler: component.setupBeforeSuper
        },
        {
          type: CaepHookType.AfterViewInit,
          priority: 1,
          runBeforeSuper: true,
          className: 'DummyChildComponent',
          handler: component.testBeforeSuper
        },
        { type: CaepHookType.AfterViewInit, className: 'DummyComponent', handler: component.giveFocus }
      ];
      const spyBindSetupBeforeSuper = spyOn<any>(component.setupBeforeSuper, 'bind').and.returnValue(
        component.setupBeforeSuper
      );
      const spyBindTestBeforeSuper = spyOn<any>(component.testBeforeSuper, 'bind').and.returnValue(
        component.testBeforeSuper
      );
      const spyBindGiveFocus = spyOn<any>(component.giveFocus, 'bind').and.returnValue(component.giveFocus);
      const actualHandlers = hookManager['getHookHandlers'](CaepHookType.AfterViewInit);
      expect(actualHandlers).toEqual(expectedHandlers);
    });

    it("should return an empty array if handlers' metadata are not defined for a specific hook type", () => {
      const expectedHandlers: ICaepHookHandler[] = [];
      const actualHandlers = hookManager['getHookHandlers'](CaepHookType.AfterContentChecked);
      expect(actualHandlers).toEqual(expectedHandlers);
    });
  });

  describe('runHookHandlers', () => {
    it('should call OnInit hook handlers in the correct order', () => {
      const spyInitializationMethod = spyOn<any>(component, 'initializationMethod');
      const spyStartCounter = spyOn(component, 'startCounter');
      const spyMaxPriorityMethod = spyOn<any>(component, 'maxPriorityMethod');
      const spyOverriddenMethodWithoutDecorator = spyOn<any>(component, 'overriddenMethodWithoutDecorator');
      const spyInitBeforeSuper = spyOn(component, 'initBeforeSuper');
      const spyOverriddenMethodWithDifferentDecorator = spyOn<any>(component, 'overriddenMethodWithDifferentDecorator');
      const spyLocalMethod = spyOn<any>(component, 'localMethod');
      const spyLocalMethod2 = spyOn<any>(component, 'localMethod2');
      hookManager['runHookHandlers'](CaepHookType.Init, undefined);
      expect(spyInitBeforeSuper).toHaveBeenCalledTimes(1);
      expect(spyInitBeforeSuper).toHaveBeenCalledBefore(spyMaxPriorityMethod);
      expect(spyMaxPriorityMethod).toHaveBeenCalledTimes(1);
      expect(spyMaxPriorityMethod).toHaveBeenCalledBefore(spyInitializationMethod);
      expect(spyInitializationMethod).toHaveBeenCalledTimes(1);
      expect(spyInitializationMethod).toHaveBeenCalledBefore(spyOverriddenMethodWithoutDecorator);
      expect(spyOverriddenMethodWithoutDecorator).toHaveBeenCalledTimes(1);
      expect(spyOverriddenMethodWithoutDecorator).toHaveBeenCalledBefore(spyStartCounter);
      expect(spyStartCounter).toHaveBeenCalledTimes(1);
      expect(spyStartCounter).toHaveBeenCalledBefore(spyLocalMethod);
      expect(spyLocalMethod).toHaveBeenCalledTimes(1);
      expect(spyLocalMethod).toHaveBeenCalledBefore(spyLocalMethod2);
      expect(spyLocalMethod2).toHaveBeenCalledTimes(1);
      expect(spyLocalMethod2).toHaveBeenCalledBefore(spyOverriddenMethodWithDifferentDecorator);
      expect(spyOverriddenMethodWithDifferentDecorator).toHaveBeenCalledTimes(1);
    });

    it('should call initBeforeSuper handler before DummyComponent hook handlers', () => {
      const spyMaxPriorityMethod = spyOn<any>(component, 'maxPriorityMethod');
      const spyInitBeforeSuper = spyOn(component, 'initBeforeSuper');
      hookManager['runHookHandlers'](CaepHookType.Init, undefined);
      expect(spyInitBeforeSuper).toHaveBeenCalledTimes(1);
      expect(spyInitBeforeSuper).toHaveBeenCalledBefore(spyMaxPriorityMethod);
      expect(spyMaxPriorityMethod).toHaveBeenCalledTimes(1);
    });

    it('should call DummyComponent OnInit hook handlers by priority order', () => {
      const spyInitializationMethod = spyOn<any>(component, 'initializationMethod');
      const spyStartCounter = spyOn(component, 'startCounter');
      const spyMaxPriorityMethod = spyOn<any>(component, 'maxPriorityMethod');
      const spyOverriddenMethodWithoutDecorator = spyOn<any>(component, 'overriddenMethodWithoutDecorator');
      hookManager['runHookHandlers'](CaepHookType.Init, undefined);
      expect(spyMaxPriorityMethod).toHaveBeenCalledTimes(1);
      expect(spyMaxPriorityMethod).toHaveBeenCalledBefore(spyInitializationMethod);
      expect(spyInitializationMethod).toHaveBeenCalledTimes(1);
      expect(spyInitializationMethod).toHaveBeenCalledBefore(spyOverriddenMethodWithoutDecorator);
      expect(spyOverriddenMethodWithoutDecorator).toHaveBeenCalledTimes(1);
      expect(spyOverriddenMethodWithoutDecorator).toHaveBeenCalledBefore(spyStartCounter);
      expect(spyStartCounter).toHaveBeenCalledTimes(1);
    });

    it('should call DummyChildComponent OnInit hook handlers by registration order if they have same defined priority', () => {
      const spyLocalMethod = spyOn<any>(component, 'localMethod');
      const spyLocalMethod2 = spyOn<any>(component, 'localMethod2');
      hookManager['runHookHandlers'](CaepHookType.Init, undefined);
      expect(spyLocalMethod).toHaveBeenCalledTimes(1);
      expect(spyLocalMethod).toHaveBeenCalledBefore(spyLocalMethod2);
      expect(spyLocalMethod2).toHaveBeenCalledTimes(1);
    });

    it('should call the overridden form of a method if it is decorated in the superclass but not in the subclass or if it is decorated in the superclass and in the subclass by different hook type', () => {
      hookManager['runHookHandlers'](CaepHookType.Init, undefined);
      expect(mockService.observeDummy).toHaveBeenCalledTimes(2);
    });

    it('should call OnChanges hook handlers in the correct order', () => {
      const spyStartCounter = spyOn(component, 'startCounter');
      const spyOverriddenMethodWithDifferentDecorator = spyOn<any>(component, 'overriddenMethodWithDifferentDecorator');
      const spyOverriddenMethod = spyOn<any>(component, 'overriddenMethod');
      const spyLocalMethod3 = spyOn<any>(component, 'localMethod3');
      const spyLocalMethod4 = spyOn<any>(component, 'localMethod4');
      const spyChangeBeforeSuper = spyOn(component, 'changeBeforeSuper');
      const change = new SimpleChange('', 'test', false);
      const changes = { prop: change } as SimpleChanges;
      hookManager['runHookHandlers'](CaepHookType.Change, undefined, changes);
      expect(spyChangeBeforeSuper).toHaveBeenCalledOnceWith(changes);
      expect(spyChangeBeforeSuper).toHaveBeenCalledBefore(spyStartCounter);
      expect(spyStartCounter).toHaveBeenCalledOnceWith(changes);
      expect(spyStartCounter).toHaveBeenCalledBefore(spyOverriddenMethodWithDifferentDecorator);
      expect(spyOverriddenMethodWithDifferentDecorator).toHaveBeenCalledOnceWith(changes);
      expect(spyOverriddenMethodWithDifferentDecorator).toHaveBeenCalledBefore(spyOverriddenMethod);
      expect(spyOverriddenMethod).toHaveBeenCalledOnceWith(changes);
      expect(spyOverriddenMethod).toHaveBeenCalledBefore(spyLocalMethod3);
      expect(spyLocalMethod3).toHaveBeenCalledOnceWith(changes);
      expect(spyLocalMethod3).toHaveBeenCalledBefore(spyLocalMethod4);
      expect(spyLocalMethod4).toHaveBeenCalledOnceWith(changes);
    });

    it('should call DummyChildComponent OnChanges hook handler before DummyComponent hook handlers if runBeforeSuper is true', () => {
      const spyStartCounter = spyOn(component, 'startCounter');
      const spyChangeBeforeSuper = spyOn(component, 'changeBeforeSuper');
      const change = new SimpleChange('', 'test', false);
      const changes = { prop: change } as SimpleChanges;
      hookManager['runHookHandlers'](CaepHookType.Change, undefined, changes);
      expect(spyChangeBeforeSuper).toHaveBeenCalledOnceWith(changes);
      expect(spyChangeBeforeSuper).toHaveBeenCalledBefore(spyStartCounter);
      expect(spyStartCounter).toHaveBeenCalledOnceWith(changes);
    });

    it('should call DummyChildComponent OnChanges hook handlers by registration order if they have undefined priority', () => {
      const spyLocalMethod3 = spyOn<any>(component, 'localMethod3');
      const spyLocalMethod4 = spyOn<any>(component, 'localMethod4');
      const change = new SimpleChange('', 'test', false);
      const changes = { prop: change } as SimpleChanges;
      hookManager['runHookHandlers'](CaepHookType.Change, undefined, changes);
      expect(spyLocalMethod3).toHaveBeenCalledOnceWith(changes);
      expect(spyLocalMethod3).toHaveBeenCalledBefore(spyLocalMethod4);
      expect(spyLocalMethod4).toHaveBeenCalledOnceWith(changes);
    });

    it('should call the overridden form of a method if it is decorated in the subclass but not in the superclass or if it is decorated in the superclass and in the subclass by different hook type', () => {
      const change = new SimpleChange('', 'test', false);
      const changes = { prop: change } as SimpleChanges;
      hookManager['runHookHandlers'](CaepHookType.Change, undefined, changes);
      expect(mockService.observeDummy).toHaveBeenCalledTimes(2);
    });

    it('should return correct handler groups when they are not saved yet', () => {
      const hookHandlers = [
        {
          type: CaepHookType.Change,
          priority: 2,
          className: 'DummyChildComponent',
          handler: component['overriddenMethod'].bind(component)
        },
        {
          type: CaepHookType.Change,
          className: 'DummyChildComponent',
          handler: component['localMethod3'].bind(component)
        },
        {
          type: CaepHookType.Change,
          className: 'DummyChildComponent',
          handler: component['localMethod4'].bind(component)
        },
        {
          type: CaepHookType.Change,
          priority: 0,
          runBeforeSuper: true,
          className: 'DummyChildComponent',
          handler: component.changeBeforeSuper.bind(component)
        },
        { type: CaepHookType.Change, className: 'DummyComponent', handler: component.startCounter.bind(component) },
        {
          type: CaepHookType.Change,
          className: 'DummyComponent',
          handler: component['overriddenMethodWithDifferentDecorator'].bind(component)
        }
      ];
      const hookHandlersByGroup: Array<ICaepHookHandler[]> = [
        [
          {
            type: CaepHookType.Change,
            priority: 2,
            className: 'DummyChildComponent',
            handler: component['overriddenMethod'].bind(component)
          },
          {
            type: CaepHookType.Change,
            className: 'DummyChildComponent',
            handler: component['localMethod3'].bind(component)
          },
          {
            type: CaepHookType.Change,
            className: 'DummyChildComponent',
            handler: component['localMethod4'].bind(component)
          },
          {
            type: CaepHookType.Change,
            priority: 0,
            runBeforeSuper: true,
            className: 'DummyChildComponent',
            handler: component.changeBeforeSuper.bind(component)
          }
        ],
        [
          { type: CaepHookType.Change, className: 'DummyComponent', handler: component.startCounter.bind(component) },
          {
            type: CaepHookType.Change,
            className: 'DummyComponent',
            handler: component['overriddenMethodWithDifferentDecorator'].bind(component)
          }
        ]
      ];
      const spyGetHookHandlers = spyOn<any>(hookManager, 'getHookHandlers').and.returnValue(hookHandlers);
      const spyGetHandlerGroupsByClassName = spyOn<any>(hookManager, 'getHandlerGroupsByClassName').and.returnValue(
        hookHandlersByGroup
      );
      const change = new SimpleChange('', 'test', false);
      const changes = { prop: change } as SimpleChanges;
      const actuaHandlerGroups = hookManager['runHookHandlers'](CaepHookType.Change, undefined, changes);
      expect(actuaHandlerGroups).toEqual(hookHandlersByGroup);
    });

    it('should call getHookHandlers and getHandlerGroupsByClassName methods if hook handlers are not saved yet', () => {
      const hookHandlers = [
        {
          type: CaepHookType.Change,
          priority: 2,
          className: 'DummyChildComponent',
          handler: component['overriddenMethod'].bind(component)
        },
        {
          type: CaepHookType.Change,
          className: 'DummyChildComponent',
          handler: component['localMethod3'].bind(component)
        },
        {
          type: CaepHookType.Change,
          className: 'DummyChildComponent',
          handler: component['localMethod4'].bind(component)
        },
        {
          type: CaepHookType.Change,
          priority: 0,
          runBeforeSuper: true,
          className: 'DummyChildComponent',
          handler: component.changeBeforeSuper.bind(component)
        },
        { type: CaepHookType.Change, className: 'DummyComponent', handler: component.startCounter.bind(component) },
        {
          type: CaepHookType.Change,
          className: 'DummyComponent',
          handler: component['overriddenMethodWithDifferentDecorator'].bind(component)
        }
      ];
      const hookHandlersByGroup: Array<ICaepHookHandler[]> = [
        [
          {
            type: CaepHookType.Change,
            priority: 2,
            className: 'DummyChildComponent',
            handler: component['overriddenMethod'].bind(component)
          },
          {
            type: CaepHookType.Change,
            className: 'DummyChildComponent',
            handler: component['localMethod3'].bind(component)
          },
          {
            type: CaepHookType.Change,
            className: 'DummyChildComponent',
            handler: component['localMethod4'].bind(component)
          },
          {
            type: CaepHookType.Change,
            priority: 0,
            runBeforeSuper: true,
            className: 'DummyChildComponent',
            handler: component.changeBeforeSuper.bind(component)
          }
        ],
        [
          { type: CaepHookType.Change, className: 'DummyComponent', handler: component.startCounter.bind(component) },
          {
            type: CaepHookType.Change,
            className: 'DummyComponent',
            handler: component['overriddenMethodWithDifferentDecorator'].bind(component)
          }
        ]
      ];
      const spyGetHookHandlers = spyOn<any>(hookManager, 'getHookHandlers').and.returnValue(hookHandlers);
      const spyGetHandlerGroupsByClassName = spyOn<any>(hookManager, 'getHandlerGroupsByClassName').and.returnValue(
        hookHandlersByGroup
      );
      const change = new SimpleChange('', 'test', false);
      const changes = { prop: change } as SimpleChanges;
      hookManager['runHookHandlers'](CaepHookType.Change, undefined, changes);
      expect(spyGetHookHandlers).toHaveBeenCalledOnceWith(CaepHookType.Change);
      expect(spyGetHandlerGroupsByClassName).toHaveBeenCalledOnceWith(hookHandlers);
    });

    it('should call OnChanges hook handlers in the correct order if they are already saved', () => {
      const spyStartCounter = spyOn(component, 'startCounter');
      const spyOverriddenMethodWithDifferentDecorator = spyOn<any>(component, 'overriddenMethodWithDifferentDecorator');
      const spyOverriddenMethod = spyOn<any>(component, 'overriddenMethod');
      const spyLocalMethod3 = spyOn<any>(component, 'localMethod3');
      const spyLocalMethod4 = spyOn<any>(component, 'localMethod4');
      const spyChangeBeforeSuper = spyOn(component, 'changeBeforeSuper');
      const hookHandlersByGroup: Array<ICaepHookHandler[]> = [
        [
          { type: CaepHookType.Change, className: 'DummyComponent', handler: component.startCounter.bind(component) },
          {
            type: CaepHookType.Change,
            className: 'DummyComponent',
            handler: component['overriddenMethodWithDifferentDecorator'].bind(component)
          }
        ],
        [
          {
            type: CaepHookType.Change,
            priority: 0,
            runBeforeSuper: true,
            className: 'DummyChildComponent',
            handler: component.changeBeforeSuper.bind(component)
          },
          {
            type: CaepHookType.Change,
            priority: 2,
            className: 'DummyChildComponent',
            handler: component['overriddenMethod'].bind(component)
          },
          {
            type: CaepHookType.Change,
            className: 'DummyChildComponent',
            handler: component['localMethod3'].bind(component)
          },
          {
            type: CaepHookType.Change,
            className: 'DummyChildComponent',
            handler: component['localMethod4'].bind(component)
          }
        ]
      ];
      const change = new SimpleChange('', 'test', false);
      const changes = { prop: change } as SimpleChanges;
      hookManager['runHookHandlers'](CaepHookType.Change, hookHandlersByGroup, changes);
      expect(spyChangeBeforeSuper).toHaveBeenCalledOnceWith(changes);
      expect(spyChangeBeforeSuper).toHaveBeenCalledBefore(spyStartCounter);
      expect(spyStartCounter).toHaveBeenCalledOnceWith(changes);
      expect(spyStartCounter).toHaveBeenCalledBefore(spyOverriddenMethodWithDifferentDecorator);
      expect(spyOverriddenMethodWithDifferentDecorator).toHaveBeenCalledOnceWith(changes);
      expect(spyOverriddenMethodWithDifferentDecorator).toHaveBeenCalledBefore(spyOverriddenMethod);
      expect(spyOverriddenMethod).toHaveBeenCalledOnceWith(changes);
      expect(spyOverriddenMethod).toHaveBeenCalledBefore(spyLocalMethod3);
      expect(spyLocalMethod3).toHaveBeenCalledOnceWith(changes);
      expect(spyLocalMethod3).toHaveBeenCalledBefore(spyLocalMethod4);
      expect(spyLocalMethod4).toHaveBeenCalledOnceWith(changes);
    });

    it('should not call getHookHandlers and getHandlerGroupsByClassName methods if hook handlers are already saved', () => {
      const spyGetHookHandlers = spyOn<any>(hookManager, 'getHookHandlers');
      const spyGetHandlerGroupsByClassName = spyOn<any>(hookManager, 'getHandlerGroupsByClassName');
      const hookHandlersByGroup: Array<ICaepHookHandler[]> = [];
      const change = new SimpleChange('', 'test', false);
      const changes = { prop: change } as SimpleChanges;
      hookManager['runHookHandlers'](CaepHookType.Change, hookHandlersByGroup, changes);
      expect(spyGetHookHandlers).not.toHaveBeenCalled();
      expect(spyGetHandlerGroupsByClassName).not.toHaveBeenCalled();
    });

    it('should return correct handler groups when they are already saved', () => {
      const hookHandlersByGroup: Array<ICaepHookHandler[]> = [];
      const change = new SimpleChange('', 'test', false);
      const changes = { prop: change } as SimpleChanges;
      hookManager['_onChangeHandlersGroups'] = hookHandlersByGroup;
      const actuaHandlerGroups = hookManager['runHookHandlers'](
        CaepHookType.Change,
        hookManager['_onChangeHandlersGroups'],
        changes
      );
      expect(actuaHandlerGroups).toBe(hookManager['_onChangeHandlersGroups']);
    });

    it('should call AfterViewInit hook handlers in the correct order', () => {
      const spyGiveFocus = spyOn(component, 'giveFocus');
      const spySetupBeforeSuper = spyOn(component, 'setupBeforeSuper');
      const spyTestBeforeSuper = spyOn(component, 'testBeforeSuper');
      hookManager['runHookHandlers'](CaepHookType.AfterViewInit, undefined);
      expect(spyTestBeforeSuper).toHaveBeenCalledTimes(1);
      expect(spyTestBeforeSuper).toHaveBeenCalledBefore(spySetupBeforeSuper);
      expect(spySetupBeforeSuper).toHaveBeenCalledTimes(1);
      expect(spySetupBeforeSuper).toHaveBeenCalledBefore(spyGiveFocus);
      expect(spyGiveFocus).toHaveBeenCalledTimes(1);
    });

    it('should call DummyChildComponent AfterViewInit hook handlers which have runBeforeSuper set to true by priority order', () => {
      const spySetupBeforeSuper = spyOn(component, 'setupBeforeSuper');
      const spyTestBeforeSuper = spyOn(component, 'testBeforeSuper');
      hookManager['runHookHandlers'](CaepHookType.AfterViewInit, undefined);
      expect(spyTestBeforeSuper).toHaveBeenCalledTimes(1);
      expect(spyTestBeforeSuper).toHaveBeenCalledBefore(spySetupBeforeSuper);
      expect(spySetupBeforeSuper).toHaveBeenCalledTimes(1);
    });

    it('should return empty array if component has not handlers of a specific hook type', () => {
      const expectedHandlers: Array<ICaepHookHandler[]> = [];
      const actualHandlers = hookManager['runHookHandlers'](CaepHookType.DoCheck, undefined);
      expect(actualHandlers).toEqual(expectedHandlers);
    });

    it('should not call getHandlerGroupsByClassName method if component has not handlers of a specific hook type', () => {
      const spyGetHandlerGroupsByClassName = spyOn<any>(hookManager, 'getHandlerGroupsByClassName');
      const actualHandlers = hookManager['runHookHandlers'](CaepHookType.DoCheck, undefined);
      expect(spyGetHandlerGroupsByClassName).not.toHaveBeenCalled();
    });
  });

  describe('getHandlerGroupsByClassName', () => {
    it('should return handler groups by class name', () => {
      const hookHandlers = [
        {
          type: CaepHookType.Change,
          priority: 2,
          className: 'DummyChildComponent',
          handler: component['overriddenMethod']
        },
        { type: CaepHookType.Change, className: 'DummyChildComponent', handler: component['localMethod3'] },
        { type: CaepHookType.Change, className: 'DummyChildComponent', handler: component['localMethod4'] },
        {
          type: CaepHookType.Change,
          priority: 0,
          runBeforeSuper: true,
          className: 'DummyChildComponent',
          handler: component.changeBeforeSuper
        },
        { type: CaepHookType.Change, className: 'DummyComponent', handler: component.startCounter },
        {
          type: CaepHookType.Change,
          className: 'DummyComponent',
          handler: component['overriddenMethodWithDifferentDecorator']
        }
      ];
      const expectedHandlerGroups: Array<ICaepHookHandler[]> = [
        [
          {
            type: CaepHookType.Change,
            priority: 2,
            className: 'DummyChildComponent',
            handler: component['overriddenMethod']
          },
          { type: CaepHookType.Change, className: 'DummyChildComponent', handler: component['localMethod3'] },
          { type: CaepHookType.Change, className: 'DummyChildComponent', handler: component['localMethod4'] },
          {
            type: CaepHookType.Change,
            priority: 0,
            runBeforeSuper: true,
            className: 'DummyChildComponent',
            handler: component.changeBeforeSuper
          }
        ],
        [
          { type: CaepHookType.Change, className: 'DummyComponent', handler: component.startCounter },
          {
            type: CaepHookType.Change,
            className: 'DummyComponent',
            handler: component['overriddenMethodWithDifferentDecorator']
          }
        ]
      ];
      const actualHandlerGroups = hookManager['getHandlerGroupsByClassName'](hookHandlers);
      expect(actualHandlerGroups).toEqual(expectedHandlerGroups);
    });

    it('should return empty array if input handlers are empty', () => {
      const hookHandlers = [];
      const expectedHandlerGroups: Array<ICaepHookHandler[]> = [];
      const actualHandlerGroups = hookManager['getHandlerGroupsByClassName'](hookHandlers);
      expect(actualHandlerGroups).toEqual(expectedHandlerGroups);
    });
  });

  describe('sortByHanlderPriorityAsc', () => {
    it('should return 0 if first and second parameter are undefined or null', () => {
      const expectedValue = 0;
      const h1 = {
        type: CaepHookType.Init,
        priority: undefined,
        className: 'DummyComponent',
        handler: jasmine.any(Function) as any
      };
      const h2 = {
        type: CaepHookType.Init,
        priority: undefined,
        className: 'DummyComponent',
        handler: jasmine.any(Function) as any
      };
      let actualValue = hookManager['sortByHanlderPriorityAsc'](h1, h2);
      expect(actualValue).toEqual(expectedValue);
      h1.priority = null;
      actualValue = hookManager['sortByHanlderPriorityAsc'](h1, h2);
      expect(actualValue).toEqual(expectedValue);
      h1.priority = undefined;
      h2.priority = null;
      actualValue = hookManager['sortByHanlderPriorityAsc'](h1, h2);
      expect(actualValue).toEqual(expectedValue);
      h1.priority = null;
      actualValue = hookManager['sortByHanlderPriorityAsc'](h1, h2);
      expect(actualValue).toEqual(expectedValue);
    });

    it('should return 1 if first parameter is undefined or null and second parameter is a number', () => {
      const expectedValue = 1;
      const h1 = {
        type: CaepHookType.Init,
        priority: undefined,
        className: 'DummyComponent',
        handler: jasmine.any(Function) as any
      };
      const h2 = {
        type: CaepHookType.Init,
        priority: 2,
        className: 'DummyComponent',
        handler: jasmine.any(Function) as any
      };
      let actualValue = hookManager['sortByHanlderPriorityAsc'](h1, h2);
      expect(actualValue).toEqual(expectedValue);
      h1.priority = null;
      actualValue = hookManager['sortByHanlderPriorityAsc'](h1, h2);
      expect(actualValue).toEqual(expectedValue);
    });

    it('should return -1 if first parameter is a number and second parameter is undefined or null', () => {
      const expectedValue = -1;
      const h1 = {
        type: CaepHookType.Init,
        priority: 2,
        className: 'DummyComponent',
        handler: jasmine.any(Function) as any
      };
      const h2 = {
        type: CaepHookType.Init,
        priority: undefined,
        className: 'DummyComponent',
        handler: jasmine.any(Function) as any
      };
      let actualValue = hookManager['sortByHanlderPriorityAsc'](h1, h2);
      expect(actualValue).toEqual(expectedValue);
      h2.priority = null;
      actualValue = hookManager['sortByHanlderPriorityAsc'](h1, h2);
      expect(actualValue).toEqual(expectedValue);
    });

    it('should return 1 if first parameter is greater than second parameter', () => {
      const expectedValue = 1;
      const h1 = {
        type: CaepHookType.Init,
        priority: 2,
        className: 'DummyComponent',
        handler: jasmine.any(Function) as any
      };
      const h2 = {
        type: CaepHookType.Init,
        priority: 0,
        className: 'DummyComponent',
        handler: jasmine.any(Function) as any
      };
      let actualValue = hookManager['sortByHanlderPriorityAsc'](h1, h2);
      expect(actualValue).toEqual(expectedValue);
    });

    it('should return 0 if first parameter is equal to second parameter', () => {
      const expectedValue = 0;
      const h1 = {
        type: CaepHookType.Init,
        priority: 1,
        className: 'DummyComponent',
        handler: jasmine.any(Function) as any
      };
      const h2 = {
        type: CaepHookType.Init,
        priority: 1,
        className: 'DummyComponent',
        handler: jasmine.any(Function) as any
      };
      let actualValue = hookManager['sortByHanlderPriorityAsc'](h1, h2);
      expect(actualValue).toEqual(expectedValue);
    });

    it('should return -1 if first parameter is smaller than second parameter', () => {
      const expectedValue = -1;
      const h1 = {
        type: CaepHookType.Init,
        priority: 1,
        className: 'DummyComponent',
        handler: jasmine.any(Function) as any
      };
      const h2 = {
        type: CaepHookType.Init,
        priority: 3,
        className: 'DummyComponent',
        handler: jasmine.any(Function) as any
      };
      let actualValue = hookManager['sortByHanlderPriorityAsc'](h1, h2);
      expect(actualValue).toEqual(expectedValue);
    });
  });
});

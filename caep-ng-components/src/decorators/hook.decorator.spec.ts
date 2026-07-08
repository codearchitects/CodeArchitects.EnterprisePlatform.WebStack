import { Component, DebugElement, Directive, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ICaepHookHandler } from '..//models';
import { CaepHook, CaepHookType } from './hook.decorator';

@Directive()
class DummyComponent {
  private _id: number;
  private _counter = 0;
  @ViewChild('controlRef') public controlRef: ElementRef;

  constructor() {}

  @CaepHook({ type: CaepHookType.Init, priority: 1 })
  public initializationMethod() {
    this._id = 0;
  }

  @CaepHook({ type: CaepHookType.Init, priority: -1 })
  @CaepHook({ type: CaepHookType.Change })
  public startCounter() {
    this._counter++;
  }
}

@Component({
    template: '<input #controlRef type="text" autofocus="true" autocomplete="off" id="dummy" placeholder="Input" title="Tooltip example!"/>',
    standalone: false
})
class DummyChildComponent extends DummyComponent {
  constructor() {
    super();
  }

  @CaepHook({ type: CaepHookType.AfterViewInit, runBeforeSuper: true })
  public setup() {
    const element = this.controlRef?.nativeElement as HTMLElement;
    if (element) element.title = 'Tooltip example';
  }
}

describe('CaepHook Decorator', () => {
  let fixture: ComponentFixture<DummyChildComponent>,
    component: DummyChildComponent,
    element: HTMLElement,
    rootControlElement: HTMLSpanElement,
    debugEl: DebugElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [DummyChildComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyChildComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    debugEl = fixture.debugElement;
    rootControlElement = element.querySelector<HTMLSpanElement>('#dummy');
  });

  it('should return a function', () => {
    const actualValue = CaepHook({ type: CaepHookType.Init });
    expect(actualValue).toBeInstanceOf(Function);
  });

  it('should define correct metadata on initializationMethod', () => {
    const metadata: ICaepHookHandler = Reflect.getMetadata(
      CaepHookType[CaepHookType.Init],
      component,
      'initializationMethod'
    );
    expect(metadata.type).toEqual(CaepHookType.Init);
    expect(metadata.priority).toEqual(1);
    expect(metadata.className).toEqual('DummyComponent');
    expect(metadata.runBeforeSuper).toBeUndefined();
    expect(metadata.handler).toBeUndefined();
  });

  it('should not define metadata on initializationMethod for hook types different from Init', () => {
    const metadataChange: ICaepHookHandler = Reflect.getMetadata(
      CaepHookType[CaepHookType.Change],
      component,
      'initializationMethod'
    );
    const metadataAfterViewInit: ICaepHookHandler = Reflect.getMetadata(
      CaepHookType[CaepHookType.AfterViewInit],
      component,
      'initializationMethod'
    );
    const metadataAfterViewCheck: ICaepHookHandler = Reflect.getMetadata(
      CaepHookType[CaepHookType.AfterViewChecked],
      component,
      'initializationMethod'
    );
    const metadataDoCheck: ICaepHookHandler = Reflect.getMetadata(
      CaepHookType[CaepHookType.DoCheck],
      component,
      'initializationMethod'
    );
    const metadataAfterContentInit: ICaepHookHandler = Reflect.getMetadata(
      CaepHookType[CaepHookType.AfterContentInit],
      component,
      'initializationMethod'
    );
    const metadataAfterContentCheck: ICaepHookHandler = Reflect.getMetadata(
      CaepHookType[CaepHookType.AfterContentChecked],
      component,
      'initializationMethod'
    );
    const metadataDestroy: ICaepHookHandler = Reflect.getMetadata(
      CaepHookType[CaepHookType.Destroy],
      component,
      'initializationMethod'
    );
    expect(metadataChange).toBeUndefined();
    expect(metadataAfterViewInit).toBeUndefined();
    expect(metadataAfterViewCheck).toBeUndefined();
    expect(metadataDoCheck).toBeUndefined();
    expect(metadataAfterContentInit).toBeUndefined();
    expect(metadataAfterContentCheck).toBeUndefined();
    expect(metadataDestroy).toBeUndefined();
  });

  it('should define correct metadata on startCounter method for Init hook', () => {
    const metadata: ICaepHookHandler = Reflect.getMetadata(CaepHookType[CaepHookType.Init], component, 'startCounter');
    expect(metadata.type).toEqual(CaepHookType.Init);
    expect(metadata.priority).toBeUndefined();
    expect(metadata.className).toEqual('DummyComponent');
    expect(metadata.runBeforeSuper).toBeUndefined();
    expect(metadata.handler).toBeUndefined();
  });

  it('should define correct metadata on startCounter method for Change hook', () => {
    const metadata: ICaepHookHandler = Reflect.getMetadata(
      CaepHookType[CaepHookType.Change],
      component,
      'startCounter'
    );
    expect(metadata.type).toEqual(CaepHookType.Change);
    expect(metadata.priority).toBeUndefined();
    expect(metadata.className).toEqual('DummyComponent');
    expect(metadata.runBeforeSuper).toBeUndefined();
    expect(metadata.handler).toBeUndefined();
  });

  it('should define correct metadata on setup method', () => {
    const metadata: ICaepHookHandler = Reflect.getMetadata(
      CaepHookType[CaepHookType.AfterViewInit],
      component,
      'setup'
    );
    expect(metadata.type).toEqual(CaepHookType.AfterViewInit);
    expect(metadata.priority).toBeUndefined();
    expect(metadata.className).toEqual('DummyChildComponent');
    expect(metadata.runBeforeSuper).toBeTrue();
    expect(metadata.handler).toBeUndefined();
  });

  it("should modify enumerable property on the decorated method's property descriptor", () => {
    const prototype = Object.getPrototypeOf(component);
    const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, 'setup');
    expect(propertyDescriptor.enumerable).toBeTrue();
  });
});

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AspectHelper, ContextService } from '@ca-webstack/ng-aspects';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { TranslateModule } from '@ngx-translate/core';
import { CaepPipesModule } from 'src/pipes';
import {
  CaepFormHandlerService,
  CaepIdSequenceService,
  CaepPipeMapperService
} from '../../services';
import { CaepFormControl } from '../../utilities';
import { CaepComponentsModule } from '../components.module';
import { CaepTextOptions } from './text-options.type';
import { CaepTextComponent } from './text.component';

describe('CaepTextComponent', () => {
  let mockIdSequenceService,
    mockFormHandlerService,
    mockPipeMapperService,
    mockAspectHelper,
    mockContextService;
  let formControl: CaepFormControl;

  beforeEach(() => {
    formControl = new CaepFormControl();
    mockIdSequenceService = jasmine.createSpyObj('mockIdSequence', ['next']);
    mockIdSequenceService.next.and.returnValue('test-id');
    mockFormHandlerService = jasmine.createSpyObj('mockFormHandler', [
      'getControl',
      'removeControl',
    ]);
    mockFormHandlerService.getControl.and.returnValue(formControl);
    mockPipeMapperService = jasmine.createSpy();
    mockAspectHelper = jasmine.createSpyObj('mockAspectHelper', ['getLabel']);
    mockContextService = jasmine.createSpyObj('mockContext', {}, ['context']);
  });

  describe('tested directly', () => {
    let component: CaepTextComponent;
    let fixture: ComponentFixture<CaepTextComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, CaepPipesModule, I18nModule.forRoot(), TranslateModule.forRoot()],
        declarations: [CaepTextComponent],
        providers: [
          { provide: CaepIdSequenceService, useValue: mockIdSequenceService },
          { provide: CaepFormHandlerService, useValue: mockFormHandlerService },
          { provide: CaepPipeMapperService, useValue: mockPipeMapperService },
          { provide: AspectHelper, useValue: mockAspectHelper },
          { provide: ContextService, useValue: mockContextService },
          provideZoneChangeDetection()
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(CaepTextComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should create options', () => {
      expect(component.options).toBeDefined();
    });

    it('should set input id attribute', () => {
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.id).toBe('test-id');
    });

    it('should set input type to text by default', () => {
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.type).toBe('text');
    });

    it('should set input type based on options.type property', () => {
      component.hostOptions = new CaepTextOptions({ type: 'email' });
      fixture.detectChanges();
      const inputElement = fixture.nativeElement.querySelector('input');
      expect(inputElement.type).toBe('email');
    });
  });

  describe('inside a test host', () => {
    let hostComponent: TestHostComponent;
    let hostFixture: ComponentFixture<TestHostComponent>;
    let caepTextComponent: CaepTextComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CaepComponentsModule, ReactiveFormsModule, I18nModule.forRoot(), TranslateModule.forRoot()],
        declarations: [TestHostComponent],
        providers: [
          { provide: CaepIdSequenceService, useValue: mockIdSequenceService },
          { provide: CaepFormHandlerService, useValue: mockFormHandlerService },
          { provide: CaepPipeMapperService, useValue: mockPipeMapperService },
          { provide: AspectHelper, useValue: mockAspectHelper },
          { provide: ContextService, useValue: mockContextService },
          provideZoneChangeDetection()
        ],
      }).compileComponents();
    });

    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      caepTextComponent = hostFixture.debugElement.query(By.directive(CaepTextComponent)).componentInstance;
      hostFixture.detectChanges();
    });

    it('should pass inputs to CaepTextComponent', () => {
      const expectedProp = 'name';
      const expectedModel = { name: 'test name', age: 30 };
      hostComponent.prop = expectedProp;
      hostComponent.model = expectedModel;
      hostFixture.detectChanges();
      expect(caepTextComponent.prop).toBe(expectedProp);
      expect(caepTextComponent.model).toBe(expectedModel);
    });

    it('should emit valueChanges', () => {
      const expectedValue = 'test value';
      caepTextComponent.valueChanges.emit(expectedValue);
      hostFixture.detectChanges();
      expect(hostComponent.value).toBe(expectedValue);
    });

    it('should call onCanValueChange', () => {
      spyOn(hostComponent, 'onCanValueChange');
      const newValue = 'test1.1';
      const model = { prop1: 'test1', prop2: 'test2' };
      const prop = 'prop1';
      const expectedEvent = new CaepValueChange(model, prop, newValue, new EventEmitter());
      caepTextComponent.canValueChange.emit(expectedEvent);
      hostFixture.detectChanges();
      expect(hostComponent.onCanValueChange).toHaveBeenCalledWith(
        expectedEvent
      );
    });

    it('should disable the input if enable is false', fakeAsync(() => {
      hostComponent.enable = false;
      hostFixture.detectChanges();
      tick();
      const input = hostFixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.disabled).toBeTrue();
    }));

    it('should hide the input if show is false', () => {
      hostComponent.show = false;
      hostFixture.detectChanges();
      const input = hostFixture.debugElement.query(By.css('input'));
      expect(input).toBeNull();
    });

    it('should set the resource to the caep text component', () => {
      const expectedResource = 'test-resource';
      hostComponent.resource = expectedResource;
      hostFixture.detectChanges();
      expect(caepTextComponent.resource).toBe(expectedResource);
    });

    it('should set selector to the caep text component', () => {
      const expectedSelectors = ['test-selector-1', 'test-selector-2'];
      hostComponent.selectors = expectedSelectors;
      hostFixture.detectChanges();
      expect(caepTextComponent.selectors).toBe(expectedSelectors);
    });

    it('should set the type options of the input element', () => {
      const expectedOptions: { type: 'text' | 'password' | 'email' } = {
        type: 'text',
      };
      hostComponent.options = expectedOptions;
      hostFixture.detectChanges();
      const input = hostFixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      expect(input.type).toBe(expectedOptions.type);
      expect(caepTextComponent.options.type).toBe(expectedOptions.type);
    });

    it('should set the id of the input element', () => {
      const expectedId = 'test-id';
      hostComponent.id = expectedId;
      hostFixture.detectChanges();
      const input = hostFixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      expect(input.id).toBe(expectedId);
    });

    it('should set the tabindex of the input element', () => {
      const expectedTabIndex = 1;
      hostComponent.tabindex = expectedTabIndex;
      hostFixture.detectChanges();
      const input = hostFixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      expect(input.tabIndex).toBe(expectedTabIndex);
    });

    it('should set the autofocus attribute of the input element', () => {
      hostComponent.autofocus = true;
      hostFixture.detectChanges();
      const input = hostFixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      expect(input.autofocus).toBeTrue();
    });

    it('should set the label of the input element', () => {
      const expectedLabel = 'Test Label';
      hostComponent.label = expectedLabel;
      hostFixture.detectChanges();
      const label = hostFixture.debugElement.query(
        By.css('label')
      ).nativeElement;
      expect(label.textContent.trim()).toBe(expectedLabel);
    });

    it('should set the width of the input element', () => {
      const expectedWidth = '50%';
      hostComponent.width = expectedWidth;
      hostFixture.detectChanges();
      const input = hostFixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      expect(input.style.maxWidth).toBe(expectedWidth);
    });

    it('should set the height of the input element', () => {
      const expectedHeight = '100px';
      hostComponent.height = expectedHeight;
      hostFixture.detectChanges();
      const input = hostFixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      expect(input.style.height).toBe(expectedHeight);
    });

    it('should add container classes to the container element', () => {
      const expectedContainerClasses = [
        'test-container-class-1',
        'test-container-class-2',
      ];
      hostComponent.containerClass = expectedContainerClasses;
      hostFixture.detectChanges();
      const container = hostFixture.debugElement.query(By.css(expectedContainerClasses.map(e => `.${e}`).toString())).nativeElement;
      expectedContainerClasses.forEach((containerClass) => {
        expect(container.classList.contains(containerClass)).toBeTrue();
      });
    });

    it('should set the tooltip to the caep text component', () => {
      const expectedTooltip = 'Test Tooltip';
      hostComponent.tooltip = expectedTooltip;
      hostFixture.detectChanges();
      expect(caepTextComponent.tooltip).toBe(expectedTooltip);
    });

    it('should emit the KeyboardEvent when a key is pressed', () => {
      const expectedEvent = createKeyEvent('keypress', 'Enter');
      spyOn(hostComponent, 'onKeypressed');
      hostFixture.detectChanges();
      const input = hostFixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      input.dispatchEvent(expectedEvent);
      expect(hostComponent.onKeypressed).toHaveBeenCalledWith(expectedEvent);
    });

    it('should emit the KeyboardEvent when a key is down', () => {
      const expectedEvent = createKeyEvent('keydown', 'Enter');
      spyOn(hostComponent, 'onKeydowned');
      hostFixture.detectChanges();
      const input = hostFixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      input.dispatchEvent(expectedEvent);
      expect(hostComponent.onKeydowned).toHaveBeenCalledWith(expectedEvent);
    });

    it('should emit the KeyboardEvent when a key is released', () => {
      const expectedEvent = createKeyEvent('keyup', 'Enter');
      spyOn(hostComponent, 'onKeyupped');
      hostFixture.detectChanges();
      const input = hostFixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      input.dispatchEvent(expectedEvent);
      expect(hostComponent.onKeyupped).toHaveBeenCalledWith(expectedEvent);
    });

    it('should emit the MouseEvent when the input is clicked', () => {
      const expectedEvent = new MouseEvent('click');
      spyOn(hostComponent, 'onClicked');
      hostFixture.detectChanges();
      const input = hostFixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      input.dispatchEvent(expectedEvent);
      expect(hostComponent.onClicked).toHaveBeenCalledWith(expectedEvent);
    });

    it('should emit the MouseEvent when the input is double-clicked', () => {
      const expectedEvent = new MouseEvent('dblclick');
      spyOn(hostComponent, 'onDblclicked');
      hostFixture.detectChanges();
      const input = hostFixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      input.dispatchEvent(expectedEvent);
      expect(hostComponent.onDblclicked).toHaveBeenCalledWith(expectedEvent);
    });

    it('should emit the FocusEvent when the input is focused', () => {
      const expectedEvent = new FocusEvent('focus');
      spyOn(hostComponent, 'onFocused');
      hostFixture.detectChanges();
      const input = hostFixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      input.dispatchEvent(expectedEvent);
      expect(hostComponent.onFocused).toHaveBeenCalledWith(expectedEvent);
    });

    it('should emit the FocusEvent when the input is blurred', () => {
      const expectedEvent = new FocusEvent('blur');
      spyOn(hostComponent, 'onBlurred');
      hostFixture.detectChanges();
      const input = hostFixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      input.dispatchEvent(expectedEvent);
      expect(hostComponent.onBlurred).toHaveBeenCalledWith(expectedEvent);
    });

    it('should emit the MouseEvent when the input is moved', () => {
      const expectedEvent = new MouseEvent('mousemove');
      spyOn(hostComponent, 'onMousemoved');
      hostFixture.detectChanges();
      const input = hostFixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      input.dispatchEvent(expectedEvent);
      expect(hostComponent.onMousemoved).toHaveBeenCalledWith(expectedEvent);
    });
  });
});
////// Test Host Component //////
import { Component, EventEmitter, provideZoneChangeDetection } from '@angular/core';
import { CaepValueChange } from '../../models';


@Component({
    template: ` <caep-text
    [prop]="prop"
    [model]="model"
    (valueChanges)="onValueChanges($event)"
    (canValueChange)="onCanValueChange($event)"
    [enable]="enable"
    [show]="show"
    [resource]="resource"
    [selectors]="selectors"
    [options]="options"
    [id]="id"
    [tabindex]="tabindex"
    [autofocus]="autofocus"
    [label]="label"
    [width]="width"
    [height]="height"
    [containerClass]="containerClass"
    [tooltip]="tooltip"
    (keypressed)="onKeypressed($event)"
    (keydowned)="onKeydowned($event)"
    (keyupped)="onKeyupped($event)"
    (clicked)="onClicked($event)"
    (dblclicked)="onDblclicked($event)"
    (focused)="onFocused($event)"
    (blurred)="onBlurred($event)"
    (mousemoved)="onMousemoved($event)"
  >
  </caep-text>`,
    standalone: false
})
class TestHostComponent {
  model: { [id: string]: any } = { name: 'test name', age: 30 };
  prop: string = 'name';
  value: any;
  enable: boolean = true;
  show: boolean = true;
  resource: string;
  selectors: string[] = ['enable', 'show'];
  options: CaepTextOptions = new CaepTextOptions();
  id: string;
  tabindex: number | string = 0;
  autofocus: boolean = false;
  label: string;
  width: string | number;
  height: string | number;
  containerClass: string | string[];
  tooltip: string;

  onValueChanges(changed: any) {
    this.value = changed;
  }
  onCanValueChange(event: CaepValueChange<any>) { }
  onKeypressed(event: KeyboardEvent) { }
  onKeydowned(event: KeyboardEvent) { }
  onKeyupped(event: KeyboardEvent) { }
  onClicked(event: MouseEvent) { }
  onDblclicked(event: MouseEvent) { }
  onFocused(event: FocusEvent) { }
  onBlurred(event: FocusEvent) { }
  onMousemoved(event: MouseEvent) { }
}

function createKeyEvent(type: string, key: string): KeyboardEvent {
  const event = new KeyboardEvent(type, {
    key,
    code: key,
  });
  return event;
}

import { IShRadioOptions, ShRadioComponent } from '../../../components/radio/radio.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { KeyCode } from '../../../utilities/key-code.const';
import { ILookupSingle } from '../../../components/base';

describe('Radio component', () => {
  let component: ShRadioComponent<any, string>;
  let fixture: ComponentFixture<ShRadioComponent<any, any>>;
  let htmlElement: HTMLDivElement;

  const mockedId = 'sampleId';
  const idSequenceServiceNext = jasmine.createSpy().and.returnValue(mockedId);
  const mockedIdSequenceService = {
    next: idSequenceServiceNext
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ShRadioComponent],
      providers: [
        ValidatorHelper,
        AspectHelper,
        ContextService,
        { provide: IdSequenceService, useValue: mockedIdSequenceService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    idSequenceServiceNext.calls.reset();
    fixture = TestBed.createComponent(ShRadioComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: 'myValue' };
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

  it('constructor should set groupName to idSequence next value', () => {
    expect(idSequenceServiceNext).toHaveBeenCalledTimes(2);
    expect(component['groupName']).toEqual(mockedId);
  });

  describe('onKey', () => {
    it('should do nothing when enable is false', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      component.enable = false;

      component['onKey'](event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
    it('should do nothing when keycode is not arrow down, up, left or right', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ALT
      });

      component['onKey'](event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
    it('should call next, preventDefault and stopPropagation when keyCode or which is arrow up', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const nextSpy = spyOn(component as any, 'next');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_UP
      });

      component['onKey'](event);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(nextSpy).toHaveBeenCalledOnceWith(false);
    });
    it('should call next, preventDefault and stopPropagation when keyCode or which is arrow left', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const nextSpy = spyOn(component as any, 'next');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ARROW_LEFT
      });

      component['onKey'](event);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(nextSpy).toHaveBeenCalledOnceWith(false);
    });
    it('should call next, preventDefault and stopPropagation when keyCode or which is arrow down', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const nextSpy = spyOn(component as any, 'next');
      Object.defineProperty(event, 'which', {
        value: KeyCode.ARROW_DOWN
      });

      component['onKey'](event);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(nextSpy).toHaveBeenCalledOnceWith(true);
    });
    it('should call next, preventDefault and stopPropagation when keyCode or which is arrow right', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const nextSpy = spyOn(component as any, 'next');
      Object.defineProperty(event, 'which', {
        value: KeyCode.ARROW_RIGHT
      });

      component['onKey'](event);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(nextSpy).toHaveBeenCalledOnceWith(true);
    });
  });

  it('toggle should call setControlValue with ref', () => {
    const value: ILookupSingle<string> = {
      id: '0',
      label: 'x',
      ref: 'x'
    };
    const setControlValueSpy = spyOn(component as any, 'setControlValue');

    component['toggle'](value);

    expect(setControlValueSpy).toHaveBeenCalledOnceWith(value.ref);
  });

  describe('next', () => {
    it('should do nothing if value is undefined', () => {
      const toggleSpy = spyOn(component as any, 'toggle');
      const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(undefined);

      component['next']();

      expect(getControlValueSpy).toHaveBeenCalledTimes(1);
      expect(toggleSpy).not.toHaveBeenCalledTimes(1);
    });
    it('should do nothing if newIndex is -1', () => {
      const toggleSpy = spyOn(component as any, 'toggle');
      spyOn(component['values'], 'findIndex').and.returnValue(0);

      component['next'](false);

      expect(toggleSpy).not.toHaveBeenCalled();
    });
    const values: ILookupSingle<string>[] = [
      {
        id: '0',
        label: 'a',
        ref: 'a'
      },
      {
        id: '1',
        label: 'b',
        ref: 'b'
      },
      {
        id: '2',
        label: 'c',
        ref: 'c'
      }
    ];
    it('should call toggle with next index value', () => {
      const toggleSpy = spyOn(component as any, 'toggle');
      const currentIndex = 0;
      component['values'] = values;
      spyOn(component as any, 'getControlValue').and.returnValue(values[currentIndex].ref);

      component['next'](true);

      expect(toggleSpy).toHaveBeenCalledOnceWith(values[currentIndex + 1]);
    });
    it('should call toggle with 0 index value when next is true and currentIndex is last available value', () => {
      const toggleSpy = spyOn(component as any, 'toggle');
      const currentIndex = values.length - 1;
      component['values'] = values;
      spyOn(component as any, 'getControlValue').and.returnValue(values[currentIndex].ref);

      component['next'](true);

      expect(toggleSpy).toHaveBeenCalledOnceWith(values[0]);
    });
    it('should call toggle with previous index value', () => {
      const toggleSpy = spyOn(component as any, 'toggle');
      const currentIndex = 1;
      component['values'] = values;
      spyOn(component as any, 'getControlValue').and.returnValue(values[currentIndex].ref);

      component['next'](false);

      expect(toggleSpy).toHaveBeenCalledOnceWith(values[currentIndex - 1]);
    });
    it('should call toggle with last index value when next is false and currentIndex is 0', () => {
      const toggleSpy = spyOn(component as any, 'toggle');
      const currentIndex = 0;
      component['values'] = values;
      spyOn(component as any, 'getControlValue').and.returnValue(values[currentIndex].ref);

      component['next'](false);

      expect(toggleSpy).toHaveBeenCalledOnceWith(values[values.length - 1]);
    });
  });
});

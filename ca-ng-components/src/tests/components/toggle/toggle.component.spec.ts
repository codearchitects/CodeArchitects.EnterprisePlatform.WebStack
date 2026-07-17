import { KeyCode } from './../../../utilities/key-code.const';
import { ShToggleComponent } from '../../../components/toggle/toggle.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';

describe('Toggle component', () => {
  let component: ShToggleComponent;
  let fixture: ComponentFixture<ShToggleComponent>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ShToggleComponent],
      providers: [IdSequenceService, ValidatorHelper, AspectHelper, ContextService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShToggleComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: true };
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

  it('toggle should set opposite value of current one and call touch', () => {
    const expectedValue = false;
    const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(!expectedValue);
    const setControlValueSpy = spyOn(component as any, 'setControlValue');
    const touchSpy = spyOn(component as any, 'touch');

    component['toggle']();

    expect(getControlValueSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledOnceWith(expectedValue);
    expect(touchSpy).toHaveBeenCalledTimes(1);
  });

  describe('touch', () => {
    it('should not call markAsTouched if formControl is already touched', () => {
      component['formControl'].markAsTouched();
      const markAsTouchedSpy = spyOn(component['formControl'], 'markAsTouched');
      expect(component['formControl'].touched).toBeTruthy();

      component['touch']();

      expect(markAsTouchedSpy).not.toHaveBeenCalled();
    });

    it('should call markAsTouched', () => {
      const markAsTouchedSpy = spyOn(component['formControl'], 'markAsTouched');
      expect(component['formControl'].touched).toBeFalsy();

      component['touch']();

      expect(markAsTouchedSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('onKey', () => {
    it('should do nothing when enable is false', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      component.enable = false;

      component['onKey'](event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
    it('should do nothing when isReadonly is true', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      component['internalOptions'].isReadonly = true;

      component['onKey'](event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
    it('should do nothing when keycode is not enter or space', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ALT
      });

      component['onKey'](event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
    it('should call toggle, preventDefault and stopPropagation when keyCode or which is enter', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const toggleSpy = spyOn(component as any, 'toggle');
      Object.defineProperty(event, 'keyCode', {
        value: KeyCode.ENTER
      });

      component['onKey'](event);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(toggleSpy).toHaveBeenCalledTimes(1);
    });
    it('should call toggle, preventDefault and stopPropagation when keyCode or which is space', () => {
      const event = new KeyboardEvent('keydown');
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const toggleSpy = spyOn(component as any, 'toggle');
      Object.defineProperty(event, 'which', {
        value: KeyCode.SPACE
      });

      component['onKey'](event);

      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
      expect(toggleSpy).toHaveBeenCalledTimes(1);
    });
  });

});

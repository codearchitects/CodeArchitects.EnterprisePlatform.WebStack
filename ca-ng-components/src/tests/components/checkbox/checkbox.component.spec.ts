import { KeyCode } from './../../../utilities/key-code.const';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { FormHandlerService } from './../../../services/form-handler.service';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShCheckboxComponent } from '../../../components/checkbox/checkbox.component';
import * as common from '../../../utilities/common.utility';

describe('Checkbox component', () => {
  let component: ShCheckboxComponent;
  let fixture: ComponentFixture<ShCheckboxComponent>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ShCheckboxComponent],
      providers: [
        IdSequenceService,
        ValidatorHelper,
        AspectHelper,
        ContextService,
        FormHandlerService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShCheckboxComponent);
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
    const input = htmlElement.children[0] as HTMLInputElement;
    expect(input).toBeDefined();
    expect(input).not.toBeNull();
    expect(input instanceof HTMLInputElement).toBeTruthy();
    expect(input.type).toEqual('checkbox');
  });
  describe('onKey', () => {
    it('should do nothing when component is not enabled', () => {
      component.enable = false;
      const touchSpy = spyOn(component as any, 'touch');

      component['onKey'](new KeyboardEvent('keydown'));

      expect(touchSpy).not.toHaveBeenCalled();
    });
    it('should do nothing when component is readOnly', () => {
      component.enable = true;
      component['internalOptions'].isReadonly = true;
      const touchSpy = spyOn(component as any, 'touch');

      component['onKey'](new KeyboardEvent('keydown'));

      expect(touchSpy).not.toHaveBeenCalled();
    });
    it('should do nothing when keypressed keyCode is not enter or space', () => {
      const touchSpy = spyOn(component as any, 'touch');
      const event = new KeyboardEvent('keydown');
      const inSpy = spyOn(common, 'IN').and.callThrough();
      Object.defineProperty(event, 'keyCode', {
        value: 65
      });

      component['onKey'](event);

      expect(inSpy).toHaveBeenCalledTimes(1);
      expect(inSpy).toHaveBeenCalledWith(event.keyCode, KeyCode.ENTER, KeyCode.SPACE);
      expect(touchSpy).not.toHaveBeenCalled();
    });
    it('should do nothing when keypressed which is not enter or space', () => {
      const touchSpy = spyOn(component as any, 'touch');
      const event = new KeyboardEvent('keydown');
      const inSpy = spyOn(common, 'IN').and.callThrough();
      Object.defineProperty(event, 'which', {
        value: 65
      });

      component['onKey'](event);

      expect(inSpy).toHaveBeenCalledTimes(1);
      expect(inSpy).toHaveBeenCalledWith(event.which, KeyCode.ENTER, KeyCode.SPACE);
      expect(touchSpy).not.toHaveBeenCalled();
    });
    it('should call toggle, preventDefault and stopPropagation when keyCode is enter', () => {
      const touchSpy = spyOn(component as any, 'touch');
      const event = new KeyboardEvent('keydown');
      const inSpy = spyOn(common, 'IN').and.callThrough();
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      Object.defineProperty(event, 'keyCode', {
        value: 13
      });

      component['onKey'](event);

      expect(inSpy).toHaveBeenCalledTimes(1);
      expect(inSpy).toHaveBeenCalledWith(event.keyCode, KeyCode.ENTER, KeyCode.SPACE);
      expect(touchSpy).toHaveBeenCalledTimes(1);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
    });
    it('should call toggle, preventDefault and stopPropagation when keyCode is space', () => {
      const touchSpy = spyOn(component as any, 'touch');
      const event = new KeyboardEvent('keydown');
      const inSpy = spyOn(common, 'IN').and.callThrough();
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      Object.defineProperty(event, 'keyCode', {
        value: 32
      });

      component['onKey'](event);

      expect(inSpy).toHaveBeenCalledTimes(1);
      expect(inSpy).toHaveBeenCalledWith(event.keyCode, KeyCode.ENTER, KeyCode.SPACE);
      expect(touchSpy).toHaveBeenCalledTimes(1);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('toggle', () => {
    it('should do nothing when component is not enabled', () => {
      component.enable = false;
      const setControlValueSpy = spyOn(component as any, 'setControlValue');
      const touchSpy = spyOn(component as any, 'touch');

      component['toggle']();

      expect(setControlValueSpy).not.toHaveBeenCalled();
      expect(touchSpy).not.toHaveBeenCalled();
    });
    it('should do nothing when component is readOnly', async(() => {
      component.enable = true;
      component['internalOptions'].isReadonly = true;
      const setControlValueSpy = spyOn(component as any, 'setControlValue');
      const touchSpy = spyOn(component as any, 'touch');

      component['toggle']();

      expect(setControlValueSpy).not.toHaveBeenCalled();
      expect(touchSpy).not.toHaveBeenCalled();
    }));
    it('toggle should call setControlValue and touch when component is enabled and not readonly', () => {
      const controlValue = true;
      const setControlValueSpy = spyOn(component as any, 'setControlValue');
      const touchSpy = spyOn(component as any, 'touch');
      component.enable = true;
      component['internalOptions'].isReadonly = false;
      spyOn(component as any, 'getControlValue').and.returnValue(controlValue);

      component['toggle']();

      expect(setControlValueSpy).toHaveBeenCalledTimes(1);
      expect(setControlValueSpy).toHaveBeenCalledWith(!controlValue);
      expect(touchSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('touch', () => {
    it('should do nothing if formControl is touched', () => {
      const markAsTouchedSpy = spyOn(component['formControl'], 'markAsTouched');
      Object.defineProperty(component['formControl'], 'touched', {
        value: true
      });

      component['touch']();

      expect(markAsTouchedSpy).not.toHaveBeenCalled();
    });
    it('should call formControl markAsTouched', () => {
      const markAsTouchedSpy = spyOn(component['formControl'], 'markAsTouched');
      Object.defineProperty(component['formControl'], 'touched', {
        value: false
      });

      component['touch']();

      expect(markAsTouchedSpy).toHaveBeenCalledTimes(1);
    });
  });
});

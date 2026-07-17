import { ILookupMulti } from './../../../components/base/base-lookup-multi.component';
import { KeyCode } from './../../../utilities/key-code.const';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { FormHandlerService } from './../../../services/form-handler.service';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShCheckgroupComponent } from '../../../components/checkgroup/checkgroup.component';
import { ShFormControl } from '../../../utilities/form-control.utility';
import * as common from '../../../utilities/common.utility';

describe('Checkgroup component', () => {
  let component: ShCheckgroupComponent<any, any>;
  let fixture: ComponentFixture<ShCheckgroupComponent<any, any>>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ShCheckgroupComponent],
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
    fixture = TestBed.createComponent(ShCheckgroupComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: [true, false, true] };
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
  describe('onKey', () => {
    it('should do nothing when component is not enabled', () => {
      component.enable = false;
      const toggleSpy = spyOn(component as any, 'toggle');

      component['onKey']('id0', new KeyboardEvent('keydown'));

      expect(toggleSpy).not.toHaveBeenCalled();
    });
    it('should do nothing when component is readOnly', () => {
      component.enable = true;
      component['internalOptions'].isReadonly = true;
      const toggleSpy = spyOn(component as any, 'toggle');

      component['onKey']('id0', new KeyboardEvent('keydown'));

      expect(toggleSpy).not.toHaveBeenCalled();
    });
    it('should do nothing when keypressed keyCode is not enter or space', () => {
      const toggleSpy = spyOn(component as any, 'toggle');
      const event = new KeyboardEvent('keydown');
      const inSpy = spyOn(common, 'IN').and.callThrough();
      Object.defineProperty(event, 'keyCode', {
        value: 65
      });

      component['onKey']('id0', event);

      expect(inSpy).toHaveBeenCalledTimes(1);
      expect(inSpy).toHaveBeenCalledWith(event.keyCode, KeyCode.ENTER, KeyCode.SPACE);
      expect(toggleSpy).not.toHaveBeenCalled();
    });
    it('should do nothing when keypressed which is not enter or space', () => {
      const toggleSpy = spyOn(component as any, 'toggle');
      const event = new KeyboardEvent('keydown');
      const inSpy = spyOn(common, 'IN').and.callThrough();
      Object.defineProperty(event, 'which', {
        value: 65
      });

      component['onKey']('id0', event);

      expect(inSpy).toHaveBeenCalledTimes(1);
      expect(inSpy).toHaveBeenCalledWith(event.which, KeyCode.ENTER, KeyCode.SPACE);
      expect(toggleSpy).not.toHaveBeenCalled();
    });
    it('should call toggle, preventDefault and stopPropagation when keyCode is enter', () => {
      const toggleSpy = spyOn(component as any, 'toggle');
      const event = new KeyboardEvent('keydown');
      const inSpy = spyOn(common, 'IN').and.callThrough();
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const checkboxId = 'id1';
      Object.defineProperty(event, 'keyCode', {
        value: 13
      });

      component['onKey'](checkboxId, event);

      expect(inSpy).toHaveBeenCalledTimes(1);
      expect(inSpy).toHaveBeenCalledWith(event.keyCode, KeyCode.ENTER, KeyCode.SPACE);
      expect(toggleSpy).toHaveBeenCalledTimes(1);
      expect(toggleSpy).toHaveBeenCalledWith(checkboxId);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
    });
    it('should call toggle, preventDefault and stopPropagation when keyCode is space', () => {
      const toggleSpy = spyOn(component as any, 'toggle');
      const event = new KeyboardEvent('keydown');
      const inSpy = spyOn(common, 'IN').and.callThrough();
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      const checkboxId = 'id2';
      Object.defineProperty(event, 'keyCode', {
        value: 32
      });

      component['onKey'](checkboxId, event);

      expect(inSpy).toHaveBeenCalledTimes(1);
      expect(inSpy).toHaveBeenCalledWith(event.keyCode, KeyCode.ENTER, KeyCode.SPACE);
      expect(toggleSpy).toHaveBeenCalledTimes(1);
      expect(toggleSpy).toHaveBeenCalledWith(checkboxId);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
      expect(stopPropagationSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe('toggle', () => {
    const sutFormControl = new ShFormControl();
    sutFormControl.setValue(false);
    const values = [
      {
        id: 'id0',
        label: 'a',
        ref: true,
        formControl: new ShFormControl()
      },
      {
        id: 'id1',
        label: 'b',
        ref: false,
        formControl: sutFormControl
      }
    ];
    it('should do nothing when component is not enabled', () => {
      component.enable = false;
      const setValueSpy = spyOn(sutFormControl, 'setValue');

      component['toggle']('id1');

      expect(setValueSpy).not.toHaveBeenCalled();
    });
    it('should do nothing when component is readOnly', async(() => {
      component.enable = true;
      component['internalOptions'].isReadonly = true;
      const setValueSpy = spyOn(sutFormControl, 'setValue');

      component['toggle']('id1');

      expect(setValueSpy).not.toHaveBeenCalled();
    }));
    it('toggle should call formControl setValue when component is enabled and not readonly', () => {
      const setValueSpy = spyOn(sutFormControl, 'setValue');
      component.enable = true;
      component['internalOptions'].isReadonly = false;
      component['values'] = values;

      component['toggle']('id1');

      expect(setValueSpy).toHaveBeenCalledTimes(1);
      expect(setValueSpy).toHaveBeenCalledWith(!sutFormControl.value);
    });
  });
});

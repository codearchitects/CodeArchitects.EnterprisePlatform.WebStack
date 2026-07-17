import { ShFormControl, ShFormControlMode } from './../../../utilities/form-control.utility';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { FormHandlerService } from '../../../services/form-handler.service';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { BaseFormattedFixture } from '../../fixtures';

describe('BaseFormatted component', () => {
  let component: BaseFormattedFixture;
  let fixture: ComponentFixture<BaseFormattedFixture>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseFormattedFixture],
      providers: [IdSequenceService, ValidatorHelper, FormHandlerService, AspectHelper, ContextService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseFormattedFixture);
    component = fixture.debugElement.componentInstance;
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector<HTMLDivElement>('#base-formatted-component');
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });

  it('should return mode', () => {
    const expectedMode = ShFormControlMode.Edit;
    const control = new ShFormControl();
    control.mode = expectedMode;

    expect(component.mode).not.toEqual(expectedMode);
    component['formControl'] = control;
    expect(component.mode).toEqual(expectedMode);
  });
  describe('onControlValueChanges', () => {
    it('should call tolerantCheck and commit if returns true', () => {
      const tolerantCheckSpy = spyOn(component as any, 'tolerantCheck').and.returnValue(true);
      const commitSpy = spyOn(component as any, 'commit');
      const control = new ShFormControl();
      control.mode = ShFormControlMode.Edit;
      component['formControl'] = control;
      tolerantCheckSpy.calls.reset();
      commitSpy.calls.reset();

      component['onControlValueChanges']();
      expect(tolerantCheckSpy).toHaveBeenCalledTimes(1);
      expect(commitSpy).toHaveBeenCalledTimes(1);
    });
    it('should call tolerantCheck and rollback if returns false', () => {
      const tolerantCheckSpy = spyOn(component as any, 'tolerantCheck').and.returnValue(false);
      const rollbackSpy = spyOn(component as any, 'rollback');
      const control = new ShFormControl();
      control.mode = ShFormControlMode.Edit;
      component['formControl'] = control;
      tolerantCheckSpy.calls.reset();
      rollbackSpy.calls.reset();

      component['onControlValueChanges']();
      expect(tolerantCheckSpy).toHaveBeenCalledTimes(1);
      expect(rollbackSpy).toHaveBeenCalledTimes(1);
    });
  });
  it('modelValueChangesHandler should call updateControlValue when mode is browse', () => {
    const spy = spyOn(component as any, 'updateControlValue');
    const control = new ShFormControl();
    control.mode = ShFormControlMode.Browse;
    component['formControl'] = control;
    spy.calls.reset();

    component['modelValueChangesHandler']();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('commit should set oldValue and call updateModelValue', () => {
    const expectedValue = 'sample';
    const updateModelValueSpy = spyOn(component as any, 'updateModelValue');
    const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue(expectedValue);
    updateModelValueSpy.calls.reset();
    getControlValueSpy.calls.reset();

    component['commit']();
    expect(getControlValueSpy).toHaveBeenCalledTimes(1);
    expect(updateModelValueSpy).toHaveBeenCalledTimes(1);
    expect(component['oldValue']).toEqual(expectedValue);
  });
  it('rollback should call setControlValue when value has changed', () => {
    const oldValue = 'bar';
    const getControlValueSpy = spyOn(component as any, 'getControlValue').and.returnValue('baz');
    const setControlValueSpy = spyOn(component as any, 'setControlValue');
    getControlValueSpy.calls.reset();
    setControlValueSpy.calls.reset();
    component['oldValue'] = oldValue;

    component['rollback']();
    expect(getControlValueSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledTimes(1);
    expect(setControlValueSpy).toHaveBeenCalledWith(oldValue);
  });
  describe('updateControlValue', () => {
    it('should update value calling formatModelValue', () => {
      const expectedValue = 'BAZ';
      const formatModelValueSpy = spyOn(component as any, 'formatModelValue').and.returnValue(expectedValue);
      const setControlValueSpy = spyOn(component as any, 'setControlValue');
      formatModelValueSpy.calls.reset();
      setControlValueSpy.calls.reset();

      component['updateControlValue']();
      expect(formatModelValueSpy).toHaveBeenCalledTimes(1);
      expect(setControlValueSpy).toHaveBeenCalledTimes(1);
      expect(setControlValueSpy).toHaveBeenCalledWith(expectedValue);
    });
    it('should update value using given value', () => {
      const expectedValue = 'baz';
      const setControlValueSpy = spyOn(component as any, 'setControlValue');
      setControlValueSpy.calls.reset();

      component['updateControlValue'](expectedValue);
      expect(setControlValueSpy).toHaveBeenCalledTimes(1);
      expect(setControlValueSpy).toHaveBeenCalledWith(expectedValue);
    });
  });
  describe('updateModelValue', () => {
    it('should update value calling parseControlValue', () => {
      const expectedValue = 'BAZ';
      const parseControlValueSpy = spyOn(component as any, 'parseControlValue').and.returnValue(expectedValue);
      const setModelValueSpy = spyOn(component as any, 'setModelValue');
      parseControlValueSpy.calls.reset();
      setModelValueSpy.calls.reset();

      component['updateModelValue']();
      expect(parseControlValueSpy).toHaveBeenCalledTimes(1);
      expect(setModelValueSpy).toHaveBeenCalledTimes(1);
      expect(setModelValueSpy).toHaveBeenCalledWith(expectedValue);
    });
    it('should update value using given value', () => {
      const expectedValue = 'baz';
      const setModelValueSpy = spyOn(component as any, 'setModelValue');
      setModelValueSpy.calls.reset();

      component['updateModelValue'](expectedValue);
      expect(setModelValueSpy).toHaveBeenCalledTimes(1);
      expect(setModelValueSpy).toHaveBeenCalledWith(expectedValue);
    });
  });
  describe('onFocusIn', () => {
    it('should set mode to edit', () => {
      const control = new ShFormControl();
      component['formControl'] = control;


      expect(control.mode).not.toEqual(ShFormControlMode.Edit);
      component['onFocusIn']();
      expect(control.mode).toEqual(ShFormControlMode.Edit as any);
    });
    it('should call updateControlValue', () => {
      const control = new ShFormControl();
      const spy = spyOn(component as any, 'updateControlValue');
      component['formControl'] = control;
      spy.calls.reset();

      component['onFocusIn']();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call select on event target', () => {
      const control = new ShFormControl();
      const element = document.createElement('div');
      Object.defineProperty(element, 'select', {
        writable: true,
        value: () => null
      });
      const event = new FocusEvent('focusIn');
      Object.defineProperty(event, 'target', {
        writable: true
      });
      (event as any).target = element;
      const spy = spyOn(element as any, 'select');
      component['formControl'] = control;

      const jq = spyOn(window as any, '$').and.returnValue(element);

      component['onFocusIn'](event);
      expect(jq).toHaveBeenCalledTimes(1);
      expect(jq).toHaveBeenCalledWith(element);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
  describe('onFocusOut', () => {
    it('should set formControl mode to browse', () => {
      const control = new ShFormControl();
      control.mode = ShFormControlMode.Edit;
      component['formControl'] = control;

      expect(control.mode).not.toEqual(ShFormControlMode.Browse as any);
      component['onFocusOut']();
      expect(control.mode).toEqual(ShFormControlMode.Browse as any);
    });
    it('should call updateControlValue', () => {
      const control = new ShFormControl();
      const spy = spyOn(component as any, 'updateControlValue');
      component['formControl'] = control;
      spy.calls.reset();

      component['onFocusOut']();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});

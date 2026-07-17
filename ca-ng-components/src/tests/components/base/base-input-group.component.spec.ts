import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { FormHandlerService } from '../../../services/form-handler.service';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { BaseInputGroupFixture } from '../../fixtures';
import { SimpleChange } from '@angular/core';
import { FormGroup } from '@angular/forms';

describe('BaseInputGroup component', () => {
  let component: BaseInputGroupFixture;
  let fixture: ComponentFixture<BaseInputGroupFixture>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaseInputGroupFixture],
      providers: [IdSequenceService, ValidatorHelper, FormHandlerService, ContextService, AspectHelper]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseInputGroupFixture);
    component = fixture.debugElement.componentInstance;
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector<HTMLDivElement>('#base-input-group-component');
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });
  it('should return input class as string', () => {
    const classes = ['class1', 'class2', 'class3'];
    component['internalOptions'].inputClass = classes;

    expect(component.inputClass).toEqual('class1 class2 class3');
  });
  it('constructor should set form handler service', () => {
    expect(component['formHandler']).toBeDefined();
    expect(component['formHandler']).not.toBeNull();
    expect(component['formHandler'] instanceof FormHandlerService).toBeTruthy();
  });
  it('ngOnInit should call createFormGroup', () => {
    const spy = spyOn(component as any, 'createFormGroup');
    spy.calls.reset();

    component.ngOnInit();

    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('ngOnDestroy should call destroyFormGroup', () => {
    const spy = spyOn(component as any, 'destroyFormGroup');
    spy.calls.reset();

    component.ngOnDestroy();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should create form group', () => {
    const service = component['formHandler'];
    const expectedGroup = new FormGroup({});
    const spy = spyOn(service, 'getGroup').and.returnValue(expectedGroup);
    const model = { prop1: 'a' };
    const prop = 'prop1';
    const getModelValueSpy = spyOn(component as any, 'getModelValue').and.returnValue(model[prop]);
    component.prop = prop;
    component.model = model;
    component['formGroup'] = undefined;
    spy.calls.reset();
    getModelValueSpy.calls.reset();

    component['createFormGroup']();
    expect(getModelValueSpy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(model[prop], model);
    expect(component['formGroup']).toEqual(expectedGroup);
  });
  it('should destroy form group', () => {
    const service = component['formHandler'];
    const spy = spyOn(service, 'removeGroup');
    const model = { prop1: 'a' };
    const prop = 'prop1';
    const getModelValueSpy = spyOn(component as any, 'getModelValue').and.returnValue(model[prop]);
    component.prop = prop;
    component.model = model;
    spy.calls.reset();
    getModelValueSpy.calls.reset();

    component['destroyFormGroup']();
    expect(getModelValueSpy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(model[prop], model);
  });
  it('getDefaultOptions should have input options', () => {
    const defaults = component['getDefaultOptions']();

    expect(defaults).toBeDefined();
    expect(defaults.inputClass).toEqual([]);
    expect((defaults as any).onChange).toBeDefined();
    expect(typeof (defaults as any).onChange).toEqual('function');
    expect((defaults as any).onChange(null)).toBeUndefined();
  });

  it('should delete formGroup and create a new one when model changes', () => {
    const previousModel = { prop1: 'bar' };
    const prop = 'prop1';
    const newModel = { prop1: 'baz' };
    const change = new SimpleChange(previousModel, newModel, false);
    const service = component['formHandler'];
    const removeGroupSpy = spyOn(service, 'removeGroup');
    const createFormGroupSpy = spyOn(component as any, 'createFormGroup');
    component.model = previousModel;
    component.prop = prop;
    removeGroupSpy.calls.reset();
    createFormGroupSpy.calls.reset();

    component.ngOnChanges({ model: change });
    expect(removeGroupSpy).toHaveBeenCalledTimes(1);
    expect(removeGroupSpy).toHaveBeenCalledWith(previousModel[prop], previousModel);
    expect(createFormGroupSpy).toHaveBeenCalledTimes(1);
  });
});

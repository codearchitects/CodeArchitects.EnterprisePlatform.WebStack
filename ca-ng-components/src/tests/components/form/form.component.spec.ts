import { I18nModule } from '@ca-webstack/ng-i18n';
import { TranslateModule } from '@ngx-translate/core';
import { ShFormComponent } from '../../../components/form/form.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IShBaseOptions, ShValidationMessageComponent } from '../../../components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormHandlerService, IdSequenceService } from '../../../services';
import { ErrorMessagePipe, WarningMessagePipe } from '../../../components/pipes';
import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { ComplexTypeList } from '../../../utilities/complex-type.list';
import { SimpleChange, SimpleChanges } from '@angular/core';

describe('Form component', () => {
  let component: ShFormComponent<any, IShBaseOptions>;
  let fixture: ComponentFixture<ShFormComponent<any, IShBaseOptions>>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), I18nModule],
      declarations: [ShFormComponent, ShValidationMessageComponent, ErrorMessagePipe, WarningMessagePipe],
      providers: [IdSequenceService, ContextService, ComplexTypeList, ValidatorHelper, AspectHelper, FormHandlerService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShFormComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: 'value' };
    fixture.detectChanges();
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector('div');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });

  it('constructor should set formHandler', () => {
    expect(component['formHandler']).toBeDefined();
    expect(component['formHandler']).not.toBeNull();
    expect(component['formHandler'] instanceof FormHandlerService).toBeTruthy();
  });

  it('ngOnInit should call createFormGroup', () => {
    const createFormGroupSpy = spyOn(component as any, 'createFormGroup');

    component.ngOnInit();

    expect(createFormGroupSpy).toHaveBeenCalledTimes(1);
  });

  it('ngOnDestroy should call destroyFormGroup', () => {
    const destroyFormGroupSpy = spyOn(component as any, 'destroyFormGroup');

    component.ngOnDestroy();

    expect(destroyFormGroupSpy).toHaveBeenCalledTimes(1);
  });

  describe('ngOnChanges', () => {
    it('should call createFormGroup', () => {
      const createFormGroupSpy = spyOn(component as any, 'createFormGroup');

      component.ngOnChanges({});

      expect(createFormGroupSpy).toHaveBeenCalledTimes(1);
    });
    it('should delete formGroup when model changes', () => {
      const createFormGroupSpy = spyOn(component as any, 'createFormGroup');
      const removeGroupSpy = spyOn(component['formHandler'], 'removeGroup');
      const previousValue = 'foo';
      const changes: SimpleChanges = {
        'model': new SimpleChange(previousValue, 'sample', false)
      };
      component['formGroup'] = {} as any;

      expect(component['formGroup']).toBeDefined();

      component.ngOnChanges(changes);

      expect(removeGroupSpy).toHaveBeenCalledTimes(1);
      expect(removeGroupSpy).toHaveBeenCalledWith(previousValue);
      expect(createFormGroupSpy).toHaveBeenCalledTimes(1);
      expect(component['formGroup']).toBeUndefined();
    });
  });
  describe('createFormGroup', () => {
    it('should do nothing if formGroup already exists', () => {
      const fakeFormGroup: any = {};
      component['formGroup'] = fakeFormGroup;

      component['createFormGroup']();

      expect(component['formGroup']).toEqual(fakeFormGroup);
    });
    it('should call formHandler getGroup and assign to formGroup', () => {
      const fakeModel = { myModel: 'myValue' };
      const fakeGroup: any = { value: 'myGroup' };
      const getGroupSpy = spyOn(component['formHandler'], 'getGroup').and.returnValue(fakeGroup);
      component.model = fakeModel;
      component['formGroup'] = undefined;

      component['createFormGroup']();

      expect(getGroupSpy).toHaveBeenCalledTimes(1);
      expect(getGroupSpy).toHaveBeenCalledWith(fakeModel);
      expect(component['formGroup']).toEqual(fakeGroup);
    });
  });
  it('destroyFormGroup should call formHandler removeGroup', () => {
    const fakeModel = { myModel: 'myValue' };
    const removeGroupSpy = spyOn(component['formHandler'], 'removeGroup');
    component.model = fakeModel;

    component['destroyFormGroup']();

    expect(removeGroupSpy).toHaveBeenCalledTimes(1);
    expect(removeGroupSpy).toHaveBeenCalledWith(fakeModel);
  });
});

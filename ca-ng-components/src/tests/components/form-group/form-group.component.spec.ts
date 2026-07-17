import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ShComponentsModule } from '../../../components/components.module';
import { ShFormGroupComponent } from '../../../components/form-group/form-group.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IdSequenceService } from '../../../services';
import { ContextService } from '@ca-webstack/ng-aspects';
import { IShBaseOptions } from '../../../components';

describe('FormGroup component', () => {
  let component: ShFormGroupComponent<any, IShBaseOptions>;
  let fixture: ComponentFixture<ShFormGroupComponent<any, IShBaseOptions>>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ShComponentsModule, TranslateModule.forRoot()],
      providers: [IdSequenceService, ContextService, TranslateService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShFormGroupComponent);
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

  describe('createFormGroup', () => {
    it('should do nothing if formGroup already exists', () => {
      const fakeFormGroup: any = {};
      component['formGroup'] = fakeFormGroup;

      component['createFormGroup']();

      expect(component['formGroup']).toEqual(fakeFormGroup);
    });
    it('should call formHandler getGroup and set return value to formGroup', () => {
      const mockedFormGroup: any = { myGroup: 'group' };
      const mockedParent = { aParent: 'parent' };
      const mockedModel = { myProp: 'theProp' };
      const getGroupSpy = spyOn(component['formHandler'], 'getGroup').and.returnValue(mockedFormGroup);
      component.model = mockedModel;
      component.parent = mockedParent;
      component['formGroup'] = undefined;

      component['createFormGroup']();

      expect(getGroupSpy).toHaveBeenCalledTimes(1);
      expect(getGroupSpy).toHaveBeenCalledWith(mockedModel, mockedParent);
      expect(component['formGroup']).toEqual(mockedFormGroup);
    });
  });
  it('destroyFormGroup should call formHandler removeGroup', () => {
    const removeGroupSpy = spyOn(component['formHandler'], 'removeGroup');
    const mockedParent = { aParent: 'parent' };
    const mockedModel = { myProp: 'theProp' };
    component.model = mockedModel;
    component.parent = mockedParent;

    component['destroyFormGroup']();

    expect(removeGroupSpy).toHaveBeenCalled();
    expect(removeGroupSpy).toHaveBeenCalledWith(mockedModel, mockedParent);
  });
});

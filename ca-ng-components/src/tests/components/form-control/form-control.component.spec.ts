import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ShComponentsModule } from './../../../components/components.module';
import { ShFormControlComponent } from '../../../components/form-control/form-control.component';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { IdSequenceService } from '../../../services';
import { ContextService } from '@ca-webstack/ng-aspects';
import * as utilities from '../../../utilities/common.utility';

describe('FormControl component', () => {
  let component: ShFormControlComponent<any>;
  let fixture: ComponentFixture<ShFormControlComponent<any>>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ShComponentsModule, TranslateModule.forRoot()],
      providers: [IdSequenceService, ContextService, TranslateService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShFormControlComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: 'value' };
    component.prop = 'prop';
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

  describe('constructor', () => {
    it('should set context service', () => {
      expect(component['_contextService']).toBeDefined();
      expect(component['_contextService']).not.toBeNull();
      expect(component['_contextService'] instanceof ContextService).toBeTruthy();
    });
    it('should subscribe contextService contextChange', () => {
      expect(component['_contextService'].contextChange.observers.length).toEqual(1);
    });
    it('should set isReady to false and call a yieldFunc when contextChange emits a value', () => {
      const yieldFuncSpy = spyOn(utilities, 'yieldFunc');
      component['isReady'] = true;

      component['_contextService'].contextChange.next();

      expect(component['isReady']).toBeFalsy();
      expect(yieldFuncSpy).toHaveBeenCalledTimes(1);
    });
    describe('subscription yield function', () => {
      it('should set isReady to true', fakeAsync(() => {
        const yieldFuncSpy = spyOn(utilities, 'yieldFunc').and.callThrough();
        component['isReady'] = false;

        component['_contextService'].contextChange.next();
        tick();

        expect(yieldFuncSpy).toHaveBeenCalledTimes(1);
        expect(component['isReady']).toBeTruthy();
      }));
    });
  });

});

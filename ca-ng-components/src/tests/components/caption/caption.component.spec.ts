import { ShIconComponent } from './../../../components/icon/icon.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShCaptionComponent } from './../../../components/caption/caption.component';
import { ValidatorHelper, AspectHelper, ContextService } from '@ca-webstack/ng-aspects';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormHandlerService } from '../../../services/form-handler.service';
import { IdSequenceService } from '../../../services/id-sequence.service';

describe('Caption component', () => {
  let component: ShCaptionComponent<any>;
  let fixture: ComponentFixture<ShCaptionComponent<any>>;
  let htmlElement: HTMLLabelElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), I18nModule],
      declarations: [ShCaptionComponent, ShIconComponent],
      providers: [
        IdSequenceService,
        ValidatorHelper,
        AspectHelper,
        ContextService,
        FormHandlerService,
        TranslateService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShCaptionComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector('label');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLLabelElement).toBeTruthy();
  });
  it('should set model as empty object if undefined', () => {
    component.model = undefined;

    component.ngOnInit();
    expect(component.model).toEqual({});
  });
});

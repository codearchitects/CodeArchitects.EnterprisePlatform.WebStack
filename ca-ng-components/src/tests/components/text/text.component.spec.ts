import { AspectHelper, ContextService, ValidatorHelper } from '@ca-webstack/ng-aspects';
import { FormHandlerService } from './../../../services/form-handler.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '@ca-webstack/ng-i18n';
import { ShTextComponent } from './../../../components/text/text.component';
import { ShIconComponent } from './../../../components/icon/icon.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('Text component', () => {
  let component: ShTextComponent;
  let fixture: ComponentFixture<ShTextComponent>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), I18nModule],
      declarations: [ShTextComponent, ShIconComponent],
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
    fixture = TestBed.createComponent(ShTextComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: 'value' };
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
    expect(input.type).toEqual('text');
  });
  it('getDefaultOptions should return correct type', () => {
    const options = component['getDefaultOptions']();
    expect(options).toBeDefined();
    expect(options).not.toBeNull();
    expect(options.type).toEqual('text');
  });
});

import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ShComponentsModule } from '../../../components/components.module';
import { ShFormArrayComponent } from '../../../components/form-array/form-array.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IdSequenceService } from '../../../services';
import { ContextService } from '@ca-webstack/ng-aspects';
import { IShBaseOptions } from '../../../components';

describe('FormArray component', () => {
  let component: ShFormArrayComponent<Array<any>, IShBaseOptions>;
  let fixture: ComponentFixture<ShFormArrayComponent<any, IShBaseOptions>>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ShComponentsModule, TranslateModule.forRoot()],
      providers: [IdSequenceService, ContextService, TranslateService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShFormArrayComponent);
    component = fixture.debugElement.componentInstance;
    component.model = [];
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

});

import { TranslateModule } from '@ngx-translate/core';
import { ShIconComponent } from './../../../components/icon/icon.component';
import { ShSliderComponent } from '../../../components/slider/slider.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { FormHandlerService } from '../../../services/form-handler.service';
import { ValidatorHelper, AspectHelper, ContextService } from '@ca-webstack/ng-aspects';

describe('Slider component', () => {
  let component: ShSliderComponent;
  let fixture: ComponentFixture<ShSliderComponent>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [ShSliderComponent, ShIconComponent],
      providers: [IdSequenceService, FormHandlerService, ValidatorHelper, AspectHelper, ContextService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShSliderComponent);
    component = fixture.debugElement.componentInstance;
    component.model = { prop: 10 };
    component.prop = 'prop';
    fixture.detectChanges();
    htmlElement = fixture.debugElement.nativeElement.querySelector('div');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
    const input = htmlElement.children[0] as HTMLInputElement;
    expect(input).toBeDefined();
    expect(input).not.toBeNull();
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input.type).toEqual('range');
  });

});

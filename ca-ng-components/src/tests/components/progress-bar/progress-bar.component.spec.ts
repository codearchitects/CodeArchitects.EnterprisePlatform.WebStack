import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { ShProgressBarPercentPipe } from './../../../pipes/progress-bar.pipe';
import { ShProgressBarComponent } from '../../../components/progress-bar/progress-bar.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';

describe('ProgressBar component', () => {
  let component: ShProgressBarComponent;
  let fixture: ComponentFixture<ShProgressBarComponent>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShProgressBarComponent, ShProgressBarPercentPipe],
      providers: [IdSequenceService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShProgressBarComponent);
    component = fixture.debugElement.componentInstance;
    component.value = 0;
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

  it('should initialize values correctly', () => {
    expect(component['_isIndeterminate']).toBeFalsy();
    expect(component['_showLabel']).toBeFalsy();
    expect(component['_min']).toEqual(0);
    expect(component['_value']).toEqual(0);
    expect(component['MAX_DEFAULT']).toEqual(100);
    expect(component['_max']).toEqual(component['MAX_DEFAULT']);
  });

  describe('value', () => {
    it('getter should return current value', () => {
      const expectedValue = 34;
      component['_value'] = expectedValue;

      expect(component.value).toEqual(expectedValue);
    });
    it('setter should coerce number and set it to value', () => {
      const value: any = '31.5';
      const coercedValue = coerceNumberProperty(value);

      component.value = value;

      expect(component.value).toEqual(coercedValue);
    });
    it('setter should throw an error in console when value exceedes max value', () => {
      const value = 105;
      const consoleErrorSpy = spyOn(console, 'error');

      component.value = value;

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(component.value).toEqual(value);
    });
  });

  describe('max', () => {
    it('getter should return current value', () => {
      const expectedMax = 200;
      component['_max'] = expectedMax;

      expect(component.max).toEqual(expectedMax);
    });
    it('setter should set max using coercion', () => {
      const max: any = '200';
      const coercedMax = coerceNumberProperty(max);

      component.max = max;

      expect(component.max).toEqual(coercedMax);
    });
    it('setter should set default max when value is null', () => {
      component.max = null;

      expect(component.max).toEqual(component['MAX_DEFAULT']);
    });
    it('setter should set default max when value is undefined', () => {
      component.max = undefined;

      expect(component.max).toEqual(component['MAX_DEFAULT']);
    });
  });

  describe('min', () => {
    it('getter should return current value', () => {
      const expectedMin = 10;
      component['_min'] = expectedMin;

      expect(component.min).toEqual(expectedMin);
    });
    it('setter should set min using coercion', () => {
      const min: any = '15';
      const coercedMin = coerceNumberProperty(min);

      component.min = min;

      expect(component.min).toEqual(coercedMin);
    });
  });

  describe('showLabel', () => {
    it('getter should return current value', () => {
      const expectedShow = false;
      component['_showLabel'] = expectedShow;

      expect(component.showLabel).toEqual(expectedShow);
    });
    it('setter should set showLabel using coercion', () => {
      component.showLabel = false;
      const showLabel: any = 'true';
      const coercedShowLabel = coerceBooleanProperty(showLabel);

      component.showLabel = showLabel;

      expect(component.showLabel).toEqual(coercedShowLabel);
    });
  });

  describe('isIndeterminate', () => {
    it('getter should return current value', () => {
      const expectedIsIndeterminate = false;
      component['_isIndeterminate'] = expectedIsIndeterminate;

      expect(component.isIndeterminate).toEqual(expectedIsIndeterminate);
    });
    it('setter should set isIndeterminate using coercion', () => {
      component.isIndeterminate = false;
      const isIndeterminate: any = 'true';
      const coercedIsIndeterminate = coerceBooleanProperty(isIndeterminate);

      component.isIndeterminate = isIndeterminate;

      expect(component.isIndeterminate).toEqual(coercedIsIndeterminate);
    });
  });

});

import { ShIconComponent } from './../../../components/icon/icon.component';
import { ShButtonComponent } from './../../../components/button/button.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IdSequenceService } from '../../../services/id-sequence.service';
import { PolicyEngineService, ResourceService } from '@ca-webstack/ng-policy-engine';

describe('Button component', () => {
  let component: ShButtonComponent;
  let fixture: ComponentFixture<ShButtonComponent>;
  let htmlElement: HTMLButtonElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShButtonComponent, ShIconComponent],
      providers: [IdSequenceService, PolicyEngineService, ResourceService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShButtonComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    const html: HTMLElement = fixture.debugElement.nativeElement;
    htmlElement = html.querySelector('button');
  });
  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLButtonElement).toBeTruthy();
  });
  it('should set defaults', () => {
    expect(component.primary).toBeFalsy();
    expect(component.transparent).toBeFalsy();
    expect(component.negative).toBeFalsy();
    expect(component.outline).toBeFalsy();
  });
  it('getDefaultOptions should return correct type', () => {
    const options = component['getDefaultOptions']();
    expect(options).toBeDefined();
    expect(options).not.toBeNull();
    expect(options.type).toEqual('button');
  });
  describe('onClick', () => {
    const event = new MouseEvent('click');
    it('should stop propagation', () => {
      const spy = spyOn(event, 'stopPropagation');
      spy.calls.reset();

      component['onClick'](event);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should preventDefault if button is not enabled by auth', () => {
      const spy = spyOn(event, 'preventDefault');
      spy.calls.reset();
      component.enable = false;

      component['onClick'](event);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should emit click and clicked passing the event', () => {
      const clickEmitSpy = spyOn(component.click, 'emit');
      const clickedEmitSpy = spyOn(component.clicked, 'emit');
      clickEmitSpy.calls.reset();
      clickedEmitSpy.calls.reset();

      component['onClick'](event);
      expect(clickEmitSpy).toHaveBeenCalledTimes(1);
      expect(clickEmitSpy).toHaveBeenCalledWith(event);
      expect(clickedEmitSpy).toHaveBeenCalledTimes(1);
      expect(clickedEmitSpy).toHaveBeenCalledWith(event);
    });
  });
});

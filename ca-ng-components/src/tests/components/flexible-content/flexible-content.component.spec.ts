import { ShFlexibleContentComponent } from './../../../components/flexible-content/flexible-content.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

describe('FlexibleContent component', () => {
  let component: ShFlexibleContentComponent;
  let fixture: ComponentFixture<ShFlexibleContentComponent>;
  let htmlElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShFlexibleContentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShFlexibleContentComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    htmlElement = fixture.debugElement.nativeElement.querySelector('div');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement instanceof HTMLDivElement).toBeTruthy();
  });

});

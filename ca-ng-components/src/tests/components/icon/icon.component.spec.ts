import { ShIconComponent } from '../../../components/icon/icon.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange, SimpleChanges } from '@angular/core';

describe('Icon component', () => {
  let component: ShIconComponent;
  let fixture: ComponentFixture<ShIconComponent>;
  let htmlElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShIconComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShIconComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    htmlElement = fixture.debugElement.nativeElement.querySelector('i');
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(component).toBeTruthy();
    expect(htmlElement).toBeDefined();
    expect(htmlElement).not.toBeNull();
    expect(htmlElement).toBeInstanceOf(HTMLElement);
  });

  describe('ngOnChanges', () => {
    it('should do nothing if name did not change', () => {
      const expectedName = 'foo';
      const changes: SimpleChanges = {
        'myChange': {} as any
      };
      component.name = expectedName;

      component.ngOnChanges(changes);

      expect(component.name).toEqual(expectedName);
    });
    it('should change name', () => {
      const expectedName = 'sample';
      const changes: SimpleChanges = {
        'name': new SimpleChange(undefined, expectedName, false)
      };
      component.name = expectedName;

      component.ngOnChanges(changes);

      expect(component.name).toEqual(`icon icon-${expectedName}`);
    });
  });
});

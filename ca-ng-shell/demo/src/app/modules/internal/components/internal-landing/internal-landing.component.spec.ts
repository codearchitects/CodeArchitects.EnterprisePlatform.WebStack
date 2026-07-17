import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalLandingComponent } from './internal-landing.component';

describe('InternalLandingComponent', () => {
  let component: InternalLandingComponent;
  let fixture: ComponentFixture<InternalLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideZoneChangeDetection } from '@angular/core';
import { ColorsPageComponent } from './colors-page.component';

describe('ColorsPageComponent', () => {
  let component: ColorsPageComponent;
  let fixture: ComponentFixture<ColorsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorsPageComponent ],
      providers: [provideZoneChangeDetection()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

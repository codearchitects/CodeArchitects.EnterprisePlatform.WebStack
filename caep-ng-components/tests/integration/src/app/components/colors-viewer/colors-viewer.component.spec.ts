import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideZoneChangeDetection } from '@angular/core';
import { ColorsViewerComponent } from './colors-viewer.component';

describe('ColorsViewerComponent', () => {
  let component: ColorsViewerComponent;
  let fixture: ComponentFixture<ColorsViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorsViewerComponent ],
      providers: [provideZoneChangeDetection()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

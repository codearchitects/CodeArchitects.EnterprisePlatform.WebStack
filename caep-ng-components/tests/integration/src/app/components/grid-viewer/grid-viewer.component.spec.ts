import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideZoneChangeDetection } from '@angular/core';
import { GridViewerComponent } from './grid-viewer.component';

describe('GridViewerComponent', () => {
  let component: GridViewerComponent;
  let fixture: ComponentFixture<GridViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridViewerComponent ],
      providers: [provideZoneChangeDetection()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

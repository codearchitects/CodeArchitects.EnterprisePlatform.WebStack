import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideZoneChangeDetection } from '@angular/core';
import { CaepSidePanelComponent } from './side-panel.component';

describe('SidePanelComponent', () => {
  let component: CaepSidePanelComponent;
  let fixture: ComponentFixture<CaepSidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaepSidePanelComponent],
      providers: [provideZoneChangeDetection()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaepSidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

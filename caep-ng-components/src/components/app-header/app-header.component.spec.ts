import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideZoneChangeDetection } from '@angular/core';
import { CaepAppHeaderComponent } from './app-header.component';

describe('AppHeaderComponent', () => {
  let component: CaepAppHeaderComponent;
  let fixture: ComponentFixture<CaepAppHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaepAppHeaderComponent],
      providers: [provideZoneChangeDetection()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaepAppHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

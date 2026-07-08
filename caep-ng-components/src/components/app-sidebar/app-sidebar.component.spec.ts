import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideZoneChangeDetection } from '@angular/core';
import { CaepAppSidebarComponent } from './app-sidebar.component';

describe('AppSidebarComponent', () => {
  let component: CaepAppSidebarComponent;
  let fixture: ComponentFixture<CaepAppSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaepAppSidebarComponent],
      providers: [provideZoneChangeDetection()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaepAppSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

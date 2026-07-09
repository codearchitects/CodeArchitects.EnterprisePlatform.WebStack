import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideZoneChangeDetection } from '@angular/core';
import { CaepFloatingCommandsComponent } from './floating-commands.component';

describe('FloatingCommandsComponent', () => {
  let component: CaepFloatingCommandsComponent;
  let fixture: ComponentFixture<CaepFloatingCommandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaepFloatingCommandsComponent],
      providers: [provideZoneChangeDetection()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaepFloatingCommandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

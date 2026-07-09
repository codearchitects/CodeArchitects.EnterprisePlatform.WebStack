import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideZoneChangeDetection } from '@angular/core';
import { ColumnsExamplePageComponent } from './columns-example-page.component';

describe('ColumnsExamplePageComponent', () => {
  let component: ColumnsExamplePageComponent;
  let fixture: ComponentFixture<ColumnsExamplePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnsExamplePageComponent ],
      providers: [provideZoneChangeDetection()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnsExamplePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideZoneChangeDetection } from '@angular/core';
import { CaepContainerModule } from '../../container.module';
import { CaepContainerComponent } from './container.component';

describe('CaepContainerComponent', () => {
  let component: CaepContainerComponent;
  let fixture: ComponentFixture<CaepContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaepContainerModule.forRoot({ stackFrameFactory: null, taskSlotFactory: null })],
      providers: [provideZoneChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(CaepContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

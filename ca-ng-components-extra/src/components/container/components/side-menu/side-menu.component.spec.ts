import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideZoneChangeDetection } from '@angular/core';
import { CaepIdSequenceService } from '../../../../services';
import { CaepContainerModule } from '../../container.module';
import { CaepSideMenuComponent } from './side-menu.component';

describe('CaepSideMenuComponent', () => {
  let component: CaepSideMenuComponent;
  let fixture: ComponentFixture<CaepSideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaepContainerModule.forRoot({ stackFrameFactory: null, taskSlotFactory: null })],
      providers: [CaepIdSequenceService, provideZoneChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(CaepSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

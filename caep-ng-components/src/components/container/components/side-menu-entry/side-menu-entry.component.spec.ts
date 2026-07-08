import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideZoneChangeDetection } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CaepIdSequenceService } from '../../../../services';
import { CaepContainerModule } from '../../container.module';
import { CaepSideMenuEntryComponent } from './side-menu-entry.component';

describe('CaepSideMenuEntryComponent', () => {
  let component: CaepSideMenuEntryComponent;
  let fixture: ComponentFixture<CaepSideMenuEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CaepContainerModule.forRoot({ stackFrameFactory: null, taskSlotFactory: null }),
        TranslateModule.forRoot()
      ],
      providers: [CaepIdSequenceService, provideZoneChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(CaepSideMenuEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

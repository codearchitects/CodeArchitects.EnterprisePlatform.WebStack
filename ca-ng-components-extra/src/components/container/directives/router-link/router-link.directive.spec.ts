import { provideZoneChangeDetection } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { CaepIdSequenceService } from '../../../../services';
import { CaepContainerModule } from '../../container.module';
import { CaepSideMenuService } from '../../services';
import { CaepRouterLinkDirective } from './router-link.directive';

describe('CaepRouterLinkDirective', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CaepContainerModule.forRoot({ taskSlotFactory: null, stackFrameFactory: null })],
      declarations: [],
      providers: [CaepIdSequenceService, provideZoneChangeDetection()]
    });
    TestBed.compileComponents();
  });
  it('should create an instance', inject([CaepSideMenuService], (service: CaepSideMenuService) => {
    const directive = new CaepRouterLinkDirective(service, null, null, null);
    expect(directive).toBeTruthy();
  }));
});

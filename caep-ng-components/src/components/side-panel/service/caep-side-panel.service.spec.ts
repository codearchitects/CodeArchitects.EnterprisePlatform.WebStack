import { TestBed } from '@angular/core/testing';

import { CaepSidePanelService } from './caep-side-panel.service';

describe('CaepSidePanelService', () => {
  let service: CaepSidePanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaepSidePanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

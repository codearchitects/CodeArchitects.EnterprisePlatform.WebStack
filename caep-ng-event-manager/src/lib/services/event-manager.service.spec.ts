import { TestBed } from '@angular/core/testing';

import { CaepEventManagerService } from './event-manager.service';

describe('CaepEventManagerService', () => {
  let service: CaepEventManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaepEventManagerService]
    });
    service = TestBed.inject(CaepEventManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { DownloadResultsService } from './download-results.service';

describe('DownloadResultsService', () => {
  let service: DownloadResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

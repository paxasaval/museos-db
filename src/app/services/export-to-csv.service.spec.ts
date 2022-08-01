import { TestBed } from '@angular/core/testing';

import { ExportToCsvService } from './export-to-csv.service';

describe('ExportToCsvService', () => {
  let service: ExportToCsvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportToCsvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

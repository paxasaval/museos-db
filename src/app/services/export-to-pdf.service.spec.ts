import { TestBed } from '@angular/core/testing';

import { ExportToPdfService } from './export-to-pdf.service';

describe('ExportToPdfService', () => {
  let service: ExportToPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportToPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { GeneralRecordService } from './general-record.service';

describe('GeneralRecordService', () => {
  let service: GeneralRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

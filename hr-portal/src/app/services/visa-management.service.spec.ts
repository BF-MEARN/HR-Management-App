import { TestBed } from '@angular/core/testing';

import { VisaManagementService } from './visa-management.service';

describe('VisaManagementService', () => {
  let service: VisaManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisaManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

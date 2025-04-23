import { TestBed } from '@angular/core/testing';

import { HousingManagementService } from './housing-management.service';

describe('HousingManagementService', () => {
  let service: HousingManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HousingManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

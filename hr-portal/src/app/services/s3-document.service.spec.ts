import { TestBed } from '@angular/core/testing';

import { S3DocumentService } from './s3-document.service';

describe('S3DocumentService', () => {
  let service: S3DocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(S3DocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

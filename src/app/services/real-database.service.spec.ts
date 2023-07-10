import { TestBed } from '@angular/core/testing';

import { RealDatabaseService } from './real-database.service';

describe('RealDatabaseService', () => {
  let service: RealDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

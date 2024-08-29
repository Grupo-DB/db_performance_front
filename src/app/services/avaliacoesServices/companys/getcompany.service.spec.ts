import { TestBed } from '@angular/core/testing';

import { GetCompanyService } from './getcompany.service';

describe('GetcompanyService', () => {
  let service: GetCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

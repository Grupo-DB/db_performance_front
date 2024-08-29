import { TestBed } from '@angular/core/testing';

import { RegisterCompanyService } from './registercompany.service';

describe('RegistercompanyService', () => {
  let service: RegisterCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

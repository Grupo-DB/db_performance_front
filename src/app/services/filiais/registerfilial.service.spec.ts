import { TestBed } from '@angular/core/testing';

import { RegisterfilialService } from './registerfilial.service';

describe('RegisterfilialService', () => {
  let service: RegisterfilialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterfilialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

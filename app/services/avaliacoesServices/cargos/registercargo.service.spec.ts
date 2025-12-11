import { TestBed } from '@angular/core/testing';

import { RegistercargoService } from './registercargo.service';

describe('RegistercargoService', () => {
  let service: RegistercargoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistercargoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

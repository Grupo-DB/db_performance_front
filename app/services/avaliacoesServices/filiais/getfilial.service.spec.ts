import { TestBed } from '@angular/core/testing';

import { GetfilialService } from './getfilial.service';

describe('GetfilialService', () => {
  let service: GetfilialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetfilialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

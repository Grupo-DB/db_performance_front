import { TestBed } from '@angular/core/testing';

import { FilialService } from './registerfilial.service';

describe('RegisterfilialService', () => {
  let service: FilialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

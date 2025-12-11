import { TestBed } from '@angular/core/testing';

import { GetSetorService } from './get-setor.service';

describe('GetSetorService', () => {
  let service: GetSetorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetSetorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

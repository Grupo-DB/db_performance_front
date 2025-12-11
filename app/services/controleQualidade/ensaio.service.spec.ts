import { TestBed } from '@angular/core/testing';

import { EnsaioService } from './ensaio.service';

describe('EnsaioService', () => {
  let service: EnsaioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnsaioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

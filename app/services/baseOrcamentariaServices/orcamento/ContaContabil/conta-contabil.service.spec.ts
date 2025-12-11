import { TestBed } from '@angular/core/testing';

import { ContaContabilService } from './conta-contabil.service';

describe('ContaContabilService', () => {
  let service: ContaContabilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContaContabilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

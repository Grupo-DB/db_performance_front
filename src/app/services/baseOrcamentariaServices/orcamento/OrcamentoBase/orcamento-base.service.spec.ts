import { TestBed } from '@angular/core/testing';

import { OrcamentoBaseService } from './orcamento-base.service';

describe('OrcamentoBaseService', () => {
  let service: OrcamentoBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrcamentoBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

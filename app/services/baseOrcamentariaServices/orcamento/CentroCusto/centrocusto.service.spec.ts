import { TestBed } from '@angular/core/testing';

import { CentrocustoService } from './centrocusto.service';

describe('CentrocustoService', () => {
  let service: CentrocustoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentrocustoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

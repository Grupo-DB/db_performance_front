import { TestBed } from '@angular/core/testing';

import { CustoproducaoService } from './custoproducao.service';

describe('CustoproducaoService', () => {
  let service: CustoproducaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustoproducaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

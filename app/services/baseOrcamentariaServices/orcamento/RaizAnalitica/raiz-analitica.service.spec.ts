import { TestBed } from '@angular/core/testing';

import { RaizAnaliticaService } from './raiz-analitica.service';

describe('RaizAnaliticaService', () => {
  let service: RaizAnaliticaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaizAnaliticaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

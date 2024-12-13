import { TestBed } from '@angular/core/testing';

import { RealizadoService } from './realizado.service';

describe('RealizadoService', () => {
  let service: RealizadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealizadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

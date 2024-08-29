import { TestBed } from '@angular/core/testing';

import { GetAvaliadorService } from './getavaliador.service';

describe('GetavaliadorService', () => {
  let service: GetAvaliadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAvaliadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

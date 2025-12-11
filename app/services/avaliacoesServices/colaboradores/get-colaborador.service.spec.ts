import { TestBed } from '@angular/core/testing';

import { GetColaboradorService } from './get-colaborador.service';

describe('GetColaboradorService', () => {
  let service: GetColaboradorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetColaboradorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

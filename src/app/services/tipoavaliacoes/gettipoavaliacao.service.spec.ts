import { TestBed } from '@angular/core/testing';

import { GetTipoAvalicaoService } from './gettipoavaliacao.service';

describe('GettipoavaliacaoService', () => {
  let service: GetTipoAvalicaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetTipoAvalicaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

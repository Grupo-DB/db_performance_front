import { TestBed } from '@angular/core/testing';

import { GetTipoAvaliacaoService } from './gettipoavaliacao.service';

describe('GettipoavaliacaoService', () => {
  let service: GetTipoAvaliacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetTipoAvaliacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TipoAvaliacaoService } from './registertipoavaliacao.service';

describe('RegistertipoavaliacaoService', () => {
  let service: TipoAvaliacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoAvaliacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

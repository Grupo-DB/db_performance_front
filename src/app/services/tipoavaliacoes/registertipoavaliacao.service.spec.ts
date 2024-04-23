import { TestBed } from '@angular/core/testing';

import { RegisterTipoAvaliacaoService } from './registertipoavaliacao.service';

describe('RegistertipoavaliacaoService', () => {
  let service: RegisterTipoAvaliacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterTipoAvaliacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

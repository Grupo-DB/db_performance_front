import { TestBed } from '@angular/core/testing';

import { GetAvaliacaoService } from './getavaliacao.service';

describe('GetavaliacaoService', () => {
  let service: GetAvaliacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAvaliacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

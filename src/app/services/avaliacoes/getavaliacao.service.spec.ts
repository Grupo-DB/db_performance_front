import { TestBed } from '@angular/core/testing';

import { GetavaliacaoService } from './getavaliacao.service';

describe('GetavaliacaoService', () => {
  let service: GetavaliacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetavaliacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

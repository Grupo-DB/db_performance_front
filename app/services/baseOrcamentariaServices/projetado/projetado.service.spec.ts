import { TestBed } from '@angular/core/testing';

import { ProjetadoService } from './projetado.service';

describe('ProjetadoService', () => {
  let service: ProjetadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjetadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { GrupoItensService } from './grupo-itens.service';

describe('GrupoItensService', () => {
  let service: GrupoItensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrupoItensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { RegisterTipoContratoService } from './resgitertipocontrato.service';

describe('ResgitertipocontratoService', () => {
  let service: RegisterTipoContratoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterTipoContratoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

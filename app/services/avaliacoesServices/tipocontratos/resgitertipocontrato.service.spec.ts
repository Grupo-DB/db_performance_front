import { TestBed } from '@angular/core/testing';

import {  TipoContratoService } from './resgitertipocontrato.service';

describe('TipocontratoService', () => {
  let service: TipoContratoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoContratoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

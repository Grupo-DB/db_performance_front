import { TestBed } from '@angular/core/testing';

import { AvaliadorService } from './registeravaliador.service';

describe('AvaliadorService', () => {
  let service: AvaliadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvaliadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

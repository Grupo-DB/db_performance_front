import { TestBed } from '@angular/core/testing';

import { RegisteravaliadorService } from './registeravaliador.service';

describe('RegisteravaliadorService', () => {
  let service: RegisteravaliadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisteravaliadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

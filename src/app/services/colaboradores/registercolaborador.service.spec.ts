import { TestBed } from '@angular/core/testing';

import { RegisterColaboradorService } from './registercolaborador.service';

describe('RegistercolaboradorService', () => {
  let service: RegisterColaboradorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterColaboradorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

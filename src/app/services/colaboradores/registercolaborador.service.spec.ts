import { TestBed } from '@angular/core/testing';

import { RegistercolaboradorService } from './registercolaborador.service';

describe('RegistercolaboradorService', () => {
  let service: RegistercolaboradorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistercolaboradorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

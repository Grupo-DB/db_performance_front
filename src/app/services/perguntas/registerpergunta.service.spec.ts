import { TestBed } from '@angular/core/testing';

import { RegisterPerguntaService } from './registerpergunta.service';

describe('RegisterperguntaService', () => {
  let service: RegisterPerguntaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterPerguntaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

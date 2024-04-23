import { TestBed } from '@angular/core/testing';

import { RegisterperguntaService } from './registerpergunta.service';

describe('RegisterperguntaService', () => {
  let service: RegisterperguntaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterperguntaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

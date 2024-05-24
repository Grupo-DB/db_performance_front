import { TestBed } from '@angular/core/testing';

import { PerguntaService } from './registerpergunta.service';

describe('PerguntaService', () => {
  let service: PerguntaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerguntaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

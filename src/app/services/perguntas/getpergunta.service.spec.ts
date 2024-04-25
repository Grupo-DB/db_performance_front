import { TestBed } from '@angular/core/testing';

import { GetPerguntaService } from './getpergunta.service';

describe('GetperguntaService', () => {
  let service: GetPerguntaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPerguntaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

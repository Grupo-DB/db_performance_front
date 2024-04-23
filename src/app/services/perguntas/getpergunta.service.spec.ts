import { TestBed } from '@angular/core/testing';

import { GetperguntaService } from './getpergunta.service';

describe('GetperguntaService', () => {
  let service: GetperguntaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetperguntaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

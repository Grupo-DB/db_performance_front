import { TestBed } from '@angular/core/testing';

import { RegisteravaliacaoService } from './registeravaliacao.service';

describe('RegisteravaliacaoService', () => {
  let service: RegisteravaliacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisteravaliacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

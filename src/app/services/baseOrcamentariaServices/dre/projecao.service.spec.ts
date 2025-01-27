import { TestBed } from '@angular/core/testing';

import { ProjecaoService } from './projecao.service';

describe('ProjecaoService', () => {
  let service: ProjecaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjecaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

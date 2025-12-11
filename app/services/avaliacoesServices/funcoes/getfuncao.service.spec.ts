import { TestBed } from '@angular/core/testing';

import { GetFuncaoService } from './getfuncao.service';

describe('GetFuncaoService', () => {
  let service: GetFuncaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetFuncaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

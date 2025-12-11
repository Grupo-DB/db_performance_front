import { TestBed } from '@angular/core/testing';

import { InicialService } from './inicial.service';

describe('InicialService', () => {
  let service: InicialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InicialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

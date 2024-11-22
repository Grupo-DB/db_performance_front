import { TestBed } from '@angular/core/testing';

import { RaizSinteticaService } from './raiz-sintetica.service';

describe('RaizSinteticaService', () => {
  let service: RaizSinteticaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaizSinteticaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { RegistrosHsExtrasService } from './registros-hs-extras.service';

describe('RegistrosHsExtrasService', () => {
  let service: RegistrosHsExtrasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrosHsExtrasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

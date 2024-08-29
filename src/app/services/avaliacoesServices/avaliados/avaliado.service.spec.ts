import { TestBed } from '@angular/core/testing';

import { AvaliadoService } from './avaliado.service';

describe('AvaliadoService', () => {
  let service: AvaliadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvaliadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

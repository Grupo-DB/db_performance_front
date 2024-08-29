import { TestBed } from '@angular/core/testing';

import { AmbienteService } from './ambiente.service';

describe('AmbienteService', () => {
  let service: AmbienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmbienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

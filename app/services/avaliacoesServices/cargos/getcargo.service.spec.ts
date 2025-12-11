import { TestBed } from '@angular/core/testing';

import { GetCargoService } from './getcargo.service';

describe('GetcargoService', () => {
  let service: GetCargoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCargoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

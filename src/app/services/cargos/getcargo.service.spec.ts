import { TestBed } from '@angular/core/testing';

import { GetcargoService } from './getcargo.service';

describe('GetcargoService', () => {
  let service: GetcargoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetcargoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

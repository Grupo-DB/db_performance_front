import { TestBed } from '@angular/core/testing';

import { CurvaService } from './curva.service';

describe('CurvaService', () => {
  let service: CurvaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurvaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

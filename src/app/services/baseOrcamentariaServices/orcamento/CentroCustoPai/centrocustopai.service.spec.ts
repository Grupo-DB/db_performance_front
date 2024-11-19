import { TestBed } from '@angular/core/testing';

import { CentrocustopaiService } from './centrocustopai.service';

describe('CentrocustopaiService', () => {
  let service: CentrocustopaiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentrocustopaiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

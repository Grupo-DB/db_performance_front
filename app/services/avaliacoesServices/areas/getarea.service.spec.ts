import { TestBed } from '@angular/core/testing';

import { GetAreaService } from './getarea.service';

describe('GetareaService', () => {
  let service: GetAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

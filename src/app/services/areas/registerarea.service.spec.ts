import { TestBed } from '@angular/core/testing';

import { RegisterAreaService } from './registerarea.service';

describe('RegisterareaService', () => {
  let service: RegisterAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

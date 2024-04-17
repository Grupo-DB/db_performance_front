import { TestBed } from '@angular/core/testing';

import { RegistersetorService } from './registersetor.service';

describe('RegistersetorService', () => {
  let service: RegistersetorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistersetorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

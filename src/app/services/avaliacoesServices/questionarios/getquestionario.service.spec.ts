import { TestBed } from '@angular/core/testing';

import { GetQuestionarioService } from './getquestionario.service';

describe('GetquestionarioService', () => {
  let service: GetQuestionarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetQuestionarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

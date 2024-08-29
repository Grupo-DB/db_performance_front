import { TestBed } from '@angular/core/testing';

import { RegisterQuestionarioService } from './registerquestionario.service';

describe('RegisterquestionarioService', () => {
  let service: RegisterQuestionarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterQuestionarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { GetTipoContratoService } from './gettipocontrato.service';


describe('GetTipocontratoService', () => {
  let service: GetTipoContratoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetTipoContratoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PprOrcamentoComponent } from './ppr-orcamento.component';

describe('PprOrcamentoComponent', () => {
  let component: PprOrcamentoComponent;
  let fixture: ComponentFixture<PprOrcamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PprOrcamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PprOrcamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

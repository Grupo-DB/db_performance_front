import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcamentogrupoitensComponent } from './orcamentogrupoitens.component';

describe('OrcamentogrupoitensComponent', () => {
  let component: OrcamentogrupoitensComponent;
  let fixture: ComponentFixture<OrcamentogrupoitensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrcamentogrupoitensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrcamentogrupoitensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

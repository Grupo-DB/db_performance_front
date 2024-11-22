import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcamentoBaseComponent } from './orcamento-base.component';

describe('OrcamentoBaseComponent', () => {
  let component: OrcamentoBaseComponent;
  let fixture: ComponentFixture<OrcamentoBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrcamentoBaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrcamentoBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

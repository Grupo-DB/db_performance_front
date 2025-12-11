import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvoulucaoavaliacoesComponent } from './evoulucaoavaliacoes.component';

describe('EvoulucaoavaliacoesComponent', () => {
  let component: EvoulucaoavaliacoesComponent;
  let fixture: ComponentFixture<EvoulucaoavaliacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvoulucaoavaliacoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvoulucaoavaliacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

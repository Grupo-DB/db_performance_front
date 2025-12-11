import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsqueceuSenhaComponent } from './esqueceusenha.component';

describe('EsqueceusenhaComponent', () => {
  let component: EsqueceuSenhaComponent;
  let fixture: ComponentFixture<EsqueceuSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EsqueceuSenhaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EsqueceuSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

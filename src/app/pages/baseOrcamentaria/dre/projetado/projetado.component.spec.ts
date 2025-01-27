import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetadoComponent } from './projetado.component';

describe('ProjetadoComponent', () => {
  let component: ProjetadoComponent;
  let fixture: ComponentFixture<ProjetadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjetadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

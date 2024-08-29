import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoavaliacaoComponent } from './tipoavaliacao.component';

describe('TipoavaliacaoComponent', () => {
  let component: TipoavaliacaoComponent;
  let fixture: ComponentFixture<TipoavaliacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoavaliacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipoavaliacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

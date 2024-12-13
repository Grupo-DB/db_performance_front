import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizadoComponent } from './realizado.component';

describe('RealizadoComponent', () => {
  let component: RealizadoComponent;
  let fixture: ComponentFixture<RealizadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealizadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

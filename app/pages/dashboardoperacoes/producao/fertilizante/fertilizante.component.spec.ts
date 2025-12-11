import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FertilizanteComponent } from './fertilizante.component';

describe('FertilizanteComponent', () => {
  let component: FertilizanteComponent;
  let fixture: ComponentFixture<FertilizanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FertilizanteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FertilizanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

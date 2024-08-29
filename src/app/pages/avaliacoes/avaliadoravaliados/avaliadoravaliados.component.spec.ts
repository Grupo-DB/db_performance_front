import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliadorAvaliadosComponent } from './avaliadoravaliados.component';

describe('AvaliadoravaliadosComponent', () => {
  let component: AvaliadorAvaliadosComponent;
  let fixture: ComponentFixture<AvaliadorAvaliadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvaliadorAvaliadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvaliadorAvaliadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

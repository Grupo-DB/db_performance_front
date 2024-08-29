import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvaliadoComponent } from './avaliado.component';

describe('AvaliadoComponent', () => {
  let component: AvaliadoComponent;
  let fixture: ComponentFixture<AvaliadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvaliadoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvaliadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

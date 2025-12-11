import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashAvaliadorComponent } from './dashavaliador.component';

describe('DashAvaliadorComponent', () => {
  let component: DashAvaliadorComponent;
  let fixture: ComponentFixture<DashAvaliadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashAvaliadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashAvaliadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

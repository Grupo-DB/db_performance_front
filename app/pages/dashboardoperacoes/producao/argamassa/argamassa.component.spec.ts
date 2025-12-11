import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgamassaComponent } from './argamassa.component';

describe('ArgamassaComponent', () => {
  let component: ArgamassaComponent;
  let fixture: ComponentFixture<ArgamassaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArgamassaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArgamassaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

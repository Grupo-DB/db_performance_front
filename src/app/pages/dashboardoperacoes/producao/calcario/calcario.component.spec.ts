import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcarioComponent } from './calcario.component';

describe('CalcarioComponent', () => {
  let component: CalcarioComponent;
  let fixture: ComponentFixture<CalcarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalcarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalcarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

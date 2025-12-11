import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashControleComponent } from './dash-controle.component';

describe('DashControleComponent', () => {
  let component: DashControleComponent;
  let fixture: ComponentFixture<DashControleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashControleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashControleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

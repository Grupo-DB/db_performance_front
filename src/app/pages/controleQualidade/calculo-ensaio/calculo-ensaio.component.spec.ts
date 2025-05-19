import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculoEnsaioComponent } from './calculo-ensaio.component';

describe('CalculoEnsaioComponent', () => {
  let component: CalculoEnsaioComponent;
  let fixture: ComponentFixture<CalculoEnsaioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculoEnsaioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculoEnsaioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

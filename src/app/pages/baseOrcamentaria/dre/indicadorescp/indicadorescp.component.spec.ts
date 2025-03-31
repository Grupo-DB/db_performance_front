import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorescpComponent } from './indicadorescp.component';

describe('IndicadorescpComponent', () => {
  let component: IndicadorescpComponent;
  let fixture: ComponentFixture<IndicadorescpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicadorescpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicadorescpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurvaComponent } from './curva.component';

describe('CurvaComponent', () => {
  let component: CurvaComponent;
  let fixture: ComponentFixture<CurvaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurvaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

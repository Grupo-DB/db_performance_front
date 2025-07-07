import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpressaComponent } from './expressa.component';

describe('ExpressaComponent', () => {
  let component: ExpressaComponent;
  let fixture: ComponentFixture<ExpressaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpressaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpressaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

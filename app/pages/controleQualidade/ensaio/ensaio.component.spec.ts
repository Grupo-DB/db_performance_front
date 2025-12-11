import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnsaioComponent } from './ensaio.component';

describe('EnsaioComponent', () => {
  let component: EnsaioComponent;
  let fixture: ComponentFixture<EnsaioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnsaioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnsaioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

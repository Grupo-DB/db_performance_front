import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativoavaliadoresComponent } from './comparativoavaliadores.component';

describe('ComparativoavaliadoresComponent', () => {
  let component: ComparativoavaliadoresComponent;
  let fixture: ComponentFixture<ComparativoavaliadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparativoavaliadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparativoavaliadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariavelComponent } from './variavel.component';

describe('VariavelComponent', () => {
  let component: VariavelComponent;
  let fixture: ComponentFixture<VariavelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariavelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

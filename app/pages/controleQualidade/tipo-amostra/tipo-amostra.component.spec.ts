import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoAmostraComponent } from './tipo-amostra.component';

describe('TipoAmostraComponent', () => {
  let component: TipoAmostraComponent;
  let fixture: ComponentFixture<TipoAmostraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoAmostraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoAmostraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

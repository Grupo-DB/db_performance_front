import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoEnsaioComponent } from './tipo-ensaio.component';

describe('TipoEnsaioComponent', () => {
  let component: TipoEnsaioComponent;
  let fixture: ComponentFixture<TipoEnsaioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoEnsaioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoEnsaioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipocontratoComponent } from './tipocontrato.component';

describe('TipocontratoComponent', () => {
  let component: TipocontratoComponent;
  let fixture: ComponentFixture<TipocontratoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipocontratoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipocontratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

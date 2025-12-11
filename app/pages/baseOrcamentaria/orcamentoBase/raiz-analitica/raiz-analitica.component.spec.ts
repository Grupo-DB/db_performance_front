import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaizAnaliticaComponent } from './raiz-analitica.component';

describe('RaizAnaliticaComponent', () => {
  let component: RaizAnaliticaComponent;
  let fixture: ComponentFixture<RaizAnaliticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaizAnaliticaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RaizAnaliticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

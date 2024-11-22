import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaizSinteticaComponent } from './raiz-sintetica.component';

describe('RaizSinteticaComponent', () => {
  let component: RaizSinteticaComponent;
  let fixture: ComponentFixture<RaizSinteticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaizSinteticaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RaizSinteticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

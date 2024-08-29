import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeproducaoComponent } from './homeproducao.component';

describe('HomeproducaoComponent', () => {
  let component: HomeproducaoComponent;
  let fixture: ComponentFixture<HomeproducaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeproducaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeproducaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

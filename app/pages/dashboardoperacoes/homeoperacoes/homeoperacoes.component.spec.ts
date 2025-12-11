import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeoperacoesComponent } from './homeoperacoes.component';

describe('HomeoperacoesComponent', () => {
  let component: HomeoperacoesComponent;
  let fixture: ComponentFixture<HomeoperacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeoperacoesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeoperacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

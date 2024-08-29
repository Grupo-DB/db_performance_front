import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomebritagemComponent } from './homebritagem.component';

describe('HomebritagemComponent', () => {
  let component: HomebritagemComponent;
  let fixture: ComponentFixture<HomebritagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomebritagemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomebritagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RebritagemComponent } from './rebritagem.component';

describe('RebritagemComponent', () => {
  let component: RebritagemComponent;
  let fixture: ComponentFixture<RebritagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RebritagemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RebritagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
